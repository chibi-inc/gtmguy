<template>
  <div class="min-h-screen bg-stone-50">
    <TheNavbar />
    
    <main>
      <article itemscope itemtype="http://schema.org/BlogPosting" class="max-w-3xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-24">
        <header>
          <h1 itemprop="headline" class="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-4 sm:mb-6 leading-tight">
            {{ post.title }}
          </h1>
          <p itemprop="description" class="text-lg sm:text-xl text-neutral-600 leading-relaxed mb-6 sm:mb-8">
            {{ post.description }}
          </p>
          <div class="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-neutral-600">
            <div itemprop="author" itemscope itemtype="http://schema.org/Person" class="flex items-center gap-2">
              <div class="w-8 sm:w-10 h-8 sm:h-10 bg-neutral-900 rounded-full flex items-center justify-center text-white">
                <Icon name="ph:user-duotone" class="text-lg" />
              </div>
              <div>
                <p class="font-medium text-neutral-900">{{ post.author }}</p>
                <p class="text-neutral-500">Author</p>
              </div>
            </div>
            <div class="hidden sm:block w-px h-8 bg-neutral-200"></div>
            <time itemprop="datePublished" :datetime="post.date" class="flex items-center gap-2">
              {{ formatDate(post.date) }}
            </time>
          </div>
        </header>

        <div class="mb-10 sm:mb-16 -mx-4 sm:mx-0">
          <img 
            v-if="post.image" 
            :src="post.image" 
            :alt="post.title"
            class="w-full aspect-[16/9] sm:aspect-[21/9] object-cover sm:rounded-2xl"
          />
        </div>

        <div class="prose prose-sm sm:prose-base md:prose-lg max-w-none">
          <ContentRenderer :value="post" />
        </div>

        <div class="mt-12 text-center">
          <NuxtLink 
            to="/blog"
            class="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition-colors group"
          >
            <Icon name="ph:arrow-left-duotone" class="group-hover:-translate-x-0.5 transition-transform" />
            Back to Blog
          </NuxtLink>
        </div>
      </article>
    </main>

    <TheFooter />
  </div>
</template>

<script setup>
import { useHead } from '#head'
const route = useRoute()
const { data: post } = await useAsyncData('post', () => queryContent(route.path).findOne())

// Enhanced SEO setup for blog posts
const setupSEO = (post) => {
  if (!post) return

  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://gtmguy.ai'
  const postUrl = `${siteUrl}${route.path}`
  const postImage = post.image ? (post.image.startsWith('http') ? post.image : `${siteUrl}${post.image}`) : `${siteUrl}/og-image.png`

  useHead({
    title: `${post.title} | GTMGuy Blog`,
    link: [
      { rel: 'icon', type: 'image/png', href: '/logo.png' },
      { rel: 'apple-touch-icon', href: '/logo.png' },
      { rel: 'canonical', href: postUrl },
    ],
    meta: [
      { name: 'description', content: post.description },
      // Open Graph
      { property: 'og:title', content: post.title },
      { property: 'og:description', content: post.description },
      { property: 'og:image', content: postImage },
      { property: 'og:url', content: postUrl },
      { property: 'og:type', content: 'article' },
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@thetronjohnson' },
      { name: 'twitter:creator', content: '@thetronjohnson' },
      { name: 'twitter:title', content: `${post.title} | GTMGuy Blog` },
      { name: 'twitter:description', content: post.description },
      { name: 'twitter:image', content: postImage },
      { name: 'twitter:image:alt', content: post.title },
      { name: 'twitter:image:width', content: '1200' },
      { name: 'twitter:image:height', content: '630' },
      // Article specific meta tags
      { property: 'article:published_time', content: post.date },
      { property: 'article:author', content: post.author },
      { property: 'article:section', content: post.category || 'Product Management' },
      { name: 'keywords', content: `${post.tags?.join(', ')}, product management, GTM strategy, marketing` },
    ],
    // Enhanced Article structured data
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": postUrl
          },
          "headline": post.title,
          "description": post.description,
          "image": postImage,
          "datePublished": post.date,
          "dateModified": post.lastUpdated || post.date,
          "author": {
            "@type": "Person",
            "name": post.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "GTMGuy",
            "logo": {
              "@type": "ImageObject",
              "url": "https://gtmguy.ai/logo.png",
              "width": "512",
              "height": "512"
            }
          },
          "keywords": post.tags?.join(', '),
          "articleBody": post.description
        })
      }
    ],
  })
}

// Watch for post changes and update SEO
watch(() => post.value, (newPost) => {
  setupSEO(newPost)
}, { immediate: true })

// Add schema breadcrumbs
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://gtmguy.ai"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://gtmguy.ai/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": post.value?.title,
      "item": `https://gtmguy.ai${route.path}`
    }
  ]
}

// Add breadcrumb schema to head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(breadcrumbSchema)
    }
  ]
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Handle 404
if (!post.value) {
  throw createError({ statusCode: 404, message: 'Post not found' })
}
</script>

<style>
/* Base content styles */
.prose {
  @apply text-neutral-700 leading-relaxed;
}

/* Mobile-first approach for content */
.prose p {
  @apply text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed;
}

.prose h1 {
  @apply text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mt-12 sm:mt-16 mb-4 sm:mb-6 leading-tight;
}

.prose h2 {
  @apply text-xl sm:text-2xl font-bold text-neutral-900 mt-8 sm:mt-12 mb-3 sm:mb-4 leading-tight;
}

.prose h3 {
  @apply text-lg sm:text-xl font-bold text-neutral-900 mt-6 sm:mt-8 mb-2 sm:mb-3;
}

/* Lists */
.prose ul {
  @apply my-4 sm:my-6 space-y-2 sm:space-y-3 pl-4 sm:pl-6;
}

.prose li {
  @apply pl-2 text-base sm:text-lg;
  position: relative;
}

/* Images */
.prose img {
  @apply -mx-4 sm:mx-0 w-screen sm:w-full sm:rounded-xl shadow-sm my-6 sm:my-8;
}

/* Code blocks */
.prose pre {
  @apply -mx-4 sm:mx-0 p-4 sm:p-6 rounded-none sm:rounded-xl overflow-x-auto border border-neutral-200/50 my-6 sm:my-8;
  font-size: 0.875rem;
}

/* Quotes */
.prose blockquote {
  @apply pl-4 sm:pl-6 border-l-4 border-neutral-200 italic my-6 sm:my-8 text-neutral-700 text-base sm:text-lg;
}

/* Links */
.prose a {
  @apply text-sky-600 hover:text-sky-700 transition-colors border-b border-sky-200 hover:border-sky-600;
  word-break: break-word;
}

/* Tables */
.prose table {
  @apply -mx-4 sm:mx-0 w-screen sm:w-full my-6 sm:my-8 text-sm sm:text-base;
  min-width: 100%;
}

.prose table th,
.prose table td {
  @apply py-2 px-3 sm:py-3 sm:px-4;
}

/* Responsive padding adjustments */
.prose > * {
  @apply px-0;
}

/* First paragraph emphasis */
.prose > p:first-of-type {
  @apply text-lg sm:text-xl text-neutral-800;
}

/* Better spacing on mobile */
.prose > * + * {
  @apply mt-4 sm:mt-6;
}
</style> 