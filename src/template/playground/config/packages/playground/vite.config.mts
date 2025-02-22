import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }): UserConfig => ({
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
