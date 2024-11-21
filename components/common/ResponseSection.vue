<template>
  <div v-if="content" class="mt-8 space-y-6" ref="responseContainer">
    <div class="border-t border-stone-200 pt-8">
      <!-- Response Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2 text-neutral-600">
          <Icon name="ph:chat-circle-text-duotone" class="text-lg" />
          <span class="font-medium">GTMGuy</span>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="downloadMarkdown"
            class="px-3 py-1.5 text-neutral-600 hover:text-neutral-900 flex items-center gap-2 text-sm transition-colors rounded-md hover:bg-stone-50"
          >
            <Icon name="ph:download-duotone" class="text-lg" />
            Download
          </button>
          <button
            @click="copyToClipboard"
            class="px-3 py-1.5 text-neutral-600 hover:text-neutral-900 flex items-center gap-2 text-sm transition-colors rounded-md hover:bg-stone-50"
          >
            <Icon :name="copied ? 'ph:check-duotone' : 'ph:copy-duotone'" class="text-lg" />
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
          <button
            @click="$emit('clear')"
            class="px-3 py-1.5 text-neutral-600 hover:text-neutral-900 flex items-center gap-2 text-sm transition-colors rounded-md hover:bg-stone-50"
          >
            <Icon name="ph:x-duotone" class="text-lg" />
            Clear 
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="prose prose-stone max-w-none">
          <div v-html="markdownToHtml(content)"></div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-4 flex justify-end">
        <button
          @click="regenerate"
          class="flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors text-sm px-3 py-1.5 rounded-md hover:bg-sky-50"
        >
          <Icon name="ph:arrows-counter-clockwise-duotone" class="text-lg" />
          Regenerate
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
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

const responseContainer = ref(null)

watch(() => props.content, async (newContent) => {
  if (newContent) {
    // Wait for the next tick and DOM update
    await nextTick()
    // Increase delay slightly to ensure content is fully rendered
    setTimeout(() => {
      responseContainer.value?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'  // Changed from 'start' to 'center' for better UX
      })
    }, 200)  // Increased from 100ms to 200ms
  }
})

const regenerate = () => {
  emit('regenerate')
}

const downloadMarkdown = () => {
  const blob = new Blob([props.content], { type: 'text/markdown' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'gtmguy-response.md'
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
</script>

<style>
.prose {
  @apply text-neutral-700;
}
.prose h1, .prose h2, .prose h3 {
  @apply text-neutral-900 font-semibold tracking-tight;
}
.prose h1 {
  @apply text-2xl mb-6 border-b border-stone-200 pb-4;
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
  @apply bg-stone-100 px-1.5 py-0.5 rounded text-sm font-mono text-neutral-800;
}
.prose pre {
  @apply bg-stone-100 p-4 rounded-lg my-4 overflow-x-auto shadow-sm;
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