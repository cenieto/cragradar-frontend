/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

// The dev server runs inside the cluster behind the ingress, on the same port as the prod nginx
// (8080), so the Kubernetes manifests are identical in dev and prod.
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    host: true,
    port: 8080,
    strictPort: true,
    allowedHosts: ['cragradar.localhost'],
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
