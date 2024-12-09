<template>
  <main class="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
    <!-- Hero Section with enhanced styling -->
    <section class="pt-28 sm:pt-40 pb-16 sm:pb-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-sky-50/30 to-transparent"></div>
      <!-- Decorative Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-20 left-10 w-96 h-96 bg-sky-100/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-stone-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div class="text-center mb-16">
          <span class="px-4 py-1.5 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-800 text-white text-sm font-medium inline-flex items-center gap-2 mb-6">
            <Icon name="ph:sparkle-duotone" class="text-lg" />
            {{ usecase.name }}
          </span>
          <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-neutral-900 mb-6">
            {{ usecase.description }}
          </h1>
        </div>
      </div>
    </section>

    <!-- Value Proposition with updated styling -->
    <section class="py-24 bg-stone-50/50 backdrop-blur-sm border-y border-stone-200">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <span class="text-sky-600 font-medium mb-2 block">Why It Matters</span>
          <h2 class="text-4xl font-bold text-neutral-900 mb-6">Strategic Impact</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-xl border border-stone-200 hover:shadow-xl transition-all duration-200">
            <div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-6">
              <Icon name="ph:target-duotone" class="text-2xl text-sky-600" />
            </div>
            <h3 class="text-xl font-semibold text-neutral-900 mb-3">The Challenge</h3>
            <p class="text-neutral-700">{{ usecase.valueProposition.why }}</p>
          </div>
          <div class="bg-white p-8 rounded-xl border border-stone-200 hover:shadow-xl transition-all duration-200">
            <div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-6">
              <Icon name="ph:target-duotone" class="text-2xl text-sky-600" />
            </div>
            <h3 class="text-xl font-semibold text-neutral-900 mb-3">The Impact</h3>
            <p class="text-neutral-700">{{ usecase.valueProposition.impact }}</p>
          </div>
          <div class="bg-white p-8 rounded-xl border border-stone-200 hover:shadow-xl transition-all duration-200">
            <div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-6">
              <Icon name="ph:target-duotone" class="text-2xl text-sky-600" />
            </div>
            <h3 class="text-xl font-semibold text-neutral-900 mb-3">Go-to-Market Insight</h3>
            <p class="text-neutral-700">{{ usecase.valueProposition.gtmInsight }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section with matching design -->
    <section v-if="usecase.stats" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-stone-50 p-8 rounded-xl border border-stone-200 hover:shadow-xl transition-all duration-200">
            <div class="text-4xl font-bold text-neutral-900 mb-2">{{ usecase.stats.successRate }}</div>
            <p class="text-neutral-700">Success Rate</p>
          </div>
          <div class="bg-stone-50 p-8 rounded-xl border border-stone-200 hover:shadow-xl transition-all duration-200">
            <div class="text-4xl font-bold text-neutral-900 mb-2">{{ usecase.stats.timeReduction }}</div>
            <p class="text-neutral-700">Time Reduction</p>
          </div>
          <div class="bg-stone-50 p-8 rounded-xl border border-stone-200 hover:shadow-xl transition-all duration-200">
            <div class="text-4xl font-bold text-neutral-900 mb-2">{{ usecase.stats.satisfactionRate }}</div>
            <p class="text-neutral-700">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section with consistent styling -->
    <section v-if="usecase.benefits" class="py-24 bg-stone-50/50 backdrop-blur-sm border-y border-stone-200">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <span class="text-sky-600 font-medium mb-2 block">Key Benefits</span>
          <h2 class="text-4xl font-bold text-neutral-900 mb-6">Why Choose This Approach</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(benefit, index) in usecase.benefits" 
               :key="index"
               class="bg-white p-8 rounded-xl border border-stone-200 hover:shadow-xl transition-all duration-200">
            <div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-6">
              <Icon name="ph:star-duotone" class="text-2xl text-sky-600" />
            </div>
            <p class="text-neutral-700">{{ benefit }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Available Tools Section -->
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <span class="text-sky-600 font-medium mb-2 block">Tools & Features</span>
          <h2 class="text-4xl font-bold text-neutral-900 mb-6">Available Tools</h2>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink
            v-for="(useCase, index) in usecase.useCases" 
            :key="index"
            :to="`/tools/${useCase.tools.id}`"
            class="bg-white p-8 rounded-xl border border-stone-200 hover:shadow-xl transition-all duration-200">
            <div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-6">
              <Icon :name="useCase.tools.icon" class="text-2xl text-sky-600" />
            </div>
            <h3 class="text-xl font-semibold text-neutral-900 mb-3">{{ useCase.title }}</h3>
            <p class="text-neutral-700">{{ useCase.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
defineProps({
  usecase: {
    type: Object,
    required: true,
    validator: (usecase) => {
      return usecase.name && 
             usecase.description && 
             Array.isArray(usecase.useCases)
    }
  }
})
</script> 