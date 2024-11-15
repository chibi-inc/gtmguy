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
        <span class="text-neutral-900">Generating Metrics & KPIs...</span>
      </div>
    </div>

    <form @submit.prevent="generateMetrics" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Generate Metrics & KPIs</h3>
        <p class="text-neutral-600">Fill in the details below to create a comprehensive metrics framework.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Primary Business Goal
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              What is your main business objective?
            </span>
          </label>
          <textarea
            v-model="formData.businessGoal"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Increase market share in the enterprise segment by 30% within the next year..."
          ></textarea>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Key Activities
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              List the main activities you want to measure
            </span>
          </label>
          <textarea
            v-model="formData.keyActivities"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., User acquisition, Feature adoption, Customer retention, Sales conversion..."
          ></textarea>
        </div>

        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            TimeFrame
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              What period do you want to measure?
            </span>
          </label>
          <input
            type="text"
            v-model="formData.timeFrame"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none"
            placeholder="e.g., Q2 2024, Next 6 months, Annual 2024"
          />
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70"
        :disabled="isLoading || !formData.businessGoal || !formData.keyActivities || !formData.timeFrame"
      >
        <Icon name="ph:chart-line-up-duotone" class="text-xl" />
        Generate Metrics & KPIs
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="generateMetrics"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'

const formData = ref({
  businessGoal: '',
  keyActivities: '',
  timeFrame: ''
})

const isLoading = ref(false)
const response = ref('')

const generateMetrics = async () => {
  if (!formData.value.businessGoal || !formData.value.keyActivities || !formData.value.timeFrame) return
  
  isLoading.value = true
  response.value = ''
  
  try {
    const res = await fetch('/api/metrics', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to generate Metrics & KPIs')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error generating Metrics & KPIs:', error)
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