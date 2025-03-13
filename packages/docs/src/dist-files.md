# Files in `dist`

When you build your new package, you'll find various files `dist`. Here we'll try to explain what they are and why you need them.

Each file targets a different use case. You'll find several of the files referenced in `package.json`, which tells other tools which file to use. If you're familiar with those fields in `package.json` then you should be able to get some sense of what those files are for.

A project will look something like this, using the name `my-lib` as an example:

```
📁 packages
   📁 my-lib
      📁 dist
      📁 src
      📄 package.json
      📄 vite.config.mts
```

Inside `dist` you should see files like these:

```
📁 dist
   📄 my-lib.cjs
   📄 my-lib.css
   📄 my-lib.d.ts
   📄 my-lib.esm.dev.mjs
   📄 my-lib.esm-browser.prod.js
   📄 my-lib.esm-bundler.prod.mjs
   📄 my-lib.global.dev.js
   📄 my-lib.global.prod.js
   📄 my-lib.prod.css
```

We'll go into detail about these files later, but in brief:
- Files with a `.css` ending are CSS.
- The file ending `.d.ts` contains the TypeScript types.
- The other files (with `.cjs`, `.js` and `.mjs` endings) are JavaScript files.
- Files with `dev` in their names are intended to be used during development.
- Files with `prod` in their names are intended to be used in production.
- `esm` indicates that a file is an ES module (i.e. it supports `import`/`export`).
- `.cjs` indicates a CommonJS file (i.e. it supports `require()`).
- `global` indicates that a file exposes the library via a global variable.

Depending on the specifics of your project, it's possible that you don't need all of these files, or maybe you need more alternatives for other use cases. Either way, you can change which files are built by modifying `vite.config.mts` and `package.json`.

## Building `.vue` files

Libraries that use `.vue` files face specific challenges. The default project configuration assumes that you do want to use `.vue` files in your library source code.

There are two ways to handle `.vue` files in libraries:
- Include the raw `.vue` files in the built library.
- Compile the `.vue` files down to `.js` files.

The key difference is when the files are compiled. The first approach forces the consuming application to compile them, whereas the second approach performs the compilation as part of the library's build.

There are pros and cons with either approach, but the project scaffolded with this tool uses the second approach.

### Development vs production

For applications, the distinction between development and production is usually clear.

For libraries, there are two build processes to consider: building the library itself and building the application. The consuming application might also not have a build process, e.g. for sites using libraries from a CDN.

Rather than a clear split between development and production, we instead have three stages: developing the library, developing the consuming application, and finally production. The first stage, developing the library itself, doesn't impact what we publish to npm, so we can ignore that here.

The production stage is also relatively straightforward. 

The stage that poses the most challenges is developing the consuming application. We need to build our library in such a way that it'll work well during that stage.

When building `.vue` files, the SFC compiler needs to know whether to generate a development or production build. There are several differences between development and production builds, but for now we'll just focus on three of them:

1. A development build is fully compatible with Vue Devtools, whereas a production build only has limited Devtools support. Externally available properties, like `$props` and `$attrs`, will be shown in the Devtools in either build, but component state inside `<script setup>` will only be exposed in development builds.
2. Type-based prop definitions are compiled to a helpful runtime equivalent in a development build, whereas a production build will aim for minimal code.
3. A development build includes the full (absolute) file path of each `.vue` file in the built code, under a property called `__file`.

You can see the first two differences for yourself in the Vue Playground at <https://play.vuejs.org/>. The compiled component is visible in the JS tab, and you can toggle between `DEV` and `PROD` using the button at the top of the page. The difference in the `__file` property isn't apparent without the full Vite build-chain.

Having two different compiled forms means we need to commit to which one we want when we build the library.

Including the full path in `__file` is a headache. The build output of a library should be consistent between users, so it shouldn't depend on where the project is stored on the local filesystem. The full path can also potentially include sensitive information, such as usernames or company names, risking doxxing the library's author.

Ideally we'd want a third mode here, aimed at building development builds of libraries. Devtools support and type-based prop compilation should work like a development build, but features like the `__file` property should behave like production, as they aren't relevant to developing the downstream application.

That doesn't exist, but we can get close by using a production build with `prodDevtools: true`. That enables Devtools support, but sadly we won't get the improved runtime props definition.

To accommodate this, we need to generate `dev` and `prod` builds, even when the downstream application is using a bundler. The `dev` builds still use production mode, but with `prodDevtools: true`. The `package.json` then tells the downstream bundler which one to use in each case.

### SSR

The SFC compiler can also generate special SSR builds for `.vue` files, allowing them to skip VNodes on the server and just generate HTML strings directly. You can see this in the Vue Playground at <https://play.vuejs.org/>, in the SSR tab.

Currently, the project created using this scaffolding tool does not generate special SSR builds. It should still work with SSR, but it'll use the slower VNode-based approach.

## The files

### `<name>.cjs`

This is a CommonJS build. It is intended to be used in Node applications that use `require()`.

Some features of this build:
- The file is not minified, as it isn't used in the browser.
- The global `__DEV__` flag will depend on the runtime value of `process.env.NODE_ENV`. This is only relevant if you're using it in your library code.
- SFCs will be compiled in production mode, without `prodDevtools: true`.

There is an argument for having separate `dev` and `prod` builds, but the generated project won't currently be configured that way.

### `<name>.css` and `<name>.prod.css`

These are the built CSS files for the project. The `<style>` sections of any components will end up in these files.

The `prod` file is minified, but they should otherwise be the same. If the consuming application is using a bundler then it should minify the CSS itself, so the minified build is only really relevant to applications that don't have a build step.

There currently isn't any support in the generated project for splitting the CSS file into smaller chunks.

Consuming applications will need to include the CSS file manually. With a bundler that would usually mean importing it, without a bundler it'd usually be a `<link rel="stylesheet">` in the HTML file.

### `<name>.d.ts`

This file contains the TypeScript types. This should include type information for anything exported by the package, including any components.

Tooling in the consuming application should pick this up automatically, as it's referenced from `package.json`.

### `<name>.esm.dev.mjs`

This file exposes the library as an ES module. It is intended to be used during development, either with a bundler or directly in the browser via `<script type="module">` and import maps.

Some features of this build:
- The file is not minified, to make debugging easier.
- The global `__DEV__` flag will be set to `true`. This is only relevant if you're using it in your library code.
- SFCs will be compiled in production mode, but with `prodDevtools: true`.

In production, you would use either `<name>.esm-browser.prod.js` or `<name>.esm-bundler.prod.mjs` instead.

If your library needs to differentiate between bundlers and direct browser usage during development then you may need to adjust the build to generate more files. 

### `<name>.esm-browser.prod.js`

This file is an ES module build intended to be used directly in the browser, not via a bundler. For example:

```html
<script type="importmap">
{
  "imports": {
    "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js",
    "@skirtle/example-lib": "https://unpkg.com/@skirtle/example-lib/dist/example-lib.esm-browser.prod.js"
  }
}
</script>
<script type="module">
import { ExampleComponent } from '@skirtle/example-lib'
// ...
</script>
```

It's a production build, so in real code the versions should be pinned.

Some features of this build:
- The file is minified, reducing its size. Note that Vite doesn't fully minify `esm` builds for libraries.
- The global `__DEV__` flag will be set to `false` and dead code removed. This is only relevant if you're using it in your code.
- SFCs will be compiled in production mode, without `prodDevtools: true`.

During development, you'd normally use `<name>.esm.dev.mjs` instead.

### `<name>.esm-bundler.prod.mjs`

This is a production ES module build, intended to be used by a bundler.

Some features of this build:
- The file is not minified. The bundler will be expected to handle that.
- The global `__DEV__` variable will depend on the bundler's value for `process.env.NODE_ENV`.
- SFCs will be compiled in production mode, without `prodDevtools: true`.

From a bundler's perspective, the only significant difference between this build and the `<name>.esm.dev.mjs` build is that `.vue` files are built without `prodDevtools: true`. If you aren't using `.vue` files in your library code then this file can be used in both development and production. That would be similar to libraries like Vue core, Vue Router and Pinia, which just have an `esm-bundler` build, with no distinction between `dev` and `prod`. In that scenario, `<name>.esm.dev.mjs` is only used in the browser, so it could be renamed to something like `<name>.esm-browser.dev.js`.

### `<name>.global.dev.js` and `<name>.global.prod.js`

Global builds can be used without build tools, just by including a `<script>` tag in the HTML page. They are built using the IIFE format.

The library is exposed using a global variable. For example, let's imagine our package is called `@skirtle/example-lib`, it might be used something like this:

```html
<body>
<div id="app">
  <ExampleComponent />  
</div>
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/@skirtle/example-lib/dist/example-lib.global.dev.js"></script>
<script>
Vue.createApp({
  components: {
    ExampleComponent: ExampleLib.ExampleComponent
  }  
}).mount('#app')
</script>
</body>
```

The global build of Vue creates a global variable called `Vue`, exposing `createApp`. The global build of `@skirtle/example-lib` creates a global variable called `ExampleLib`, allowing us to access `ExampleComponent`.

In production applications, the `prod` builds of both `vue` and `@skirtle/example-lib` should be used instead, and exact versions should be pinned in the URL.

The differences between the `dev` and `prod` builds are:
- `prod` is minified, `dev` isn't.
- `dev` sets `__DEV__` to `true`, `prod` sets it to `false`, with any dead code removed.
- `dev` builds use `prodDevtools: true`.

## `build:dev`, `build:neutral`, `build:prod`

The default build for the generated project is split into 3 targets in `scripts`, to accommodate the files we need to generate. If you decide to add or remove more built files then you may also need to add or remove build targets from `package.json`, as well as adjusting `vite.config.mts`.

A single Vite build can produce multiple files, but those files must share most of their build options and only one file can be created for each format.

There's nothing special about having 3 builds, that's just how many we need to create the combinations we need. We generate 3 `esm` files in `dist`, so we need at least 3 builds to achieve that.

Roughly speaking:
- `build:dev` - unminified development builds that can be served to the browser without further build tools: `<name>.esm.dev.mjs` and `<name>.global.dev.js`.
- `build:neutral` - unminified builds that won't go directly to the browser: `<name>.cjs` and `<name>.esm-bundler.prod.js`.
- `build:prod` - minified production builds to be served directly to the browser:  `<name>.esm.prod.js` and `<name>.global.prod.js`

The TypeScript types only need to be generated once, so they get bolted onto `build:neutral`.

Each build will also generate a CSS file, but two of them will be the same and will be given the same name.
