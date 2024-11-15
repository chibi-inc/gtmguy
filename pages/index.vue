<template>
  <div class="flex min-h-screen bg-gradient-to-br from-stone-100 to-stone-200">
    <!-- Sidebar -->
    <aside class="w-72 p-8 border-r border-stone-200 bg-white/50 backdrop-blur-sm">
      <div class="mb-10">
        <div class="flex items-center gap-3 mb-2">
          <Icon name="ph:rocket-launch-duotone" class="text-3xl text-sky-600" />
          <h1 class="text-2xl font-bold text-neutral-900">GTMGuy</h1>
        </div>
        <p class="text-sm text-neutral-600">Your AI-Powered Go-to-Market Assistant</p>
      </div>
      <nav>
        <ul class="space-y-3">
          <li v-for="(item, index) in menuItems" :key="index">
            <button 
              :class="getMenuItemClasses(index)"
              @click="activeItem = index"
            >
              <Icon :name="item.icon" class="text-xl" :class="activeItem === index ? 'text-sky-600' : 'text-neutral-600'" />
              {{ item.label }}
            </button>
          </li>
        </ul>
      </nav>
      
      <!-- Footer -->
      <div class="mt-auto pt-8 border-t border-stone-200 mt-8">
        <div class="flex items-center gap-2 text-sm text-neutral-600">
          <Icon name="ph:info-duotone" class="text-lg" />
          <span>Version 1.0.0</span>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 p-8">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-neutral-900">{{ menuItems[activeItem].label }}</h2>
        <p class="text-neutral-600 mt-1">{{ getDescription(activeItem) }}</p>
      </div>
      <div class="rounded-xl border border-stone-200 bg-white/50 backdrop-blur-sm p-6 shadow-sm">
        <component :is="currentComponent" />
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

const activeItem = ref(0)

const menuItems = [
  { label: 'ICP', icon: 'ph:buildings-duotone', component: ICP },
  { label: 'GTM Strategy', icon: 'ph:target-duotone', component: GtmStrategy },
  { label: 'SWOT Analysis', icon: 'ph:chart-pie-slice-duotone', component: SwotAnalysis },
  { label: 'A/B Test Planner', icon: 'ph:test-tube-duotone', component: AbTestPlanner },
  { label: 'User Journey Map', icon: 'ph:map-trifold-duotone', component: UserJourneyMap },
  { label: 'Metrics and KPI', icon: 'ph:chart-line-up-duotone', component: MetricsKpi },
  { label: 'MVP Generator', icon: 'ph:cube-duotone', component: MvpGenerator },
]

const currentComponent = computed(() => menuItems[activeItem.value].component)

const getMenuItemClasses = (index) => ({
  'w-full text-left px-5 py-3.5 rounded-xl text-neutral-700 hover:bg-stone-200 transition-all duration-200 flex items-center gap-3': true,
  'text-neutral-900 bg-stone-200 font-medium': activeItem.value === index
})

const getDescription = (index) => {
  const descriptions = {
    0: "Define and analyze your Ideal Customer Profile",
    1: "Plan and execute your go-to-market strategy",
    2: "Analyze strengths, weaknesses, opportunities, and threats",
    3: "Design and track A/B tests for your product",
    4: "Map out your user's journey and touchpoints",
    5: "Track key performance indicators and metrics",
    6: "Generate MVP features and requirements"
  }
  return descriptions[index]
}
</script>
