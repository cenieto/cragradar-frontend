export const PLATFORM_ADMIN_ROLE = 'platform_admin'
export const CONTENT_GENERATOR_ROLE = 'content_generator'

/** Roles that create content, and may use the app on a laptop. */
export const CONTENT_ROLES: readonly string[] = [PLATFORM_ADMIN_ROLE, CONTENT_GENERATOR_ROLE]

function decodeBase64Url(encoded: string): string {
  const base64: string = encoded.replace(/-/g, '+').replace(/_/g, '/')
  const padded: string = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  const bytes: Uint8Array = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/**
 * Read the Keycloak realm roles of an access token, to adapt the interface.
 *
 * The signature is not checked: the backend checks every request.
 *
 * @param accessToken Encoded access token.
 * @returns The roles of `realm_access.roles`; empty if the token cannot be read.
 */
export function readRealmRoles(accessToken: string): string[] {
  const encodedPayload: string | undefined = accessToken.split('.')[1]
  if (encodedPayload === undefined) {
    return []
  }
  try {
    const payload: { realm_access?: { roles?: unknown } } = JSON.parse(
      decodeBase64Url(encodedPayload),
    )
    const roles: unknown = payload.realm_access?.roles
    return Array.isArray(roles) ? roles.filter((role) => typeof role === 'string') : []
  } catch {
    return []
  }
}

/**
 * Tell whether a user creates content.
 *
 * @param roles Realm roles of the user.
 * @returns `true` for content generators and platform admins.
 */
export function hasContentRole(roles: readonly string[]): boolean {
  return roles.some((role) => CONTENT_ROLES.includes(role))
}
