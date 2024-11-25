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
        <span class="text-neutral-900">Analyzing SEO...</span>
      </div>
    </div>

    <!-- Upgrade Modal -->
    <UpgradeModal v-if="showUpgradeModal" @close="showUpgradeModal = false" />

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">SEO Optimizer</h3>
        <p class="text-neutral-600">Enter your page URL to get comprehensive SEO recommendations.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Website URL
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Enter the full URL of your website
            </span>
          </label>
          <input
            v-model="formData.url"
            type="url"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none"
            :class="{
              'border-red-300': validationStates.url.error,
              'border-green-300': validationStates.url.dirty && validationStates.url.valid
            }"
            placeholder="e.g., https://example.com"
            @input="handleUrlInput"
            @blur="handleUrlBlur"
            required
          />
          <!-- Error Message -->
          <p 
            v-if="validationStates.url.error" 
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
        <Icon name="ph:google-logo-duotone" class="text-xl" />
        {{ isLoading ? 'Analyzing...' : 'Analyze SEO' }}
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="analyzeSeo"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'
import { useCredits } from '~/composables/useCredits'
import { useUrlValidation } from '~/composables/useUrlValidation'
import UpgradeModal from '~/components/common/UpgradeModal.vue'

const formData = ref({
  url: ''
})

const isLoading = ref(false)
const response = ref('')
const showError = ref(false)
const { checkAndConsumeCredit, showUpgradeModal } = useCredits()
const { validateUrl } = useUrlValidation()

// Validation states
const validationStates = ref({
  url: {
    dirty: false,
    valid: false,
    error: ''
  }
})

const handleUrlInput = () => {
  validationStates.value.url.dirty = true
  const { valid, error } = validateUrl(formData.value.url)
  validationStates.value.url.valid = valid
  validationStates.value.url.error = error
}

const handleUrlBlur = () => {
  if (!validationStates.value.url.dirty) {
    validationStates.value.url.dirty = true
    const { valid, error } = validateUrl(formData.value.url)
    validationStates.value.url.valid = valid
    validationStates.value.url.error = error
  }
}

const handleSubmit = async () => {
  // Validate URL before submission
  const { valid, error } = validateUrl(formData.value.url)
  validationStates.value.url.valid = valid
  validationStates.value.url.error = error
  validationStates.value.url.dirty = true
  
  if (!valid) return
  
  await analyzeSeo()
}

const analyzeSeo = async () => {
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
    const res = await fetch('/api/seo-optimizer', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to analyze SEO')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}
</script> 