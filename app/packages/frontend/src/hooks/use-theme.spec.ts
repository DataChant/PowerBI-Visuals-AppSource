import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { THEME_STORAGE_KEY, useAppTheme } from './use-theme';

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-appearance');
  document.documentElement.classList.remove('dark');
  window.localStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** A device whose light or dark setting can be changed while the app is open. */
function stubDevice(dark: boolean) {
  const listeners = new Set<() => void>();
  const query = {
    matches: dark,
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  };
  const matchMedia = vi.fn(() => query);
  vi.stubGlobal('matchMedia', matchMedia);
  return {
    matchMedia,
    listeners,
    set(next: boolean) {
      query.matches = next;
      listeners.forEach((listener) => listener());
    },
  };
}

describe('app theme', () => {
  it.each([true, false])('opens in the theme the device is set to (dark: %s)', (dark) => {
    const device = stubDevice(dark);
    const { result } = renderHook(useAppTheme);

    expect(device.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    expect(result.current.isDark).toBe(dark);
    expect(document.documentElement.classList.contains('dark')).toBe(dark);
  });

  it('opens in the light theme when the browser reports no device setting', () => {
    const { result } = renderHook(useAppTheme);
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('remembers a picked theme for the next visit', async () => {
    stubDevice(false);
    const first = renderHook(useAppTheme);
    await act(async () => first.result.current.toggleTheme());
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    first.unmount();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');

    const next = renderHook(useAppTheme);
    expect(next.result.current.isDark).toBe(true);
    expect(document.documentElement).toHaveClass('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('puts a remembered choice ahead of the device setting', () => {
    stubDevice(true);
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    const { result } = renderHook(useAppTheme);
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('keeps a remembered choice when the host sets an appearance later', async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    const { result } = renderHook(useAppTheme);
    await act(async () =>
      document.documentElement.setAttribute('data-appearance', 'light')
    );
    expect(result.current.isDark).toBe(true);
  });

  it('follows the device when its setting changes and no theme was picked', async () => {
    const device = stubDevice(false);
    const { result, unmount } = renderHook(useAppTheme);
    await act(async () => device.set(true));
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement).toHaveClass('dark');
    unmount();
    expect(device.listeners.size).toBe(0);
  });

  it('keeps a picked theme when the device setting changes', async () => {
    const device = stubDevice(false);
    const { result } = renderHook(useAppTheme);
    await act(async () => result.current.toggleTheme());
    await act(async () => device.set(false));
    expect(result.current.isDark).toBe(true);
  });

  it('still switches themes when the browser blocks storage', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const { result } = renderHook(useAppTheme);
    expect(result.current.isDark).toBe(false);
    await act(async () => result.current.toggleTheme());
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement).toHaveClass('dark');
  });

  it.each(['data-theme', 'data-appearance'])(
    'honors an explicit %s theme',
    (attribute) => {
      stubDevice(false);
      document.documentElement.setAttribute(attribute, 'dark');
      const { result } = renderHook(useAppTheme);
      expect(result.current.isDark).toBe(true);
      expect(document.documentElement).toHaveClass('dark');
    }
  );

  it('honors a dark class supplied before mounting', () => {
    document.documentElement.classList.add('dark');
    const { result } = renderHook(useAppTheme);
    expect(result.current.isDark).toBe(true);
  });

  it('tracks host appearance changes and returns to the device theme when the override is removed', async () => {
    const { result } = renderHook(useAppTheme);
    await act(async () =>
      document.documentElement.setAttribute('data-appearance', 'dark')
    );
    expect(result.current.isDark).toBe(true);
    await act(async () =>
      document.documentElement.removeAttribute('data-appearance')
    );
    expect(result.current.isDark).toBe(false);
  });

  it('keeps a manual light choice when the host is dark', async () => {
    document.documentElement.setAttribute('data-appearance', 'dark');
    const { result } = renderHook(useAppTheme);
    await act(async () => result.current.toggleTheme());
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(document.documentElement).not.toHaveClass('dark');
    await act(async () =>
      document.documentElement.setAttribute('data-appearance', 'dark')
    );
    expect(result.current.isDark).toBe(false);
    await act(async () => result.current.toggleTheme());
    expect(result.current.isDark).toBe(true);
  });
});
