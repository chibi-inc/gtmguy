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
        <span class="text-neutral-900">Generating Copy...</span>
      </div>
    </div>

    <form @submit.prevent="generateCopy" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Generate Marketing Copy</h3>
        <p class="text-neutral-600">Fill in the details below to create targeted, engaging copy variations.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Product Details
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Describe your product's features and benefits
            </span>
          </label>
          <textarea
            v-model="formData.productDetails"
            rows="4"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., An AI-powered social media management tool with automated scheduling, content suggestions, and analytics dashboard..."
          ></textarea>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Target Customer
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Describe who this copy is targeting
            </span>
          </label>
          <textarea
            v-model="formData.targetCustomer"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Small business owners aged 30-45 who are tech-savvy and value efficiency..."
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70"
        :disabled="isLoading || !formData.productDetails || !formData.targetCustomer"
      >
        <Icon name="ph:pencil-duotone" class="text-xl" />
        Generate Copy
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

const formData = ref({
  productDetails: '',
  targetCustomer: ''
})

const isLoading = ref(false)
const response = ref('')

const generateCopy = async () => {
  if (!formData.value.productDetails || !formData.value.targetCustomer) return
  
  isLoading.value = true
  response.value = ''
  
  try {
    const res = await fetch('/api/copy-generator', {
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
    console.error('Error generating copy:', error)
  } finally {
    isLoading.value = false
  }
}
</script> 