<template>
  <div class="max-w-2xl mx-auto">
    <form @submit.prevent="generateSWOT" class="space-y-8">
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Product Description
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Tell us about your product and its key features
            </span>
          </label>
          <textarea
            v-model="formData.productDescription"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., An AI-powered content management system for digital publishers..."
          ></textarea>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Target Market
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Describe your market and competitive landscape
            </span>
          </label>
          <textarea
            v-model="formData.targetMarket"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Online news outlets and digital magazines competing with traditional media..."
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base"
      >
        <Icon name="ph:chart-pie-slice-duotone" class="text-xl" />
        Generate SWOT Analysis
      </button>
    </form>
  </div>
</template>

<script setup>
const formData = ref({
  productDescription: '',
  targetMarket: ''
})

const generateSWOT = () => {
  // Handle form submission
  console.log('Generating SWOT Analysis with:', formData.value)
}
</script> 