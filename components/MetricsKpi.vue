<template>
  <div class="max-w-2xl mx-auto">
    <form @submit.prevent="generateMetrics" class="space-y-8">
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Primary Business Goal
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              What is your main business objective?
            </span>
          </label>
          <textarea
            v-model="formData.businessGoal"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Increase market share in the enterprise segment by 30% within the next year..."
          ></textarea>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Key Activities
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              List the main activities you want to measure
            </span>
          </label>
          <textarea
            v-model="formData.keyActivities"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., User acquisition, Feature adoption, Customer retention, Sales conversion..."
          ></textarea>
        </div>

        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            TimeFrame
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              What period do you want to measure?
            </span>
          </label>
          <input
            type="text"
            v-model="formData.timeFrame"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none"
            placeholder="e.g., Q2 2024, Next 6 months, Annual 2024"
          />
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base"
      >
        <Icon name="ph:chart-line-up-duotone" class="text-xl" />
        Generate Metrics & KPIs
      </button>
    </form>
  </div>
</template>

<script setup>
const formData = ref({
  businessGoal: '',
  keyActivities: '',
  timeFrame: ''
})

const generateMetrics = () => {
  // Handle form submission
  console.log('Generating Metrics & KPIs with:', formData.value)
}
</script> 