import { resolve } from 'node:path'

import { defineConfigWithTheme } from 'vitepress'

export default ({ mode }: { mode: string }) => defineConfigWithTheme({
  srcDir: './src',
  outDir: './dist',
  base: '/@unscopedPackageName@',
  title: '@scopedPackageName@',
  lang: 'en-US',
  description: 'Description',
  cleanUrls: true,

  // sitemap: {
  //   hostname: 'https://???.github.io'
  // },

  // transformHead({ page}) {
  //   if (page !== '404.md') {
  //     const canonicalUrl = `https://???.github.io/${page}`
  //       .replace(/index\.md$/, '')
  //       .replace(/\.md$/, '')
  //
  //     return [['link', { rel: 'canonical', href: canonicalUrl }]]
  //   }
  // },

  vite: {
    resolve: {
      alias: {
        '@scopedPackageName@': resolve(__dirname, '../../@projectName@/src/index.ts')
      }
    },

    define: {
      __DEV__: JSON.stringify(mode !== 'production')
    },

    server: {
      fs: {
        allow: [
          '..',
          '../../@projectName@/src'
        ]
      }
    }
  },

  themeConfig: {
    search: {
      provider: 'local'
    },

    nav: [
      { text: 'Guide', link: '/introduction' }
    ],

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/' }
    // ],

    sidebar: [
      {
        text: 'Getting started',
        items: [
          {
            text: 'Introduction',
            link: '/introduction'
          }
        ]
      }
    ]
  }
})
