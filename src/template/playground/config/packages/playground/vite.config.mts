import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    vueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@scopedPackageName@': fileURLToPath(new URL('../@projectName@/src/index.ts', import.meta.url))
    }
  },

  define: {
    __DEV__: JSON.stringify(mode !== 'production')
  }
}))
