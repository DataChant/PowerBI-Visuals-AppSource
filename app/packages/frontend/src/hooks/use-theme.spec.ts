import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useAppTheme } from './use-theme';

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-appearance');
  document.documentElement.classList.remove('dark');
  vi.unstubAllGlobals();
});

describe('app theme', () => {
  it('defaults to light even when the system prefers dark', () => {
    const matchMedia = vi.fn(() => ({ matches: true }));
    vi.stubGlobal('matchMedia', matchMedia);
    const { result } = renderHook(useAppTheme);

    expect(result.current.isDark).toBe(false);
    expect(document.documentElement).not.toHaveClass('dark');
    expect(matchMedia).not.toHaveBeenCalled();
  });

  it.each(['data-theme', 'data-appearance'])(
    'honors an explicit %s theme',
    (attribute) => {
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

  it('tracks host appearance changes and returns to light when the override is removed', async () => {
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
