<template>
  <div class="max-w-2xl mx-auto">
    <form @submit.prevent="generateStrategy" class="space-y-8">
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Product Description
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Describe your product and its unique value proposition
            </span>
          </label>
          <textarea
            v-model="formData.productDescription"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., A mobile app that helps remote teams track their productivity and collaborate better..."
          ></textarea>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Target Market
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Define your target audience and their pain points
            </span>
          </label>
          <textarea
            v-model="formData.targetMarket"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Remote-first companies with 20-200 employees struggling with team coordination..."
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base"
      >
        <Icon name="ph:target-duotone" class="text-xl" />
        Generate GTM Strategy
      </button>
    </form>
  </div>
</template>

<script setup>
const formData = ref({
  productDescription: '',
  targetMarket: ''
})

const generateStrategy = () => {
  // Handle form submission
  console.log('Generating GTM Strategy with:', formData.value)
}
</script> 