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
            @click="downloadPdf"
            class="px-3 py-1.5 text-neutral-600 hover:text-neutral-900 flex items-center gap-2 text-sm transition-colors rounded-md hover:bg-stone-50"
          >
            <Icon name="ph:file-pdf-duotone" class="text-lg" />
            Download PDF
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
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

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

const downloadPdf = async () => {
  try {
    const contentElement = document.querySelector('.prose')
    if (!contentElement) return

    // Get the actual rendered content
    const canvas = await html2canvas(contentElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      windowWidth: contentElement.scrollWidth,
      onclone: (clonedDoc) => {
        const element = clonedDoc.querySelector('.prose')
        element.style.padding = '40px'
        element.style.borderRadius = '0'
        element.style.border = 'none'
      }
    })

    // A4 dimensions in points
    const a4Width = 595.28
    const a4Height = 841.89
    const margin = 40

    // Calculate dimensions
    const imgWidth = a4Width - (2 * margin)
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // Initialize PDF
    const pdf = new jsPDF('p', 'pt', 'a4')
    
    // Calculate number of pages needed
    const pageHeight = a4Height - (2 * margin)
    const pagesNeeded = Math.ceil(imgHeight / pageHeight)
    
    // Add content page by page
    for (let page = 0; page < pagesNeeded; page++) {
      // Add new page if not first page
      if (page > 0) {
        pdf.addPage()
      }

      // Calculate what portion of the image to use for this page
      const sourceY = page * pageHeight * (canvas.width / imgWidth)
      const sourceHeight = Math.min(
        pageHeight * (canvas.width / imgWidth),
        canvas.height - sourceY
      )
      
      // Create a temporary canvas for this page's content
      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = canvas.width
      pageCanvas.height = sourceHeight
      
      const context = pageCanvas.getContext('2d')
      context.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sourceHeight,
        0,
        0,
        canvas.width,
        sourceHeight
      )

      // Add content to PDF
      pdf.addImage(
        pageCanvas.toDataURL('image/png'),
        'PNG',
        margin,
        margin,
        imgWidth,
        (sourceHeight * imgWidth) / canvas.width
      )

      // Add footer
      pdf.setDrawColor(229, 231, 235)
      pdf.line(margin, a4Height - 25, a4Width - margin, a4Height - 25)
      pdf.setFontSize(8)
      pdf.setTextColor(156, 163, 175)
      pdf.text('Generated by GTMGuy.ai', margin, a4Height - 12)
      pdf.text(`Page ${page + 1} of ${pagesNeeded}`, a4Width - margin - 60, a4Height - 12)
    }

    // Save PDF
    pdf.save('gtmguy-response.pdf')
  } catch (error) {
    console.error('Error generating PDF:', error)
  }
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

/* Add styles to ensure proper PDF rendering */
.prose {
  background: white;
  padding: 20px;
  margin: 0;
  width: 100%;
}

@media print {
  .prose {
    font-size: 12px;
    line-height: 1.5;
  }

  .prose h1 {
    font-size: 18px;
    margin-bottom: 16px;
  }

  .prose h2 {
    font-size: 16px;
    margin-bottom: 12px;
  }

  .prose p {
    margin-bottom: 12px;
  }
}
</style> 
