# Why does it... ?

You might have a lot of questions about why the generated project is structured the way it is. This page aims to answer some of those questions.

To learn more about the built files in the `dist` directory see [Files in `dist`](dist-files).

## Influences

Much of the configuration is based on [`create-vue`](https://github.com/vuejs/create-vue). Sticking close to that tool makes it easier for everyone involved.

But applications and libraries need different things.

Libraries such as [Vue core](https://github.com/vuejs/core), [Vue Router](https://github.com/vuejs/router) and [Pinia](https://github.com/vuejs/pinia/) have also heavily influenced the project structure used by this tool, especially the use of a `packages` directory and pnpm workspaces. Various other tools, such as `simple-git-hooks`, `lint-staged` and VitePress, have been chosen to align with those projects.

Those projects use [rollup](https://rollupjs.org/) directly for their builds, rather than Vite. Vite already uses rollup behind the scenes, but using it directly is more flexible. Using Vite as a wrapper has a few advantages:

- Vite is familiar to most members of the Vue community.
- Using Vite keeps us closer to `create-vue`.
- Vite has its own ecosystem of useful plugins.

In particular, the libraries mentioned above don't use `.vue` files in their source code. Compiling `.vue` files with rollup is certainly possible, but it's more convenient to reuse the same toolchain used to build Vue applications.

## Multiple packages

The project is split into multiple packages. By default, these are in a directory called `packages`, plus a root package. Each package has its own `package.json` file.

These packages form a pnpm workspace, configured via `pnpm-workspace.yaml`. The workspace allows certain actions to be applied to all packages in one go, for example, running `pnpm install` at the root will install dependencies for all the packages.

Splitting the `package.json` in this way helps to keep things modular. It also helps to reduce the amount of noise in the `package.json` that gets published to the npm registry.

The project's root `package.json` uses `preinstall` and `postinstall` hooks. It's important that these are not in the `package.json` that's published to the npm registry, otherwise they would run when someone tries to install your package.

## TypeScript configuration

The TypeScript configuration is mostly done of a per-package basis. The configuration files are closely based on the files created by `create-vue`.

A root-level `tsconfig.json` is only created if ESLint is included. That is just used to check `eslint.config.ts`, which is at the root of the project. There currently aren't any other TS files that live outside the sub-packages.

Where possible we use `vue-tsc --build` to perform the type checks, the same as `create-vue`, but for the docs package that doesn't currently seem to be possible. We have `"vitePressExtensions": [".md"]` set in `vueCompilerOptions`, which allows `.md` files to be processed a bit like `.vue` files, allowing any Vue syntax to be type-checked. That setting triggers an error if we use `vue-tsc --build`, so we check the code and config files separately instead.

## ESLint configuration

The ESLint configuration is very closely based on `create-vue`.

While it is theoretically possible to have separate ESLint configurations for each package, that's unlikely to be useful in practice, so the configuration is at the root level of the project.

ESLint Stylistic can be used as a formatter. See https://eslint.style/guide/why for an explanation of the benefits of that package over dedicated formatters such as Prettier. If you want to use Prettier instead then you'll need to configure it yourself, at least for now.

## `simple-git-hooks` and `lint-staged`

`simple-git-hooks` is widely used in the Vue and Vite ecosystems to run tasks when files are committed to git. This helps to catch mistakes early.

Currently, we support using `simple-git-hooks` for running the type checks and running ESLint, via `lint-staged`. Using `lint-staged` ensures that only *staged* files are checked (i.e. those that are going to be included in the commit). By default, the project runs ESLint with the `--fix` flag, to automatically fix any problems, but you can remove that flag if you're concerned about code being unexpectedly mangled by the formatter.

Many projects also use `simple-git-hooks` to impose restrictions on the commit message. This isn't currently something configured by the tool.

We use a `postinstall` target in `scripts` to update the git hooks, ensuring they stay up to date for anyone developing the package. The documentation for `simple-git-hooks` warns against doing that, but it's important to note that the `postinstall` is in the project's root `package.json`, not the `package.json` that's published to the npm registry. It's only a problem if it's published to the registry.

## `.gitignore`

The `.gitignore` is similar to `create-vue`.

We use a single `.gitignore`, rather than having one in each package. This leads to some entries that target specific parts of individual packages, which might more naturally be configured using a separate `.gitignore` within that specific package.

A key reason for using a single file is that we can easily integrate it into other tools, such as ESLint.

## Vite configuration

The separate page [Files in `dist`](/dist-files) explains the reasoning behind some of the most important parts of `vite.config.mts`.

The Vue plugin is configured with `componentIdGenerator: 'filepath'`. This controls how the ids are generated for `<style scoped>`. The default strategy hashes the file contents, but only after other parts of the build have processed the file, leading to inconsistent hashes between development and production builds. Using the filepath instead helps to keep the ids stable across all the files in `dist`, so that any combination of JS and CSS files should work together.

[`vite-plugin-dts`](https://github.com/qmhc/vite-plugin-dts) is used to generate the `.d.ts` file. By default, this generates a separate `.d.ts` file for each input file, but `rollupTypes: true` merges them into a single file. Despite the naming similarity, that setting is unrelated to the build tool rollup.

As we can't build all the output files we need in one go, we instead run Vite three times. `emptyOutDir` is set to `false`, so that we don't lose the build artifacts from the other stages of the build. `rimraf` is used to clear the `dist` directory at the start of the build process.

In `rollupOptions` we configure `external: ['vue']`. This tells rollup to keep any imports from the `vue` package as imports, rather than pulling all the code into the built library. For output formats that don't support `import` it will be rewritten accordingly, e.g. using `require()` for CommonJS. For global (IIFE) builds, there is the extra setting `globals: { vue: 'Vue' }`, which tells rollup to rewrite imports like `import { ref } from 'vue'` as `const { ref } = Vue`, or code that's equivalent.

## `__DEV__` and `__TEST__`

The project supports 'global variables' for `__DEV__` and `__TEST__`. The `__TEST__` variable isn't included by default and requires the `--extended` flag to opt in.

While they are configured as global variables from a TypeScript perspective, and will be interpreted that way by tools such as IDEs and ESlint, they are actually statically replaced by Vite during the build. They also need to be configured in the docs and playground packages, as those packages use the library's source code directly.

If you need to add other variables like these, e.g. `__BROWSER__`, `__CI__`, `__SSR__`, you'll need to configure those yourself, using `__DEV__` and `__TEST__` as a starting point. In some cases you may need to make other changes to the build to generate extra files in `dist`, so consumers of your package can use the alternative builds.

For `__TEST__` we replace the value with a simple `true` or `false`, which can be configured using Vite's `define` option.

For `__DEV__` it's a little more complicated, because in some builds we replace it with `!(process.env.NODE_ENV === "production")`. This allows the downstream bundler to make the decision about what mode we're in. We can't use `define` for a complex value like this, so `@rollup/plugin-replace` is used instead.

## `pages.yml`

The file `.github/worksflows/pages.yml` configures the GitHub Pages workflow for the documentation. The exact name of the file is not important, GitHub will run all workflows configured in `.github/workflows`.

The configuration is similar to those found at:

- https://vite.dev/guide/static-deploy.html#github-pages
- https://vitepress.dev/guide/deploy#github-pages

pnpm is enabled in the configuration, but a specific version isn't specified as we're using the `packageManager` option in `package.json`.

The workflow is configured to run on the `main` branch. You'd typically want the documentation to reflect the latest release, so whether `main` is an appropriate choice will depend on your release process.

The [`paths-ignore`](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onpushpull_requestpull_request_targetpathspaths-ignore) setting can be used to avoid running GitHub Pages for changes that don't impact the documentation. The default configuration will only ignore the playground package. Trying to be really precise about what changes trigger the workflow is error-prone and the small gains usually aren't worth the extra effort.

You'll also need to enable GitHub Pages in the settings for your repo.

## `jiti`

The package `jiti` is included so that ESLint can use a TypeScript configuration file:

- <https://eslint.org/docs/latest/use/configure/configuration-files#typescript-configuration-files>
