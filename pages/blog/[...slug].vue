<template>
  <div class="min-h-screen bg-stone-50">
    <TheNavbar />
    
    <article class="max-w-3xl mx-auto px-6 pt-32 pb-24">
      <div v-if="post">
        <!-- Category & Back Link -->
        <div class="flex items-center justify-between mb-12">
          <NuxtLink 
            to="/blog"
            class="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors group text-sm"
          >
            <Icon name="ph:arrow-left-duotone" class="group-hover:-translate-x-0.5 transition-transform" />
            Back to Blog
          </NuxtLink>
        </div>

        <!-- Post Header -->
        <header class="mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">{{ post.title }}</h1>
          <p class="text-xl text-neutral-600 leading-relaxed mb-8">{{ post.description }}</p>
          <div class="flex items-center gap-6 text-sm text-neutral-600">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center text-white">
                <Icon name="ph:user-duotone" class="text-lg" />
              </div>
              <div>
                <p class="font-medium text-neutral-900">{{ post.author }}</p>
                <p class="text-neutral-500">Author</p>
              </div>
            </div>
            <div class="w-px h-8 bg-neutral-200"></div>
            <div class="flex items-center gap-2">
              <Icon name="ph:calendar-duotone" class="text-lg" />
              <span>{{ formatDate(post.date) }}</span>
            </div>
          </div>
        </header>

        <!-- Featured Image -->
        <div class="mb-16">
          <img 
            v-if="post.image" 
            :src="post.image" 
            :alt="post.title"
            class="w-full aspect-[21/9] object-cover rounded-2xl shadow-lg"
          />
        </div>

        <!-- Content -->
        <div class="prose prose-stone prose-lg max-w-none">
          <ContentRenderer :value="post" />
        </div>

        <!-- Share and Navigation -->
        <div class="mt-16 flex items-center justify-between border-t border-neutral-200 pt-8">
          <div class="flex items-center gap-4">
            <span class="text-sm font-medium text-neutral-700">Share this article:</span>
            <div class="flex items-center gap-3">
              <button class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors">
                <Icon name="ph:twitter-logo-duotone" class="text-lg" />
              </button>
              <button class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors">
                <Icon name="ph:linkedin-logo-duotone" class="text-lg" />
              </button>
              <button class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors">
                <Icon name="ph:link-duotone" class="text-lg" />
              </button>
            </div>
          </div>
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
const { data: post } = await useAsyncData('post', () => queryContent(route.path).findOne())

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
  font-size: 1.125rem;
}

/* Headings */
.prose h1 {
  @apply text-4xl font-bold text-neutral-900 mt-16 mb-6 leading-tight;
}

.prose h2 {
  @apply text-2xl font-bold text-neutral-900 mt-12 mb-4 leading-tight;
}

.prose h3 {
  @apply text-xl font-bold text-neutral-900 mt-8 mb-3;
}

/* Paragraphs and spacing */
.prose p {
  @apply mb-6 leading-relaxed;
}

.prose > p:first-of-type {
  @apply text-lg text-neutral-800;
}

/* Lists */
.prose ul {
  @apply my-6 space-y-3 pl-6;
}

.prose li {
  @apply pl-2;
  position: relative;
}

.prose ul > li::before {
  content: "";
  @apply absolute w-1.5 h-1.5 bg-neutral-400 rounded-full;
  left: -1rem;
  top: 0.75rem;
  transform: translateY(-50%);
}

/* Emphasis and links */
.prose strong {
  @apply text-neutral-900 font-semibold;
}

.prose a {
  @apply text-sky-600 hover:text-sky-700 transition-colors border-b border-sky-200 hover:border-sky-600;
}

/* Quotes and callouts */
.prose blockquote {
  @apply pl-6 border-l-4 border-neutral-200 italic my-8 text-neutral-700;
}

.prose blockquote p {
  @apply mb-0;
}

/* Code blocks */
.prose code {
  @apply bg-neutral-50 px-1.5 py-0.5 rounded text-sm text-neutral-800 border border-neutral-200/50;
}

.prose pre {
  @apply bg-neutral-50 p-6 rounded-xl overflow-x-auto border border-neutral-200/50 my-8;
}

.prose pre code {
  @apply bg-transparent border-0 p-0 text-neutral-800;
}

/* Images */
.prose img {
  @apply rounded-xl shadow-sm my-8;
}

/* Horizontal spacing for better readability */
.prose > * + * {
  @apply mt-6;
}

.prose > *:first-child {
  @apply mt-0;
}

/* Custom spacing for better visual hierarchy */
.prose > h2 + * {
  @apply mt-4;
}

.prose > h3 + * {
  @apply mt-3;
}

/* Tables */
.prose table {
  @apply w-full my-8 border-collapse;
}

.prose table th {
  @apply bg-neutral-50 text-left py-3 px-4 border-b-2 border-neutral-200 font-semibold text-neutral-900;
}

.prose table td {
  @apply py-3 px-4 border-b border-neutral-200;
}

/* Lists within lists */
.prose ul ul, 
.prose ul ol,
.prose ol ul,
.prose ol ol {
  @apply my-2 ml-6;
}
</style> 