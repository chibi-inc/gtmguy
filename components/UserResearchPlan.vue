<template>
  <div class="max-w-2xl mx-auto">
    <form @submit.prevent="generateResearchPlan" class="space-y-8">
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Problem
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              What problem are you trying to research?
            </span>
          </label>
          <textarea
            v-model="formData.problem"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Understanding why users abandon our product during the onboarding process..."
          ></textarea>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Target Market
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Who do you want to research?
            </span>
          </label>
          <textarea
            v-model="formData.targetMarket"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., New users who signed up in the last 30 days and completed less than 50% of onboarding..."
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base"
        :disabled="isLoading"
      >
        <Icon v-if="!isLoading" name="ph:magnifying-glass-duotone" class="text-xl" />
        <Icon v-else name="ph:circle-notch-duotone" class="text-xl animate-spin" />
        {{ isLoading ? 'Generating...' : 'Generate Research Plan' }}
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
  problem: '',
  targetMarket: ''
})

const isLoading = ref(false)
const response = ref('')
const copied = ref(false)

const markdownToHtml = (markdown) => {
  return marked(markdown)
}

const generateResearchPlan = async () => {
  isLoading.value = true
  response.value = ''
  
  try {
    const res = await fetch('/api/research-plan', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to generate Research Plan')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error generating Research Plan:', error)
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