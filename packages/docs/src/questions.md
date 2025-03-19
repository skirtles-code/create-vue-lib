<style scoped>
.mock-terminal {
  background: #ccc;
  border: 3px solid #ccc;
  border-radius: 5px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
  margin: 16px 0;
  overflow: hidden;
}

.mock-terminal > .mock-terminal-heading {
  color: #000;
  padding: 5px 10px;
}

.mock-terminal > pre {
  background: #111;
  box-shadow: 0 0 3px 2px #000 inset;
  color: #fff;
  margin: 0;
  overflow: auto;
  padding: 10px;
}

.mock-terminal > pre > .check {
  color: #26a269;
}

.mock-terminal > pre > a:not(:hover) {
  color: inherit;
  text-decoration: none;
}
</style>

# The questions explained

<div class="mock-terminal">
  <div class="mock-terminal-heading">Terminal</div>
  <pre>$ pnpm create @skirtle/vue-lib --extended
&nbsp;
<span class="check">✔</span> <a href="#package-name">Package name … @skirtle/test-project</a>
<span class="check">✔</span> <a href="#target-directory">Target directory … test-project</a>
<span class="check">✔</span> <a href="#use-packages-directory">Use 'packages' directory? … No / Yes</a>
<span class="check">✔</span> <a href="#main-package-directory">Main package directory … test-project</a>
<span class="check">✔</span> <a href="#global-variable-name">Global variable name … TestProject</a>
<span class="check">✔</span> <a href="#github-path">GitHub path (optional) … skirtles-code/test-project</a>
<span class="check">✔</span> <a href="#include-eslint">Include ESLint? … No / Yes</a>
<span class="check">✔</span> <a href="#include-eslint-stylistic">Include ESLint Stylistic for formatting? … No / Yes</a>
<span class="check">✔</span> <a href="#include-vitest">Include Vitest for testing? … No / Yes</a>
<span class="check">✔</span> <a href="#include-vitepress">Include VitePress for documentation? … No / Yes</a>
<span class="check">✔</span> <a href="#include-github-pages">Include GitHub Pages config for documentation? … No / Yes</a>
<span class="check">✔</span> <a href="#include-playground">Include playground application for development? … No / Yes</a>
<span class="check">✔</span> <a href="#include-github-ci">Include GitHub CI configuration? … No / Yes</a>
<span class="check">✔</span> <a href="#include-examples">Include example code? … No, just configs / Yes</a>
<span class="check">✔</span> <a href="#configure-src-alias">Configure @ as an alias for src? … No / Yes</a>
<span class="check">✔</span> <a href="#configure-test-variable">Configure global __TEST__ variable?</a></pre>
</div>

## Package name

This name will be used to populate the `name` field for your package's `package.json`. This field is the unique identifier for all packages published to the npm registry.

The newly created project will also use this name in various other places, such as in the generated docs and in example code.

Using a scoped package name is recommended, but not mandatory. Scopes provide a namespace, ensuring that package names don't clash within the npm registry. For example, several official Vue packages are scoped to `@vue`, e.g. `@vue/reactivity` and `@vue/test-utils`. This CLI tool used the scoped name `@skirtle/create-vue-lib`.

You need to register an account with npm before you can publish packages to the registry. While you don't need to create an account immediately, you may want to give some thought to what names are available before you start. Packages can be scoped using either a user name or an organization name registered with npm.

To learn more about scopes see <https://docs.npmjs.com/about-scopes>.

## Target directory

The name of the directory (folder) where the project will be created. This directory will be created in the current working directory.

If the directory already exists the files will be overwritten. This can be useful when performing upgrades, though you should ensure all old files are stored in source control first, so you can review the diffs and decide which changes to keep.

The special value `.` can also be used to indicate that files should be placed in the current directory.

The directory can be renamed after the project is created. None of the files within the project depend on the name of this folder.

The tool should only create files within the specified directory. It won't edit any global configuration or files elsewhere on the filesystem. If you want to delete the project you can just delete this directory.

## Use 'packages' directory?{#use-packages-directory}

:::info NOTE
This question is only asked when using the `--extended` flag.
:::

By default, the packages in the newly created project will be placed in a root-level directory called `packages`, like this:

```
📁 packages
   📁 docs
   📁 playground
   📁 <main-package-directory>
```

While this convention is commonly used by the official Vue libraries, the real benefits come as a project grows and the number of packages increases. If you only need one or two packages then you might prefer to keep them in root-level directories, rather than in `packages`.

## Main package directory

:::info NOTE
This question is only asked when using the `--extended` flag.
:::

The new project will have a directory structure something like this:

```
📁 packages
   📁 docs
   📁 playground
   📁 <main-package-directory>
```

The main package directory sits alongside the `docs` and `playground` packages and is used to hold the source code for the library itself.

A directory structure similar to this is used by various libraries in the Vue ecosystem. For example, see Pinia at <https://github.com/vuejs/pinia/tree/v3/packages>.

By default, this will be the same as the package name, but with any scope removed. So, for example, if you called the package `@skirtle/test-project` then the main package directory will be called `test-project`.

## Global variable name

:::info NOTE
This question is only asked when using the `--extended` flag.
:::

Libraries need to be built in a variety of formats, so they can be consumed in different use cases. A *global* build is used by projects that aren't using build tools, such as those that pull in libraries from a CDN.

Global builds don't support `import` or `require()`, but instead expose the library via a global variable in the browser. For example, Vue uses the global variable `Vue` in its global builds.

The global variable name should closely match the name of your library. For example, if your library is called `@skirtle/test-project` then the default global variable name would be `TestProject`.

## GitHub path

If you intend to store your project on GitHub then you should specify the path here. The remote repo doesn't need to exist yet, it is just used to populate fields in files such as `package.json` and the docs.

The GitHub path should be in the form `username/repo-name`.

For example, this project has its repository at `https://github.com/skirtles-code/create-vue-lib`, so the GitHub path is `skirtles-code/create-vue-lib`.

While answering this question is optional, it can be especially useful if you intend to use GitHub Pages to host your documentation, as the generated configuration files will be much closer to their final form.

## Include ESLint?

Include configuration for ESLint. This will be very similar to the default configuration generated by the official [`create-vue`](https://github.com/vuejs/create-vue) tool.

`simple-git-hooks` and `lint-staged` will also be configured in the root `package.json` to automatically check files when they're committed to Git.

## Include ESLint Stylistic for formatting?{#include-eslint-stylistic}

You'll only see this question if you chose to include ESLint in the previous question.

[ESLint Stylistic](https://eslint.style/) is a code formatter based on ESLint.

Currently, this is the only formatter that is supported by this CLI tool, but you can configure others yourself after the project is created.

## Include Vitest for testing?{#include-vitest}

:::info NOTE
This question is only asked when using the `--extended` flag.
:::

[Vitest](https://vitest.dev/) is a testing framework for Vite.

Testing is particularly important for libraries, so Vitest is included by default, but you can opt out if you want to implement an alternative testing strategy.

## Include VitePress for documentation?{#include-vitepress}

[VitePress](https://vitepress.dev/) has become the standard tool for library documentation in the Vue community. If you intend to publish your package publicly then you probably want to use VitePress for your documentation.

Very small libraries might prefer to just use a GitHub `README.md` instead. Large libraries might prefer to house the documentation in a separate repo. But most libraries are somewhere in the middle, and this option works well for them. For example, you can see this approach being used by both [Vue Router](https://github.com/vuejs/router/tree/main/packages) and [Pinia](https://github.com/vuejs/pinia/tree/v3/packages).

VitePress will be configured with an `alias` to allow you to access your library within the documentation. This will use the library source code directly, without needing a build or release of the library.

## Include GitHub Pages config for documentation?{#include-github-pages}

You'll only see this question if you chose to include VitePress in the previous question.

Selecting this option will generate configuration files for deploying your documentation to GitHub Pages via a GitHub Action.

When you're ready to deploy the documentation, you'll need to enable deployment in the settings for your GitHub repository:

1. Go to **Settings** / **Pages**.
2. Select a **Source** value of **GitHub Actions**.
3. You may be prompted to create a configuration file. That isn't necessary if you're using the configuration generated by this tool.

## Include playground application for development?{#include-playground}

While you're developing your library, you can use the playground application to experiment and try out your changes.

This isn't a playground in the same sense as the official Vue playground. Instead, it's just an application that is pre-configured to be able to use your library.

The playground application will use your library direct from the source code, without needing to build the library separately. This is usually beneficial, as it allows for quicker development and immediate feedback on changes. But it does make the playground slightly less representative of a real consuming application, as it isn't using the built files.

## Include GitHub CI configuration?{#include-github-ci}

Continuous Integration (CI) is used to help catch problems as soon as they occur.

This option will include a GitHub Actions configuration for a CI workflow. It will run the `lint`, `type-check`, `build` and `test:unit` targets from the `scripts` section of the root `package.json`. The workflow is triggered by any PRs opened against the `main` branch, as well as when changes are pushed to `main`.

If a [GitHub path](#github-path) has been provided, the job will be configured so that it only runs for that specific fork.

## Include example code?{#include-examples}

:::info NOTE
This question is only asked when using the `--extended` flag.
:::

The example code includes some sample components and mock documentation pages. These are useful for testing that the newly created project actually works.

But if you've used the tool before and already know what you're doing, the examples can sometimes be a nuisance, as you're just going to immediately delete them. This option allows you to skip including them in the first place, but at the expense of creating a project that won't actually build because there's no code to build.

## Configure `@` as an alias for `src`?{#configure-src-alias}

:::info NOTE
This question is only asked when using the `--extended` flag.
:::

The official [`create-vue`](https://github.com/vuejs/create-vue) tool configures an alias called `@` that resolves to `src`. This can be useful in large applications with deeply nested directory structures, rather than trying to use `../../../..` at the start of relative paths.

This is typically less useful in libraries, as there tend to be fewer files and less nesting, so using an alias is usually unnecessary.

But if you do want to use an alias, it can be tricky to configure it in a way that works across the various internal packages (e.g. the docs and playground). Selecting this option will configure that for you.

If you want to use other aliases for directories in your library, rather than `@`, you may still want to select this option as a starting point.

## Configure global `__TEST__` variable?{#configure-test-variable}

:::info NOTE
This question is only asked when using the `--extended` flag.
:::

All projects created with this tool include a global variable called `__DEV__` that can be used to conditionally run code in either development or production. This is typically used to include extra warning messages to help consumers during development.

Optionally, you can also include a global variable called `__TEST__`, which allows you to detect when code is running in tests.

While this is occasionally useful, it is much less commonly used than `__DEV__`, so configuration for `__TEST__` is optional.

While `__DEV__` and `__TEST__` are exposed as global variables in the code and TypeScript types, they are actually statically replaced by Vite, so the variables are already gone by the time the code runs.
