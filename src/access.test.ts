import { describe, expect, it } from 'vitest'

import { decideAccess, type AccessRequest } from './access'

const SIGNED_IN_VIEWER_ON_PHONE: AccessRequest = {
  isPublicPage: false,
  requiresContentRole: false,
  isAllowedOnLaptop: false,
  isSignedIn: true,
  isContentEditor: false,
  isMobileDevice: true,
}

describe('decideAccess', () => {
  it('lets a viewer see content on a phone', () => {
    expect(decideAccess(SIGNED_IN_VIEWER_ON_PHONE)).toBe('allow')
  })

  it('sends a viewer on a laptop to the mobile-only page', () => {
    expect(decideAccess({ ...SIGNED_IN_VIEWER_ON_PHONE, isMobileDevice: false })).toBe(
      'mobile-only',
    )
  })

  it('lets a content creator see content on a laptop', () => {
    const editorOnLaptop: AccessRequest = {
      ...SIGNED_IN_VIEWER_ON_PHONE,
      isMobileDevice: false,
      isContentEditor: true,
    }
    expect(decideAccess(editorOnLaptop)).toBe('allow')
  })

  it('shows the mobile-only page itself on a laptop', () => {
    const mobileOnlyPage: AccessRequest = {
      ...SIGNED_IN_VIEWER_ON_PHONE,
      isMobileDevice: false,
      isAllowedOnLaptop: true,
    }
    expect(decideAccess(mobileOnlyPage)).toBe('allow')
  })

  it('sends a viewer away from content creation, even on a phone', () => {
    expect(decideAccess({ ...SIGNED_IN_VIEWER_ON_PHONE, requiresContentRole: true })).toBe('home')
  })

  it('asks a signed-out user to log in before anything else', () => {
    const signedOutOnLaptop: AccessRequest = {
      ...SIGNED_IN_VIEWER_ON_PHONE,
      isSignedIn: false,
      isMobileDevice: false,
    }
    expect(decideAccess(signedOutOnLaptop)).toBe('login')
  })

  it('shows public pages to signed-out users', () => {
    const callbackPage: AccessRequest = {
      ...SIGNED_IN_VIEWER_ON_PHONE,
      isPublicPage: true,
      isSignedIn: false,
    }
    expect(decideAccess(callbackPage)).toBe('allow')
  })
})
