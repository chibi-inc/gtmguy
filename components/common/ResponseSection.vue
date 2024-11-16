<template>
  <div v-if="content" class="mt-8 space-y-6">
    <div class="border-t border-stone-200 pt-8">
      <!-- Response Header -->
      <div class="flex items-center justify-end mb-6">
        <div class="flex items-center gap-3">
          <button
            @click="copyToClipboard"
            class="px-3 py-1.5 text-neutral-600 hover:text-neutral-900 flex items-center gap-2 text-sm transition-colors"
          >
            <Icon :name="copied ? 'ph:check-duotone' : 'ph:copy-duotone'" class="text-lg" />
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
          <button
            @click="$emit('clear')"
            class="px-3 py-1.5 text-neutral-600 hover:text-neutral-900 flex items-center gap-2 text-sm transition-colors"
          >
            <Icon name="ph:x-duotone" class="text-lg" />
            Clear
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
        <div class="prose prose-stone max-w-none">
          <div v-html="markdownToHtml(content)"></div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-4 flex justify-end">
        <button
          @click="regenerate"
          class="flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors text-sm"
        >
          <Icon name="ph:arrows-counter-clockwise-duotone" class="text-lg" />
          Regenerate
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['clear', 'regenerate'])

const copied = ref(false)

const markdownToHtml = (markdown) => {
  return marked(markdown)
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.content)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}


const regenerate = () => {
  emit('regenerate')
}
</script>

<style>
.prose {
  @apply text-neutral-700;
}
.prose h1, .prose h2, .prose h3 {
  @apply text-neutral-900 font-semibold;
}
.prose h1 {
  @apply text-2xl mb-6;
}
.prose h2 {
  @apply text-xl mb-4 mt-8;
}
.prose h3 {
  @apply text-lg mb-3 mt-6;
}
.prose ul {
  @apply list-disc pl-4 mb-4 space-y-2;
}
.prose ol {
  @apply list-decimal pl-4 mb-4 space-y-2;
}
.prose p {
  @apply mb-4 leading-relaxed;
}
.prose strong {
  @apply text-neutral-900;
}
.prose blockquote {
  @apply border-l-4 border-stone-200 pl-4 italic my-4;
}
.prose code {
  @apply bg-stone-100 px-1.5 py-0.5 rounded text-sm font-mono;
}
.prose pre {
  @apply bg-stone-100 p-4 rounded-lg my-4 overflow-x-auto;
}
.prose table {
  @apply w-full border-collapse my-4;
}
.prose th, .prose td {
  @apply border border-stone-200 px-4 py-2;
}
.prose th {
  @apply bg-stone-50;
}
</style> 