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
        <span class="text-neutral-900">Generating Journey Map...</span>
      </div>
    </div>

    <form @submit.prevent="generateJourney" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Generate User Journey Map</h3>
        <p class="text-neutral-600">Fill in the details below to create a comprehensive user journey map.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            User Description
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Tell us about your typical user
            </span>
          </label>
          <textarea
            v-model="formData.userDescription"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Marketing manager at a mid-sized tech company, responsible for digital campaigns..."
          ></textarea>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Main Touchpoints
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              List the key interaction points with your product
            </span>
          </label>
          <textarea
            v-model="formData.mainTouchpoints"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Website discovery, Free trial signup, Onboarding email sequence, First project creation..."
          ></textarea>
        </div>

        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Goals
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              What are the user's main objectives?
            </span>
          </label>
          <textarea
            v-model="formData.goals"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Streamline campaign planning, Improve team collaboration, Track ROI more effectively..."
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70"
        :disabled="isLoading || !formData.userDescription || !formData.mainTouchpoints || !formData.goals"
      >
        <Icon name="ph:map-trifold-duotone" class="text-xl" />
        Generate Journey Map
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="generateJourney"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'

const formData = ref({
  userDescription: '',
  mainTouchpoints: '',
  goals: ''
})

const isLoading = ref(false)
const response = ref('')

const generateJourney = async () => {
  if (!formData.value.userDescription || !formData.value.mainTouchpoints || !formData.value.goals) return
  
  isLoading.value = true
  response.value = ''
  
  try {
    const res = await fetch('/api/journey', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to generate User Journey Map')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error generating User Journey Map:', error)
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