//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { useState, useEffect, useLayoutEffect } from 'react';

/** Where the theme a visitor picks is remembered between visits. */
export const THEME_STORAGE_KEY = 'custom-visuals-marketplace-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

function attributeTheme(attribute: string): boolean | undefined {
  const value = document.documentElement.getAttribute(attribute);
  if (value === 'dark') return true;
  if (value === 'light') return false;
  return undefined;
}

function explicitTheme(): boolean | undefined {
  return attributeTheme('data-theme') ?? attributeTheme('data-appearance');
}

/** The theme the visitor picked on an earlier visit, if the browser kept it. */
function storedTheme(): boolean | undefined {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (value === 'dark') return true;
    if (value === 'light') return false;
  } catch {
    // Storage can be blocked, as in some private windows. The choice is then
    // simply not remembered.
  }
  return undefined;
}

function storeTheme(dark: boolean) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
  } catch {
    // As above: without storage, the choice lasts for this visit only.
  }
}

/** The device's own light or dark setting, where the browser reports one. */
function systemQuery(): MediaQueryList | undefined {
  try {
    return typeof window.matchMedia === 'function' ? window.matchMedia(DARK_QUERY) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Opens in the theme the visitor picked on an earlier visit, and otherwise in
 * the one the device is set to. A theme the app or host sets explicitly comes
 * first, and a theme the visitor picks overrides a host appearance and is
 * remembered for the next visit.
 */
export function useAppTheme() {
  const [isDark, setIsDark] = useState(
    () =>
      attributeTheme('data-theme') ??
      storedTheme() ??
      attributeTheme('data-appearance') ??
      (document.documentElement.classList.contains('dark') || (systemQuery()?.matches ?? false))
  );

  // Before the first paint, so a dark device never sees the light theme flash.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    const root = document.documentElement;
    // A remembered choice counts as picked again, so a host appearance set
    // later does not replace it.
    const stored = storedTheme();
    if (stored !== undefined && attributeTheme('data-theme') === undefined) {
      root.setAttribute('data-theme', stored ? 'dark' : 'light');
    }
    const system = systemQuery();
    const follow = () => setIsDark(explicitTheme() ?? system?.matches ?? false);
    const observer = new MutationObserver(follow);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-appearance'],
    });
    // With no theme picked, the app follows the device when its setting changes.
    system?.addEventListener?.('change', follow);

    return () => {
      observer.disconnect();
      system?.removeEventListener?.('change', follow);
    };
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.setAttribute(
      'data-theme',
      next ? 'dark' : 'light'
    );
    storeTheme(next);
    setIsDark(next);
  };

  return { isDark, toggleTheme };
}
