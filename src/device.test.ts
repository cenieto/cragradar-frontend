import { describe, expect, it } from 'vitest'

import { isMobileDevice } from './device'

const IPHONE_SAFARI =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
const ANDROID_PHONE_FIREFOX = 'Mozilla/5.0 (Android 15; Mobile; rv:140.0) Gecko/140.0 Firefox/140.0'
const ANDROID_TABLET_CHROME =
  'Mozilla/5.0 (Linux; Android 15; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
const WINDOWS_CHROME =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
const IPAD_SAFARI =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15'

describe('isMobileDevice', () => {
  it('trusts the client hint when the browser gives it', () => {
    expect(isMobileDevice({ userAgent: WINDOWS_CHROME, userAgentDataMobile: true })).toBe(true)
    expect(isMobileDevice({ userAgent: IPHONE_SAFARI, userAgentDataMobile: false })).toBe(false)
  })

  it.each([
    ['iPhone Safari', IPHONE_SAFARI],
    ['Android phone Firefox', ANDROID_PHONE_FIREFOX],
  ])('recognises a phone from its user agent: %s', (_name, userAgent) => {
    expect(isMobileDevice({ userAgent })).toBe(true)
  })

  it.each([
    ['Windows Chrome', WINDOWS_CHROME],
    ['Android tablet Chrome', ANDROID_TABLET_CHROME],
    ['iPad Safari, which reports a Mac', IPAD_SAFARI],
  ])('treats a laptop or tablet as not mobile: %s', (_name, userAgent) => {
    expect(isMobileDevice({ userAgent })).toBe(false)
  })
})
