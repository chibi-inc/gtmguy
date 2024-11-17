<template>
  <div class="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
    <!-- Update the Navbar component to listen for the sign-in event -->
    <TheNavbar @sign-in="signInWithGoogle" />

    <!-- Hero Section -->
    <section class="pt-28 sm:pt-40 pb-16 sm:pb-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-sky-50/30 to-transparent"></div>
      <!-- Enhanced Decorative Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-20 left-10 w-96 h-96 bg-sky-100/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-stone-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div class="max-w-3xl mx-auto text-center">
          <span class="px-4 py-1.5 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-800 text-white text-sm font-medium inline-flex items-center gap-2 mb-6 sm:mb-8">
            <Icon name="ph:sparkle-duotone" class="text-lg" />
            AI-Powered Go-to-Market Tools
          </span>
          <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-neutral-900 mb-6 sm:mb-8 leading-tight">
            Go to Market in <span class="text-gradient">Seconds</span>, Not Months
          </h1>
          <p class="text-lg sm:text-xl text-neutral-700 mb-8 sm:mb-10 leading-relaxed">
            Optimize your landing page, improve SEO, generate product strategies, launch plans, user research, and more in <span class="font-semibold">seconds</span>.
          </p>
          <!-- Mobile-optimized CTA buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button 
              @click="signInWithGoogle"
              :disabled="isLoading"
              class="w-full sm:w-auto px-8 sm:px-10 py-4 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-lg font-medium flex items-center justify-center gap-2">
              <Icon name="ph:sparkle-duotone" class="text-xl" />
              {{ isLoading ? 'Loading...' : 'Start Creating for Free →' }}
            </button>
            <a href="#features" class="w-full sm:w-auto px-6 py-4 text-neutral-900 hover:bg-white/75 rounded-xl transition-all duration-200 text-lg font-medium flex items-center justify-center gap-2 group">
              <Icon name="ph:magic-wand-duotone" class="text-xl" />
              See All Tools
            </a>
          </div>
          <!-- Social Proof -->
          <div class="mt-12 pt-8 border-t border-neutral-200/50 animate-fade-in-up delay-400">
            <div class="max-w-md mx-auto bg-stone-50/80 backdrop-blur-sm rounded-xl p-6 border border-stone-200">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="ph:smiley-duotone" class="text-2xl text-white" />
                </div>
                <div class="text-left">
                  <p class="text-neutral-700 italic mb-2">
                    "This AI thing just wrote my entire go-to-market strategy while I was getting coffee. Pretty neat!"
                  </p>
                  <p class="text-sm text-neutral-600">- Probably a Happy Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why GTMGuy Section -->
    <section class="py-6 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-sky-50/10 to-transparent"></div>
      <div class="max-w-7xl mx-auto px-6 relative">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-8">
            <span class="text-sky-600 font-medium">Why GTMGuy?</span>
            <h2 class="text-4xl font-bold text-neutral-900">Stop Struggling with Go-to-Market Strategy</h2>
            <div class="space-y-6">
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center">
                  <Icon name="ph:timer-duotone" class="text-2xl text-sky-600" />
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-neutral-900 mb-2">From Weeks to Minutes</h3>
                  <p class="text-neutral-700">Stop spending weeks on strategy documents. GTMGuy helps you generate professional GTM assets in minutes using AI.</p>
                </div>
              </div>
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                  <Icon name="ph:brain-duotone" class="text-2xl text-sky-600" />
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-neutral-900 mb-2">Expert-Level Strategy</h3>
                  <p class="text-neutral-700">Access battle-tested frameworks and strategies used by successful companies, powered by advanced AI.</p>
                </div>
              </div>
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                  <Icon name="ph:currency-circle-dollar-duotone" class="text-2xl text-sky-600" />
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-neutral-900 mb-2">Fraction of the Cost</h3>
                  <p class="text-neutral-700">Save thousands on consultants and agencies. Get professional GTM strategy at a fraction of the traditional cost.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="lg:pl-12">
            <div class="bg-white rounded-2xl border border-stone-200 p-8 space-y-8">
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon name="ph:check-circle-duotone" class="text-2xl text-green-600" />
                  </div>
                  <p class="text-neutral-900"><span class="font-semibold">No templates or guesswork</span> - AI-powered strategy tailored to your product</p>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon name="ph:check-circle-duotone" class="text-2xl text-green-600" />
                  </div>
                  <p class="text-neutral-900"><span class="font-semibold">Complete GTM toolkit</span> - Everything from ICPs to launch plans in one place</p>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon name="ph:check-circle-duotone" class="text-2xl text-green-600" />
                  </div>
                  <p class="text-neutral-900"><span class="font-semibold">Continuous updates</span> - Strategy that evolves with your product and market</p>
                </div>
              </div>
              <div class="border-t border-stone-200 pt-8">
                <div class="bg-neutral-50 rounded-xl p-6">
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="ph:rocket-duotone" class="text-2xl text-white" />
                    </div>
                    <div>
                      <h4 class="font-semibold text-neutral-900 mb-1">Limited Time Launch Offer</h4>
                      <p class="text-neutral-700 text-sm">Get lifetime access to unlimited strategies for just $199. Start with 10 free strategies to try it out.</p>
                    </div>
                  </div>
                  <button 
                    @click="signInWithGoogle"
                    :disabled="isLoading"
                    class="mt-6 w-full bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-xl py-3 px-6 text-center font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 inline-block">
                    {{ isLoading ? 'Loading...' : 'Try All Tools Free →' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section id="features" class="py-24 bg-stone-50/50 backdrop-blur-sm border-y border-stone-200">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-20">
          <span class="text-sky-600 font-medium mb-2 block">Features</span>
          <h2 class="text-5xl font-bold text-neutral-900 mb-6">All the Tools You Need</h2>
          <p class="text-xl text-neutral-700 max-w-2xl mx-auto">
            Our AI-powered tools help you build, launch, and grow better products faster.
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div v-for="feature in features" :key="feature.title" 
            class="bg-stone-50 p-8 rounded-xl border border-stone-200 hover:border-neutral-900/10 transition-all duration-300 group hover:shadow-xl hover:shadow-stone-900/5 hover:-translate-y-1">
            <div class="w-12 h-12 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Icon :name="feature.icon" class="text-2xl" />
            </div>
            <h3 class="text-xl font-semibold text-neutral-900 mb-3">{{ feature.title }}</h3>
            <p class="text-neutral-700 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section id="benefits-section" class="py-20">
      <div class="max-w-7xl mx-auto px-6">
        <div class="max-w-3xl mx-auto text-center mb-16">
          <span class="text-sky-600 font-medium mb-2 block">Benefits</span>
          <h2 class="text-4xl font-bold text-neutral-900 mb-4">Why Choose GTMGuy?</h2>
          <p class="text-lg text-neutral-700">
            Save time, reduce costs, and improve your go-to-market strategy with AI-powered insights.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div v-for="benefit in benefits" :key="benefit.title" 
            class="text-center group bg-stone-50 p-8 rounded-xl border border-stone-200 hover:border-neutral-900/10 transition-all duration-200 hover:shadow-xl hover:shadow-stone-900/5">
            <div class="w-16 h-16 bg-neutral-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <Icon :name="benefit.icon" class="text-3xl" />
            </div>
            <h3 class="text-xl font-semibold text-neutral-900 mb-3">{{ benefit.title }}</h3>
            <p class="text-neutral-700 leading-relaxed">{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Social Proof -->
    <section class="py-20 bg-stone-50/50 backdrop-blur-sm border-y border-stone-200">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-12">
          <span class="text-sky-600 font-medium mb-2 block">Early Access</span>
          <h2 class="text-4xl font-bold text-neutral-900 mb-4">Join the GTM Revolution</h2>
          <p class="text-lg text-neutral-700 max-w-2xl mx-auto">
            Join early adopters who are already creating winning go-to-market strategies in record time. No more endless meetings and spreadsheets.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div class="bg-stone-50 p-6 rounded-xl border border-stone-200">
            <div class="text-4xl font-bold text-neutral-900 mb-2">24h</div>
            <p class="text-neutral-700">Average time saved per GTM document</p>
          </div>
          <div class="bg-stone-50 p-6 rounded-xl border border-stone-200">
            <div class="text-4xl font-bold text-neutral-900 mb-2">90%</div>
            <p class="text-neutral-700">Lower cost than traditional consulting</p>
          </div>
          <div class="bg-stone-50 p-6 rounded-xl border border-stone-200">
            <div class="text-4xl font-bold text-neutral-900 mb-2">100%</div>
            <p class="text-neutral-700">AI-powered strategy and insights</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing-section" class="py-24 bg-stone-50/50 backdrop-blur-sm border-y border-stone-200">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <span class="text-sky-600 font-medium mb-2 block">Simple Pricing</span>
          <h2 class="text-5xl font-bold text-neutral-900 mb-6">Start For Free, Scale When Ready</h2>
          <p class="text-xl text-neutral-700 max-w-2xl mx-auto">
            Try GTMGuy for free with our trial. Upgrade to lifetime access when you're ready.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <!-- Free Trial -->
          <div class="bg-white rounded-2xl border border-stone-200 p-8 hover:shadow-xl hover:shadow-stone-900/5 transition-all duration-200">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-2xl font-bold text-neutral-900 mb-2">Free Trial</h3>
                <p class="text-neutral-700">Best to try out GTMGuy</p>
              </div>
              <span class="bg-stone-100 text-neutral-900 px-4 py-1 rounded-full text-sm font-medium">Free</span>
            </div>
            <div class="mb-8">
              <div class="text-5xl font-bold text-neutral-900 mb-1">10</div>
              <p class="text-neutral-700">Reports total</p>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center gap-3 text-neutral-700">
                <Icon name="ph:check-circle-duotone" class="text-xl text-sky-600" />
                <span>All AI-powered tools</span>
              </li>
              <li class="flex items-center gap-3 text-neutral-700">
                <Icon name="ph:check-circle-duotone" class="text-xl text-sky-600" />
                <span>Ideal for testing</span>
              </li>
              <li class="flex items-center gap-3 text-neutral-700">
                <Icon name="ph:check-circle-duotone" class="text-xl text-sky-600" />
                <span>No credit card required</span>
              </li>
            </ul>
            <button 
              @click="signInWithGoogle"
              :disabled="isLoading"
              class="w-full bg-neutral-900 text-white rounded-xl py-3 px-6 text-center font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 inline-block">
              {{ isLoading ? 'Loading...' : 'Start Creating for Free →' }}
            </button>
          </div>

          <!-- Lifetime Pro -->
          <div class="bg-gradient-to-br from-neutral-900 to-stone-900 rounded-2xl p-8 text-white relative overflow-hidden hover:shadow-xl hover:shadow-stone-900/5 transition-all duration-200">
            <div class="absolute inset-0">
              <div class="absolute top-0 left-0 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl"></div>
              <div class="absolute bottom-0 right-0 w-64 h-64 bg-stone-400/10 rounded-full blur-3xl"></div>
            </div>
            <div class="relative">
              <div class="flex justify-between items-start mb-6">
                <div>
                  <h3 class="text-2xl font-bold mb-2">Lifetime Pro</h3>
                  <p class="text-neutral-300">Best value for serious users</p>
                </div>
                <span class="bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium">Limited Time</span>
              </div>
              <div class="mb-8">
                <div class="text-5xl font-bold mb-1">∞</div>
                <p class="text-neutral-300">Unlimited reports forever</p>
              </div>
              <div class="mb-8">
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-bold">$199</span>
                  <span class="text-neutral-300">one-time payment</span>
                </div>
                <p class="text-sm text-neutral-300 mt-1">Lifetime access, unlimited value</p>
              </div>
              <ul class="space-y-4 mb-8">
                <li class="flex items-center gap-3 text-neutral-200">
                  <Icon name="ph:check-circle-duotone" class="text-xl text-sky-400" />
                  <span>Everything in Free Trial</span>
                </li>
                <li class="flex items-center gap-3 text-neutral-200">
                  <Icon name="ph:check-circle-duotone" class="text-xl text-sky-400" />
                  <span>Unlimited reports</span>
                </li>
                <li class="flex items-center gap-3 text-neutral-200">
                  <Icon name="ph:check-circle-duotone" class="text-xl text-sky-400" />
                  <span>Priority support</span>
                </li>
                <li class="flex items-center gap-3 text-neutral-200">
                  <Icon name="ph:check-circle-duotone" class="text-xl text-sky-400" />
                  <span>Lifetime updates</span>
                </li>
              </ul>
              <button 
                @click="signInWithGoogle"
                :disabled="isLoading"
                class="w-full bg-white text-neutral-900 rounded-xl py-3 px-6 text-center font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 inline-block">
                {{ isLoading ? 'Loading...' : 'Get Unlimited Access →' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 sm:py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <div class="bg-gradient-to-br from-neutral-900 to-stone-900 rounded-2xl p-8 sm:p-16 text-center text-white relative overflow-hidden">
          <div class="absolute inset-0">
            <div class="absolute top-0 left-0 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div class="absolute bottom-0 right-0 w-96 h-96 bg-stone-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          <div class="relative">
            <h2 class="text-5xl font-bold mb-6">Ready to Transform Your GTM Strategy?</h2>
            <p class="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
              Join early adopters who are already creating winning go-to-market strategies in record time. No more endless meetings and spreadsheets.
            </p>
            <button 
              @click="signInWithGoogle"
              :disabled="isLoading"
              class="inline-flex items-center gap-2 px-10 py-4 bg-white text-neutral-900 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-lg font-medium group">
              <Icon name="ph:sparkle-duotone" class="text-xl transition-transform group-hover:rotate-12" />
              {{ isLoading ? 'Loading...' : 'Start Creating for Free →' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Use shared Footer component -->
    <TheFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const isLoading = ref(false)
const errorMessage = ref('')
const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const signInWithGoogle = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'email profile'
      },
    })

    if (error) {
      errorMessage.value = error.message
    }

  } catch (error) {
    console.error('Error signing in with Google:', error)
    errorMessage.value = 'An unexpected error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (user.value) {
    await router.push('/app')
  }
})

const { setSeo } = useSeo()

// Set SEO metadata
setSeo({
  title: 'AI-Powered Go-to-Market Strategy Tools',
  description: 'Create comprehensive go-to-market strategies, ICPs, and product launch plans in minutes with AI. Transform your GTM strategy with GTMGuy.',
  url: 'https://gtmguy.com', // Replace with your domain
})

// Structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "GTMGuy",
        "description": "AI-powered go-to-market strategy tools",
        "applicationCategory": "BusinessApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      })
    }
  ]
})

// Features and Benefits data
const features = [
  {
    title: 'ICP Creator',
    icon: 'ph:user-duotone',
    description: 'Create detailed Ideal Customer Profiles that help you target the right audience with precision and clarity.'
  },
  {
    title: 'GTM Strategy',
    icon: 'ph:target-duotone',
    description: 'Create comprehensive go-to-market strategies tailored to your product and market positioning.'
  },
  {
    title: 'Landing Page Analyzer',
    icon: 'ph:browser-duotone',
    description: 'Get AI-powered insights on your landing page conversion potential and actionable improvement suggestions.'
  },
  {
    title: 'SEO Optimizer',
    icon: 'ph:google-logo-duotone',
    description: 'Analyze and optimize your content for search engines with AI-driven recommendations and keywords.'
  },
  {
    title: 'Copy Generator',
    icon: 'ph:pencil-duotone',
    description: 'Create compelling marketing copy that resonates with your target audience and drives conversions.'
  },
  {
    title: 'Product Launch Plan',
    icon: 'ph:rocket-launch-duotone',
    description: 'Plan your product launches with detailed timelines, strategies, and success metrics.'
  },
  {
    title: 'A/B Test Planner',
    icon: 'ph:test-tube-duotone',
    description: 'Design effective A/B tests to optimize your product features and marketing campaigns.'
  },
  {
    title: 'Metrics & KPIs',
    icon: 'ph:chart-line-up-duotone',
    description: 'Define the right metrics and KPIs for your goals to track and measure your go-to-market success.'
  },
  {
    title: 'User Research Plan',
    icon: 'ph:magnifying-glass-duotone',
    description: 'Create detailed user research plans to better understand your customers and their needs.'
  }
]

const benefits = [
  {
    title: 'Save Time',
    icon: 'ph:clock-duotone',
    description: 'Create comprehensive documents and strategies in minutes instead of days or weeks.'
  },
  {
    title: 'Reduce Costs',
    icon: 'ph:money-duotone',
    description: 'Cut down on consulting fees and streamline your planning process with AI assistance.'
  },
  {
    title: 'Improve Quality',
    icon: 'ph:star-duotone',
    description: 'Get AI-powered insights based on best practices and proven frameworks in the industry.'
  }
]
</script>

<style>
.text-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-sky-700;
}

/* Add animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

.delay-200 {
  animation-delay: 200ms;
}

.delay-300 {
  animation-delay: 300ms;
}

.delay-400 {
  animation-delay: 400ms;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}
</style>
