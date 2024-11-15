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
        <span class="text-neutral-900">Generating MVP Plan...</span>
      </div>
    </div>

    <form @submit.prevent="generateMVP" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Generate MVP Plan</h3>
        <p class="text-neutral-600">Fill in the details below to create a comprehensive MVP plan.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Problem
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              What problem does your MVP solve?
            </span>
          </label>
          <textarea
            v-model="formData.problem"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Small businesses struggle to manage their social media presence effectively..."
          ></textarea>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Target Market
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Who are your early adopters?
            </span>
          </label>
          <textarea
            v-model="formData.targetMarket"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Small e-commerce businesses with 1-5 employees managing their own social media..."
          ></textarea>
        </div>

        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Must Have Functionalities
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              What are the core features needed?
            </span>
          </label>
          <textarea
            v-model="formData.mustHaveFunctionalities"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Social media post scheduling, Analytics dashboard, Content calendar..."
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70"
        :disabled="isLoading || !formData.problem || !formData.targetMarket || !formData.mustHaveFunctionalities"
      >
        <Icon name="ph:cube-duotone" class="text-xl" />
        Generate MVP Plan
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="generateMVP"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'

const formData = ref({
  problem: '',
  targetMarket: '',
  mustHaveFunctionalities: ''
})

const isLoading = ref(false)
const response = ref('')

const generateMVP = async () => {
  if (!formData.value.problem || !formData.value.targetMarket || !formData.value.mustHaveFunctionalities) return
  
  isLoading.value = true
  response.value = ''
  
  try {
    const res = await fetch('/api/mvp', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to generate MVP Plan')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error generating MVP Plan:', error)
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