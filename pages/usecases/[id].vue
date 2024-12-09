<template>
  <TheNavbar />
  <div v-if="!currentUseCase" class="p-8 text-center">
    <h1 class="text-2xl font-bold text-gray-900">Use Case Not Found</h1>
    <p class="text-gray-600 mt-2">The requested use case could not be found.</p>
  </div>
  <template v-else>
    <div class="bg-gray-100 py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-sm breadcrumbs">
          <span class="text-gray-600">{{ currentStage.label }}</span>
          <span class="mx-2">→</span>
          <span class="font-medium">{{ currentUseCase.name }}</span>
        </div>
      </div>
    </div>
    <UseCaseLanding :usecase="currentUseCase" />
    <TheFooter />
  </template>
</template>

<script setup>
import { usecases, stages } from '~/config/usecases'
import UseCaseLanding from '~/components/landing/UseCaseLanding.vue'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const currentUseCase = usecases[route.params.id]
const currentStage = computed(() => 
  currentUseCase ? stages.find(stage => stage.id === currentUseCase.stage) : null
)

// Add SEO
if (currentUseCase) {
  useHead({
    title: `${currentUseCase.name} - ${currentStage.value.label}`,
    meta: [
      { name: 'description', content: currentUseCase.description },
    ]
  })
}
</script>
