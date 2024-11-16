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
        <span class="text-neutral-900">Generating PRD...</span>
      </div>
    </div>

    <form @submit.prevent="generatePRD" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Generate PRD</h3>
        <p class="text-neutral-600">Fill in the details below to create a comprehensive Product Requirements Document.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Product Vision
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Describe your product vision and goals
            </span>
          </label>
          <textarea
            v-model="formData.productVision"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., To revolutionize team collaboration by providing an AI-powered platform that streamlines communication..."
          ></textarea>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Target Users
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Who will be using this product?
            </span>
          </label>
          <textarea
            v-model="formData.targetUsers"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Remote teams in tech companies, project managers, team leads, and individual contributors..."
          ></textarea>
        </div>

        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Key Features
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              List the main features and functionality
            </span>
          </label>
          <textarea
            v-model="formData.keyFeatures"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., 1. Real-time collaboration, 2. AI-powered task automation, 3. Advanced analytics dashboard..."
          ></textarea>
        </div>

        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Constraints
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Technical, business, or resource constraints
            </span>
          </label>
          <textarea
            v-model="formData.constraints"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Must be compliant with GDPR, should work on low-bandwidth connections, development timeline of 6 months..."
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70"
        :disabled="isLoading || !isFormValid"
      >
        <Icon name="ph:file-text-duotone" class="text-xl" />
        Generate PRD
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="generatePRD"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'

const formData = ref({
  productVision: '',
  targetUsers: '',
  keyFeatures: '',
  constraints: ''
})

const isLoading = ref(false)
const response = ref('')

const isFormValid = computed(() => {
  return formData.value.productVision && 
         formData.value.targetUsers && 
         formData.value.keyFeatures && 
         formData.value.constraints
})

const generatePRD = async () => {
  if (!isFormValid.value) return
  
  isLoading.value = true
  response.value = ''
  
  try {
    const res = await fetch('/api/prd', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to generate PRD')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error generating PRD:', error)
  } finally {
    isLoading.value = false
  }
}
</script> 