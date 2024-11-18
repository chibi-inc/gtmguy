<template>
  <div class="max-w-2xl mx-auto">
    <!-- Loading Overlay -->
    <div 
      v-if="isLoading"
      class="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl border border-stone-200 shadow-lg flex items-center gap-4">
        <div class="animate-spin text-sky-500">
          <Icon name="ph:circle-notch-duotone" class="text-2xl" />
        </div>
        <span class="text-neutral-900">Generating Prioritization Framework...</span>
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

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Generate Prioritization Framework</h3>
        <p class="text-neutral-600">Fill in the details below to create a prioritized list of features or initiatives.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Prioritization Method
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Select the framework to use for prioritization
            </span>
          </label>
          <select
            v-model="formData.method"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none"
          >
            <option 
              v-for="(label, key) in methodOptions" 
              :key="key" 
              :value="key"
            >
              {{ label }}
            </option>
          </select>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Features/Initiatives
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              List the features or initiatives to prioritize
            </span>
          </label>
          <textarea
            v-model="formData.features"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            :class="{ 'border-red-300': showFeaturesError }"
            placeholder="e.g., Mobile app, API integration, Analytics dashboard..."
            @input="showFeaturesError = false"
            required
          ></textarea>
          <!-- Error Message -->
          <p v-if="showFeaturesError" class="mt-2 text-sm text-red-600">
            Please list your features or initiatives
          </p>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Business Goals
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              What are your main business objectives?
            </span>
          </label>
          <textarea
            v-model="formData.goals"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            :class="{ 'border-red-300': showGoalsError }"
            placeholder="e.g., Increase user engagement, improve retention, expand market share..."
            @input="showGoalsError = false"
            required
          ></textarea>
          <!-- Error Message -->
          <p v-if="showGoalsError" class="mt-2 text-sm text-red-600">
            Please specify your business goals
          </p>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:hover:bg-sky-500"
        :disabled="isLoading"
      >
        <Icon name="ph:list-numbers-duotone" class="text-xl" />
        {{ isLoading ? 'Generating...' : 'Generate Prioritization' }}
      </button>
    </form>

    <!-- Response Section -->
    <ResponseSection 
      v-if="response"
      :content="response"
      @clear="response = ''"
      @regenerate="generatePrioritization"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResponseSection from '~/components/common/ResponseSection.vue'
import { useCredits } from '~/composables/useCredits'

const methodOptions = {
  RICE: "RICE (Reach, Impact, Confidence, Effort)",
  MOSCOW: "MoSCoW (Must, Should, Could, Won't have)",
  VALUE_EFFORT: "Value vs Effort Matrix",
  KANO: "Kano Model"
}

const formData = ref({
  features: '',
  goals: '',
  method: 'RICE' // Default method
})

const isLoading = ref(false)
const response = ref('')
const showFeaturesError = ref(false)
const showGoalsError = ref(false)
const { checkAndConsumeCredit, showUpgradeModal } = useCredits()

const handleUpgrade = () => {
  showUpgradeModal.value = false
  // Implement upgrade logic
}

const handleSubmit = async () => {
  // Reset errors
  showFeaturesError.value = false
  showGoalsError.value = false

  // Validate inputs
  if (!formData.value.features) {
    showFeaturesError.value = true
  }
  if (!formData.value.goals) {
    showGoalsError.value = true
  }

  if (!formData.value.features || !formData.value.goals) {
    return
  }
  
  await generatePrioritization()
}

const generatePrioritization = async () => {
  isLoading.value = true
  response.value = ''
  
  try {
    const canProceed = await checkAndConsumeCredit()
    if (!canProceed) {
      isLoading.value = false
      return
    }

    const res = await fetch('/api/prioritization', {
      method: 'POST',
      body: JSON.stringify({
        items: formData.value.features,
        method: formData.value.method
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Failed to generate prioritization framework')

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