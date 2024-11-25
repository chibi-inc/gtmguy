<template>
  <div class="space-y-4">
    <!-- Header with stats -->
    <div class="bg-white rounded-lg border border-neutral-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold text-neutral-900">Link Suggestions</h3>
          <p class="text-sm text-neutral-600 mt-1">Found {{ suggestions.length }} relevant internal linking opportunities</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="text-sm text-neutral-600">
            Average Relevance: 
            <span class="font-semibold text-neutral-900">{{ averageRelevance }}%</span>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-neutral-50 rounded-lg p-4">
          <div class="flex items-center gap-2 text-neutral-600 mb-1">
            <Icon name="ph:link-duotone" class="text-lg" />
            <span class="text-sm">Total Suggestions</span>
          </div>
          <div class="text-2xl font-bold text-neutral-900">{{ suggestions.length }}</div>
        </div>
        <div class="bg-neutral-50 rounded-lg p-4">
          <div class="flex items-center gap-2 text-neutral-600 mb-1">
            <Icon name="ph:percent-duotone" class="text-lg" />
            <span class="text-sm">Average Match</span>
          </div>
          <div class="text-2xl font-bold text-neutral-900">{{ averageRelevance }}%</div>
        </div>
      </div>
    </div>

    <!-- Suggestions List -->
    <div class="bg-white rounded-lg border border-neutral-200">
      <div class="divide-y divide-neutral-100">
        <div 
          v-for="(suggestion, index) in suggestions" 
          :key="index"
          class="p-6"
        >
          <div class="space-y-4">
            <!-- Original Text -->
            <div>
              <div class="text-sm text-neutral-600 mb-1">Original Text</div>
              <div class="text-neutral-900">
                "{{ suggestion.originalText }}"
              </div>
            </div>
            
            <!-- Target URL -->
            <div>
              <div class="text-sm text-neutral-600 mb-1">Target URL</div>
              <a 
                :href="suggestion.targetUrl" 
                target="_blank" 
                class="text-sky-500 hover:text-sky-600 hover:underline break-all"
              >
                {{ suggestion.targetUrl }}
              </a>
            </div>

            <!-- Reason -->
            <div>
              <div class="text-sm text-neutral-600 mb-1">Reason</div>
              <p class="text-neutral-700">
                {{ suggestion.reason }}
              </p>
            </div>

            <!-- Scores -->
            <div class="flex gap-4">
              <div class="flex items-center gap-2">
                <div 
                  class="px-2 py-1 rounded text-sm font-medium"
                  :class="getScoreClass(suggestion.relevanceScore)"
                >
                  {{ suggestion.relevanceScore }}%
                </div>
                <span class="text-sm text-neutral-600">Relevance</span>
              </div>
              <div class="flex items-center gap-2">
                <div 
                  class="px-2 py-1 rounded text-sm font-medium"
                  :class="getScoreClass(suggestion.contextMatch)"
                >
                  {{ suggestion.contextMatch }}%
                </div>
                <span class="text-sm text-neutral-600">Context Match</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end gap-3">
      <button
        @click="$emit('regenerate')"
        class="flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors text-sm px-3 py-1.5 rounded-md hover:bg-sky-50"
      >
        <Icon name="ph:arrows-counter-clockwise-duotone" class="text-lg" />
        <span>Regenerate</span>
      </button>
      <button
        @click="$emit('clear')"
        class="px-3 py-1.5 text-neutral-600 hover:text-neutral-900 flex items-center gap-2 text-sm transition-colors rounded-md hover:bg-stone-50"
      >
        <Icon name="ph:x" class="text-lg" />
        <span>Clear</span>
      </button>
    </div>

    <!-- Enhanced Content Preview -->
    <div v-if="enhancedContent" class="bg-white rounded-lg border border-neutral-200 p-6">
      <div class="mb-4">
        <h4 class="text-lg font-semibold text-neutral-900">Enhanced Content</h4>
        <p class="text-sm text-neutral-600 mt-1">Content with suggested internal links applied</p>
      </div>
      <div 
        class="prose prose-neutral max-w-none"
        v-html="formattedContent"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Suggestion {
  originalText: string
  targetUrl: string
  relevanceScore: number
  contextMatch: number
  reason: string
}

const props = defineProps<{
  suggestions: Suggestion[]
  enhancedContent: string
}>()

defineEmits(['clear', 'regenerate'])

const averageRelevance = computed(() => {
  if (!props.suggestions.length) return 0
  const avg = props.suggestions.reduce((acc, curr) => acc + curr.relevanceScore, 0) / props.suggestions.length
  return Math.round(avg)
})

const formattedContent = computed(() => {
  return props.enhancedContent.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-sky-500 hover:text-sky-600 hover:underline">$1</a>'
  )
})

function getScoreClass(score: number) {
  if (score >= 80) return 'bg-green-100 text-green-700'
  if (score >= 60) return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
}
</script>

<style scoped>
.prose :deep(a) {
  text-decoration: none;
}

.prose :deep(a:hover) {
  text-decoration: underline;
}
</style> 