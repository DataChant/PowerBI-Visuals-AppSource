//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import type { OpaqueSession } from '@microsoft/rayfin-auth';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { AuthContext, type AuthContextValue } from './auth.context';

import { IAuthService } from '@/services/rayfin-auth.service';

interface AuthProviderProps {
  children: ReactNode;
  rayfinAuthService: IAuthService;
}

/**
 * AuthProvider — resolves a silent session once on mount.
 *
 * Behavior:
 * - Lets the SDK classify the host before reusing any stored identity.
 * - Restores standalone sessions before falling back to Rayfin CLI sign-in.
 * - Settles unauthenticated when none of the silent paths produce a session.
 *
 * Consume the session with the `useAuth` hook.
 */
export function AuthProvider({
  children,
  rayfinAuthService,
}: AuthProviderProps) {
  const [session, setSession] = useState<OpaqueSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<Error | null>(null);
  const isAuthenticated =
    session?.isAuthenticated === true && session.isAnonymous === false;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await rayfinAuthService.resolveSession();
        if (cancelled) return;
        setSession(result);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [rayfinAuthService]);

  useEffect(() => {
    if (!isAuthenticated) return;
    return rayfinAuthService.onSessionChange?.(setSession);
  }, [rayfinAuthService, isAuthenticated]);

  const signIn = useCallback(async () => {
    setIsSigningIn(true);
    setSignInError(null);
    try {
      const result = await rayfinAuthService.signIn();
      setSession(result);
      setError(null);
    } catch (err) {
      setSignInError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsSigningIn(false);
    }
  }, [rayfinAuthService]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated,
      isLoading,
      canSignIn: rayfinAuthService.canSignIn,
      signIn,
      isSigningIn,
      signInError,
      config: rayfinAuthService.config,
      error,
    }),
    [
      session,
      isAuthenticated,
      isLoading,
      rayfinAuthService,
      signIn,
      isSigningIn,
      signInError,
      error,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
