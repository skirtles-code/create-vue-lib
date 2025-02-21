#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'
import { parseArgs } from 'node:util'
import prompts, { type PromptObject } from 'prompts'
import ejs from 'ejs'
import packageJson from '../package.json'

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

async function textPromptIf(condition: boolean, message: string, initial?: string): Promise<string> {
  return condition ? textPrompt(message, initial) : initial ?? ''
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

type Args = {
  extended: boolean
}

// TODO: Add link to docs
const helpMessage = `\
Usage: create-vue-lib [OPTIONS...]

Create a new Vite project to build a Vue-based library.

Options:
  --extended, -x
    Prompt for extra configuration options.
  --help, -h
    Display this help message.
  --version, -v
    Display the version number for create-vue-lib.
`

function processArgs(): Args {
  let argValues: object = {}

  const options = {
    extended: {
      short: 'x',
      type: 'boolean'
    },
    help: {
      short: 'h',
      type: 'boolean'
    },
    version: {
      short: 'v',
      type: 'boolean'
    }
  } as const

  try {
    const args = parseArgs({
      options
    })

    argValues = args.values
  } catch (err) {
    if (err.code === 'ERR_PARSE_ARGS_UNKNOWN_OPTION') {
      console.log('Error:')
      console.log(err.message)
      console.log('See --help for valid options')
      process.exit(1)
    } else {
      throw err
    }
  }

  if (argValues.help) {
    console.log(helpMessage)
    process.exit(0)
  }

  if (argValues.version) {
    console.log(`${packageJson.name} v${packageJson.version}`)
    process.exit(0)
  }

  return {
    extended: !!argValues.extended
  }
}

async function init() {
  const cwd = process.cwd()

  const { extended } = processArgs()

  console.log()
  console.log(`Welcome to ${packageJson.name} v${packageJson.version}`)
  console.log()
  console.log('This tool will help you to scaffold a Vite project for your Vue-based library.')
  console.log()
  console.log('It is recommended to use a scoped package name for your library.')
  console.log('e.g. @username/package-name')
  console.log('To learn more about scopes see: https://docs.npmjs.com/about-scopes')
  console.log()

  const scopedPackageName = await textPrompt('Package name', '')

  if (!/^(@[a-z][a-z0-9-]*\/)?[a-z][a-z0-9-_.]*$/.test(scopedPackageName)) {
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

  const mainPackageDirName = await textPromptIf(extended, 'Main package directory', unscopedPackageName)

  if (!/^[\w-]+$/.test(mainPackageDirName)) {
    console.log('Invalid directory name: ' + mainPackageDirName)
    process.exit(1)
  }

  const globalVariableName = await textPromptIf(extended, 'Global variable name', projectName.replace(/ /g, ''))

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
