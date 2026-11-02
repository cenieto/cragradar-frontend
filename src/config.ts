// The app, its API, its tiles and Keycloak share one hostname, so every URL derives from the
// origin of the page and the same build runs in every environment.
export const APP_ORIGIN: string = window.location.origin

export const OIDC_AUTHORITY: string = `${APP_ORIGIN}/auth/realms/cragradar`
export const OIDC_CLIENT_ID = 'cragradar-frontend'

export const UPLOAD_ENDPOINT: string = `${APP_ORIGIN}/api/uploads`
// Chunks small enough to finish within the read timeout of the ingress on slow networks.
export const UPLOAD_CHUNK_SIZE_BYTES: number = 50 * 1024 * 1024
