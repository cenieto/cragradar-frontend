import { computed, reactive, type ComputedRef } from 'vue'
import { UserManager, WebStorageStateStore, type User } from 'oidc-client-ts'

import { APP_ORIGIN, OIDC_AUTHORITY, OIDC_CLIENT_ID } from './config'
import { hasContentRole, readRealmRoles } from './roles'

/** Signed-in user of the app, shared by every component. */
export const session = reactive<{ user: User | null; roles: string[] }>({ user: null, roles: [] })

export const isContentEditor: ComputedRef<boolean> = computed(() => hasContentRole(session.roles))

// Authorization Code + PKCE with Keycloak; tokens are renewed with the refresh token before
// they expire and kept in sessionStorage, so they end with the browser tab.
const userManager: UserManager = new UserManager({
  authority: OIDC_AUTHORITY,
  client_id: OIDC_CLIENT_ID,
  redirect_uri: `${APP_ORIGIN}/callback`,
  post_logout_redirect_uri: `${APP_ORIGIN}/`,
  response_type: 'code',
  scope: 'openid',
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
})

function setUser(user: User | null): void {
  session.user = user
  session.roles = user === null ? [] : readRealmRoles(user.access_token)
}

userManager.events.addUserLoaded(setUser)
userManager.events.addUserUnloaded(() => setUser(null))

/**
 * Restore the user of a previous sign-in, renewing an expired access token if possible.
 *
 * @returns The signed-in user, or `null` when the user must sign in.
 */
export async function loadUser(): Promise<User | null> {
  const storedUser: User | null = await userManager.getUser()
  if (storedUser === null) {
    setUser(null)
    return null
  }
  if (!storedUser.expired) {
    setUser(storedUser)
    return storedUser
  }
  try {
    setUser(await userManager.signinSilent())
  } catch {
    await userManager.removeUser()
    setUser(null)
  }
  return session.user
}

/**
 * Send the browser to the Keycloak login page.
 *
 * @param returnPath Page to show once signed in.
 */
export async function login(returnPath: string): Promise<void> {
  await userManager.signinRedirect({ state: { returnPath } })
}

/**
 * Finish the login when Keycloak redirects back to `/callback`.
 *
 * @returns The page the user wanted before signing in.
 */
export async function completeLogin(): Promise<string> {
  const user: User = await userManager.signinRedirectCallback()
  setUser(user)
  const state: { returnPath?: string } | undefined = user.state as { returnPath?: string }
  return state?.returnPath ?? '/'
}

/** Sign out of the app and of Keycloak. */
export async function logout(): Promise<void> {
  await userManager.signoutRedirect()
}

/**
 * Get the current access token, for API calls.
 *
 * @returns The token, or an empty string when signed out.
 */
export function getAccessToken(): string {
  return session.user?.access_token ?? ''
}
