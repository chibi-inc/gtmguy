<template>
  <div class="max-w-2xl mx-auto">
    <form @submit.prevent="generateJourney" class="space-y-8">
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            User Description
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Tell us about your typical user
            </span>
          </label>
          <textarea
            v-model="formData.userDescription"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Marketing manager at a mid-sized tech company, responsible for digital campaigns..."
          ></textarea>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Main Touchpoints
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              List the key interaction points with your product
            </span>
          </label>
          <textarea
            v-model="formData.mainTouchpoints"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Website discovery, Free trial signup, Onboarding email sequence, First project creation..."
          ></textarea>
        </div>

        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Goals
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              What are the user's main objectives?
            </span>
          </label>
          <textarea
            v-model="formData.goals"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Streamline campaign planning, Improve team collaboration, Track ROI more effectively..."
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base"
        :disabled="isLoading"
      >
        <Icon v-if="!isLoading" name="ph:map-trifold-duotone" class="text-xl" />
        <Icon v-else name="ph:circle-notch-duotone" class="text-xl animate-spin" />
        {{ isLoading ? 'Generating...' : 'Generate Journey Map' }}
      </button>
    </form>

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
  userDescription: '',
  mainTouchpoints: '',
  goals: ''
})

const isLoading = ref(false)
const response = ref('')
const copied = ref(false)

const markdownToHtml = (markdown) => {
  return marked(markdown)
}

const generateJourney = async () => {
  isLoading.value = true
  response.value = ''
  
  try {
    const res = await fetch('/api/journey', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to generate User Journey Map')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error generating User Journey Map:', error)
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