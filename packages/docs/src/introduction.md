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

- [pnpm](https://pnpm.io/) as package manager
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Vue 3](https://vuejs.org/)
- [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks)
- [publint](https://publint.dev/docs/)

Optional features include:

- Project uses a `packages` directory, similar to [Vue core](https://github.com/vuejs/core), [Vue Router](https://github.com/vuejs/router) and [Pinia](https://github.com/vuejs/pinia)
- [VitePress](https://vitepress.dev/) for documentation, with optional [GitHub Pages](https://pages.github.com/) deployment
- A playground application to use for development
- [ESLint](https://eslint.org/), [ESLint Stylistic](https://eslint.style/) and [lint-staged](https://github.com/lint-staged/lint-staged)
- [Vitest](https://vitest.dev/) for testing

The new project doesn't have any dependencies on special packages. It mostly uses the same dependencies as the official `create-vue` scaffolding tool, plus some widely used packages such as VitePress and ESLint Stylistic. In particular, there aren't any dependencies that tie you to the scaffolding tool.

Currently unsupported (you'd need to configure them yourself):

- JSX/TSX
- Prettier
- Other Vue libraries, such as VueUse, Vue Router and Pinia
- E2E testing

## Examples

You can see an example library, created using this tool, at:

- https://github.com/skirtles-code/example-vue-lib

This has been published to the npm registry as [`@skirtle/example-vue-lib`](https://www.npmjs.com/package/@skirtle/example-vue-lib).

## Prerequisites

Developing libraries to publish to npm is tricky. There is some inherent complexity to publishing packages that can't be avoided, and you're unlikely to succeed if you don't have prior experience of working with Vue, Vite and the wider ecosystem.

Both the scaffolding tool and this documentation assume that you are already comfortable working with standard Vue tooling. Previous experience of publishing packages is not required, but this documentation will only focus on aspects relevant to projects created with this scaffolding tool, it is not a general-purpose guide to building and publishing packages.

This scaffolding tool aims to make it easier to get started, but it doesn't completely remove the need to study the build tools you're using and learn what they can do.

Each library has different requirements, and you'll likely need to make changes to the project created by this tool.
