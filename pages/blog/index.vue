<template>
  <div class="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
    <TheNavbar />
    
    <div class="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <div class="max-w-3xl mx-auto text-center mb-16">
        <h1 class="text-4xl sm:text-5xl font-bold text-neutral-900 mb-6">GTM Insights Blog</h1>
        <p class="text-lg text-neutral-700">
          Expert insights and guides on go-to-market strategy and product launches.
        </p>
      </div>

      <!-- Blog Posts Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article v-for="post in posts" :key="post._path" class="group">
          <NuxtLink :to="post._path">
            <div class="aspect-[16/9] mb-6 overflow-hidden rounded-xl bg-stone-100">
              <img 
                v-if="post.image" 
                :src="post.image" 
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <time class="text-sm text-neutral-500">{{ formatDate(post.date) }}</time>
              <h2 class="text-xl font-semibold text-neutral-900 mt-2 mb-3 group-hover:text-sky-600 transition-colors">
                {{ post.title }}
              </h2>
              <p class="text-neutral-600 line-clamp-2">{{ post.description }}</p>
            </div>
          </NuxtLink>
        </article>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

const { signInWithGoogle, isLoading } = useAuth()

// Fetch posts first
const { data: posts } = await useAsyncData('posts', () => 
  queryContent('/blog').sort({ date: -1 }).find()
)

// Format date helper
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// SEO Configuration
useHead({
  title: 'GTM Insights Blog | Product Development & GTM Strategies',
  meta: [
    { 
      name: 'description', 
      content: 'Expert guides on SaaS product development, go-to-market strategies, and growth tactics. Learn how to build and scale your SaaS product.' 
    },
    { 
      name: 'keywords', 
      content: 'saas development, product management, gtm strategy, saas growth, product launch' 
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'GTMGuy Blog',
        description: 'SaaS Product Development & Growth Strategies',
        url: 'https://gtmguy.ai/blog',
        blogPost: posts.value?.map(post => ({
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          author: {
            '@type': 'Person',
            name: post.author
          },
          url: `https://gtmguy.ai/blog/${post._path?.split('/').pop()}`
        })) || []
      }))
    }
  ]
})

definePageMeta({
  sitemap: {
    priority: 0.9,
    changefreq: 'daily'
  }
})
</script> 