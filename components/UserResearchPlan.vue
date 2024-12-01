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
        <span class="text-neutral-900">Generating Research Plan...</span>
      </div>
    </div>



    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Generate Research Plan</h3>
        <p class="text-neutral-600">Fill in the details below to create a comprehensive user research plan.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Research Objectives
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              What do you want to learn about your users?
            </span>
          </label>
          <textarea
            v-model="formData.objectives"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            :class="{ 'border-red-300': showObjectivesError }"
            placeholder="e.g., Understand how users currently manage their tasks and what pain points they face..."
            @input="showObjectivesError = false"
            required
          ></textarea>
          <!-- Error Message -->
          <p v-if="showObjectivesError" class="mt-2 text-sm text-red-600">
            Please specify your research objectives
          </p>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Target Users
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Who are you researching?
            </span>
          </label>
          <textarea
            v-model="formData.targetUsers"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            :class="{ 'border-red-300': showUsersError }"
            placeholder="e.g., Product managers in tech companies who manage multiple projects..."
            @input="showUsersError = false"
            required
          ></textarea>
          <!-- Error Message -->
          <p v-if="showUsersError" class="mt-2 text-sm text-red-600">
            Please describe your target users
          </p>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:hover:bg-sky-500"
        :disabled="isLoading"
      >
        <Icon name="ph:magnifying-glass-duotone" class="text-xl" />
        {{ isLoading ? 'Generating...' : 'Generate Research Plan' }}
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="generateResearchPlan"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'
import { useCredits } from '~/composables/useCredits'


const formData = ref({
  objectives: '',
  targetUsers: ''
})

const isLoading = ref(false)
const response = ref('')
const showObjectivesError = ref(false)
const showUsersError = ref(false)
const { checkAndConsumeCredit  } = useCredits()

const handleSubmit = async () => {
  // Reset errors
  showObjectivesError.value = false
  showUsersError.value = false

  // Validate inputs
  if (!formData.value.objectives) {
    showObjectivesError.value = true
  }
  if (!formData.value.targetUsers) {
    showUsersError.value = true
  }

  if (!formData.value.objectives || !formData.value.targetUsers) {
    return
  }
  
  await generateResearchPlan()
}

const generateResearchPlan = async () => {
  isLoading.value = true
  response.value = ''
  
  try {
    // Check credits first
    const canProceed = await checkAndConsumeCredit()
    if (!canProceed) {
      isLoading.value = false
      return
    }

    // If credit check passes, proceed with generation
    const res = await fetch('/api/research-plan', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to generate research plan')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error:', error)
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