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
        <span class="text-neutral-900">Generating SWOT Analysis...</span>
      </div>
    </div>

    <form @submit.prevent="generateSWOT" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Generate SWOT Analysis</h3>
        <p class="text-neutral-600">Fill in the details below to create a comprehensive SWOT analysis.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Product Description
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Tell us about your product and its key features
            </span>
          </label>
          <textarea
            v-model="formData.productDescription"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., An AI-powered content management system for digital publishers..."
          ></textarea>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Target Market
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Describe your market and competitive landscape
            </span>
          </label>
          <textarea
            v-model="formData.targetMarket"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Online news outlets and digital magazines competing with traditional media..."
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70"
        :disabled="isLoading || !formData.productDescription || !formData.targetMarket"
      >
        <Icon name="ph:chart-pie-slice-duotone" class="text-xl" />
        Generate SWOT Analysis
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="generateSWOT"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'

const formData = ref({
  productDescription: '',
  targetMarket: ''
})

const isLoading = ref(false)
const response = ref('')

const generateSWOT = async () => {
  if (!formData.value.productDescription || !formData.value.targetMarket) return
  
  isLoading.value = true
  response.value = ''
  
  try {
    const res = await fetch('/api/swot', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to generate SWOT Analysis')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error generating SWOT Analysis:', error)
  } finally {
    isLoading.value = false
  }
}
</script> 