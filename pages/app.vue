<template>
  <div class="flex min-h-screen bg-gradient-to-br from-stone-100 to-stone-200">
    <!-- Fixed Sidebar -->
    <aside class="fixed inset-y-0 left-0 w-72 bg-white/50 backdrop-blur-sm border-r border-stone-200">
      <div class="flex flex-col h-full p-6">
        <!-- Header -->
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-2">
            <Icon name="ph:rocket-launch-duotone" class="text-3xl text-sky-600" />
            <h1 class="text-2xl font-bold text-neutral-900">GTMGuy</h1>
          </div>
          <p class="text-sm text-neutral-600">Your AI-Powered Product & Marketing Suite
        </p>
        </div>

        <!-- Navigation -->
        <nav class="flex-1">
          <ul class="grid grid-cols-1 gap-1.5">
            <li v-for="(item, index) in menuItems" :key="index">
              <button 
                :class="getMenuItemClasses(index)"
                @click="activeItem = index"
              >
                <Icon 
                  :name="item.icon" 
                  class="text-lg shrink-0" 
                  :class="activeItem === index ? 'text-sky-600' : 'text-neutral-600'" 
                />
                <span class="truncate">{{ item.label }}</span>
              </button>
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

    <!-- Main Content Area -->
    <main class="flex-1 ml-72">
      <div class="max-w-6xl mx-auto p-8">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-neutral-900">{{ menuItems[activeItem].label }}</h2>
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
import { ref, computed } from 'vue'
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

const activeItem = ref(0)

const menuItems = [
  { label: 'A/B Test Planner', icon: 'ph:test-tube-duotone', component: AbTestPlanner },
  { label: 'Copy Generator', icon: 'ph:pencil-duotone', component: CopyOptimizer },
  { label: 'GTM Strategy', icon: 'ph:target-duotone', component: GtmStrategy },
  { label: 'Ideal Customer Profile', icon: 'ph:user-duotone', component: ICP },
  { label: 'Launch Plan', icon: 'ph:rocket-launch-duotone', component: ProductLaunchPlan },
  { label: 'Metrics and KPI', icon: 'ph:chart-line-up-duotone', component: MetricsKpi },
  { label: 'MVP Generator', icon: 'ph:cube-duotone', component: MvpGenerator },
  { label: 'PRD Generator', icon: 'ph:file-text-duotone', component: PrdGenerator },
  { label: 'Prioritization', icon: 'ph:list-numbers-duotone', component: Prioritization },
  { label: 'Research Plan', icon: 'ph:magnifying-glass-duotone', component: UserResearchPlan },
  { label: 'SWOT Analysis', icon: 'ph:chart-pie-slice-duotone', component: SwotAnalysis },
  { label: 'User Journey Map', icon: 'ph:map-trifold-duotone', component: UserJourneyMap }
]

const currentComponent = computed(() => menuItems[activeItem.value].component)

const getMenuItemClasses = (index) => ({
  'w-full text-left px-3 py-2 rounded-lg text-neutral-700 hover:bg-stone-200 transition-all duration-200 flex items-center gap-2 text-sm': true,
  'text-neutral-900 bg-stone-200 font-medium': activeItem.value === index
})

const getDescription = (index) => {
  const descriptions = {
    0: "Design and track A/B tests for your product",
    1: "Generate copy for target customers",
    2: "Plan and execute your go-to-market strategy",
    3: "Define and analyze your Ideal Customer Profile",
    4: "Plan and execute your product launch",
    5: "Track key performance indicators and metrics",
    6: "Generate MVP features and requirements",
    7: "Generate comprehensive Product Requirements Documents",
    8: "Prioritize features and initiatives",
    9: "Create comprehensive user research plans",
    10: "Analyze strengths, weaknesses, opportunities, and threats",
    11: "Map out your user's journey and touchpoints"
  }
  return descriptions[index]
}
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
</style>
