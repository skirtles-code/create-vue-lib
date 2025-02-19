#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'
import prompts, { type PromptObject } from 'prompts'
import ejs from 'ejs'

async function prompt(options: Omit<PromptObject, 'name'>) {
  try {
    const result = await prompts(
      {
        ...options,
        name: 'name'
      },
      {
        onCancel: () => {
          throw new Error('Cancelled')
        }
      }
    )

    return result.name
  } catch (cancelled) {
    console.log(cancelled.message)
    process.exit(1)
  }
}

async function textPrompt(message: string, initial?: string): Promise<string> {
  const resp = await prompt({
    type: 'text',
    message,
    initial
  })

  return resp.trim()
}

async function togglePrompt(message: string, initial = false, active = 'Yes', inactive = 'No'): Promise<boolean> {
  return prompt({
    type: 'toggle',
    message,
    initial,
    active,
    inactive
  })
}

async function togglePromptIf(condition: boolean, message: string, initial = false, active = 'Yes', inactive = 'No'): Promise<boolean> {
  return condition ? togglePrompt(message, initial, active, inactive) : initial
}

type Config = {
  scopedPackageName: string
  unscopedPackageName: string
  shortUnscopedPackageName: string
  projectName: string
  globalVariableName: string
  targetDirName: string
  targetDirPath: string
  mainPackageDirName: string
  templateDirPath: string
  githubPath: string
  githubUrl: string
  githubIssues: string
  githubRepository: string
  githubPagesOrigin: string
  docsBase: string
  homepageUrl: string
  includeDocs: boolean
  includeGithubPages: boolean
  includePlayground: boolean
  includeExamples: boolean
  includeEsLint: boolean
  includeEsLintStylistic: boolean
}

async function init() {
  const cwd = process.cwd()

  const scopedPackageName = await textPrompt('Package name', '@skirtle/test-project')

  // TODO: Tightening this check, e.g. for hyphen positions
  if (!/^@[a-z0-9-]+\/[a-z0-9-]+$/.test(scopedPackageName)) {
    console.log('Invalid package name: ' + scopedPackageName)
    process.exit(1)
  }

  const unscopedPackageName = scopedPackageName.replace(/.*\//, '')
  const shortUnscopedPackageName = unscopedPackageName.replace(/^vue-/, '')
  const projectName = unscopedPackageName.replace(/-+/g, ' ').trim().split(' ').map(s => s[0].toUpperCase() + s.slice(1)).join(' ')

  const targetDirName = await textPrompt('Target directory', unscopedPackageName)

  if (targetDirName !== '.' && !/^[\w-]+$/.test(targetDirName)) {
    console.log('Invalid directory name: ' + targetDirName)
    process.exit(1)
  }

  const targetDirPath = path.join(cwd, targetDirName)

  if (targetDirName === '.') {
    // TODO: Check files properly and prompt accordingly
    if (fs.existsSync(path.join(targetDirPath, 'package.json'))) {
      console.log('Target directory already contains package.json')
    }
  } else {
    if (fs.existsSync(targetDirPath)) {
      console.log('Target directory already exists')
    }
  }

  const mainPackageDirName = await textPrompt('Main package directory', unscopedPackageName)

  if (!/^[\w-]+$/.test(mainPackageDirName)) {
    console.log('Invalid directory name: ' + mainPackageDirName)
    process.exit(1)
  }

  const globalVariableName = await textPrompt('Global variable name', projectName.replace(/ /g, ''))

  if (!/^[a-zA-Z$_][\w$]*$/.test(globalVariableName)) {
    console.log('Invalid variable name: ' + globalVariableName)
    process.exit(1)
  }

  const githubPath = await textPrompt('GitHub path, e.g. skirtles-code/test-project (optional)')

  if (githubPath && !/^[\w-]+\/[\w-]+$/.test(githubPath)) {
    console.log('Invalid GitHub path: ' + githubPath)
    process.exit(1)
  }

  const includeEsLint = await togglePrompt('Include ESLint?', true)
  const includeEsLintStylistic = await togglePromptIf(includeEsLint, 'Include ESLint Stylistic for formatting?', includeEsLint)
  const includeDocs = await togglePrompt('Include VitePress for documentation?', true)
  const includeGithubPages = includeDocs && await togglePrompt('Include GitHub Pages config for documentation?')
  const includePlayground = await togglePrompt('Include playground application for development?', true)
  const includeExamples = await togglePrompt('Include example code?', true, 'Yes', 'No, just configs')

  const [githubUserName, githubRepoName] = (githubPath || '/').split('/')
  const githubUrl = githubPath ? `https://github.com/${githubPath}` : ''
  const githubIssues = githubPath ? `${githubUrl}/issues` : ''
  const githubRepository = githubPath ? `git+${githubUrl}.git` : ''
  const githubPagesOrigin = githubUserName && includeGithubPages ? `https://${githubUserName}.github.io` : ''
  const docsBase = githubRepoName && includeGithubPages ? `/${githubRepoName}/` : '/'
  const homepageUrl = githubPagesOrigin && includeGithubPages ? `${githubPagesOrigin}${docsBase}` : githubUrl

  const templateDirPath = path.resolve(__dirname, 'template')

  const config: Config = {
    scopedPackageName,
    unscopedPackageName,
    shortUnscopedPackageName,
    projectName,
    globalVariableName,
    targetDirName,
    targetDirPath,
    mainPackageDirName,
    templateDirPath,
    githubPath,
    githubUrl,
    githubIssues,
    githubRepository,
    githubPagesOrigin,
    docsBase,
    homepageUrl,
    includeDocs,
    includeGithubPages,
    includePlayground,
    includeExamples,
    includeEsLint,
    includeEsLintStylistic
  }

  copyTemplate('base', config)

  if (config.includeDocs) {
    copyTemplate('vitepress', config)
  }

  if (config.includeGithubPages) {
    copyTemplate('gh-pages', config)
  }

  if (config.includePlayground) {
    copyTemplate('playground', config)
  }

  if (config.includeEsLint) {
    copyTemplate('eslint', config)
  }

  console.log('Project created')
  console.log('Note: pnpm must be used as the package manager')
  console.log()

  if (targetDirName !== '.') {
    console.log('cd ' + targetDirName)
  }

  console.log('pnpm install')

  if (!fs.existsSync(path.join(targetDirPath, 'packages', config.mainPackageDirName, 'LICENSE'))) {
    console.log()
    console.log(`You should add a suitable license at packages/${config.mainPackageDirName}/LICENSE`)
  }
}

function copyTemplate(templateName: string, config: Config) {
  const dirs = ['config']

  if (config.includeExamples) {
    dirs.push('examples')
  }

  for (const dir of dirs) {
    const templateDirPath = path.join(config.templateDirPath, templateName, dir)

    if (fs.existsSync(templateDirPath)) {
      copyFiles('', {
        ...config,
        templateDirPath
      })
    }
  }
}

function copyFiles(templateFile: string, config: Config) {
  const templatePath = path.join(config.templateDirPath, templateFile)
  const stats = fs.statSync(templatePath)
  const basename = path.basename(templatePath)

  const targetPath = path.join(config.targetDirPath, templateFile.replace(/@projectName@/g, config.mainPackageDirName))

  if (stats.isDirectory()) {
    if (basename === 'node_modules') {
      return
    }

    fs.mkdirSync(targetPath, { recursive: true })

    for (const file of fs.readdirSync(templatePath)) {
      copyFiles(path.join(templateFile, file), config)
    }

    return
  }

  const filename = path.basename(templatePath)

  if (filename.endsWith('.ejs')) {
    const template = fs.readFileSync(templatePath, 'utf-8')
    const target = targetPath.replace(/\.ejs$/, '')
    const content = ejs.render(template, { config })

    fs.writeFileSync(target, content)
  } else if (['package.json', 'vite.config.mts', 'config.mts', 'index.md', 'introduction.md', 'App.vue', 'tsconfig.app.json', 'env.d.ts'].includes(filename)) {
    const template = fs.readFileSync(templatePath, 'utf-8')
    const content = template
      .replace(/@projectName@/g, config.mainPackageDirName)
      .replace(new RegExp(`@(${Object.keys(config).join('|')})@`, 'g'), (all, setting) => config[setting] ?? all)

    fs.writeFileSync(targetPath, content)
  } else {
    fs.copyFileSync(templatePath, targetPath)
  }
}

init()
