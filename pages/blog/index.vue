<template>
  <div class="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
    <TheNavbar />
    
    <div class="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <div class="max-w-3xl mx-auto text-center mb-16">
        <span class="text-sky-600 font-medium mb-4 block">Blog</span>
        <h1 class="text-5xl font-bold text-neutral-900 mb-6">GTMGuy Blog</h1>
        <p class="text-xl text-neutral-700">
          Expert insights and guides on go-to-market strategy and product launches
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article 
          v-for="post in posts" 
          :key="post._path" 
          class="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <NuxtLink :to="post._path" class="block h-full">
            <div class="aspect-[16/9] overflow-hidden bg-stone-100">
              <img 
                v-if="post.image" 
                :src="post.image" 
                :alt="post.title"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-stone-400">
                <Icon name="ph:image-duotone" class="text-4xl" />
              </div>
            </div>
            <div class="p-6">
              <div class="flex items-center gap-3 text-sm text-neutral-600 mb-4">
                <div class="flex items-center gap-2">
                  <Icon name="ph:calendar-duotone" class="text-lg" />
                  <span>{{ formatDate(post.date) }}</span>
                </div>
                <span class="text-stone-300">·</span>
                <div class="flex items-center gap-2">
                  <Icon name="ph:user-duotone" class="text-lg" />
                  <span>{{ post.author }}</span>
                </div>
              </div>
              <h2 class="text-xl font-bold text-neutral-900 mb-3 line-clamp-2">{{ post.title }}</h2>
              <p class="text-neutral-700 mb-6 line-clamp-3">{{ post.description }}</p>
              <div class="flex items-center gap-2 text-sky-600 font-medium hover:text-sky-700 transition-colors group">
                Read Article
                <Icon name="ph:arrow-right-duotone" class="text-lg group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup>
const { setSeo } = useSeo()

setSeo({
  title: 'GTM Insights Blog',
  description: 'Expert insights and guides on go-to-market strategy and product launches. Learn how to create effective GTM strategies.',
  url: 'https://gtmguy.ai/blog', // Replace with your domain
  type: 'blog',
})

const { data: posts } = await useAsyncData('posts', () => queryContent('/blog').sort({ date: -1 }).find())

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script> 