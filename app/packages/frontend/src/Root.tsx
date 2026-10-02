//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { ErrorBoundary } from 'react-error-boundary';

import App from './App.tsx';
import { ErrorFallback } from './ErrorFallback';
import { ThemeContext } from './hooks/theme.context';
import { useAppTheme } from './hooks/use-theme';

/**
 * The app is public and reads published data files, so nothing here signs a
 * visitor in or waits for Fabric.
 */
export function Root() {
  const { isDark, toggleTheme } = useAppTheme();

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <App />
      </ErrorBoundary>
    </ThemeContext.Provider>
  );
}
