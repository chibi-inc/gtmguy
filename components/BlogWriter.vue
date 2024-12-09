<template>
  <div class="max-w-3xl mx-auto">
    <!-- Loading Overlay -->
    <div 
      v-if="isLoading"
      class="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl border border-stone-200 shadow-lg flex items-center gap-4">
        <div class="animate-spin text-sky-500">
          <Icon name="ph:circle-notch-duotone" class="text-2xl" />
        </div>
        <span class="text-neutral-900">Generating blog post...</span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Generate SEO-Optimized Blog Post</h3>
        <p class="text-neutral-600">Fill in the details below to create an engaging, SEO-friendly blog post.</p>
      </div>

      <div class="space-y-6">
        <!-- Topic Input -->
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Blog Topic
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              What's the main topic of your blog post?
            </span>
          </label>
          <input
            v-model="formData.topic"
            type="text"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none"
            :class="{ 'border-red-300': showTitleError }"
            placeholder="e.g., How to Improve Customer Retention in SaaS"
            @input="showTitleError = false"
            required
          />
          <p v-if="showTitleError" class="mt-2 text-sm text-red-600">
            Please provide a blog topic
          </p>
        </div>

        <!-- Context Input -->
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Context
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Why are you writing this blog? What's your goal?
            </span>
          </label>
          <textarea
            v-model="formData.context"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            :class="{ 'border-red-300': showContentError }"
            placeholder="e.g., Educating our customers about best practices, positioning our product as a solution..."
            @input="showContentError = false"
            required
          ></textarea>
          <p v-if="showContentError" class="mt-2 text-sm text-red-600">
            Please provide context for the blog
          </p>
        </div>

        <!-- Audience Input -->
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Target Audience
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Who is this blog post for?
            </span>
          </label>
          <textarea
            v-model="formData.audience"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            :class="{ 'border-red-300': showTargetError }"
            placeholder="e.g., SaaS founders and product managers looking to reduce churn..."
            @input="showTargetError = false"
            required
          ></textarea>
          <p v-if="showTargetError" class="mt-2 text-sm text-red-600">
            Please describe your target audience
          </p>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:hover:bg-sky-500"
        :disabled="isLoading"
      >
        <Icon name="ph:article-duotone" class="text-xl" />
        {{ isLoading ? 'Generating...' : 'Generate Blog Post' }}
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="generateBlog"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'
import { useCredits } from '~/composables/useCredits'

const formData = ref({
  topic: '',
  context: '',
  audience: ''
})

const isLoading = ref(false)
const response = ref('')
const showTitleError = ref(false)
const showContentError = ref(false)
const showTargetError = ref(false)
const { checkAndConsumeCredit } = useCredits()
const emit = defineEmits(['updateCredits'])

const handleSubmit = async () => {
  // Reset errors
  showTitleError.value = false
  showContentError.value = false
  showTargetError.value = false

  // Validate inputs
  if (!formData.value.topic) showTitleError.value = true
  if (!formData.value.context) showContentError.value = true
  if (!formData.value.audience) showTargetError.value = true

  if (!formData.value.topic || !formData.value.context || !formData.value.audience) {
    return
  }
  
  await generateBlog()
}

const generateBlog = async () => {
  if (!formData.value.topic || !formData.value.context || !formData.value.audience) return
  
  isLoading.value = true
  response.value = ''
  
  try {
    // Check credits first
    const canProceed = await checkAndConsumeCredit()
    if (!canProceed) {
      isLoading.value = false
      return
    }
    emit('updateCredits')

    const res = await fetch('/api/blog-writer', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to generate blog post')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}
</script> 