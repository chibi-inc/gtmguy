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
        <span class="text-neutral-900">Generating Prioritization...</span>
      </div>
    </div>

    <form @submit.prevent="generatePrioritization" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Generate Prioritization</h3>
        <p class="text-neutral-600">Fill in the details below to prioritize your items using the selected framework.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Items to Prioritize
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              List the items you want to prioritize (one per line)
            </span>
          </label>
          <textarea
            v-model="formData.items"
            rows="5"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g.,
1. Implement single sign-on
2. Add export to PDF feature
3. Redesign dashboard
4. Add mobile app support
5. Implement team collaboration features"
          ></textarea>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Prioritization Method
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Choose the framework for prioritization
            </span>
          </label>
          <select
            v-model="formData.method"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none py-2.5 px-3"
          >
            <option value="RICE">RICE (Reach, Impact, Confidence, Effort)</option>
            <option value="MOSCOW">MoSCoW (Must, Should, Could, Won't)</option>
            <option value="VALUE_EFFORT">Value vs Effort Matrix</option>
            <option value="KANO">Kano Model</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70"
        :disabled="isLoading || !formData.items || !formData.method"
      >
        <Icon name="ph:list-numbers-duotone" class="text-xl" />
        Generate Prioritization
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="generatePrioritization"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'

const formData = ref({
  items: '',
  method: 'RICE' // Default method
})

const isLoading = ref(false)
const response = ref('')

const generatePrioritization = async () => {
  if (!formData.value.items || !formData.value.method) return
  
  isLoading.value = true
  response.value = ''
  
  try {
    const res = await fetch('/api/prioritization', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to generate Prioritization')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error generating Prioritization:', error)
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