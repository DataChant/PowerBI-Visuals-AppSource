//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import {
  ensureSignedInWithFabric,
  initEmbeddedAuth as sdkInitEmbeddedAuth,
  signInWithBrokeredToken,
} from '@microsoft/rayfin-auth-provider-fabric';
import {
  fetchRayfinLocalSessionToken,
  isRayfinLocalAutoLoginEnabled,
} from '@microsoft/rayfin-local-dev';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { IAuthService } from './rayfin-auth.service';

const { authenticatedSession } = vi.hoisted(() => ({
  authenticatedSession: {
    user: {
      id: 'embedded-user',
      email: 'embedded@example.com',
    },
    isAuthenticated: true,
    isAnonymous: false,
  },
}));

// The SDK call is where the resolved workspace and item ids leave this module,
// so it is the only place a deployed value is distinguishable from a
// compiled-in one.
vi.mock('@microsoft/rayfin-auth-provider-fabric', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@microsoft/rayfin-auth-provider-fabric')
  >()),
  initEmbeddedAuth: vi.fn(async () => null),
  ensureSignedInWithFabric: vi.fn(async () => authenticatedSession),
  signInWithBrokeredToken: vi.fn(async () => authenticatedSession),
}));

vi.mock('@microsoft/rayfin-local-dev', () => ({
  fetchRayfinLocalSessionToken: vi.fn(async () => ({
    accessToken: 'rayfin-access-token',
    tokenType: 'Bearer',
    expiresIn: 3600,
  })),
  isRayfinLocalAutoLoginEnabled: vi.fn(() => false),
  resolveRayfinFunctionsBaseUrl: vi.fn(() => undefined),
}));

// bootstrapAuth runs at module init, so rejecting there blanks the page before
// React can render any explanation. Both dev providers can launch the frontend
// with only part of the configuration, so every partial state has to be
// renderable rather than fatal.
describe('bootstrapAuth with incomplete configuration', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.mocked(sdkInitEmbeddedAuth).mockClear();
    vi.mocked(sdkInitEmbeddedAuth).mockResolvedValue(null);
    vi.mocked(ensureSignedInWithFabric).mockClear();
    vi.mocked(signInWithBrokeredToken).mockClear();
    vi.mocked(fetchRayfinLocalSessionToken).mockClear();
    vi.mocked(isRayfinLocalAutoLoginEnabled).mockReturnValue(false);
  });

  function stubEnv(values: Record<string, string>): void {
    for (const [name, value] of Object.entries(values)) {
      vi.stubEnv(name, value);
    }
  }

  /** No `rayfin.config.json` deployed — what local dev and a fresh scaffold see. */
  function stubMissingRuntimeConfig(): void {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(null, { status: 404 }))
    );
  }

  // The client is a module-level singleton, so each case needs a fresh module
  // graph -- otherwise the first case's resolved config decides every later one.
  async function bootstrap(): Promise<IAuthService> {
    vi.resetModules();
    const { bootstrapAuth } = await import('./rayfin-auth.service');
    return bootstrapAuth();
  }

  const RAYFIN_ONLY = {
    VITE_RAYFIN_API_URL: 'http://localhost:5168',
    VITE_RAYFIN_PUBLISHABLE_KEY: 'pk-local',
    VITE_FABRIC_WORKSPACE_ID: '',
    VITE_FABRIC_ITEM_ID: '',
    VITE_FABRIC_PORTAL_URL: '',
  };

  const FULLY_CONFIGURED = {
    VITE_RAYFIN_API_URL: 'http://localhost:5168',
    VITE_RAYFIN_PUBLISHABLE_KEY: 'pk-local',
    VITE_FABRIC_WORKSPACE_ID: 'ws-1',
    VITE_FABRIC_ITEM_ID: 'item-1',
    VITE_FABRIC_PORTAL_URL: 'https://app.fabric.microsoft.com',
  };

  // `rayfin dev` against the local backend: Rayfin values, no Fabric item yet.
  describe('before the first deploy', () => {
    it('does not reject, so the app still mounts', async () => {
      stubEnv(RAYFIN_ONLY);
      stubMissingRuntimeConfig();

      await expect(bootstrap()).resolves.toBeDefined();
    });

    it('reports that the app has not been deployed', async () => {
      stubEnv(RAYFIN_ONLY);
      stubMissingRuntimeConfig();

      expect((await bootstrap()).config).toEqual({ kind: 'not-deployed' });
    });

    it('resolves no session, settling the provider unauthenticated', async () => {
      stubEnv(RAYFIN_ONLY);
      stubMissingRuntimeConfig();

      const service = await bootstrap();

      await expect(service.resolveSession()).resolves.toBeNull();
    });
  });

  // The Fabric dev provider treats a failed publishable-key lookup as a
  // warning: it persists the deployment and launches the frontend anyway, so
  // the Fabric values can be present while the key is not.
  describe('when the publishable key lookup failed', () => {
    const FABRIC_WITHOUT_KEY = {
      ...FULLY_CONFIGURED,
      VITE_RAYFIN_PUBLISHABLE_KEY: '',
    };

    it('does not reject, so the app still mounts', async () => {
      stubEnv(FABRIC_WITHOUT_KEY);
      stubMissingRuntimeConfig();

      await expect(bootstrap()).resolves.toBeDefined();
    });

    it('names the missing field rather than reporting not-deployed', async () => {
      stubEnv(FABRIC_WITHOUT_KEY);
      stubMissingRuntimeConfig();

      expect((await bootstrap()).config).toEqual({
        kind: 'incomplete',
        missing: ['publishableKey'],
      });
    });

    it('checks deployed config before reporting the missing key', async () => {
      stubEnv(FABRIC_WITHOUT_KEY);
      const fetchSpy = vi.fn(async () => new Response(null, { status: 404 }));
      vi.stubGlobal('fetch', fetchSpy);

      await bootstrap();

      expect(fetchSpy).toHaveBeenCalledWith('/rayfin.config.json');
    });
  });

  it('does not reject when nothing is configured at all', async () => {
    stubEnv({
      VITE_RAYFIN_API_URL: '',
      VITE_RAYFIN_PUBLISHABLE_KEY: '',
      VITE_FABRIC_WORKSPACE_ID: '',
      VITE_FABRIC_ITEM_ID: '',
      VITE_FABRIC_PORTAL_URL: '',
    });
    stubMissingRuntimeConfig();

    expect((await bootstrap()).config).toEqual({
      kind: 'incomplete',
      missing: ['apiUrl', 'publishableKey'],
    });
  });

  it('uses deployed config when no build-time defaults exist', async () => {
    stubEnv({
      VITE_RAYFIN_API_URL: '',
      VITE_RAYFIN_PUBLISHABLE_KEY: '',
      VITE_FABRIC_WORKSPACE_ID: '',
      VITE_FABRIC_ITEM_ID: '',
      VITE_FABRIC_PORTAL_URL: '',
    });
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              apiUrl: 'https://prod.example.com',
              publishableKey: 'pk-prod',
              workspaceId: 'ws-prod',
              itemId: 'item-prod',
              portalUrl: 'https://app.fabric.microsoft.com',
            }),
            { status: 200, headers: { 'content-type': 'application/json' } }
          )
      )
    );

    expect((await bootstrap()).config).toEqual({ kind: 'ready' });
  });

  it('builds the Fabric service once every value is present', async () => {
    stubEnv(FULLY_CONFIGURED);
    stubMissingRuntimeConfig();

    expect((await bootstrap()).config).toEqual({ kind: 'ready' });
  });

  // A promoted bundle carries the previous stage's values, so the SDK fails
  // closed when it cannot read the deployed config. That must surface as a
  // rendered explanation rather than escaping and blanking the page.
  describe('when the deployed config cannot be read', () => {
    it('reports the failure instead of rejecting', async () => {
      stubEnv(FULLY_CONFIGURED);
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => new Response(null, { status: 500 }))
      );

      const { config } = await bootstrap();

      expect(config.kind).toBe('config-error');
    });

    it('does not silently fall back to the compiled-in Fabric values', async () => {
      stubEnv(FULLY_CONFIGURED);
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => {
          throw new TypeError('Failed to fetch');
        })
      );

      const { config } = await bootstrap();

      expect(config.kind).not.toBe('ready');
    });
  });

  // The deployed config is the authority: a promoted artifact must follow it
  // rather than the stage it happened to be built in.
  it('prefers the deployed config over the compiled-in values', async () => {
    stubEnv(FULLY_CONFIGURED);
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              apiUrl: 'https://prod.example.com',
              publishableKey: 'pk-prod',
              workspaceId: 'ws-prod',
              itemId: 'item-prod',
              portalUrl: 'https://app.fabric.microsoft.com',
            }),
            { status: 200, headers: { 'content-type': 'application/json' } }
          )
      )
    );

    // `kind: 'ready'` alone would not distinguish this — the compiled-in values
    // are complete too. Assert what reaches the SDK.
    const service = await bootstrap();
    expect(service.config).toEqual({ kind: 'ready' });

    await service.resolveSession();

    expect(sdkInitEmbeddedAuth).toHaveBeenCalledTimes(1);
    expect(vi.mocked(sdkInitEmbeddedAuth).mock.calls[0][1]).toMatchObject({
      workspaceId: 'ws-prod',
      projectId: 'item-prod',
    });
  });

  it('falls back to the local brokered session after classifying the host', async () => {
    stubEnv(FULLY_CONFIGURED);
    stubMissingRuntimeConfig();
    vi.mocked(isRayfinLocalAutoLoginEnabled).mockReturnValue(true);

    const service = await bootstrap();
    await expect(service.resolveSession()).resolves.toMatchObject({
      isAuthenticated: true,
    });

    expect(fetchRayfinLocalSessionToken).toHaveBeenCalledTimes(1);
    expect(signInWithBrokeredToken).toHaveBeenCalledWith(expect.anything(), {
      accessToken: 'rayfin-access-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
    });
    expect(sdkInitEmbeddedAuth).toHaveBeenCalledTimes(1);
    expect(
      vi.mocked(sdkInitEmbeddedAuth).mock.invocationCallOrder[0]
    ).toBeLessThan(
      vi.mocked(fetchRayfinLocalSessionToken).mock.invocationCallOrder[0]
    );
  });

  it('prefers the embedded handoff over a local brokered session', async () => {
    stubEnv(FULLY_CONFIGURED);
    stubMissingRuntimeConfig();
    vi.mocked(isRayfinLocalAutoLoginEnabled).mockReturnValue(true);
    vi.mocked(sdkInitEmbeddedAuth).mockResolvedValue(authenticatedSession);

    const service = await bootstrap();
    await expect(service.resolveSession()).resolves.toBe(authenticatedSession);

    expect(sdkInitEmbeddedAuth).toHaveBeenCalledTimes(1);
    expect(fetchRayfinLocalSessionToken).not.toHaveBeenCalled();
    expect(signInWithBrokeredToken).not.toHaveBeenCalled();
  });

  it('does not fall back to local credentials when host classification fails', async () => {
    stubEnv(FULLY_CONFIGURED);
    stubMissingRuntimeConfig();
    vi.mocked(isRayfinLocalAutoLoginEnabled).mockReturnValue(true);
    const failure = new Error('Host classification failed.');
    vi.mocked(sdkInitEmbeddedAuth).mockRejectedValueOnce(failure);
    const service = await bootstrap();

    await expect(service.resolveSession()).rejects.toBe(failure);
    expect(fetchRayfinLocalSessionToken).not.toHaveBeenCalled();
    expect(signInWithBrokeredToken).not.toHaveBeenCalled();
  });

  it('restores a non-anonymous session only after the SDK classifies a standalone host', async () => {
    stubEnv(FULLY_CONFIGURED);
    stubMissingRuntimeConfig();
    vi.mocked(isRayfinLocalAutoLoginEnabled).mockReturnValue(true);
    const service = await bootstrap();
    const { getRayfinClient } = await import('@/lib/rayfin-client');
    const client = await getRayfinClient();
    const restored = { user: null, isAuthenticated: true, isAnonymous: false };
    const getSession = vi
      .spyOn(client.auth, 'getSession')
      .mockReturnValue(restored);

    await expect(service.resolveSession()).resolves.toBe(restored);
    expect(
      vi.mocked(sdkInitEmbeddedAuth).mock.invocationCallOrder[0]
    ).toBeLessThan(getSession.mock.invocationCallOrder[0]);
    expect(fetchRayfinLocalSessionToken).not.toHaveBeenCalled();
    getSession.mockRestore();
  });

  it('uses the embedded handshake before consulting a stored identity in a frame', async () => {
    stubEnv(FULLY_CONFIGURED);
    stubMissingRuntimeConfig();
    vi.stubGlobal('parent', {});
    vi.mocked(sdkInitEmbeddedAuth).mockResolvedValue(authenticatedSession);
    const service = await bootstrap();
    const { getRayfinClient } = await import('@/lib/rayfin-client');
    const client = await getRayfinClient();
    const getSession = vi.spyOn(client.auth, 'getSession');
    await expect(service.resolveSession()).resolves.toBe(authenticatedSession);
    expect(sdkInitEmbeddedAuth).toHaveBeenCalledTimes(1);
    expect(getSession).not.toHaveBeenCalled();
    expect(fetchRayfinLocalSessionToken).not.toHaveBeenCalled();
  });

  it('allows local sign-in in a development iframe only after the SDK yields no embedded session', async () => {
    stubEnv(FULLY_CONFIGURED);
    stubMissingRuntimeConfig();
    vi.stubGlobal('parent', {});
    vi.mocked(isRayfinLocalAutoLoginEnabled).mockReturnValue(true);
    const service = await bootstrap();
    await expect(service.resolveSession()).resolves.toMatchObject({
      isAuthenticated: true,
    });
    expect(fetchRayfinLocalSessionToken).toHaveBeenCalledTimes(1);
    expect(sdkInitEmbeddedAuth).toHaveBeenCalledTimes(1);
    expect(
      vi.mocked(sdkInitEmbeddedAuth).mock.invocationCallOrder[0]
    ).toBeLessThan(
      vi.mocked(fetchRayfinLocalSessionToken).mock.invocationCallOrder[0]
    );
  });

  it('never requests local development credentials in a production build', async () => {
    stubEnv(FULLY_CONFIGURED);
    stubMissingRuntimeConfig();
    vi.stubEnv('DEV', false);
    vi.mocked(isRayfinLocalAutoLoginEnabled).mockReturnValue(true);
    await (await bootstrap()).resolveSession();
    expect(fetchRayfinLocalSessionToken).not.toHaveBeenCalled();
    expect(sdkInitEmbeddedAuth).toHaveBeenCalledTimes(1);
  });

  it('starts interactive Fabric sign-in through the service method', async () => {
    stubEnv(FULLY_CONFIGURED);
    stubMissingRuntimeConfig();

    const service = await bootstrap();
    await expect(service.signIn()).resolves.toMatchObject({
      isAuthenticated: true,
    });

    expect(ensureSignedInWithFabric).toHaveBeenCalledTimes(1);
  });
});
