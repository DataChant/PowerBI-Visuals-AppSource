//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import type { OpaqueSession } from '@microsoft/rayfin-auth';
import {
  ensureSignedInWithFabric,
  initEmbeddedAuth as sdkInitEmbeddedAuth,
  signInWithBrokeredToken,
  type FabricAuthOptions,
} from '@microsoft/rayfin-auth-provider-fabric';
import type RayfinClient from '@microsoft/rayfin-client';

import { getRayfinClient, MissingRayfinConfigError } from '@/lib/rayfin-client';

/** Why the app cannot authenticate, when it cannot. */
export type AuthConfig =
  | { readonly kind: 'ready' }
  /** No Fabric item yet — the expected state before the first deploy. */
  | { readonly kind: 'not-deployed' }
  /** Something wired the app up incompletely; names the absent vars. */
  | { readonly kind: 'incomplete'; readonly missing: readonly string[] }
  /**
   * The deployed `rayfin.config.json` could not be read. The SDK fails closed
   * here rather than falling back to the compiled-in values, because in a
   * promoted stage those point at the previous stage's backend.
   */
  | { readonly kind: 'config-error'; readonly message: string };

export interface IAuthService {
  /**
   * Whether the app can authenticate, and if not, why. {@link AuthGate}
   * renders a different explanation per case.
   */
  readonly config: AuthConfig;

  /**
   * Whether an interactive sign-in can be started from the auth gate.
   */
  readonly canSignIn: boolean;

  /**
   * Resolve the current environment's session authority without opening UI.
   * Let the SDK classify the host before trusting a stored session, then
   * restore standalone authentication or use the Rayfin CLI's local sign-in.
   */
  resolveSession(): Promise<OpaqueSession | null>;

  /**
   * Start the Fabric popup or redirect flow.
   *
   * Call this directly from a user-gesture handler so the browser permits the
   * popup opened by the SDK.
   */
  signIn(): Promise<OpaqueSession>;

  /** Observe sign-out or refresh failure after a session has been established. */
  onSessionChange?(
    listener: (session: OpaqueSession | null) => void
  ): () => void;
}

/**
 * Resolve the app's configuration and construct the auth service it uses.
 *
 * Called from `main.tsx` at module init — **before** React mounts, so this
 * must not throw: nothing has rendered yet, and an exception here leaves the
 * static `<noscript>` fallback in `index.html` on screen with no explanation.
 * Every required value is therefore checked here, before anything that would
 * throw on a missing one is constructed.
 *
 * Deployment-specific values come from the runtime config the deploy emits,
 * falling back to these build-time vars (which is what local dev uses):
 * - `VITE_RAYFIN_API_URL` — Rayfin API base URL (e.g. `http://localhost:5168`)
 * - `VITE_RAYFIN_PUBLISHABLE_KEY` — Rayfin publishable key (`pk-...`)
 * - `VITE_FABRIC_WORKSPACE_ID` — Fabric workspace ID
 * - `VITE_FABRIC_ITEM_ID` — Fabric item ID
 * - `VITE_FABRIC_PORTAL_URL` — Fabric portal base URL
 */
export async function bootstrapAuth(): Promise<IAuthService> {
  // Resolving reads the deployed config over the network, so unlike the checks
  // above it can fail. The SDK deliberately fails closed on anything other than
  // "no config file", so surface that as a rendered explanation rather than
  // letting it escape and blank the page.
  let client: Awaited<ReturnType<typeof getRayfinClient>>;
  try {
    client = await getRayfinClient();
  } catch (error) {
    if (error instanceof MissingRayfinConfigError) {
      return new UnconfiguredAuthService({
        kind: 'incomplete',
        missing: error.missing,
      });
    }

    return new UnconfiguredAuthService({
      kind: 'config-error',
      message: error instanceof Error ? error.message : String(error),
    });
  }

  // These only exist once a Fabric item has been created, so they are absent
  // on every fresh scaffold until the first `rayfin up`.
  const {
    workspaceId,
    itemId: projectId,
    portalUrl: fabricPortalUrl,
  } = client.runtimeConfig ?? {};

  if (!workspaceId || !projectId || !fabricPortalUrl) {
    return new UnconfiguredAuthService({ kind: 'not-deployed' });
  }

  const fabricOptions: FabricAuthOptions = {
    workspaceId,
    projectId,
    fabricPortalUrl,
    returnOrigin: window.location.origin,
  };

  return new RayfinAuthService(client, fabricOptions);
}

/**
 * Stands in for the real service when the app cannot authenticate.
 *
 * Reports no session, which settles {@link AuthProvider} into an
 * unauthenticated state — the same path taken when the app is opened outside
 * a Fabric iframe.
 */
class UnconfiguredAuthService implements IAuthService {
  readonly canSignIn = false;

  constructor(readonly config: AuthConfig) {}

  async resolveSession(): Promise<OpaqueSession | null> {
    return null;
  }

  async signIn(): Promise<OpaqueSession> {
    throw new Error('Sign-in is unavailable until Rayfin is configured.');
  }
}

/**
 * Auth service that wraps the Fabric brokered authentication SDK
 * (`@microsoft/rayfin-auth-provider-fabric`).
 */
class RayfinAuthService implements IAuthService {
  readonly config: AuthConfig = { kind: 'ready' };
  readonly canSignIn = true;

  constructor(
    // Only the auth surface, so declaring an entity in the data schema does not
    // make the client unassignable here -- a bare `RayfinClient` defaults to
    // `Record<string, any>`, which a schema-typed client is not.
    private readonly client: Pick<RayfinClient, 'auth'>,
    private readonly fabricOptions: FabricAuthOptions
  ) {}

  async resolveSession(): Promise<OpaqueSession | null> {
    // Classify the host and let the SDK decide whether a persisted session
    // may be reused *before* this service trusts anything already in local
    // storage. `initEmbeddedAuth()` only resumes a persisted/refreshed
    // session when the host supplies a Fabric user hint (or a handoff
    // already completed this page load); otherwise -- including the
    // externalEmbed and legacy-host cases -- it skips straight to a fresh
    // handoff, which is exactly the protection a stale previous user's
    // session needs. For a standalone page (no parent frame, no embed flag)
    // this call is a fast no-op and returns `null` immediately, so the
    // fallbacks below still run unchanged.
    const embeddedSession = await sdkInitEmbeddedAuth(
      this.client.auth,
      this.fabricOptions
    );
    if (embeddedSession) return embeddedSession;

    const currentSession = this.client.auth.getSession();
    if (currentSession.isAuthenticated && !currentSession.isAnonymous)
      return currentSession;
    if (currentSession.isAnonymous) await this.client.auth.signOut();

    if (this.client.auth.hasRefreshToken()) {
      try {
        await this.client.auth.refreshSession();
        const refreshedSession = this.client.auth.getSession();
        if (refreshedSession.isAuthenticated && !refreshedSession.isAnonymous)
          return refreshedSession;
      } catch {
        // Continue to the environment-specific silent paths.
      }
    }

    // Keep development credential brokerage out of the production bundle.
    if (import.meta.env.DEV) {
      const localDev = await import('@microsoft/rayfin-local-dev');
      if (localDev.isRayfinLocalAutoLoginEnabled()) {
        const sessionToken = await localDev.fetchRayfinLocalSessionToken();
        if (!sessionToken) {
          throw new Error(
            'Local automatic sign-in is enabled, but no session token was returned.'
          );
        }
        return signInWithBrokeredToken(this.client.auth, sessionToken);
      }
    }
    return null;
  }

  async signIn(): Promise<OpaqueSession> {
    if (this.client.auth.getSession().isAnonymous)
      await this.client.auth.signOut();
    return ensureSignedInWithFabric(this.client.auth, this.fabricOptions);
  }

  onSessionChange(
    listener: (session: OpaqueSession | null) => void
  ): () => void {
    return this.client.auth.onSessionChange(listener);
  }
}
