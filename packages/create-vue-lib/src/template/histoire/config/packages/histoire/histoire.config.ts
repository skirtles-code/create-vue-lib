import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
  outDir: 'dist',
  plugins: [HstVue()],
  storyMatch: ['../**/*.story.vue'],
  setupFile: './setup.ts'
})
