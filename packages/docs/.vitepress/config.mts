import { defineConfigWithTheme } from 'vitepress'

export default defineConfigWithTheme({
  srcDir: './src',
  outDir: './dist',
  base: '/create-vue-lib/',
  title: '@skirtle/create-vue-lib',
  lang: 'en-US',
  description: 'Scaffolding tool for Vue libraries',
  cleanUrls: true,

  sitemap: {
    hostname: 'https://skirtles-code.github.io/create-vue-lib/'
  },

  transformHead({ page }) {
    if (page !== '404.md') {
      // The final replacement assumes `cleanUrls: true` is set
      const canonicalUrl = `https://skirtles-code.github.io/create-vue-lib/${page}`
        .replace(/index\.md$/, '')
        .replace(/\.md$/, '')

      return [['link', { rel: 'canonical', href: canonicalUrl }]]
    }
  },

  themeConfig: {
    search: {
      provider: 'local'
    },

    nav: [
      { text: 'Guide', link: '/introduction' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/skirtles-code/create-vue-lib' }
    ],

    sidebar: [
      {
        text: 'Getting started',
        items: [
          {
            text: 'Introduction',
            link: '/introduction'
          }, {
            text: 'The questions explained',
            link: '/questions'
          }, {
            text: 'Next steps',
            link: '/next-steps'
          }
        ]
      }
    ]
  }
})
