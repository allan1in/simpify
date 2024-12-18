import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    // Don't need to import functions from vitest in test files (**.spec.js)
    globals: true
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // https://vitejs.dev/config/shared-options.html#css-preprocessoroptions-extension-additionaldata
        additionalData: `@import '@/styles/_variables.scss';@import '@/styles/_mixins.scss';`
      }
    }
  }
})
