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
        <span class="text-neutral-900">Optimizing Copy...</span>
      </div>
    </div>

    <form @submit.prevent="generateOptimizedCopy" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Optimize Your Copy</h3>
        <p class="text-neutral-600">Fill in the details below to create targeted, engaging copy.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Original Copy
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Enter the copy you want to optimize
            </span>
          </label>
          <textarea
            v-model="formData.originalCopy"
            rows="4"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Our software helps businesses manage their tasks better..."
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
        :disabled="isLoading || !formData.originalCopy || !formData.targetCustomer"
      >
        <Icon name="ph:pencil-duotone" class="text-xl" />
        Optimize Copy
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="generateOptimizedCopy"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'

const formData = ref({
  originalCopy: '',
  targetCustomer: ''
})

const isLoading = ref(false)
const response = ref('')

const generateOptimizedCopy = async () => {
  if (!formData.value.originalCopy || !formData.value.targetCustomer) return
  
  isLoading.value = true
  response.value = ''
  
  try {
    const res = await fetch('/api/copy-optimizer', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to optimize copy')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error optimizing copy:', error)
  } finally {
    isLoading.value = false
  }
}
</script> 