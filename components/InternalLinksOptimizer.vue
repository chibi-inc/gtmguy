<template>
  <div class="max-w-2xl mx-auto">
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
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none"
            :class="{
              'border-red-300': validationStates.content.error,
              'border-green-300': validationStates.content.dirty && validationStates.content.valid
            }"
            placeholder="Enter your blog content..."
            @input="handleContentInput"
            @blur="handleContentBlur"
            required
          />
          <p 
            v-if="validationStates.content.error" 
            class="mt-2 text-sm text-red-600"
          >
            {{ validationStates.content.error }}
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
            :class="{
              'border-red-300': validationStates.url.error,
              'border-green-300': validationStates.url.dirty && validationStates.url.valid
            }"
            placeholder="https://example.com/sitemap.xml"
            @input="handleUrlInput"
            @blur="handleUrlBlur"
            required
          />
          <p 
            v-if="validationStates.url.error" 
            class="mt-2 text-sm text-red-600"
          >
            {{ validationStates.url.error }}
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

    <!-- Results Section -->
    <div v-if="suggestions.length" class="mt-8">
      <BaseDivider class="my-6" />
      
      <div class="space-y-6">
        <h3 class="text-xl font-semibold text-gray-900">Suggested Internal Links</h3>
        
        <div v-for="(suggestion, index) in suggestions" 
             :key="index"
             class="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors duration-200">
          <div class="space-y-3">
            <div>
              <div class="font-medium text-gray-700">Original Text:</div>
              <div class="text-gray-600 mt-1 text-sm">"{{ suggestion.originalText }}"</div>
            </div>
            
            <div>
              <div class="font-medium text-gray-700">Suggested Link:</div>
              <a :href="suggestion.targetUrl"
                 target="_blank"
                 class="text-blue-600 hover:text-blue-800 text-sm mt-1 block">
                {{ suggestion.targetUrl }}
              </a>
            </div>

            <div>
              <div class="font-medium text-gray-700">Reason:</div>
              <div class="text-gray-600 mt-1 text-sm">{{ suggestion.reason }}</div>
            </div>

            <div class="flex items-center justify-between">
              <BaseChip>Relevance: {{ suggestion.relevanceScore }}%</BaseChip>
              <BaseChip>Context Match: {{ suggestion.contextMatch }}%</BaseChip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUrlValidation } from '~/composables/useUrlValidation'
import { useCredits } from '~/composables/useCredits'

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

const { validateUrl } = useUrlValidation()
const { checkAndConsumeCredit, showUpgradeModal } = useCredits()

const isValidInputs = computed(() => {
  return blogContent.value.length > 100 && validateUrl(sitemapUrl.value)
})

// Add validation states
const validationStates = ref({
  content: {
    dirty: false,
    valid: false,
    error: ''
  },
  url: {
    dirty: false,
    valid: false,
    error: ''
  }
})

// Add validation handlers
const handleContentInput = () => {
  validationStates.value.content.dirty = true
  validationStates.value.content.valid = blogContent.value.length > 100
  validationStates.value.content.error = blogContent.value.length <= 100 ? 'Content must be at least 100 characters' : ''
}

const handleContentBlur = () => {
  if (!validationStates.value.content.dirty) {
    validationStates.value.content.dirty = true
    handleContentInput()
  }
}

const handleUrlInput = () => {
  validationStates.value.url.dirty = true
  const { valid, error } = validateUrl(sitemapUrl.value)
  validationStates.value.url.valid = valid
  validationStates.value.url.error = error
}

const handleUrlBlur = () => {
  if (!validationStates.value.url.dirty) {
    validationStates.value.url.dirty = true
    handleUrlInput()
  }
}

const handleUpgrade = () => {
  showUpgradeModal.value = false
  // Implement upgrade logic
}

async function analyzeBlogForLinks() {
  if (!await checkAndConsumeCredit()) {
    showUpgradeModal.value = true
    return
  }

  try {
    isProcessing.value = true
    error.value = ''
    
    const response = await $fetch('/api/internal-links', {
      method: 'POST',
      body: {
        blogContent: blogContent.value,
        sitemapUrl: sitemapUrl.value
      }
    })

    if (response.success) {
      suggestions.value = response.data.suggestions
      console.log('Received suggestions:', suggestions.value) // Debug log
    } else {
      throw new Error(response.message || 'Failed to generate suggestions')
    }
  } catch (e: any) {
    error.value = e.message || 'An error occurred while analyzing'
    console.error('Error in analyzeBlogForLinks:', e) // Debug log
  } finally {
    isProcessing.value = false
  }
}
</script> 