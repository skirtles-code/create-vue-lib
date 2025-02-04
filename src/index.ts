#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'
import prompts from 'prompts'
import ejs from 'ejs'

type Config = {
  scopedPackageName: string
  unscopedPackageName: string
  shortUnscopedPackageName: string
  projectName: string
  globalVariableName: string
  targetDirName: string
  targetDirPath: string
  templateDirPath: string
}

async function init() {
  const cwd = process.cwd()

  let result: {
    packageName?: string
  } = {}

  try {
    result = await prompts(
      [
        {
          name: 'packageName',
          type: 'text',
          message: 'Package name',
          initial: '@skirtle/test-project'
        }
      ],
      {
        onCancel: () => {
          throw new Error('Cancelled')
        },
      },
    )
  } catch (cancelled) {
    console.log(cancelled.message)
    process.exit(1)
  }

  const scopedPackageName = result.packageName

  // TODO: Tightening this check, e.g. for hyphen positions
  if (!/@[a-z0-9-]+\/[a-z0-9-]+/.test(scopedPackageName)) {
    console.log('Invalid package name: ' + scopedPackageName)
    process.exit(1)
  }

  const unscopedPackageName = scopedPackageName.replace(/.*\//, '')
  const shortUnscopedPackageName = unscopedPackageName.replace(/^vue-/, '')
  const projectName = unscopedPackageName.replace(/-+/g, ' ').trim().split(' ').map(s => s[0].toUpperCase() + s.slice(1)).join(' ')
  const globalVariableName = projectName.replace(/ /g, '')
  const targetDirName = unscopedPackageName

  const targetDirPath = path.join(cwd, targetDirName)

  if (fs.existsSync(targetDirPath)) {
    console.log('Target directory already exists')
  } else {
    // TODO: Shouldn't need recursive once we're done
    fs.mkdirSync(targetDirPath, { recursive: true })
  }

  const templateDirPath = path.resolve(__dirname, 'template')

  const config: Config = {
    scopedPackageName,
    unscopedPackageName,
    shortUnscopedPackageName,
    projectName,
    globalVariableName,
    targetDirName,
    targetDirPath,
    templateDirPath
  }

  copyTemplate('base', config)

  console.log('Project created')
  console.log('Note: pnpm must be used as the package manager')
  console.log()
  console.log('cd ' + targetDirName)
  console.log('pnpm install')
  console.log()
  console.log(`You should add a suitable license at ${targetDirName}/packages/${config.shortUnscopedPackageName}/LICENSE`)
}

function copyTemplate(templateName: string, config: Config) {
  copyFiles('', {
    ...config,
    templateDirPath: path.join(config.templateDirPath, templateName)
  })
}

function copyFiles(templateFile: string, config: Config) {
  const templatePath = path.join(config.templateDirPath, templateFile)
  const stats = fs.statSync(templatePath)
  const basename = path.basename(templatePath)

  const targetPath = path.join(config.targetDirPath, templateFile.replace(/@projectName@/g, config.shortUnscopedPackageName))

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
  } else if (['package.json', 'vite.config.mts', 'config.mts', 'index.md', 'introduction.md', 'App.vue'].includes(filename)) {
    const template = fs.readFileSync(templatePath, 'utf-8')
    const content = template
      .replace(/@projectName@/g, config.shortUnscopedPackageName)
      .replace(/@unscopedPackageName@/g, config.unscopedPackageName)
      .replace(/@globalVariableName@/g, config.globalVariableName)
      .replace(/@scopedPackageName@/g, config.scopedPackageName)

    fs.writeFileSync(targetPath, content)
  } else {
    fs.copyFileSync(templatePath, targetPath)
  }
}

init()
