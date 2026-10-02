//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { createContext, useContext } from 'react';

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  toggleTheme: () => {},
});

/**
 * Reads the current theme.
 *
 * `useTheme` is the name React developers - and the models that write like them
 * - reach for by habit, so it is the one this exports. `useThemeContext` stays
 * as an alias because guessing either name should not cost a build.
 */
export function useTheme() {
  return useContext(ThemeContext);
}

export const useThemeContext = useTheme;
