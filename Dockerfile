# syntax=docker/dockerfile:1
# Stages: `dev` (Vite dev server, used by Tilt and the dev container) and `prod` (nginx serving
# the build). Both listen on 8080, so the Kubernetes manifests do not change between them.
FROM node:24-bookworm-slim AS base
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
# The `node` user of the image has UID 1000, matching the WSL user.
USER node
WORKDIR /app

FROM base AS dev
COPY --chown=node package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY --chown=node . .
CMD ["pnpm", "dev"]

FROM dev AS build
RUN pnpm build

FROM nginxinc/nginx-unprivileged:1.29-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
