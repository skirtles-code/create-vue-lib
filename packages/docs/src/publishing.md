# Publishing to npm

To publish to the npm registry you'll need to use the command `pnpm publish`. You should read the docs for that command before continuing. The documentation for `npm publish` is also a really useful reference and well worth a read.

- [`pnpm publish`](https://pnpm.io/cli/publish)
- [`npm publish`](https://docs.npmjs.com/cli/v11/commands/npm-publish)

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

The dry run will show which files are going to be included in the published package. pnpm should automatically include the `LICENSE` file, taken from the workspace root. The `README.md` isn't taken from the workspace root, so that's copied as part of the build. You should also see `package.json` and the files in `dist`. Files from `src` shouldn't be needed.

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

This scaffolding tool doesn't currently have any support for automating this process, but you can find various examples of automation scripts if you look through the GitHub repos for large projects.
