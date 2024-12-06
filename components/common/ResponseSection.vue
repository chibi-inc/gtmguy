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
import html2pdf from 'html2pdf.js'

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
    const styleSheet = document.createElement('style')
    styleSheet.textContent = `
      .prose {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                     Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 
                     'Helvetica Neue', Arial, sans-serif;
        line-height: 1.5;
        color: #374151;
        padding: 0 1rem;
      }

      .prose h1 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 1.5em;
        color: #111827;
        page-break-inside: avoid;
      }

      .prose h2 {
        font-size: 20px;
        font-weight: 600;
        margin-top: 1.5em;
        margin-bottom: 1em;
        color: #1F2937;
        page-break-inside: avoid;
      }

      .prose h3 {
        font-size: 18px;
        font-weight: 600;
        margin-top: 1.5em;
        margin-bottom: 1em;
        color: #1F2937;
        page-break-inside: avoid;
      }

      .prose ul {
        list-style: none;
        padding-left: 0;
        margin: 1em 0;
      }

      .prose ul li {
        position: relative;
        padding-left: 1.5em;  /* Increased padding for consistent text alignment */
        margin-bottom: 0.5em;
      }

      /* Primary bullet */
      .prose > div > ul > li::before {
        content: "•";
        position: absolute;
        left: 0.75em;  /* Adjusted for consistent spacing */
        color: #4B5563;
        font-size: 1em;
      }

      /* Secondary bullet */
      .prose > div > ul > li > ul > li::before {
        content: "•";
        position: absolute;
        left: 0.75em;  /* Matched with primary bullet spacing */
        color: #4B5563;
        font-size: 0.8em;
        top: 0.2em;
      }

      /* Proper spacing for nested lists */
      .prose > div > ul > li > ul {
        margin-top: 0.5em;
        margin-bottom: 0;
        padding-left: 0.5em;
      }

      /* Handle paragraphs in list items */
      .prose > div > ul > li > p {
        margin: 0;
        display: inline-block;
        page-break-inside: avoid;
      }

      /* Keep list items together */
      .prose > div > ul > li {
      }

      /* Strong text styling */
      .prose strong {
        font-weight: 600;
        color: #111827;
      }

      /* Horizontal rule styling */
      .prose hr {
        margin: 2em 0;
        border: 0;
        border-top: 1px solid #E5E7EB;
        page-break-after: avoid;
      }

      /* Max width to ensure readability */
      .prose.max-w-none {
        max-width: none;
        width: 100%;
      }

    `
    document.head.appendChild(styleSheet)

    const element = document.querySelector('.prose')
    if (!element) return

    const options = {
      margin: [20, 20, 20, 20],
      filename: 'gtmguy-response.pdf',
      image: { 
        type: 'jpeg', 
        quality: 0.98 
      },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        scrollY: -window.scrollY,
        windowWidth: 1200,
        onclone: function(clonedDoc) {
          const clonedElement = clonedDoc.querySelector('.prose')
          if (clonedElement) {
            clonedElement.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", Arial, sans-serif'
            clonedElement.style.fontSize = '14px'
            
            // Enhanced bullet and text alignment handling
            const listItems = clonedElement.querySelectorAll('li')
            listItems.forEach(li => {
              li.style.position = 'relative'
              li.style.breakInside = 'avoid'
              if (li.querySelector('p')) {
                li.querySelector('p').style.display = 'inline-block'
                li.querySelector('p').style.breakInside = 'avoid'
              }
            })

            // Additional page break prevention for sections
            const sections = clonedElement.querySelectorAll('h1, h2, h3, h4, h5, h6')
            sections.forEach(section => {
              section.style.pageBreakAfter = 'avoid'
              if (section.nextElementSibling) {
                section.nextElementSibling.style.pageBreakBefore = 'avoid'
              }
            })
          }
        }
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true,
        precision: 16,
        putOnlyUsedFonts: true
      }
    }

    await html2pdf()
      .set(options)
      .from(element)
      .save()

    document.head.removeChild(styleSheet)
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
  .prose strong {
    font-weight: 600;
    font-size: 14px;
  }
}
</style> 
