# Introduction

:::warning
This tool is still work-in-progress.
:::

`@skirtle/create-vue-lib` is a scaffolding tool for creating a Vite project to build a Vue-based library.

It currently requires `pnpm` to be used as the package manager.

## Usage

To create a new project:

```sh
pnpm create @skirtle/vue-lib
```

To get an extended list of customization questions:

```sh
pnpm create @skirtle/vue-lib --extended
```

To see the help message:

```sh
pnpm create @skirtle/vue-lib --help
```

## Features

As this is a scaffolding tool, you can (and should) edit the project configuration after it is created to do whatever else you need. The features here only outline what the tool can configure for you.

Currently, the following are used for all projects:

- `pnpm` as package manager
- TypeScript
- Project uses a `packages` directory, similar to Vue Core
- Vite and Vitest
- Vue

Optional features include:

- VitePress for documentation, with optional GitHub Pages deployment
- A playground application to use for development
- ESLint and ESLint Stylistic

The new project doesn't have any dependencies on special packages. It mostly uses the same dependencies as the official `create-vue` scaffolding tool, plus some widely used packages such as VitePress and ESLint Stylistic. In particular, there aren't any dependencies that tie you to the scaffolding tool.
