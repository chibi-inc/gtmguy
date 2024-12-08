<template>
<TheNavbar />
  <div class="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
    <!-- Hero Section -->
    <section class="pt-28 sm:pt-40 pb-16 sm:pb-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-sky-50/70 via-sky-100/30 to-transparent"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 mb-8">
            AI-Powered Tools for SaaS Success
          </h1>
          <p class="text-lg sm:text-xl text-neutral-600 mb-10">
            Everything you need to understand your market, build your product, launch successfully, and grow systematically.
          </p>
        </div>
      </div>
    </section>

    <!-- Tools by Stage -->
    <section class="py-16 sm:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div v-for="stage in stages" :key="stage.id" class="mb-24 last:mb-0">
          <!-- Stage Header -->
          <div class="text-center mb-12">
            <span class="text-sky-600 font-semibold mb-3 block uppercase tracking-wider text-sm">{{ stage.label }}</span>
            <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">{{ stage.description }}</h2>
          </div>

          <!-- Tools Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <NuxtLink 
              v-for="tool in getToolsByStage(stage.id)"
              :key="tool.id"
              :to="`/tools/${tool.id}`"
              class="group"
            >
              <div class="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-stone-200/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <!-- Tool Icon -->
                <div class="w-12 h-12 bg-gradient-to-br from-sky-100 to-sky-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon :name="tool.icon" class="text-2xl text-sky-600" />
                </div>

                <!-- Tool Info -->
                <h3 class="text-xl font-semibold text-neutral-900 mb-3">{{ tool.name }}</h3>
                <p class="text-neutral-600 mb-6">{{ tool.description }}</p>

                <!-- Features Preview -->
                <div class="space-y-2">
                  <div v-for="(feature, index) in tool.features.slice(0, 3)" 
                    :key="index"
                    class="flex items-center gap-2 text-sm text-neutral-500"
                  >
                    <Icon name="ph:check-circle-duotone" class="text-sky-600" />
                    <span>{{ feature }}</span>
                  </div>
                </div>

                <!-- Action -->
                <div class="mt-6 flex items-center text-sky-600 font-medium group-hover:translate-x-1 transition-transform duration-300">
                  Learn more
                  <Icon name="ph:arrow-right" class="ml-1" />
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 sm:py-24 bg-gradient-to-b from-stone-50/50 via-white to-stone-50/50 backdrop-blur-sm border-y border-stone-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 mb-6">
          Ready to Build Your SaaS?
        </h2>
        <p class="text-lg text-neutral-600 mb-10 max-w-2xl mx-auto">
          Get started with our AI-powered tools and join thousands of successful SaaS founders.
        </p>
        <button @click="signInWithGoogle" :disabled="isLoading"
          class="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-lg font-medium"
        >
          <Icon name="ph:rocket-launch-duotone" class="text-xl" />
          {{ isLoading ? 'Loading...' : 'Get Started Free →' }}
        </button>
      </div>
    </section>

    <TheFooter />
  </div>
</template>

<script setup>
import { tools, stages, getToolsByStage } from '~/config/tools'
import { useAuth } from '~/composables/useAuth'

const { signInWithGoogle, isLoading } = useAuth()
</script>
