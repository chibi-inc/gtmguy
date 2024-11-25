<template>
  <div class="flex min-h-screen bg-gradient-to-br from-stone-100 to-stone-200">
    <!-- Mobile Header (new) -->
    <div class="lg:hidden fixed top-0 left-0 right-0 bg-white/50 backdrop-blur-sm border-b border-stone-200 z-20">
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center gap-3">
          <Icon name="ph:rocket-duotone" class="text-2xl text-sky-600" />
          <NuxtLink to="/" class="text-xl font-bold text-neutral-900">GTMGuy</NuxtLink>
        </div>
        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-neutral-600">
          <Icon :name="isMobileMenuOpen ? 'ph:x-bold' : 'ph:list-bold'" class="text-2xl" />
        </button>
      </div>
    </div>

    <!-- Modified Sidebar -->
    <aside 
      :class="`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed inset-y-0 left-0 w-72 bg-white/50 backdrop-blur-sm border-r border-stone-200 transition-transform duration-200 z-10`"
    >
      <div class="flex flex-col h-full p-6">
        <!-- Header -->
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-2">
            <Icon name="ph:rocket-duotone" class="text-3xl text-sky-600" />
            <NuxtLink to="/" class="text-2xl font-bold text-neutral-900">GTMGuy</NuxtLink>
          </div>
          <p class="text-sm text-neutral-600">Your AI-Powered Product & Marketing Suite
        </p>
        </div>

        <!-- Navigation -->
        <nav class="flex-1">
          <ul class="grid grid-cols-1">
            <li v-for="(item, index) in menuItems" :key="index">
              <template v-if="item.type === 'header'">
                <div :class="getMenuItemClasses(item, index)">
                  {{ item.label }}
                </div>
              </template>
              <template v-else>
                <button 
                  :class="getMenuItemClasses(item, index)"
                  @click="activeItem = menuItems.filter(i => !i.type).indexOf(item)"
                >
                  <Icon 
                    :name="item.icon" 
                    class="text-lg shrink-0" 
                    :class="activeItem === menuItems.filter(i => !i.type).indexOf(item) ? 'text-sky-600' : 'text-neutral-600'" 
                  />
                  <span class="truncate">{{ item.label }}</span>
                </button>
              </template>
            </li>
          </ul>
        </nav>
        
        <!-- Footer -->
        <div class="pt-4 border-t border-stone-200">
          <div class="flex items-center gap-2 text-sm text-neutral-600">
            <Icon name="ph:info-duotone" class="text-lg" />
            <span>Version 1.0.0</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Modified Main Content Area -->
    <main class="flex-1 lg:ml-72 mt-16 lg:mt-0">
      <!-- Modified Navbar -->
      <nav class="bg-white/50 backdrop-blur-sm border-b border-stone-200 px-4 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <!-- Credits display -->
          <div class="flex items-center gap-4 overflow-x-auto">
            <div class="bg-stone-50 border border-stone-200 rounded-lg px-3 lg:px-4 py-2 flex items-center gap-2 lg:gap-3">
              <div class="flex items-center gap-2 text-sm text-neutral-600 whitespace-nowrap">
                <Icon name="ph:lightning-duotone" class="text-lg" />
                <span>{{ isLifetimePlan ? '🎉 unlimited' : credits }} reports {{ isLifetimePlan ? '' : 'left' }}</span>
              </div>
              <button  v-if="!isLifetimePlan"
                @click="showUpgradeModal = true"
                class="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                Upgrade
                <Icon name="ph:arrow-right-duotone" class="text-lg hidden lg:block" />
              </button>
              <UpgradeModal v-if="showUpgradeModal"
                @close="showUpgradeModal = false"
              />
            </div>
          </div>

          <!-- User profile (existing code) -->
          <div class="user-profile relative">
            <div @click="toggleDropdown" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sky-600 font-bold border-2 border-sky-600 overflow-hidden cursor-pointer">
              <img v-if="userAvatar" :src="userAvatar" alt="User avatar" class="w-full h-full object-cover">
              <span v-else>{{ userInitial }}</span>
            </div>
            <div v-if="showDropdown" class="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <a @click="signOut" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-stone-100 cursor-pointer transition-colors duration-150">
                <div class="flex items-center gap-2">
                  <Icon name="ph:sign-out-duotone" class="text-lg" />
                  <span>Sign out</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Modified content container -->
      <div class="max-w-6xl mx-auto p-4 lg:p-8">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-neutral-900">
            {{ menuItems.filter(i => !i.type)[activeItem].label }}
          </h2>
          <p class="text-neutral-600 mt-1">{{ getDescription(activeItem) }}</p>
        </div>
        <div class="rounded-xl border border-stone-200 bg-white/50 backdrop-blur-sm p-6 shadow-sm">
          <component :is="currentComponent" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import ICP from '~/components/ICP.vue'
import GtmStrategy from '~/components/GtmStrategy.vue'
import SwotAnalysis from '~/components/SwotAnalysis.vue'
import AbTestPlanner from '~/components/AbTestPlanner.vue'
import UserJourneyMap from '~/components/UserJourneyMap.vue'
import MetricsKpi from '~/components/MetricsKpi.vue'
import MvpGenerator from '~/components/MvpGenerator.vue'
import CopyOptimizer from '~/components/CopyGenerator.vue'
import UserResearchPlan from '~/components/UserResearchPlan.vue'
import ProductLaunchPlan from '~/components/ProductLaunchPlan.vue'
import Prioritization from '~/components/Prioritization.vue'
import PrdGenerator from '~/components/PrdGenerator.vue'
import LandingPageConversion from '~/components/LandingPageConversion.vue'
import SeoOptimizer from '~/components/SeoOptimizer.vue'
import UpgradeModal from '~/components/common/UpgradeModal.vue'


const activeItem = ref(0)
const showUpgradeModal = ref(false)

const menuItems = [
  // Product Features
  { 
    label: 'Product',
    type: 'header'
  },
  { label: 'MVP Generator', icon: 'ph:cube-duotone', component: MvpGenerator },
  { label: 'PRD Generator', icon: 'ph:file-text-duotone', component: PrdGenerator },
  { label: 'Prioritization', icon: 'ph:list-numbers-duotone', component: Prioritization },
  { label: 'Research Plan', icon: 'ph:magnifying-glass-duotone', component: UserResearchPlan },
  { label: 'SWOT Analysis', icon: 'ph:chart-pie-slice-duotone', component: SwotAnalysis },
  { label: 'User Journey Map', icon: 'ph:map-trifold-duotone', component: UserJourneyMap },
  
  // Marketing Features
  { 
    label: 'Marketing',
    type: 'header'
  },
  { label: 'A/B Test Planner', icon: 'ph:test-tube-duotone', component: AbTestPlanner },
  { label: 'GTM Strategy', icon: 'ph:target-duotone', component: GtmStrategy },
  { label: 'Ideal Customer Profile', icon: 'ph:user-duotone', component: ICP },
  { label: 'Link Builder', icon:'ph:link-duotone', component: InternalLinksOptimizer},
  { label: 'Landing Page Conversion', icon: 'ph:browser-duotone', component: LandingPageConversion },
  { label: 'Landing Page Copy', icon: 'ph:pencil-duotone', component: CopyOptimizer },
  { label: 'Launch Plan', icon: 'ph:rocket-launch-duotone', component: ProductLaunchPlan },
  { label: 'Metrics and KPI', icon: 'ph:chart-line-up-duotone', component: MetricsKpi },
  { label: 'SEO Analyser', icon: 'ph:google-logo-duotone', component: SeoOptimizer }
]

const currentComponent = computed(() => {
  const activeMenuItem = menuItems.filter(item => !item.type)[activeItem.value]
  return activeMenuItem?.component
})

const getMenuItemClasses = (item, index) => {
  if (item.type === 'header') {
    return 'text-xs font-semibold text-neutral-500 uppercase tracking-wider px-3 py-2'
  }
  
  const nonHeaderIndex = menuItems.filter(i => !i.type).indexOf(item)
  
  return {
    'w-full text-left px-3 py-2 rounded-lg text-neutral-700 hover:bg-stone-200 transition-all duration-200 flex items-center gap-2 text-sm': true,
    'text-neutral-900 bg-stone-200 font-medium': activeItem.value === nonHeaderIndex
  }
}

const getDescription = (index) => {
  const nonHeaderItems = menuItems.filter(item => !item.type)
  const activeMenuItem = nonHeaderItems[index]
  
  const descriptions = {
    'A/B Test Planner': "Design and track A/B tests for your product",
    'Landing Page Copy': "Generate copy for your entire landing page",
    'GTM Strategy': "Plan and execute your go-to-market strategy",
    'Ideal Customer Profile': "Define and analyze your Ideal Customer Profile",
    'Link Builder': 'Build links in one click',
    'Launch Plan': "Plan and execute your product launch",
    'Metrics and KPI': "Improve metrics and KPIs",
    'MVP Generator': "Generate MVP features and requirements",
    'PRD Generator': "Generate comprehensive Product Requirements Documents",
    'Prioritization': "Prioritize features and initiatives",
    'Research Plan': "Create comprehensive user research plans",
    'SWOT Analysis': "Analyze strengths, weaknesses, opportunities, and threats",
    'User Journey Map': "Map out your user's journey and touchpoints",
    'Landing Page Conversion': "Optimize landing pages for better conversion rates",
    'SEO Analyser': "Analyse your website's SEO"
  }
  
  return descriptions[activeMenuItem?.label] || ''
}

// Set SEO metadata with noindex
useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }, // Prevent indexing
  ],
  title: 'GTMGuy Dashboard',
  description: 'Create and manage your go-to-market strategies with GTMGuy.',
})

// Add user state
const user = useSupabaseUser()

// Add user profile functionality
const supabase = useSupabaseClient()
const showDropdown = ref(false)
const userAvatar = computed(() => user.value?.user_metadata?.avatar_url)
const userInitial = computed(() => {
  const name = user.value?.user_metadata?.full_name || user.value?.email || 'U'
  const nameParts = name.split(' ')
  const firstInitial = nameParts[0].charAt(0)
  const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0) : ''
  return (firstInitial + lastInitial).toUpperCase()
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = (event) => {
  if (showDropdown.value && !event.target.closest('.user-profile')) {
    showDropdown.value = false
  }
}

const signOut = async () => {
  try {
    await supabase.auth.signOut()
    await navigateTo('/')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

// Add initialization logic
onMounted(async () => {
  if (!user.value) {
    await navigateTo('/')
  } else {
    await fetchOrCreateUserAccount()
  }
  document.addEventListener('click', closeDropdown)

  // Close mobile menu when route changes
  watch(() => activeItem.value, () => {
    isMobileMenuOpen.value = false
  })
  
  // Close mobile menu when clicking outside
  const handleClickOutside = (event) => {
    if (isMobileMenuOpen.value && !event.target.closest('aside') && !event.target.closest('button')) {
      isMobileMenuOpen.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

async function fetchOrCreateUserAccount() {
  try {
    await $fetch('/api/auth/create-account', {
      method: 'POST',
      body: {
        user_id: user.value.id,
        email: user.value.email,
      }
    })
  } catch (error) {
    console.error('Error initializing user account:', error)
  }
}

// Add credits state and fetching
const credits = ref(0)

// Add lifetime plan state
const isLifetimePlan = ref(false)

// Update the fetch credits function
const fetchCredits = async () => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('credits, lifetime_plan')
      .eq('user', user.value.id)
      .single()

    if (error) throw error
    
    isLifetimePlan.value = data?.lifetime_plan || false
    credits.value = data?.credits || 0
  } catch (error) {
    console.error('Error fetching credits:', error)
  }
}

// Fetch credits initially and after account creation
watch(user, async (newUser) => {
  if (newUser) {
    await fetchOrCreateUserAccount()
    await fetchCredits()
  }
}, { immediate: true })


// Add to existing imports
const isMobileMenuOpen = ref(false)
onMounted(() => {
  window.$crisp = []
  window.CRISP_WEBSITE_ID = "3448ab9c-c0d3-4622-9cf8-d83d0b7f29b5"
  
  const script = document.createElement('script')
  script.src = "https://client.crisp.chat/l.js"
  script.async = true
  document.head.appendChild(script)

  // Set up Crisp user email when script loads
  script.onload = () => {
    if (user.value?.email) {
      window.$crisp.push(["set", "user:email", user.value.email])
    }
  }
})
</script>

<style>
/* Optional: Add custom scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

/* Add to existing styles */
@media (max-width: 1024px) {
  body {
    overflow-x: hidden;
  }
}
</style>
