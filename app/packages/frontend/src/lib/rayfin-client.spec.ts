//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { clientConstructor, resolveRayfinConfig } = vi.hoisted(() => ({
  clientConstructor: vi.fn(),
  resolveRayfinConfig: vi.fn(),
}));

vi.mock('@microsoft/rayfin-client', () => ({
  RayfinClient: class {
    constructor(config: unknown) {
      clientConstructor(config);
    }
  },
  ConnectorsRayfinClient: class {
    constructor(config: unknown) {
      clientConstructor(config);
    }
  },
  resolveRayfinConfig,
}));

describe('getRayfinClient', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_RAYFIN_API_URL', '');
    vi.stubEnv('VITE_RAYFIN_PUBLISHABLE_KEY', '');
    clientConstructor.mockClear();
    resolveRayfinConfig.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('does not resolve configuration when imported', async () => {
    await import('./rayfin-client');
    expect(resolveRayfinConfig).not.toHaveBeenCalled();
    expect(clientConstructor).not.toHaveBeenCalled();
  });

  it('shares initialization across concurrent service operations without portal configuration', async () => {
    resolveRayfinConfig.mockResolvedValue({
      baseUrl: 'https://backend.example.com',
      publishableKey: 'pk-example',
    });
    const { getRayfinClient } = await import('./rayfin-client');
    const [first, second] = await Promise.all([
      getRayfinClient(),
      getRayfinClient(),
    ]);
    expect(first).toBe(second);
    expect(await getRayfinClient()).toBe(first);
    expect(resolveRayfinConfig).toHaveBeenCalledTimes(1);
    expect(clientConstructor).toHaveBeenCalledTimes(1);
  });

  it('surfaces a configuration failure and permits the operation to retry', async () => {
    const failure = new Error('Runtime configuration is unavailable');
    resolveRayfinConfig.mockRejectedValueOnce(failure).mockResolvedValueOnce({
      baseUrl: 'https://backend.example.com',
      publishableKey: 'pk-example',
    });
    const { getRayfinClient } = await import('./rayfin-client');
    await expect(getRayfinClient()).rejects.toBe(failure);
    expect(clientConstructor).not.toHaveBeenCalled();
    await expect(getRayfinClient()).resolves.toBeDefined();
    expect(resolveRayfinConfig).toHaveBeenCalledTimes(2);
  });

  it('constructs the client from runtime config without build-time defaults', async () => {
    resolveRayfinConfig.mockResolvedValue({
      baseUrl: 'https://runtime.example.test/',
      publishableKey: 'pk-runtime',
      runtimeConfig: {
        apiUrl: 'https://runtime.example.test/',
        publishableKey: 'pk-runtime',
      },
    });

    const { getRayfinClient } = await import('./rayfin-client');

    await expect(getRayfinClient()).resolves.toBeDefined();
    expect(resolveRayfinConfig).toHaveBeenCalledWith(
      expect.objectContaining({ apiUrl: '', publishableKey: '' })
    );
    expect(clientConstructor).toHaveBeenCalledWith(
      expect.objectContaining({
        baseUrl: 'https://runtime.example.test/',
        publishableKey: 'pk-runtime',
      })
    );
  });

  it('reports missing configuration after runtime resolution', async () => {
    resolveRayfinConfig.mockResolvedValue({
      runtimeConfig: {},
    });

    const { getRayfinClient } = await import('./rayfin-client');

    await expect(getRayfinClient()).rejects.toThrow(
      'Missing required Rayfin configuration'
    );
    expect(clientConstructor).not.toHaveBeenCalled();
  });
});
