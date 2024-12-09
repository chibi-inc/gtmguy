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
      <!-- Main sidebar container with flex and overflow handling -->
      <div class="flex flex-col h-full">
        <!-- Fixed Header -->
        <div class="flex-shrink-0 p-6 pb-4">
          <div class="flex items-center gap-3 mb-2">
            <Icon name="ph:rocket-duotone" class="text-3xl text-sky-600" />
            <NuxtLink to="/" class="text-2xl font-bold text-neutral-900">GTMGuy</NuxtLink>
          </div>
          <p class="text-sm text-neutral-600">Your AI-Powered Product & Marketing Suite</p>
        </div>

        <!-- Scrollable Navigation -->
        <nav class="flex-1 overflow-y-auto px-4">
          <!-- Journey Progress -->
          <div class="mb-4 px-2">
            <div class="text-xs font-medium text-neutral-600 mb-2">Your Product Journey</div>
            <div class="relative flex justify-between">
              <!-- Progress Line -->
              <div class="absolute top-4 left-0 right-0 h-0.5 bg-stone-200">
                <div 
                  class="h-full bg-sky-500 transition-all duration-300"
                  :style="{
                    width: getProgressWidth
                  }"
                ></div>
              </div>
              
              <!-- Stage Indicators -->
              <div 
                v-for="(stage, index) in stages" 
                :key="stage.id"
                class="relative z-10 flex flex-col items-center gap-1"
              >
                <button
                  @click="activeStage = stage.id"
                  class="group flex flex-col items-center gap-1 cursor-pointer"
                >
                  <div 
                    class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    :class="[
                      getStageStatus(stage.id) === 'completed' ? 'bg-sky-500 text-white' :
                      getStageStatus(stage.id) === 'current' ? 'bg-sky-100 text-sky-600 ring-2 ring-sky-500' :
                      'bg-stone-100 text-neutral-400 hover:bg-stone-200'
                    ]"
                  >
                    <Icon :name="stage.icon" class="text-lg" />
                  </div>
                  <span 
                    class="text-[10px] font-medium text-center transition-colors duration-200"
                    :class="[
                      activeStage === stage.id ? 'text-sky-600' : 'text-neutral-500',
                      'group-hover:text-sky-600'
                    ]"
                  >
                    {{ stage.label }}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- Stage Content -->
          <div class="space-y-4">
            <!-- Current Stage Info -->
            <div class="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-sky-100 flex-shrink-0 flex items-center justify-center">
                  <Icon :name="getCurrentStage.icon" class="text-lg text-sky-600" />
                </div>
                <div>
                  <h3 class="text-sm font-medium text-neutral-900">{{ getCurrentStage.label }}</h3>
                  <p class="text-xs text-neutral-600 mt-0.5">{{ getCurrentStage.description }}</p>
                </div>
              </div>
            </div>

            <!-- Stage Tools -->
            <div class="space-y-2">
              <div class="text-xs font-medium text-neutral-600 px-2">Available Tools</div>
              <ul class="grid grid-cols-1 gap-1">
                <li v-for="(item, index) in filteredMenuItems" :key="index">
                  <button 
                    v-if="!item.type"
                    :class="getMenuItemClasses(item, index)"
                    @click="selectMenuItem(item)"
                  >
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                           :class="{'bg-sky-100': isActiveMenuItem(item)}">
                        <Icon 
                          :name="item.icon" 
                          class="text-base"
                          :class="isActiveMenuItem(item) ? 'text-sky-600' : 'text-neutral-600'" 
                        />
                      </div>
                      <div class="flex flex-col items-start">
                        <span class="text-sm font-medium truncate">{{ item.label }}</span>
                        <span class="text-[10px] text-neutral-500 truncate">{{ getShortDescription(item.label) }}</span>
                      </div>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <!-- Fixed Footer -->
        <div class="flex-shrink-0 p-6 pt-4 border-t border-stone-200">
          <div class="flex items-center gap-2 text-sm text-neutral-600">
            <Icon name="ph:info-duotone" class="text-lg" />
            <span>Version 1.1.0</span>
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
                <span>{{ credits }} reports left</span>
              </div>
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
          <component 
            :is="currentComponent" 
            @update-credits="credits--"
          />
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
import InternalLinksOptimizer from '~/components/InternalLinksOptimizer.vue'
import BlogWriter from '~/components/BlogWriter.vue' 
import getUtcStartOfMonth from '~/server/utils/getUtcStartOfMonth'
const activeItem = ref(0)

const menuItems = [
  // Discovery & Strategy
  { 
    label: 'Understand Your Market',
    type: 'header'
  },
  { label: 'Ideal Customer Profile', icon: 'ph:user-duotone', component: ICP },
  { label: 'User Research Plan', icon: 'ph:magnifying-glass-duotone', component: UserResearchPlan },
  { label: 'SWOT Analysis', icon: 'ph:chart-pie-slice-duotone', component: SwotAnalysis },
  
  // Product Planning
  { 
    label: 'Build Your Product',
    type: 'header'
  },
  { label: 'MVP Generator', icon: 'ph:cube-duotone', component: MvpGenerator },
  { label: 'PRD Generator', icon: 'ph:file-text-duotone', component: PrdGenerator },
  { label: 'Prioritization', icon: 'ph:list-numbers-duotone', component: Prioritization },
  { label: 'User Journey Map', icon: 'ph:map-trifold-duotone', component: UserJourneyMap },
  { label: 'Metrics and KPI', icon: 'ph:chart-line-up-duotone', component: MetricsKpi },
  
  // Launch & GTM
  { 
    label: 'Launch Your Product',
    type: 'header'
  },
  { label: 'GTM Strategy', icon: 'ph:target-duotone', component: GtmStrategy },
  { label: 'Launch Plan', icon: 'ph:rocket-launch-duotone', component: ProductLaunchPlan },
  { label: 'Landing Page Conversion', icon: 'ph:browser-duotone', component: LandingPageConversion },
  { label: 'SEO Analyser', icon:'ph:google-logo-duotone', component: SeoOptimizer },
  
  // Marketing & Growth
  { 
    label: 'Grow Your Product',
    type: 'header'
  },
  { label: 'Copywriter', icon: 'ph:pencil-duotone', component: CopyOptimizer },
  { label: 'Link Builder', icon:'ph:link-duotone', component: InternalLinksOptimizer },
  { label: 'A/B Test Planner', icon: 'ph:test-tube-duotone', component: AbTestPlanner },
  { label: 'Blog Writer', icon: 'ph:article-duotone', component: BlogWriter },
]

const currentComponent = computed(() => {
  const activeMenuItem = menuItems.filter(item => !item.type)[activeItem.value]
  return activeMenuItem?.component
})

const getMenuItemClasses = (item, index) => {
  return {
    'w-full text-left px-2 py-1 rounded-lg hover:bg-stone-100 transition-all duration-200 flex items-center': true,
    'bg-stone-100': isActiveMenuItem(item),
    'text-neutral-900': isActiveMenuItem(item),
    'text-neutral-700': !isActiveMenuItem(item)
  }
}

const getDescription = (index) => {
  const nonHeaderItems = menuItems.filter(item => !item.type)
  const activeMenuItem = nonHeaderItems[index]
  
  const descriptions = {
    // Discovery & Strategy
    'Ideal Customer Profile': "Define your target audience with detailed personas and market insights",
    'User Research Plan': "Create comprehensive research plans to validate assumptions and gather user insights",
    'SWOT Analysis': "Analyze your product's position in the market with detailed strengths, weaknesses, opportunities, and threats",
    
    // Product Planning
    'MVP Generator': "Define core features and requirements for your minimum viable product",
    'PRD Generator': "Create detailed product requirement documents that align team objectives",
    'Prioritization': "Use data-driven frameworks to prioritize features and initiatives",
    'User Journey Map': "Map out comprehensive user flows and identify optimization opportunities",
    'Metrics and KPI': "Define key metrics to track product success and growth",
    
    // Launch & GTM
    'GTM Strategy': "Build comprehensive go-to-market strategies for product success",
    'Launch Plan': "Create detailed launch plans with timelines and success metrics",
    
    // Marketing & Growth
    'Copywriter': "Generate compelling copy that converts visitors into customers",
    'Landing Page Conversion': "Optimize landing pages for better conversion rates",
    'SEO Analyser': "Improve your website's search engine visibility and performance",
    'Link Builder': "Create strategic internal links to boost SEO and user engagement",
    'A/B Test Planner': "Design and track experiments to optimize product performance",
    'Blog Writer': "Write compelling blog posts to attract and engage your audience"
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

  script: [
  {
      type: 'text/javascript',
      children: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "p56ykifasc");`
    }
  ]
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

// Update the fetch credits function
const fetchCredits = async () => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('credits, credits_last_reset')
      .eq('user', user.value.id)
      .single()

    if (error) throw error
    
    // If it's a new month, show 100 credits
    const startOfMonth = getUtcStartOfMonth()
    
    if (data?.credits_last_reset < startOfMonth) {
      credits.value = 100  // Show 100 credits at start of month
    } else {
      credits.value = data?.credits || 0
    }
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

// const updateLifetimePlan = (value) => {
//   isLifetimePlan.value = value
// }

// Add new helper functions
const getShortDescription = (label) => {
  const descriptions = {
    'Ideal Customer Profile': 'Define target audience',
    'User Research Plan': 'Plan user research',
    'SWOT Analysis': 'Analyze market position',
    'MVP Generator': 'Define core features',
    'PRD Generator': 'Create product docs',
    'Prioritization': 'Prioritize features',
    'User Journey Map': 'Map user flows',
    'Metrics and KPI': 'Track success metrics',
    'GTM Strategy': 'Plan market entry',
    'Launch Plan': 'Plan product launch',
    'Copywriter': 'Write converting copy',
    'Landing Page Conversion': 'Optimize conversions',
    'SEO Analyser': 'Improve SEO',
    'Link Builder': 'Build internal links',
    'A/B Test Planner': 'Plan experiments',
    'Blog Writer': 'Write compelling blog posts'
  }
  return descriptions[label] || ''
}

const getSectionDescription = (label) => {
  const descriptions = {
    'Discovery & Strategy': 'Understand your market',
    'Product Planning': 'Define your product',
    'Launch & GTM': 'Launch and go to market',
    'Marketing & Growth': 'Grow your product and get more users'
  }
  return descriptions[label] || ''
}

// Enhanced stages definition
const stages = [
  { 
    id: 'understand', 
    label: 'Understand', 
    icon: 'ph:binoculars-duotone',
    description: 'Research your market, define your target audience, and analyze competitors'
  },
  { 
    id: 'build', 
    label: 'Build', 
    icon: 'ph:cube-duotone',
    description: 'Plan your MVP, create PRDs, and prioritize features for development'
  },
  { 
    id: 'launch', 
    label: 'Launch', 
    icon: 'ph:rocket-launch-duotone',
    description: 'Create your GTM strategy and plan a successful product launch'
  },
  { 
    id: 'grow', 
    label: 'Grow', 
    icon: 'ph:chart-line-up-duotone',
    description: 'Optimize conversions, improve SEO, and scale your product'
  }
]

// Track active stage
const activeStage = ref('understand')

// Map menu items to stages
const menuStages = {
  'Understand Your Market': 'understand',
  'Build Your Product': 'build',
  'Launch Your Product': 'launch',
  'Grow Your Product': 'grow'
}

// Filter menu items based on active stage
const filteredMenuItems = computed(() => {
  let foundHeader = false
  return menuItems.filter(item => {
    if (item.type === 'header') {
      foundHeader = menuStages[item.label] === activeStage.value
      return foundHeader
    }
    return foundHeader
  })
})

// Update menu item selection
const selectMenuItem = (item) => {
  activeItem.value = menuItems.filter(i => !i.type).indexOf(item)
}

// Check if menu item is active
const isActiveMenuItem = (item) => {
  return activeItem.value === menuItems.filter(i => !i.type).indexOf(item)
}

// Get current stage info
const getCurrentStage = computed(() => {
  return stages.find(stage => stage.id === activeStage.value)
})

// Calculate progress width
const getProgressWidth = computed(() => {
  const currentIndex = stages.findIndex(stage => stage.id === activeStage.value)
  return `${(currentIndex / (stages.length - 1)) * 100}%`
})

// Get stage status (completed, current, upcoming)
const getStageStatus = (stageId) => {
  const currentIndex = stages.findIndex(stage => stage.id === activeStage.value)
  const stageIndex = stages.findIndex(stage => stage.id === stageId)
  
  if (stageIndex < currentIndex) return 'completed'
  if (stageIndex === currentIndex) return 'current'
  return 'upcoming'
}
</script>

<style>
/* Update scrollbar styling */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.overflow-y-auto:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
}

/* Add smooth transitions */
.sidebar-item-enter-active,
.sidebar-item-leave-active {
  transition: all 0.3s ease;
}

.sidebar-item-enter-from,
.sidebar-item-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

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

/* Add smooth transitions for stage changes */
.stage-enter-active,
.stage-leave-active {
  transition: all 0.2s ease-out;
}

.stage-enter-from,
.stage-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Add smooth hover effect for stage buttons */
.stage-button {
  transition: all 0.2s ease-out;
}

.stage-button:hover {
  transform: translateY(-1px);
}

/* Add active stage indicator animation */
.stage-active {
  animation: stage-pulse 2s infinite;
}

@keyframes stage-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.2);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(14, 165, 233, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(14, 165, 233, 0);
  }
}
</style>
