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
        <span class="text-neutral-900">Analyzing Landing Page...</span>
      </div>
    </div>

    <!-- Upgrade Modal -->
    <div 
      v-if="showUpgradeModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white p-8 rounded-2xl border border-stone-200 shadow-xl max-w-md w-full mx-4">
        <div class="text-center">
          <div class="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="ph:warning-duotone" class="text-3xl text-neutral-900" />
          </div>
          <h3 class="text-xl font-bold text-neutral-900 mb-2">No Credits Remaining</h3>
          <p class="text-neutral-600 mb-6">
            Upgrade to our Lifetime Pro plan to get unlimited generations and premium features.
          </p>
          <div class="space-y-3">
            <button
              @click="handleUpgrade"
              class="w-full py-3 px-4 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-200 font-medium"
            >
              Upgrade to Pro
            </button>
            <button
              @click="showUpgradeModal = false"
              class="w-full py-3 px-4 bg-stone-100 text-neutral-700 rounded-xl hover:bg-stone-200 transition-all duration-200 font-medium"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Landing Page Optimizer</h3>
        <p class="text-neutral-600">Enter your landing page URL to get comprehensive optimization recommendations.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Landing Page URL
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Enter the full URL of your landing page
            </span>
          </label>
          <input
            v-model="formData.url"
            type="url"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none"
            :class="{
              'border-red-300': validationStates.url.dirty && !validationStates.url.valid,
              'border-green-300': validationStates.url.dirty && validationStates.url.valid
            }"
            placeholder="e.g., https://example.com/landing-page"
            @input="handleUrlInput"
            required
          />
          <!-- Error Message -->
          <p 
            v-if="validationStates.url.dirty && validationStates.url.error" 
            class="mt-2 text-sm text-red-600"
          >
            {{ validationStates.url.error }}
          </p>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:hover:bg-sky-500"
        :disabled="isLoading"
      >
        <Icon name="ph:browser-duotone" class="text-xl" />
        {{ isLoading ? 'Analyzing...' : 'Analyze Landing Page' }}
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="analyzeLandingPage"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'
import { useCredits } from '~/composables/useCredits'

const formData = ref({
  url: ''
})

const isLoading = ref(false)
const response = ref('')
const showUrlError = ref(false)
const { checkAndConsumeCredit, showUpgradeModal } = useCredits()

// Add validation states
const validationStates = ref({
  url: {
    dirty: false,
    valid: false,
    error: ''
  }
})

// Update URL validation function
const validateUrl = (url) => {
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  
  if (!url) {
    return { valid: false, error: 'URL is required' }
  }
  if (!urlPattern.test(url)) {
    return { valid: false, error: 'Please enter a valid URL' }
  }
  return { valid: true, error: '' }
}

// Add validation handler
const handleUrlInput = () => {
  validationStates.value.url.dirty = true
  const { valid, error } = validateUrl(formData.value.url)
  validationStates.value.url.valid = valid
  validationStates.value.url.error = error
}

const handleUpgrade = () => {
  showUpgradeModal.value = false
  // Implement upgrade logic
}

const analyzeLandingPage = async () => {
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
    const res = await fetch('/api/landing-page', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to analyze landing page')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  // Reset validation state
  validationStates.value.url.dirty = true
  validationStates.value.url.error = ''
  validationStates.value.url.valid = false

  // Validate URL
  const { valid, error } = validateUrl(formData.value.url)
  validationStates.value.url.valid = valid
  validationStates.value.url.error = error
  
  if (!valid) return
  
  await analyzeLandingPage()
}
</script> 