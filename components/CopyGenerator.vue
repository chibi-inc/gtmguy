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
        <span class="text-neutral-900">Generating Copy...</span>
      </div>
    </div>

    <UpgradeModal v-if="showUpgradeModal" @close="showUpgradeModal = false" />
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Generate Marketing Copy</h3>
        <p class="text-neutral-600">Fill in the details below to create compelling marketing copy.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Product Description
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Describe your product and its key benefits
            </span>
          </label>
          <textarea
            v-model="formData.productDetails"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            :class="{ 'border-red-300': showDescriptionError }"
            placeholder="e.g., A productivity app that helps remote teams collaborate better..."
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
            Target Audience
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Who is this copy for?
            </span>
          </label>
          <textarea
            v-model="formData.targetCustomer"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            :class="{ 'border-red-300': showAudienceError }"
            placeholder="e.g., Remote tech teams looking to improve their collaboration..."
            @input="showAudienceError = false"
            required
          ></textarea>
          <!-- Error Message -->
          <p v-if="showAudienceError" class="mt-2 text-sm text-red-600">
            Please specify your target audience
          </p>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:hover:bg-sky-500"
        :disabled="isLoading"
      >
        <Icon name="ph:pencil-duotone" class="text-xl" />
        {{ isLoading ? 'Generating...' : 'Generate Copy' }}
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="generateCopy"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'
import { useCredits } from '~/composables/useCredits'
import UpgradeModal from '~/components/common/UpgradeModal.vue'

const formData = ref({
  productDetails: '',
  targetCustomer: ''
})

const isLoading = ref(false)
const response = ref('')
const showDescriptionError = ref(false)
const showAudienceError = ref(false)
const { checkAndConsumeCredit, showUpgradeModal } = useCredits()


const handleSubmit = async () => {
  // Reset errors
  showDescriptionError.value = false
  showAudienceError.value = false

  // Validate inputs
  if (!formData.value.productDetails) {
    showDescriptionError.value = true
  }
  if (!formData.value.targetCustomer) {
    showAudienceError.value = true
  }

  if (!formData.value.productDetails || !formData.value.targetCustomer) {
    return
  }
  
  await generateCopy()
}

const generateCopy = async () => {
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
    const res = await fetch('/api/copy', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to generate copy')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}
</script> 