<template>
  <div class="max-w-3xl mx-auto">
    <!-- Loading Overlay -->
    <div 
      v-if="isLoading"
      class="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl border border-stone-200 shadow-lg flex items-center gap-4">
        <div class="animate-spin text-sky-500">
          <Icon name="ph:circle-notch-duotone" class="text-2xl" />
        </div>
        <span class="text-neutral-900">Generating GTM Strategy...</span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Generate GTM Strategy</h3>
        <p class="text-neutral-600">Fill in the details below to create a comprehensive go-to-market strategy.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Product Description
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Describe your product and its unique value proposition
            </span>
          </label>
          <textarea
            v-model="formData.productDescription"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            :class="{ 'border-red-300': showDescriptionError }"
            placeholder="e.g., An AI-powered project management tool that automates task prioritization..."
            @input="showDescriptionError = false"
            required
          ></textarea>
          <!-- Error Message -->
          <p v-if="showDescriptionError" class="mt-2 text-sm text-red-600">
            Please describe your product
          </p>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Market Context
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Describe your target market and competition
            </span>
          </label>
          <textarea
            v-model="formData.marketContext"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            :class="{ 'border-red-300': showMarketError }"
            placeholder="e.g., Enterprise software market with focus on large tech companies..."
            @input="showMarketError = false"
            required
          ></textarea>
          <!-- Error Message -->
          <p v-if="showMarketError" class="mt-2 text-sm text-red-600">
            Please describe your market context
          </p>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:hover:bg-sky-500"
        :disabled="isLoading"
      >
        <Icon name="ph:target-duotone" class="text-xl" />
        {{ isLoading ? 'Generating...' : 'Generate GTM Strategy' }}
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="generateStrategy"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'
import { useCredits } from '~/composables/useCredits'

const formData = ref({
  productDescription: '',
  marketContext: ''
})

const isLoading = ref(false)
const response = ref('')
const showDescriptionError = ref(false)
const showMarketError = ref(false)
const { checkAndConsumeCredit, showUpgradeModal } = useCredits()



const handleSubmit = async () => {
  // Reset errors
  showDescriptionError.value = false
  showMarketError.value = false

  // Validate inputs
  if (!formData.value.productDescription) {
    showDescriptionError.value = true
  }
  if (!formData.value.marketContext) {
    showMarketError.value = true
  }

  if (!formData.value.productDescription || !formData.value.marketContext) {
    return
  }
  
  await generateStrategy()
}

const generateStrategy = async () => {
  isLoading.value = true
  response.value = ''
  
  try {
    // Check credits first
    const canProceed = await checkAndConsumeCredit()
    if (!canProceed) {
      isLoading.value = false
      return
    }

    // If credit check passes, proceed with generation
    const res = await fetch('/api/gtm-strategy', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to generate GTM strategy')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error:', error)
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