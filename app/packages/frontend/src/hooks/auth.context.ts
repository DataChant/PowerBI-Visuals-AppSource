//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import type { OpaqueSession } from '@microsoft/rayfin-auth';
import { createContext, useContext } from 'react';

import type { AuthConfig } from '@/services/rayfin-auth.service';

export interface AuthContextValue {
  /** The current Rayfin session, or `null` if not authenticated. */
  session: OpaqueSession | null;
  /** True only for an authenticated, non-anonymous session. */
  isAuthenticated: boolean;
  /** True while the embedded auth handoff is in flight. */
  isLoading: boolean;
  /** Whether the current configuration supports interactive sign-in. */
  canSignIn: boolean;
  /** Start the interactive Fabric sign-in flow. */
  signIn: () => Promise<void>;
  /** True while an interactive sign-in is in progress. */
  isSigningIn: boolean;
  /** Last error from interactive sign-in, if any. */
  signInError: Error | null;
  /** Whether the app can authenticate, and if not, why. */
  config: AuthConfig;
  /** Last error from silent session resolution, if any. */
  error: Error | null;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
