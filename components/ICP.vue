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
        <span class="text-neutral-900">Generating ICP...</span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Generate Your ICP</h3>
        <p class="text-neutral-600">Fill in the details below to create a comprehensive Ideal Customer Profile.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Product Description
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Tell us about your product and its main features
            </span>
          </label>
          <textarea
            v-model="formData.productDescription"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            :class="{ 'border-red-300': showProductError }"
            placeholder="e.g., A SaaS platform that helps e-commerce businesses..."
            @input="showProductError = false"
            required
          ></textarea>
          <!-- Error Message -->
          <p v-if="showProductError" class="mt-2 text-sm text-red-600">
            Please provide a product description
          </p>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Target Market
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Describe your target market
            </span>
          </label>
          <textarea
            v-model="formData.targetMarket"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            :class="{ 'border-red-300': showMarketError }"
            placeholder="e.g., Mid-sized e-commerce businesses..."
            @input="showMarketError = false"
            required
          ></textarea>
          <!-- Error Message -->
          <p v-if="showMarketError" class="mt-2 text-sm text-red-600">
            Please describe your target market
          </p>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:hover:bg-sky-500"
        :disabled="isLoading"
      >
        <Icon name="ph:user-duotone" class="text-xl" />
        {{ isLoading ? 'Generating...' : 'Generate ICP' }}
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="generateICP"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'
import { useCredits } from '~/composables/useCredits'

const formData = ref({
  productDescription: '',
  targetMarket: ''
})

const isLoading = ref(false)
const response = ref('')
const showProductError = ref(false)
const showMarketError = ref(false)
const { checkAndConsumeCredit, showUpgradeModal } = useCredits()

const handleSubmit = async () => {
  // Reset errors
  showProductError.value = false
  showMarketError.value = false

  // Validate inputs
  if (!formData.value.productDescription) {
    showProductError.value = true
  }
  if (!formData.value.targetMarket) {
    showMarketError.value = true
  }

  if (!formData.value.productDescription || !formData.value.targetMarket) {
    return
  }
  
  await generateICP()
}

const generateICP = async () => {
  if (!formData.value.productDescription || !formData.value.targetMarket) return
  
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
    const res = await fetch('/api/icp', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to generate ICP')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}
</script> 