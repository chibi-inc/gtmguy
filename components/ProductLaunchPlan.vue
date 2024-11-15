<template>
  <div class="max-w-2xl mx-auto">
    <!-- Loading Overlay -->
    <div 
      v-if="isLoading"
      class="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl border border-stone-200 shadow-lg flex items-center gap-4">
        <div class="animate-spin text-sky-500">
          <Icon name="ph:circle-notch-duotone" class="text-2xl" />
        </div>
        <span class="text-neutral-900">Generating Launch Plan...</span>
      </div>
    </div>

    <form @submit.prevent="generateLaunchPlan" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Generate Launch Plan</h3>
        <p class="text-neutral-600">Fill in the details below to create a comprehensive product launch plan.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Product
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Describe your product and its value proposition
            </span>
          </label>
          <textarea
            v-model="formData.product"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., A cloud-based project management tool designed specifically for creative agencies..."
          ></textarea>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Key Features
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              List the main features and benefits
            </span>
          </label>
          <textarea
            v-model="formData.keyFeatures"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., 1. Real-time collaboration, 2. Custom workflow templates, 3. Client portal, 4. Resource allocation..."
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70"
        :disabled="isLoading || !formData.product || !formData.keyFeatures"
      >
        <Icon name="ph:rocket-launch-duotone" class="text-xl" />
        Generate Launch Plan
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="generateLaunchPlan"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'

const formData = ref({
  product: '',
  keyFeatures: ''
})

const isLoading = ref(false)
const response = ref('')

const generateLaunchPlan = async () => {
  if (!formData.value.product || !formData.value.keyFeatures) return
  
  isLoading.value = true
  response.value = ''
  
  try {
    const res = await fetch('/api/launch-plan', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to generate Launch Plan')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error generating Launch Plan:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
.prose {
  @apply text-neutral-700;
}
.prose h1, .prose h2, .prose h3 {
  @apply text-neutral-900 font-semibold;
}
.prose ul {
  @apply list-disc pl-4;
}
.prose p {
  @apply mb-4;
}
</style> 