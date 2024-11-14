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
      >
        <Icon name="ph:map-trifold-duotone" class="text-xl" />
        Generate Journey Map
      </button>
    </form>
  </div>
</template>

<script setup>
const formData = ref({
  userDescription: '',
  mainTouchpoints: '',
  goals: ''
})

const generateJourney = () => {
  // Handle form submission
  console.log('Generating User Journey Map with:', formData.value)
}
</script> 