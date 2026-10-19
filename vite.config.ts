import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 2012,
    host: '0.0.0.0',
    allowedHosts: ['digital.agungsundoro.com'],
    hmr: {
      host: 'digital.agungsundoro.com',
      clientPort: 443,
    },
  },
  preview: {
    port: 1012,
    host: '0.0.0.0',
  },
  build: {
    cssMinify: true,
    minify: 'esbuild',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split the framework into a long-lived vendor chunk so app-only changes
        // don't invalidate the cached Vue runtime on every deploy.
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
