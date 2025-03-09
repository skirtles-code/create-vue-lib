# Upgrading

As a new tool, there hasn't really been time to establish how `@skirtle/create-vue-lib` handles upgrades. But it's maybe still worth some brief notes on how it's intended to be used. 

Much like [`create-vue`](https://github.com/vuejs/create-vue), there isn't any explicit support for upgrading projects. Both tools aim to create new projects, with any upgrades being managed manually. In most cases this just involves bumping dependencies regularly, so there's no need to involve the scaffolding tool.

With both tools it's assumed that project developers will alter their project configurations after they're created, so it isn't really practical for the tool to perform automated upgrades.

Sometimes there are significant changes required to upgrade to the latest version of a dependency, for example when a dependency needs changes to its configuration file. The complexity of such upgrades usually depends on how much you've changed the project configuration after it was created.

A common approach to upgrading is to create a completely new project and then use that as a reference point. It's usually possible to get everything working by copying across dependency versions and chunks of config files.

It can also work the other way, copying bits of the old project across to a new project to check what works and what doesn't.

With `@skirtle/create-vue-lib`, you could also consider the following approach:

1. Ensure all files from your project are checked into git.
2. Run `pnpm create @skirtle/vue-lib --extended` in the same directory, so that it overwrites the existing configuration files. Using the `--extended` flag is optional, but it'll give you the option to avoid creating the example components.
3. Use a diff tool, such as the one in your IDE, to compare the new files to those checked into git. You may need to revert a lot of the changes, but that's usually a relatively straightforward process.
