<template>
  <div class="min-h-screen bg-stone-50">
    <TheNavbar />
    
    <article class="max-w-3xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div v-if="post">
        <!-- Back Link -->
        <div class="mb-8 sm:mb-12">
          <NuxtLink 
            to="/blog"
            class="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors group text-sm"
          >
            <Icon name="ph:arrow-left-duotone" class="group-hover:-translate-x-0.5 transition-transform" />
            Back to Blog
          </NuxtLink>
        </div>

        <!-- Post Header -->
        <header class="mb-8 sm:mb-12">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-4 sm:mb-6 leading-tight">{{ post.title }}</h1>
          <p class="text-lg sm:text-xl text-neutral-600 leading-relaxed mb-6 sm:mb-8">{{ post.description }}</p>
          <div class="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-neutral-600">
            <div class="flex items-center gap-2">
              <div class="w-8 sm:w-10 h-8 sm:h-10 bg-neutral-900 rounded-full flex items-center justify-center text-white">
                <Icon name="ph:user-duotone" class="text-lg" />
              </div>
              <div>
                <p class="font-medium text-neutral-900">{{ post.author }}</p>
                <p class="text-neutral-500">Author</p>
              </div>
            </div>
            <div class="hidden sm:block w-px h-8 bg-neutral-200"></div>
            <div class="flex items-center gap-2">
              <Icon name="ph:calendar-duotone" class="text-lg" />
              <span>{{ formatDate(post.date) }}</span>
            </div>
          </div>
        </header>

        <!-- Featured Image -->
        <div class="mb-10 sm:mb-16 -mx-4 sm:mx-0">
          <img 
            v-if="post.image" 
            :src="post.image" 
            :alt="post.title"
            class="w-full aspect-[16/9] sm:aspect-[21/9] object-cover sm:rounded-2xl shadow-lg"
          />
        </div>

        <!-- Content -->
        <div class="prose prose-sm sm:prose-base md:prose-lg max-w-none">
          <ContentRenderer :value="post" />
        </div>

        <!-- Back to Blog -->
        <div class="mt-12 text-center">
          <NuxtLink 
            to="/blog"
            class="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition-colors group"
          >
            <Icon name="ph:arrow-left-duotone" class="group-hover:-translate-x-0.5 transition-transform" />
            Back to Blog
          </NuxtLink>
        </div>
      </div>
    </article>

    <TheFooter />
  </div>
</template>

<script setup>
const route = useRoute()
const { setSeo } = useSeo()
const { data: post } = await useAsyncData('post', () => queryContent(route.path).findOne())

// Set SEO metadata and structured data based on post content
watch(post, (newPost) => {
  if (newPost) {
    setSeo({
      title: newPost.title,
      description: newPost.description,
      image: newPost.image,
      url: `https://gtmguy.ai${route.path}`, // Replace with your domain
      type: 'article',
    })

    // Add structured data
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": newPost.title,
            "description": newPost.description,
            "image": newPost.image,
            "datePublished": newPost.date,
            "author": {
              "@type": "Person",
              "name": newPost.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "GTMGuy",
              "logo": {
                "@type": "ImageObject",
                "url": "https://gtmguy.ai/logo.png" // Add your logo URL
              }
            }
          })
        }
      ]
    })
  }
}, { immediate: true })

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