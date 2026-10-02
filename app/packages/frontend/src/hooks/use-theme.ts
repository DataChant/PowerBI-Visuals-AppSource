//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { useState, useEffect } from 'react';

function explicitTheme(): boolean | undefined {
  for (const attribute of ['data-theme', 'data-appearance']) {
    const value = document.documentElement.getAttribute(attribute);
    if (value === 'dark') return true;
    if (value === 'light') return false;
  }
  return undefined;
}

/**
 * Defaults to light unless the app or host explicitly chooses a theme.
 * A user toggle overrides host appearance for the current document.
 */
export function useAppTheme() {
  const [isDark, setIsDark] = useState(
    () => explicitTheme() ?? document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(explicitTheme() ?? false);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-appearance'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.setAttribute(
      'data-theme',
      next ? 'dark' : 'light'
    );
    setIsDark(next);
  };

  return { isDark, toggleTheme };
}
