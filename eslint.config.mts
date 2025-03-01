import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { includeIgnoreFile } from '@eslint/compat'
import pluginVue from 'eslint-plugin-vue'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,vue}']
  },

  includeIgnoreFile(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.gitignore')),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  stylistic.configs.customize({
    commaDangle: 'never'
  })
)
