# cragradar-frontend

Vue 3 single-page app of CragRadar. Shipped only as a container image on GHCR, which serves the
built app. Deployment manifests live in `cragradar-frontend-service`, not here.

## Views

| Route | Role required | Purpose |
| --- | --- | --- |
| `/` | viewer | Locations the user can see (the user shares at least one tag with them). |
| `/view/:imageId` | viewer | OpenSeadragon viewer with read-only annotations. |
| `/studio/...` | content_generator | Upload large images, follow ingest status, edit annotations (one editor per image, enforced by an edit lock). |
| `/users/...` | content_generator | Add viewers and assign tags. |
| `/admin/...` | platform_admin | Manage content generators. |

## Stack

Vue 3 + TypeScript + Vite, Vue Router, Pinia, `oidc-client-ts` (Authorization Code + PKCE with
Keycloak), OpenSeadragon with a Paper.js annotation overlay (supports spline and Bézier
features), TanStack Query, and an API client generated from the backend OpenAPI schema.

One image runs in every environment: the backend URL and the OIDC settings are loaded when the app
starts, from `/config.json`, which the deployment provides.

Code from `tile-drawer` (OpenSeadragon + Paper.js) and `crag-radar-poc` is meant to move here.

## Develop

Nothing is installed on the laptop. Two complementary ways to work, both using the `dev` stage of
the `Dockerfile`:

- **Run:** `tilt up` from the umbrella `cragradar` repository runs this app in the local cluster and
  syncs code edits into the running container.
- **Edit:** open this folder in VS Code and choose **Reopen in Container** for autocompletion,
  type checking and tests in the editor. Type checks also run from the `checks` button in the Tilt
  dashboard.
