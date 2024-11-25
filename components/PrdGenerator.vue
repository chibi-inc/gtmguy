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
        <span class="text-neutral-900">Generating PRD...</span>
      </div>
    </div>

    <!-- Upgrade Modal -->
    <UpgradeModal v-if="showUpgradeModal" @close="showUpgradeModal = false" />


    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Generate PRD</h3>
        <p class="text-neutral-600">Fill in the details below to create a comprehensive Product Requirements Document.</p>
      </div>

      <div class="space-y-6">
        <!-- Product Vision -->
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Product Vision
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Describe your product vision and its main objectives
            </span>
          </label>
          <textarea
            v-model="formData.productVision"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            :class="{ 'border-red-300': errors.productVision }"
            placeholder="e.g., To revolutionize team collaboration through intuitive real-time communication..."
            @input="errors.productVision = false"
            required
          ></textarea>
          <p v-if="errors.productVision" class="mt-2 text-sm text-red-600">
            Please provide a product vision
          </p>
        </div>

        <!-- Target Users -->
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Target Users
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Define your target user segments
            </span>
          </label>
          <textarea
            v-model="formData.targetUsers"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            :class="{ 'border-red-300': errors.targetUsers }"
            placeholder="e.g., Remote teams, project managers, startup founders..."
            @input="errors.targetUsers = false"
            required
          ></textarea>
          <p v-if="errors.targetUsers" class="mt-2 text-sm text-red-600">
            Please define your target users
          </p>
        </div>

        <!-- Key Features -->
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Key Features
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              List the main features you want to include
            </span>
          </label>
          <textarea
            v-model="formData.keyFeatures"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            :class="{ 'border-red-300': errors.keyFeatures }"
            placeholder="e.g., Real-time messaging, file sharing, video calls..."
            @input="errors.keyFeatures = false"
            required
          ></textarea>
          <p v-if="errors.keyFeatures" class="mt-2 text-sm text-red-600">
            Please list your key features
          </p>
        </div>

        <!-- Constraints -->
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Constraints
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              List any technical, business, or resource constraints
            </span>
          </label>
          <textarea
            v-model="formData.constraints"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            :class="{ 'border-red-300': errors.constraints }"
            placeholder="e.g., Budget limitations, technical requirements, timeline constraints..."
            @input="errors.constraints = false"
            required
          ></textarea>
          <p v-if="errors.constraints" class="mt-2 text-sm text-red-600">
            Please specify any constraints
          </p>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:hover:bg-sky-500"
        :disabled="isLoading"
      >
        <Icon name="ph:file-text-duotone" class="text-xl" />
        {{ isLoading ? 'Generating...' : 'Generate PRD' }}
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="generatePrd"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'
import { useCredits } from '~/composables/useCredits'
import UpgradeModal from '~/components/common/UpgradeModal.vue'

const formData = ref({
  productVision: '',
  targetUsers: '',
  keyFeatures: '',
  constraints: ''
})

const errors = ref({
  productVision: false,
  targetUsers: false,
  keyFeatures: false,
  constraints: false
})

const isLoading = ref(false)
const response = ref('')

const { checkAndConsumeCredit, showUpgradeModal } = useCredits()

const handleSubmit = async () => {
  // Reset all errors
  Object.keys(errors.value).forEach(key => {
    errors.value[key] = !formData.value[key]
  })

  // Check if any errors exist
  if (Object.values(errors.value).some(error => error)) {
    return
  }
  
  await generatePrd()
}

const generatePrd = async () => {
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
    const res = await fetch('/api/prd', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to generate PRD')

    const data = await res.text()
    response.value = data

  } catch (error) {
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}
</script> 