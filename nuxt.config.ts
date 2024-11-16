// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@nuxt/content',
    '@nuxtjs/sitemap',
    '@nuxtjs/supabase'
  ],
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    supabase: {
      url: process.env.SUPABASE_URL,
      serviceKey: process.env.SUPABASE_SERVICE_KEY,
      key: process.env.SUPABASE_KEY,
    }
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
  },
  sitemap: {
    hostname: 'https://gtmguy.com',
  },
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/',
      callback: '/auth/callback',
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  }
})