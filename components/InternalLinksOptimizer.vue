<template>
  <div class="max-w-3xl mx-auto">
    <!-- Loading Overlay -->
    <div 
      v-if="isProcessing"
      class="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl border border-stone-200 shadow-lg flex items-center gap-4">
        <div class="animate-spin text-sky-500">
          <Icon name="ph:circle-notch-duotone" class="text-2xl" />
        </div>
        <span class="text-neutral-900">{{ processingMessage }}</span>
      </div>
    </div>

    <form @submit.prevent="analyzeBlogForLinks" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Internal Link Builder</h3>
        <p class="text-neutral-600">Build your content's internal linking structure using AI</p>
      </div>

      <div class="space-y-6">
        <!-- Blog Content Input -->
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Blog Content
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Paste your blog content here
            </span>
          </label>
          <textarea
            v-model="blogContent"
            rows="6"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            :class="{ 'border-red-300': showBlogError }"
            placeholder="Enter your blog content..."
            @input="showBlogError = false"
            required
          />
          <p v-if="showBlogError" class="mt-2 text-sm text-red-600">
            Please provide blog content (minimum 100 characters)
          </p>
        </div>

        <!-- Sitemap URL Input -->
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Sitemap URL
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Enter your website's sitemap URL
            </span>
          </label>
          <input
            v-model="sitemapUrl"
            type="url"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none"
            :class="{ 'border-red-300': showUrlError }"
            placeholder="https://example.com/sitemap.xml"
            @input="showUrlError = false"
            required
          />
          <p v-if="showUrlError" class="mt-2 text-sm text-red-600">
            Please provide a valid sitemap URL
          </p>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:hover:bg-sky-500"
        :disabled="isProcessing || !isValidInputs"
      >
        <Icon name="ph:link-duotone" class="text-xl" />
        {{ isProcessing ? processingMessage : 'Analyze & Build Links' }}
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection
      v-if="response"
      :content="response"
      @clear="clearResponse"
      @regenerate="analyzeBlogForLinks"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCredits } from '~/composables/useCredits'
import ResponseSection from '~/components/common/ResponseSection.vue'

const blogContent = ref('')
const sitemapUrl = ref('')
const isProcessing = ref(false)
const processingMessage = ref('Analyzing content...')
const error = ref('')
const response = ref('')
const showBlogError = ref(false)
const showUrlError = ref(false)
const emit = defineEmits(['updateCredits'])

const { checkAndConsumeCredit } = useCredits()

const isValidInputs = computed(() => {
  return blogContent.value.length > 100 && 
         sitemapUrl.value.startsWith('http') && 
         sitemapUrl.value.includes('.xml')
})

async function analyzeBlogForLinks() {
  // Reset states
  showBlogError.value = false
  showUrlError.value = false
  error.value = ''
  response.value = ''

  // Validate inputs
  if (!blogContent.value || blogContent.value.length <= 100) {
    showBlogError.value = true
    return
  }
  if (!sitemapUrl.value || !sitemapUrl.value.startsWith('http')) {
    showUrlError.value = true
    return
  }

  isProcessing.value = true
  processingMessage.value = 'Fetching sitemap...'

  try {
    // Check credits first
    const canProceed = await checkAndConsumeCredit()
    if (!canProceed) {
      isProcessing.value = false
      return
    }
    emit('updateCredits')

    processingMessage.value = 'Analyzing content and building links...'

    const apiResponse = await $fetch('/api/internal-links', {
      method: 'POST',
      body: {
        blogContent: blogContent.value,
        sitemapUrl: sitemapUrl.value
      }
    })

    if (apiResponse.success) {
      response.value = apiResponse.data.enhancedContent
    } else {
      throw new Error(apiResponse.message || 'Failed to enhance content')
    }
  } catch (e: any) {
    error.value = e.message || 'An error occurred while processing'
    console.error('Error:', e)
  } finally {
    isProcessing.value = false
    processingMessage.value = 'Analyzing content...'
  }
}

function clearResponse() {
  response.value = ''
}
</script> 