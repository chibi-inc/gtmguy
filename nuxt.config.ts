// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindTypography from '@tailwindcss/typography';
import fs from 'fs'
import path from 'path'

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/content',
    '@nuxtjs/supabase',
    '@nuxt/fonts'
  ],
  css: ['~/assets/main.css'],
  tailwindcss: {
    config: {
        plugins: [tailwindTypography],
    }
  },
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    paddle: {
      apiKey: process.env.PADDLE_SECRET_KEY,
      url: process.env.PADDLE_URL,
    },
    supabase: {
      url: process.env.SUPABASE_URL,
      serviceKey: process.env.SUPABASE_SERVICE_KEY,
      key: process.env.SUPABASE_KEY,
    },
    public: {
      paddleClientToken: process.env.PADDLE_CLIENT_TOKEN,
      paddlePriceId: process.env.PADDLE_PRICE_ID,
      paddleEnvironment: process.env.PADDLE_ENVIRONMENT,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://gtmguy.ai'
    }
  },
  content: {
    markdown: {
      toc: {
        depth: 3,
        searchDepth: 3
      },
      remarkPlugins: ['remark-gfm', 'remark-math'],
      rehypePlugins: ['rehype-slug', ['rehype-katex', { throwOnError: false }]]
    },
    highlight: {
      theme: 'github-light'
    }
  },
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/app',
      callback: '/auth/callback',
    }
  },
  fonts: {
    families: [
      {
        name: 'Poppins',
        weights: [400, 500, 600, 700]
      }
    ]
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },
  nitro: {
    typescript: {
      tsConfig: {
        compilerOptions: {
          // Existing options...
        }
      }
    }
  },
  hooks: {
    'builder:watch': (event, path) => {
      if (event === 'add' || event === 'change') {
        // Ignore specific warnings
        process.removeAllListeners('warning')
        process.on('warning', (warning) => {
          if (warning.name === 'ExperimentalWarning' && 
              warning.message.includes('CommonJS module') && 
              warning.message.includes('supports-color')) {
            return
          }
          console.warn(warning)
        })
      }
    }
  }
})
