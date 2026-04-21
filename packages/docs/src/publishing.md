# Publishing to npm

To publish to the npm registry you'll need to use the command `pnpm publish`. You should read the docs for that command before continuing. The documentation for `npm publish` is also a really useful reference and well worth a read.

- [`pnpm publish`](https://pnpm.io/cli/publish)
- [`npm publish`](https://docs.npmjs.com/cli/v11/commands/npm-publish)

While `pnpm publish` and `npm publish` are very similar, it's important to use `pnpm publish` for publishing. Projects created with this tool use pnpm workspace [catalogs](https://pnpm.io/catalogs), which need to be replaced during publishing.

But before that, there are some steps you should take to check that everything is ready...

## Reviewing `package.json`

Let's imagine you created a project called `@skirtle/example-lib`. Your directory structure might be something like this:

```
📁 example-lib
   📁 packages
      📁 docs
         📄 package.json
      📁 playground
         📄 package.json
      📁 example-lib
         📁 src
         📄 package.json  ←  This file
   📄 package.json
```

There are several `package.json` files, but for publishing the library to the npm registry, the important one is `packages/example-lib/package.json`.

You should review that file carefully to ensure it has all the fields set correctly before you attempt to publish the package. Most important are the package's `name` and `version`.

When that file is first created it will contain `"private": true`. That prevents the library from being published by accident. You'll need to remove that line when you're ready to make your first release.

## Check `dependencies` and `peerDependencies`

If you've only worked on applications, you might be used to bumping dependency versions to ensure they're as recent as possible.

But when you're publishing a library you need to be a bit more careful. For example, not every application that wants to use your library will be on the latest version of Vue. You need to decide what the minimum version you want to support is, and test that it actually works against that version.

You also need to be careful about exactly where each dependency is placed: `dependencies`, `peerDependencies` and/or `devDependencies`. In an application it often doesn't matter if dependencies are in the wrong section, but for a library it's important to have everything in the right place.

The default project created by this tool won't have a `dependencies` section, with `vue` listed in `peerDependencies` instead. All other dependencies will be in `devDependencies`, as they're only used to develop the library and aren't needed in the consuming application.

If you've added other dependencies to `dependencies` or `peerDependencies` then you may also need to add them to the `rollupOptions` section of `vite.config.mts`, otherwise they may be bundled in with you library.

## Install dependencies

Ensure your local `node_modules` directory is synced up with the latest code:

```sh
pnpm install
```

## Check the build

You need to build the project before publishing:

```sh
pnpm build
```

Check the files in `dist` all contain what you're expecting. Also check the `README.md`, which by default is copied to the main project directory from the root directory as part of the build. This file is included in the published package and is what people will see when they view your package via the npm website.

## Do a dry run

A 'dry run' will go through most of the steps of publishing the package but without actually adding it to the registry. Assuming you're in the main package directory (the one containing `package.json` and `dist`), run:

```sh
pnpm publish --tag=latest --access=public --dry-run --publish-branch=main
```

If you have local files that aren't checked into git then you may need to add `--no-git-checks` too.

The dry run will show which files are going to be included in the published package. pnpm should automatically include the `LICENSE` file, taken from the workspace root. The `README.md` isn't automatically taken from the workspace root, so that's copied as part of the build. You should also see `package.json` and the files in `dist`. Files from `src` shouldn't be needed.

## Authenticating

Before you can publish you'll need to create an account on the npm registry.

pnpm doesn't have a separate command to authenticate with the registry, it'll use the token in `.npmrc`. You can use the command `npm login` (note `npm`, not `pnpm`) to populate that token. See <https://docs.npmjs.com/cli/v11/commands/npm-login>.

## Learn about unpublishing

If you make a mistake when publishing a package, you can't easily undo it.

Before you publish a package, you should also learn about how to *unpublish* a package.

See <https://docs.npmjs.com/policies/unpublish>.

## Publishing

When you're finally ready to publish, the command is the same as we used earlier for the dry run, but without the `--dry-run` flag:

```sh
pnpm publish --tag=latest --access=public --publish-branch=main
```

The package `name` and `version` will be taken from the `package.json`.

## GitHub releases

It's common to create a release on GitHub when publishing a package. This includes release notes for the release and adds a tag to the repository.

## Automating the process

Several parts of the publishing process can be automated. You can find various examples of automation scripts if you look through the GitHub repos for large projects.

This scaffolding tool provides configuration for using *trusted publishing* via a GitHub Action. It will be included if you answered `Yes` to the question *[Include GitHub configuration for publishing to npm?](questions#include-npm-publish)*.

The workflow configuration is in `.github/workflows/publish.yml`. You'll also need to enable trusted publishing in the settings for your package on the npm registry:

- https://docs.npmjs.com/trusted-publishers

The first time you publish your package you'll need to do it manually, then you can enable trusted publishing for subsequent releases.

You should check the contents of `publish.yml` to ensure you understand what it's doing. It will build and publish the package, but it won't handle any other part of the release process. The other steps, such as updating the version number in `package.json`, are still down to you.
