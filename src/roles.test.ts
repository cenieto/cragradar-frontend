import { describe, expect, it } from 'vitest'

import { hasContentRole, readRealmRoles } from './roles'

function encodeBase64Url(text: string): string {
  return btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function makeToken(payload: object): string {
  return ['header', encodeBase64Url(JSON.stringify(payload)), 'signature'].join('.')
}

describe('readRealmRoles', () => {
  it('reads the realm roles of a Keycloak access token', () => {
    const token: string = makeToken({ sub: 'u1', realm_access: { roles: ['viewer', 'content_generator'] } })
    expect(readRealmRoles(token)).toEqual(['viewer', 'content_generator'])
  })

  it('gives no roles for a token without realm access', () => {
    expect(readRealmRoles(makeToken({ sub: 'service' }))).toEqual([])
  })

  it('gives no roles for a malformed token', () => {
    expect(readRealmRoles('not-a-token')).toEqual([])
    expect(readRealmRoles('a.%%%.c')).toEqual([])
  })
})

describe('hasContentRole', () => {
  it('accepts content generators and platform admins', () => {
    expect(hasContentRole(['content_generator'])).toBe(true)
    expect(hasContentRole(['viewer', 'platform_admin'])).toBe(true)
  })

  it('rejects viewers', () => {
    expect(hasContentRole(['viewer'])).toBe(false)
  })
})
