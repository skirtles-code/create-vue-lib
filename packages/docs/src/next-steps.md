# Next steps

Creating a project using `@skirtle/create-vue-lib` is just the first step. The tool can only take you so far, you'll still need to review and adjust the project configuration to get everything just the way you need it.

Here are some ideas for things you should do...

## Init git

Make sure you're in the correct directory, then run:

```sh
git init -b main
```

You should do this before running `pnpm install`, so that `simple-git-hooks` can configure the git hooks.

## Install dependencies

```sh
pnpm install
```

The project uses the `^` prefix for most dependencies. This is usually what you'd want, as it ensures you're getting the latest versions, but it does mean that the exact versions you install may differ slightly from those that have been tested with this tool. Occasionally, new releases of the dependencies introduce regressions that break a newly scaffolded project. 

Bugs in the tool itself are also very much a possibility, especially if you've picked an unusual combination of options.

With that in mind...

## Check it works

Before you start making changes, it's worth quickly checking that the new project actually works.

Check everything builds:

```sh
pnpm build
```

Run the unit tests:

```sh
pnpm test:unit
```

If you chose to install ESLint:

```sh
pnpm lint
```

If you chose to include VitePress for documentation:

```sh
pnpm docs:dev
```

If you chose to include a playground application:

```sh
pnpm dev
```

## Update the `README.md`

While writing a detailed `README.md` can probably wait, you might want to write a few sentences now, before you push anything to GitHub.

The root `README.md` is primarily intended for readers on GitHub. It will be copied to the main package directory as part of the build, so that it can be included in the published package on npm. If you don't want that, e.g. because you'd prefer different contents in those two files, you should modify `package.json` and `.gitignore`.

## Add a `LICENSE`

You should populate the `LICENSE` file in the root directory of your project.

[`pnpm publish`](https://pnpm.io/cli/publish) will automatically include the `LICENSE` file from the workspace root, so there's no need to add a separate `LICENSE` in the main package directory unless you want it to differ from the root `LICENSE`.

## Update `package.json`

There are multiple files called `package.json` in a newly generated project. The one that is used to publish your package to npm is the most important, and you'll need to populate some fields in that file yourself.

The generated project structure should be something like this:

```
📁 packages
   📁 docs
   📁 playground
   📁 <main-package-directory>
      📁 src
      📄 package.json
```

The file `packages/<main-package-directory>/package.json` is the one you need to update. It should already have most things populated, such as the `name`, but some of the other fields near the top will be empty, e.g. `author`, `license`, `description` and `keywords`.

It will also have `"private": true` set. This will prevent you from accidentally publishing the package to the npm registry. You should leave that line in for now, but you'll need to remove it when you're ready to make your first release.
