<template>
  <div class="max-w-2xl mx-auto">
    <form @submit.prevent="generatePrioritization" class="space-y-8">
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200">
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
        
        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Prioritization Method
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Choose the framework for prioritization
            </span>
          </label>
          <select
            v-model="formData.method"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none py-2.5"
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
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base"
        :disabled="isLoading"
      >
        <Icon v-if="!isLoading" name="ph:list-numbers-duotone" class="text-xl" />
        <Icon v-else name="ph:circle-notch-duotone" class="text-xl animate-spin" />
        {{ isLoading ? 'Generating...' : 'Generate Prioritization' }}
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
  items: '',
  method: 'RICE' // Default method
})

const isLoading = ref(false)
const response = ref('')
const copied = ref(false)

const markdownToHtml = (markdown) => {
  return marked(markdown)
}

const generatePrioritization = async () => {
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