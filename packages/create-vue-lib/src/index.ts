#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'
import { parseArgs } from 'node:util'
import prompts, { type PromptObject } from 'prompts'
import ejs from 'ejs'
import { bgGreen, bgRed, bgYellowBright, black, bold, cyan, green, magenta, red } from 'picocolors'
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
  }
  catch (cancelled) {
    console.log(red(`${(cancelled as { message: string }).message}`))
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
  packageNameAsObjectKey: string
  globalVariableName: string
  targetDirName: string
  targetDirPath: string
  packagesDir: string
  mainPackageDirName: string
  templateDirPath: string
  githubPath: string
  githubUrl: string
  githubIssues: string
  githubRepository: string
  githubPagesOrigin: string
  docsBase: string
  homepageUrl: string
  includePackagesDir: boolean
  includeDocs: boolean
  includeGithubPages: boolean
  includePlayground: boolean
  includeExamples: boolean
  includeEsLint: boolean
  includeEsLintStylistic: boolean
  includeVitest: boolean
  includeGithubCi: boolean
  includeAtAliases: boolean
  includeTestVariable: boolean
  includeTailwind: boolean
  includeVpRaw: boolean
}

type Args = {
  extended: boolean
}

const helpMessage = `
${bold('Usage:')} ${bold(green('create-vue-lib'))} ${green('[OPTIONS...]')}

Create a new Vite project to build a Vue-based library.

${bold('Options:')}
  ${cyan('--extended')}, ${cyan('-x')}
    Prompt for extra configuration options.
  ${cyan('--help')}, ${cyan('-h')}
    Display this help message.
  ${cyan('--version')}, ${cyan('-v')}
    Display the version number for create-vue-lib.

Full documentation at https://skirtles-code.github.io/create-vue-lib/
`

function processArgs(): Args {
  let argValues: { help?: boolean, version?: boolean, extended?: boolean } = {}

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
  }
  catch (err) {
    if ((err as { code: string }).code === 'ERR_PARSE_ARGS_UNKNOWN_OPTION') {
      console.log(bgRed(black('ERROR')))
      console.log(red(`${(err as { message: string }).message}`))
      console.log('See --help for valid options')
      process.exit(1)
    }
    else {
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

function isValidPackageName(packageName: string) {
  // This is a bit stricter than npm requires, but we use the package name
  // to generate various other things, like directory names and the global
  // variable name, so we insist on having a 'safe' first character.
  return /^(@[a-z0-9-*~][a-z0-9-*_.~]*\/)?[a-z_][a-z0-9-_.~]*$/.test(packageName)
}

function isValidDirName(dirName: string) {
  // This might be stricter than necessary, but it should be fine for real use cases
  return /^[a-zA-Z_][\w-.~ ]*$/.test(dirName)
}

async function init() {
  const cwd = process.cwd()

  const { extended } = processArgs()

  console.log()
  console.log(`Welcome to ${bold(green(packageJson.name))} v${bold(cyan(packageJson.version))}`)
  console.log()
  console.log(`This tool will help you to scaffold a ${bold(magenta('Vite'))} project for your ${bold(green('Vue'))}-based library.`)
  console.log()
  console.log('It is recommended to use a scoped package name for your library.')
  console.log('e.g. @username/package-name')
  console.log('To learn more about scopes see: https://docs.npmjs.com/about-scopes')
  console.log()

  const scopedPackageName = await textPrompt('Package name', '')

  if (!isValidPackageName(scopedPackageName)) {
    console.log(bgRed(black('ERROR')))
    console.log(red('Invalid package name: ' + scopedPackageName))
    process.exit(1)
  }

  const unscopedPackageName = scopedPackageName.replace(/.*\//, '')

  // The earlier check on scopedPackageName makes this slightly easier
  const packageNameAsObjectKey = /^[a-zA-Z_$][\w$]*$/.test(scopedPackageName) ? scopedPackageName : `'${scopedPackageName}'`

  const targetDirName = await textPrompt('Target directory', unscopedPackageName)

  if (targetDirName !== '.' && !isValidDirName(targetDirName)) {
    console.log(bgRed(black('ERROR')))
    console.log(red('Invalid directory name: ' + targetDirName))
    process.exit(1)
  }

  const targetDirPath = path.join(cwd, targetDirName)

  if (targetDirName === '.') {
    // TODO: Check files properly and prompt accordingly
    if (fs.existsSync(path.join(targetDirPath, 'package.json'))) {
      console.log(`${bgYellowBright(black('⚠ WARNING'))} Target directory already contains package.json`)
    }
  }
  else {
    if (fs.existsSync(targetDirPath)) {
      console.log(`${bgYellowBright(black('⚠ WARNING'))} Target directory already exists`)
    }
  }

  const includePackagesDir = await togglePromptIf(extended, `Use 'packages' directory?`, true)
  const packagesDir = includePackagesDir ? 'packages/' : ''

  const mainPackageDirName = await textPromptIf(extended, 'Main package directory', unscopedPackageName)

  if (!isValidDirName(mainPackageDirName)) {
    console.log(bgRed(black('ERROR')))
    console.log(red('Invalid directory name: ' + mainPackageDirName))
    process.exit(1)
  }

  const defaultGlobalVariableName = unscopedPackageName
    .replace(/\W+/g, ' ')
    .trim()
    .split(' ')
    .map(s => s[0].toUpperCase() + s.slice(1))
    .join('')

  const globalVariableName = await textPromptIf(extended, 'Global variable name', defaultGlobalVariableName)

  if (!/^[a-zA-Z$_][\w$]*$/.test(globalVariableName)) {
    console.log(bgRed(black('ERROR')))
    console.log(red('Invalid variable name: ' + globalVariableName))
    process.exit(1)
  }

  console.log()
  console.log('The GitHub path you provide below is used to generate various URLs.')
  console.log('For example, if you intended to have your repo at https://github.com/vuejs/core then the path would be vuejs/core.')
  console.log()

  const rawGithubPath = await textPrompt('GitHub path (optional)')
  const githubPath = rawGithubPath.replace(/^(https:\/\/github.com\/|\/)/, '')

  // We don't need to be strict here, so long as it won't break the generated files
  if (rawGithubPath && !/^[\w-]+\/[\w-.]+$/.test(githubPath)) {
    console.log(bgRed(black('ERROR')))
    console.log(red('Invalid GitHub path: ' + rawGithubPath))
    process.exit(1)
  }

  const includeTailwind = await togglePrompt('Include Tailwind CSS?')
  const includeEsLint = await togglePrompt('Include ESLint?', true)
  const includeEsLintStylistic = await togglePromptIf(includeEsLint, 'Include ESLint Stylistic for formatting?', includeEsLint)
  const includeVitest = await togglePromptIf(extended, 'Include Vitest for testing?', true)
  const includeDocs = await togglePrompt('Include VitePress for documentation?', true)
  const includeVpRaw = includeDocs && await togglePromptIf(extended, 'Include support for vp-raw in VitePress?', includeTailwind)
  const includeGithubPages = includeDocs && await togglePrompt('Include GitHub Pages config for documentation?')
  const includePlayground = await togglePrompt('Include playground application for development?', true)
  const includeGithubCi = await togglePrompt('Include GitHub CI configuration?', !!githubPath)
  const includeExamples = await togglePromptIf(extended, 'Include example code?', true, 'Yes', 'No, just configs')
  const includeAtAliases = await togglePromptIf(extended, 'Configure @ as an alias for src?')
  const includeTestVariable = await togglePromptIf(extended, 'Configure global __TEST__ variable?')

  function suggestExtended() {
    if (!extended) {
      console.log(`Use the --extended flag to configure the directory name separately.`)
    }
  }

  if (includeDocs && mainPackageDirName === 'docs') {
    console.log(bgRed(black('ERROR')))
    console.log(red(`The directory name 'docs' is reserved for the documentation, please choose a different name.`))
    suggestExtended()
    process.exit(1)
  }

  if (includePlayground && mainPackageDirName === 'playground') {
    console.log(bgRed(black('ERROR')))
    console.log(red(`The directory name 'playground' is reserved for the playground, please choose a different name.`))
    suggestExtended()
    process.exit(1)
  }

  if (!includePackagesDir && mainPackageDirName === 'scripts') {
    console.log(bgRed(black('ERROR')))
    console.log(red(`The directory name 'scripts' is reserved for the scripts, please choose a different name.`))
    suggestExtended()
    process.exit(1)
  }

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
    packageNameAsObjectKey,
    globalVariableName,
    targetDirName,
    targetDirPath,
    packagesDir,
    mainPackageDirName,
    templateDirPath,
    githubPath,
    githubUrl,
    githubIssues,
    githubRepository,
    githubPagesOrigin,
    docsBase,
    homepageUrl,
    includePackagesDir,
    includeDocs,
    includeGithubPages,
    includePlayground,
    includeExamples,
    includeEsLint,
    includeEsLintStylistic,
    includeVitest,
    includeGithubCi,
    includeAtAliases,
    includeTestVariable,
    includeTailwind,
    includeVpRaw
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

  if (config.includeVitest) {
    copyTemplate('vitest', config)
  }

  if (config.includeGithubCi) {
    copyTemplate('ci', config)
  }

  if (config.includeTailwind) {
    copyTemplate('tailwind', config)
  }

  if (config.includeVpRaw) {
    copyTemplate('vp-raw', config)
  }

  console.log()
  console.log(`${bgGreen(bold(black('DONE')))} Project created`)
  console.log()
  console.log(`${bgYellowBright(black('NOTE'))} pnpm must be used as the package manager`)
  console.log()
  console.log(bold('Next steps:'))
  console.log()

  if (targetDirName !== '.') {
    console.log(bold(green('  cd ' + targetDirName)))
  }

  if (!fs.existsSync(path.join(targetDirPath, '.git'))) {
    console.log(bold(green('  git init -b main')))
  }

  console.log(bold(green('  pnpm install')))
  console.log()
  console.log('See https://skirtles-code.github.io/create-vue-lib/next-steps for more suggestions.')
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

  let targetFile = templateFile.replace(/@projectName@/g, config.mainPackageDirName)

  if (!config.includePackagesDir) {
    targetFile = targetFile.replace(/^packages/, '.')
  }

  const targetPath = path.join(config.targetDirPath, targetFile)

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
    let content = ejs.render(template, { config })

    if (/\.(json|m?[jt]s|vue)$/.test(target)) {
      // Ensure there are no blank lines at the start and a single blank line at the end
      content = content.trim() + '\n'

      // Trim spaces from the ends of lines
      content = content.replace(/ +\n/g, '\n')

      // Remove consecutive blank lines
      content = content.replace(/\n\n+/g, '\n\n')

      // Remove trailing commas and any blank newlines that follow them
      content = content.replace(/, *(?:\n+(\n\s*)|(\s*))([}\])])/g, '$1$2$3')

      // Trim blank lines after {, [ or (
      content = content.replace(/([{[(]\n)\n+/g, '$1')
    }

    fs.writeFileSync(target, content)
  }
  else {
    fs.copyFileSync(templatePath, targetPath)
  }
}

init()
