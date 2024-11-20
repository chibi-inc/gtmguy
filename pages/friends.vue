<template>
  <div class="min-h-screen bg-stone-50">
    <TheNavbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-24">
      <div class="max-w-3xl mx-auto text-center mb-16">
        <h1 class="text-4xl font-bold text-neutral-900 mb-4">Friends</h1>
        <p class="text-lg text-neutral-700">
          Check out indie products that are part of our 
          <a 
            href="https://indiehackerfriends.com" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-sky-600 hover:text-sky-700 transition-colors"
          >
          squad
          </a> 
          ✨
        </p>
      </div>

      <div v-if="isLoading" class="flex justify-center">
        <div class="animate-spin text-sky-500">
          <Icon name="ph:circle-notch-duotone" class="text-3xl" />
        </div>
      </div>

      <div 
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div 
          v-for="friend in friends" 
          :key="friend.product"
          class="bg-white rounded-xl border border-stone-200 p-6 hover:shadow-lg transition-all duration-200"
        >
          <a 
            :href="friend.link"
            target="_blank"
            rel="noopener noreferrer"
            class="block h-full"
          >
            <h3 class="text-lg font-semibold text-neutral-900 mb-2 hover:text-sky-600 transition-colors">
              {{ friend.product }}
            </h3>
            <p class="text-neutral-600">
              {{ friend.description }}
            </p>
          </a>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup>
const friends = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch('/api/friends/get')
    friends.value = await response.json()
  } catch (error) {
    console.error('Error fetching friends:', error)
  } finally {
    isLoading.value = false
  }
})
</script> 