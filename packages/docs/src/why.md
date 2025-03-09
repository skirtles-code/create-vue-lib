# Why does it... ?

You might have a lot of questions about why the generated project is structured the way it is. This page aims to answer some of those questions.

:::tip NOTE
More content should be added to this page over time, there's a lot to explain.
:::

To learn more about the built files in the `dist` directory see [Files in `dist`](dist-files).

## Influences

Much of the configuration is based on [`create-vue`](https://github.com/vuejs/create-vue). Sticking close to that tool makes it easier for everyone involved.

But applications and libraries need different things.

Libraries such as [Vue core](https://github.com/vuejs/core), [Vue Router](https://github.com/vuejs/router) and [Pinia](https://github.com/vuejs/pinia/) have also heavily influenced the project structure used by this tool, especially the use of a `packages` directory and pnpm workspaces. Various other tools, such as `simple-git-hooks`, `lint-staged` and VitePress, have been chosen to align with those projects.

Those projects use [rollup](https://rollupjs.org/) directly for their builds, rather than Vite. Using rollup is more flexible, but using Vite has a few advantages:

- Vite is familiar to most members of the Vue community.
- Using Vite keeps us closer to `create-vue`.
- Vite has its own ecosystem of useful plugins.

In particular, the libraries mentioned above don't use `.vue` files in their source code. Compiling `.vue` files with rollup is certainly possible, but it's more convenient to reuse the same toolchain used to build Vue applications. 

<!--

## ESLint configuration

## TypeScript configuration

## `simple-git-hooks` and `lint-staged`

## Vite configuration

## `__DEV__` and `__TEST__`

-->
