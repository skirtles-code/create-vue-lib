import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import replace from '@rollup/plugin-replace'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
  if (mode !== 'production' && mode !== 'development' && mode !== 'neutral' && mode !== 'test') {
    throw new Error(`Unknown mode: ${mode}`)
  }

  const dtsPlugin = mode === 'neutral'
    ? dts({
        rollupTypes: true,
        tsconfigPath: './tsconfig.app.json'
      })
    : null

  return {
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          __DEV__: mode === 'production' ? 'false' : mode === 'development' ? 'true' : '!(process.env.NODE_ENV === "production")'
        }
      }),
      vue(),
      dtsPlugin
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      target: 'es2019',
      emptyOutDir: false,
      minify: mode === 'production',
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: '@globalVariableName@',
        formats: mode === 'neutral' ? ['cjs', 'es'] : ['es', 'iife'],

        fileName(format) {
          let name = '@unscopedPackageName@'
          let extension = 'js'

          if (format === 'iife') {
            name += '.global'
          }
          else if (format === 'es') {
            name += '.esm-' + (mode === 'neutral' ? 'bundler' : 'browser')
          }

          if (mode === 'production') {
            name += '.prod'
          }
          else if (mode === 'development') {
            name += '.dev'
          }
          else if (mode === 'neutral') {
            extension = format === 'cjs' ? 'cjs' : 'mjs'
          }

          return `${name}.${extension}`
        }
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue'
          }
        }
      }
    }
  }
})
