<template>
  <div class="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100"> 
    
    <!-- Hero Section -->
    <section class="pt-28 sm:pt-40 pb-16 sm:pb-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-sky-50/70 via-sky-100/30 to-transparent"></div>
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-20 -left-20 w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-[128px] animate-pulse-slow"></div>
        <div class="absolute bottom-20 -right-20 w-[600px] h-[600px] bg-stone-300/50 rounded-full blur-[128px] animate-pulse-slower"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div class="max-w-3xl mx-auto text-center">
          <span class="px-6 py-2.5 rounded-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white text-sm font-medium inline-flex items-center gap-3 mb-10 sm:mb-12 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5">
            <Icon :name="tool.icon" class="text-xl" />
            {{ tool.shortName }}
          </span>
          
          <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 mb-8 sm:mb-10 leading-[1.1] tracking-tight">
            {{ tool.name }}
          </h1>
          
          <p class="text-lg sm:text-xl text-neutral-600 mb-10 sm:mb-12 leading-relaxed max-w-2xl mx-auto">
            {{ tool.longDescription }}
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button @click="signInWithGoogle" :disabled="isLoading"
              class="w-full sm:w-auto px-10 sm:px-12 py-4 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-lg font-medium flex items-center justify-center gap-3 shadow-lg"
            >
              <Icon name="ph:rocket-launch-duotone" class="text-2xl" />
              {{ isLoading ? 'Loading...' : 'Try Now Free →' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-32 bg-gradient-to-b from-stone-50/50 via-white to-stone-50/50 backdrop-blur-sm border-y border-stone-200">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-20">
          <span class="text-sky-600 font-semibold mb-3 block uppercase tracking-wider text-sm">Benefits</span>
          <h2 class="text-4xl sm:text-5xl font-bold text-neutral-900 mb-6">Why Use {{ tool.shortName }}?</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="benefit in tool.benefits" :key="benefit.title"
            class="bg-white/70 backdrop-blur-sm p-10 rounded-2xl border border-stone-200/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div class="w-16 h-16 bg-gradient-to-br from-sky-100 to-sky-50 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <Icon :name="benefit.icon" class="text-3xl text-sky-600" />
            </div>
            <h3 class="text-2xl font-semibold text-neutral-900 mb-4">{{ benefit.title }}</h3>
            <p class="text-neutral-600 leading-relaxed">{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <span class="text-sky-600 font-medium mb-2 block">Features</span>
          <h2 class="text-4xl font-bold text-neutral-900 mb-6">Everything You Need</h2>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="feature in tool.features" :key="feature"
            class="flex items-center gap-4 p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-stone-200/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <Icon name="ph:check-circle-duotone" class="text-2xl text-sky-600" />
            <span class="text-neutral-700">{{ feature }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-24 bg-stone-50/50 backdrop-blur-sm border-y border-stone-200">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <span class="text-sky-600 font-medium mb-2 block">Process</span>
          <h2 class="text-4xl font-bold text-neutral-900 mb-6">How It Works</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div v-for="(step, index) in tool.howItWorks" :key="index"
            class="bg-white p-6 rounded-xl border border-stone-200"
          >
            <div class="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center mb-4 text-sky-600 font-semibold">
              {{ index + 1 }}
            </div>
            <p class="text-neutral-700">{{ step }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Use Cases Section -->
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <span class="text-sky-600 font-medium mb-2 block">Applications</span>
          <h2 class="text-4xl font-bold text-neutral-900 mb-6">Use Cases</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="useCase in tool.useCases" :key="useCase.title"
            class="bg-white p-8 rounded-xl border border-stone-200 hover:shadow-xl transition-all duration-300"
          >
            <h3 class="text-xl font-semibold text-neutral-900 mb-3">{{ useCase.title }}</h3>
            <p class="text-neutral-700">{{ useCase.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-24 bg-stone-50/50 backdrop-blur-sm border-y border-stone-200">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <span class="text-sky-600 font-medium mb-2 block">Support</span>
          <h2 class="text-4xl font-bold text-neutral-900 mb-6">Frequently Asked Questions</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div v-for="item in tool.faq" :key="item.question"
            class="bg-white p-8 rounded-xl border border-stone-200"
          >
            <h3 class="text-lg font-semibold text-neutral-900 mb-3">{{ item.question }}</h3>
            <p class="text-neutral-700">{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 sm:py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <div class="bg-gradient-to-br from-neutral-900 to-stone-900 rounded-3xl p-8 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div class="absolute inset-0 overflow-hidden">
            <div class="absolute top-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 right-0 w-96 h-96 bg-stone-400/10 rounded-full blur-3xl"></div>
          </div>
          
          <div class="relative">
            <h2 class="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-200">
              Start Using {{ tool.shortName }} Today
            </h2>
            <p class="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
              Join innovative teams using {{ tool.shortName }} to build better products faster.
            </p>
            <button @click="signInWithGoogle" :disabled="isLoading"
              class="inline-flex items-center gap-2 px-10 py-4 bg-white text-neutral-900 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-lg font-medium group"
            >
              <Icon name="ph:sparkle-duotone" class="text-xl transition-transform group-hover:rotate-12" />
              {{ isLoading ? 'Loading...' : 'Try Now Free →' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <TheFooter />
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

defineProps({
  tool: {
    type: Object,
    required: true
  }
})

const { signInWithGoogle, isLoading } = useAuth()

// Add JSON-LD generation
const jsonLd = computed(() => {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.longDescription,
    "applicationCategory": "WebApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": tool.features.join(", "),
    "softwareHelp": {
      "@type": "CreativeWork",
      "text": tool.faq.map(item => `${item.question} ${item.answer}`).join(" ")
    }
  })
})
</script> 