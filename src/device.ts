/** What the browser tells about the device. */
export interface DeviceHints {
  userAgent: string
  /** `navigator.userAgentData.mobile`, when the browser supports User-Agent Client Hints. */
  userAgentDataMobile?: boolean
}

const MOBILE_USER_AGENT = /iPhone|iPod|Windows Phone|Android.*Mobile|Mobile.*Firefox|Mobi/i

/**
 * Read the device hints of the current browser.
 *
 * @returns The user agent, and the client hint when available.
 */
export function readDeviceHints(): DeviceHints {
  const userAgentData: { mobile?: boolean } | undefined = (
    navigator as Navigator & { userAgentData?: { mobile?: boolean } }
  ).userAgentData
  return { userAgent: navigator.userAgent, userAgentDataMobile: userAgentData?.mobile }
}

/**
 * Tell whether the device is a phone. Tablets and laptops are not.
 *
 * @param hints What the browser tells about the device.
 * @returns The client hint when the browser gives it, otherwise a match of the user agent.
 */
export function isMobileDevice(hints: DeviceHints): boolean {
  if (hints.userAgentDataMobile !== undefined) {
    return hints.userAgentDataMobile
  }
  return MOBILE_USER_AGENT.test(hints.userAgent)
}
