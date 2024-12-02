<template>
  <div class="max-w-3xl mx-auto">
    <!-- ... loading overlay and upgrade modal remain the same ... -->

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Conversion Optimizer</h3>
        <p class="text-neutral-600">Enter your page URL to get comprehensive optimization recommendations.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Page URL
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Enter the full URL of the page you want to analyze
            </span>
          </label>
          <input
            v-model="formData.url"
            type="url"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none"
            :class="{ 'border-red-300': showError }"
            placeholder="e.g., https://example.com/page"
            @input="showError = false"
            required
          />
          <!-- Error Message -->
          <p v-if="showError" class="mt-2 text-sm text-red-600">
            Please enter a valid URL
          </p>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:hover:bg-sky-500"
        :disabled="isLoading"
      >
        <Icon name="ph:chart-line-up-duotone" class="text-xl" />
        {{ isLoading ? 'Analyzing...' : 'Analyze Page' }}
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="analyzePage"
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

const emit = defineEmits(['updateCredits'])

const isLoading = ref(false)
const response = ref('')
const showError = ref(false)
const { checkAndConsumeCredit  } = useCredits()

const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const handleSubmit = async () => {
  if (!formData.value.url || !isValidUrl(formData.value.url)) {
    showError.value = true
    return
  }
  
  await analyzePage()
}

const analyzePage = async () => {
  isLoading.value = true
  response.value = ''
  
  try {
    // Check credits first
    const canProceed = await checkAndConsumeCredit()
    if (!canProceed) {
      isLoading.value = false
      return
    }
    emit('updateCredits')

    // If credit check passes, proceed with generation
    const res = await fetch('/api/landing-page', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to analyze page')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}
</script> 