/** Where a navigation goes. */
export type AccessDecision = 'allow' | 'login' | 'home' | 'mobile-only'

export interface AccessRequest {
  /** The page needs no signed-in user, such as the login callback. */
  isPublicPage: boolean
  /** The page is for content creators only. */
  requiresContentRole: boolean
  /** The page may be shown on a laptop to anyone, such as the "use your phone" page. */
  isAllowedOnLaptop: boolean
  isSignedIn: boolean
  isContentEditor: boolean
  isMobileDevice: boolean
}

/**
 * Decide whether a page can be shown.
 *
 * Content is visible on phones only, except for content creators, who may use any device.
 * This shapes the interface; the backend authorizes every request on its own.
 *
 * @param request The page and the user.
 * @returns `allow`, or where to send the user instead.
 */
export function decideAccess(request: AccessRequest): AccessDecision {
  if (request.isPublicPage) {
    return 'allow'
  }
  if (!request.isSignedIn) {
    return 'login'
  }
  const isMissingContentRole: boolean = request.requiresContentRole && !request.isContentEditor
  if (isMissingContentRole) {
    return 'home'
  }
  const isBlockedLaptop: boolean =
    !request.isMobileDevice && !request.isContentEditor && !request.isAllowedOnLaptop
  if (isBlockedLaptop) {
    return 'mobile-only'
  }
  return 'allow'
}
