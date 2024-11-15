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
        <span class="text-neutral-900">Generating Research Plan...</span>
      </div>
    </div>

    <form @submit.prevent="generateResearchPlan" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Generate Research Plan</h3>
        <p class="text-neutral-600">Fill in the details below to create a comprehensive user research plan.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Problem
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              What problem are you trying to research?
            </span>
          </label>
          <textarea
            v-model="formData.problem"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Understanding why users abandon our product during the onboarding process..."
          ></textarea>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Target Market
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Who do you want to research?
            </span>
          </label>
          <textarea
            v-model="formData.targetMarket"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., New users who signed up in the last 30 days and completed less than 50% of onboarding..."
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70"
        :disabled="isLoading || !formData.problem || !formData.targetMarket"
      >
        <Icon name="ph:magnifying-glass-duotone" class="text-xl" />
        Generate Research Plan
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="generateResearchPlan"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'

const formData = ref({
  problem: '',
  targetMarket: ''
})

const isLoading = ref(false)
const response = ref('')

const generateResearchPlan = async () => {
  if (!formData.value.problem || !formData.value.targetMarket) return
  
  isLoading.value = true
  response.value = ''
  
  try {
    const res = await fetch('/api/research-plan', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to generate Research Plan')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error generating Research Plan:', error)
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