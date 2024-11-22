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
        <span class="text-neutral-900">Analyzing internal links...</span>
      </div>
    </div>

    <!-- Upgrade Modal -->
    <div 
      v-if="showUpgradeModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white p-8 rounded-2xl border border-stone-200 shadow-xl max-w-md w-full mx-4">
        <div class="text-center">
          <div class="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="ph:warning-duotone" class="text-3xl text-neutral-900" />
          </div>
          <h3 class="text-xl font-bold text-neutral-900 mb-2">No Credits Remaining</h3>
          <p class="text-neutral-600 mb-6">
            Upgrade to our Lifetime Pro plan to get unlimited generations and premium features.
          </p>
          <div class="space-y-3">
            <button
              @click="handleUpgrade"
              class="w-full py-3 px-4 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-200 font-medium"
            >
              Upgrade to Pro
            </button>
            <button
              @click="showUpgradeModal = false"
              class="w-full py-3 px-4 bg-stone-100 text-neutral-700 rounded-xl hover:bg-stone-200 transition-all duration-200 font-medium"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>

    <form @submit.prevent="analyzeBlogForLinks" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Internal Links Optimizer</h3>
        <p class="text-neutral-600">Optimize your content's internal linking structure using AI</p>
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
            :class="{ 'border-red-300': showProductError }"
            placeholder="Enter your blog content..."
            @input="showProductError = false"
            required
          />
          <p v-if="showProductError" class="mt-2 text-sm text-red-600">
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
        {{ isProcessing ? 'Analyzing...' : 'Analyze & Suggest Links' }}
      </button>
    </form>

    <div v-if="suggestions.length" class="mt-8 space-y-8">
      <SuggestedLinks 
        :suggestions="suggestions" 
        @clear="clearResults"
        @regenerate="analyzeBlogForLinks"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUrlValidation } from '~/composables/useUrlValidation'
import { useCredits } from '~/composables/useCredits'
import SuggestedLinks from '~/components/SuggestedLinks.vue'

interface Suggestion {
  originalText: string
  targetUrl: string
  relevanceScore: number
  contextMatch: number
  reason: string
}

const blogContent = ref('')
const sitemapUrl = ref('')
const isProcessing = ref(false)
const error = ref('')
const suggestions = ref<Suggestion[]>([])
const showProductError = ref(false)
const showUrlError = ref(false)

const { validateUrl } = useUrlValidation()
const { checkAndConsumeCredit, showUpgradeModal } = useCredits()

const isValidInputs = computed(() => {
  return blogContent.value.length > 100 && validateUrl(sitemapUrl.value)
})

const handleUpgrade = () => {
  showUpgradeModal.value = false
  // Implement upgrade logic
}

async function analyzeBlogForLinks() {
  // Reset errors
  showProductError.value = false
  showUrlError.value = false

  // Validate inputs
  if (!blogContent.value || blogContent.value.length <= 100) {
    showProductError.value = true
  }
  if (!sitemapUrl.value || !validateUrl(sitemapUrl.value)) {
    showUrlError.value = true
  }

  if (showProductError.value || showUrlError.value) {
    return
  }

  isProcessing.value = true
  suggestions.value = []
  error.value = ''

  try {
    // Check credits first
    const canProceed = await checkAndConsumeCredit()
    if (!canProceed) {
      isProcessing.value = false
      return
    }

    const response = await $fetch('/api/internal-links', {
      method: 'POST',
      body: {
        blogContent: blogContent.value,
        sitemapUrl: sitemapUrl.value
      }
    })

    if (response.success) {
      suggestions.value = response.data.suggestions
      console.log('Received suggestions:', suggestions.value)
    } else {
      throw new Error(response.message || 'Failed to generate suggestions')
    }
  } catch (e: any) {
    error.value = e.message || 'An error occurred while analyzing'
    console.error('Error in analyzeBlogForLinks:', e)
  } finally {
    isProcessing.value = false
  }
}

// Add clear function
const clearResults = () => {
  suggestions.value = []
}
</script> 