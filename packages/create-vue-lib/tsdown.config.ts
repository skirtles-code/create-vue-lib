import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  clean: false,
  format: ['cjs'],
  target: 'node18',
  deps: {
    onlyBundle: false
  }
})
