<template>
  <div class="max-w-2xl mx-auto">
    <form @submit.prevent="generateTest" class="space-y-8">
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Hypothesis
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              What do you want to test and why?
            </span>
          </label>
          <textarea
            v-model="formData.hypothesis"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Changing the onboarding flow to include interactive tutorials will increase user activation by 25%..."
          ></textarea>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Variant Details
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Describe the different versions you want to test
            </span>
          </label>
          <textarea
            v-model="formData.variantDetails"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Version A: Current flow with text instructions, Version B: Interactive tutorial with progress tracking..."
          ></textarea>
        </div>

        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Target Market
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Who will participate in this test?
            </span>
          </label>
          <textarea
            v-model="formData.targetMarket"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., New users signing up for a free trial, excluding enterprise customers..."
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base"
      >
        <Icon name="ph:test-tube-duotone" class="text-xl" />
        Generate A/B Test Plan
      </button>
    </form>
  </div>
</template>

<script setup>
const formData = ref({
  hypothesis: '',
  variantDetails: '',
  targetMarket: ''
})

const generateTest = () => {
  // Handle form submission
  console.log('Generating A/B Test Plan with:', formData.value)
}
</script> 