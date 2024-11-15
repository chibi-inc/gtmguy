<template>
  <div class="max-w-2xl mx-auto">
    <form @submit.prevent="generateMetrics" class="space-y-8">
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200">
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
        
        <div class="bg-white p-6 rounded-xl border border-stone-200">
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

        <div class="bg-white p-6 rounded-xl border border-stone-200">
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
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base"
        :disabled="isLoading"
      >
        <Icon v-if="!isLoading" name="ph:chart-line-up-duotone" class="text-xl" />
        <Icon v-else name="ph:circle-notch-duotone" class="text-xl animate-spin" />
        {{ isLoading ? 'Generating...' : 'Generate Metrics & KPIs' }}
      </button>
    </form>

    <!-- Response Section -->
    <div v-if="response" class="mt-8 space-y-6">
      <div class="border-t border-stone-200 pt-8">
        <div class="prose prose-stone max-w-none">
          <div v-html="markdownToHtml(response)"></div>
        </div>
      </div>
      
      <div class="flex justify-end gap-4">
        <button
          @click="copyToClipboard"
          class="px-4 py-2 text-neutral-600 hover:text-neutral-900 flex items-center gap-2"
        >
          <Icon :name="copied ? 'ph:check-duotone' : 'ph:copy-duotone'" class="text-lg" />
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
        <button
          @click="downloadPDF"
          class="px-4 py-2 text-neutral-600 hover:text-neutral-900 flex items-center gap-2"
        >
          <Icon name="ph:download-duotone" class="text-lg" />
          Download PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { marked } from 'marked'

const formData = ref({
  businessGoal: '',
  keyActivities: '',
  timeFrame: ''
})

const isLoading = ref(false)
const response = ref('')
const copied = ref(false)

const markdownToHtml = (markdown) => {
  return marked(markdown)
}

const generateMetrics = async () => {
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

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(response.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const downloadPDF = () => {
  // Implement PDF download functionality
  console.log('Downloading PDF...')
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