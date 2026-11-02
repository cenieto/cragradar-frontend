# cragradar-frontend

Vue 3 single-page app of CragRadar. Shipped only as a container image on GHCR, which serves the
built app. Deployment manifests live in `cragradar-frontend-service`, not here.

## Views

| Route | Who | Purpose |
| --- | --- | --- |
| `/` | signed-in users | Locations (placeholder until locations exist). |
| `/studio` | content_generator, platform_admin | Content creation: upload an image with a button, follow its processing. |
| `/mobile-only` | anyone signed in | Shown on a laptop or tablet to users without a content role. |
| `/callback` | public | End of the Keycloak login. |

Planned: `/view/:imageId` (OpenSeadragon viewer), `/users` (viewers and tags), `/admin`.

## Rules

- **Sign-in:** every page except `/callback` needs a signed-in user (Keycloak, Authorization
  Code + PKCE with `oidc-client-ts`; tokens in sessionStorage, renewed automatically).
- **Mobile only:** content is shown on phones only, except to content generators and platform
  admins, who may use any device. Phones are detected with `navigator.userAgentData.mobile`,
  or the user agent when the browser has no client hints; tablets count as laptops. The rule
  lives in `src/access.ts`. It shapes the interface only: the backend authorizes every
  request on its own.
- **Uploads:** tus protocol with `tus-js-client`, 50 MB chunks, retried on network errors. Each
  request carries the current access token.
- **No runtime configuration:** Keycloak, the API and tiles share the hostname of the app, so
  every URL derives from `window.location.origin` (`src/config.ts`).

## Stack

Vue 3 + TypeScript + Vite, Vue Router, Tailwind CSS 4, `oidc-client-ts`, `tus-js-client`;
unit tests with Vitest (`pnpm test`).

## Develop

Nothing is installed on the laptop. Two complementary ways to work, both using the `dev` stage of
the `Dockerfile`:

- **Run:** `tilt up` from the umbrella `cragradar` repository runs this app in the local cluster and
  syncs code edits into the running container.
- **Edit:** open this folder in VS Code and choose **Reopen in Container** for autocompletion,
  type checking and tests in the editor. Type checks also run from the `checks` button in the Tilt
  dashboard.
