<template>
  <div class="max-w-2xl mx-auto">
    <form @submit.prevent="generateMVP" class="space-y-8">
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Problem
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              What problem does your MVP solve?
            </span>
          </label>
          <textarea
            v-model="formData.problem"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Small businesses struggle to manage their social media presence effectively..."
          ></textarea>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Target Market
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              Who are your early adopters?
            </span>
          </label>
          <textarea
            v-model="formData.targetMarket"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Small e-commerce businesses with 1-5 employees managing their own social media..."
          ></textarea>
        </div>

        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <label class="block text-base font-semibold text-neutral-900 mb-2">
            Must Have Functionalities
            <span class="text-sm font-normal text-neutral-500 block mt-1">
              What are the core features needed?
            </span>
          </label>
          <textarea
            v-model="formData.mustHaveFunctionalities"
            rows="3"
            class="w-full rounded-lg border-stone-200 bg-stone-50/50 focus:outline-none resize-none"
            placeholder="e.g., Social media post scheduling, Analytics dashboard, Content calendar..."
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-base"
      >
        <Icon name="ph:cube-duotone" class="text-xl" />
        Generate MVP Plan
      </button>
    </form>
  </div>
</template>

<script setup>
const formData = ref({
  problem: '',
  targetMarket: '',
  mustHaveFunctionalities: ''
})

const generateMVP = () => {
  // Handle form submission
  console.log('Generating MVP Plan with:', formData.value)
}
</script> 