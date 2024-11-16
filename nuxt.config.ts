// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@nuxt/content'
  ],
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
  },
  content: {
    markdown: {
      toc: {
        depth: 3,
        searchDepth: 3
      },
      remarkPlugins: ['remark-gfm'],
      rehypePlugins: ['rehype-slug']
    },
    highlight: {
      theme: 'github-light'
    }
  }
})