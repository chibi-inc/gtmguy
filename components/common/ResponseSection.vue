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

    // A4 dimensions
    const a4Width = 595.28
    const a4Height = 841.89
    const margin = 50
    const contentWidth = a4Width - (2 * margin)

    // Initialize PDF
    const pdf = new jsPDF('p', 'pt', 'a4')
    
    // Set default font and colors
    pdf.setFont('helvetica')
    pdf.setFontSize(10.5)
    pdf.setTextColor(55, 65, 81)

    // Enhanced text handling with better visual hierarchy
    const addTextWithBreaks = (text, x, y, maxWidth, options = {}) => {
      const {
        align = 'left',
        fontSize = 10.5,
        fontStyle = 'normal',
        lineSpacing = 1.4,
        color = [55, 65, 81],
        indent = 0
      } = options

      pdf.setFontSize(fontSize)
      pdf.setFont('helvetica', fontStyle)
      pdf.setTextColor(...color)
      
      const lines = pdf.splitTextToSize(text.trim(), maxWidth - indent)
      const lineHeight = (pdf.getLineHeight() * lineSpacing)
      
      lines.forEach((line, index) => {
        let xPos = x + indent
        if (align === 'center') {
          xPos = x + (maxWidth - pdf.getTextWidth(line)) / 2
        } else if (align === 'right') {
          xPos = x + maxWidth - pdf.getTextWidth(line)
        }
        pdf.text(line, xPos, y + (index * lineHeight))
      })

      return lines.length * lineHeight
    }

    // Parse HTML content
    const parser = new DOMParser()
    const htmlContent = parser.parseFromString(markdownToHtml(props.content), 'text/html')
    const elements = htmlContent.body.children

    let currentY = margin + 20
    let currentPage = 1

    // Add header with better styling
    pdf.setFillColor(249, 250, 251)
    pdf.rect(0, 0, a4Width, 70, 'F')
    pdf.setDrawColor(229, 231, 235)
    pdf.line(0, 70, a4Width, 70)
    
    addTextWithBreaks('GTMGuy Response', margin, 45, contentWidth, {
      fontSize: 10,
      fontStyle: 'bold',
      color: [17, 24, 39],
      lineSpacing: 1
    })
    currentY = 90

    // Process each element with enhanced styling
    for (const element of elements) {
      if (currentY > a4Height - (margin + 50)) {
        pdf.addPage()
        currentPage++
        currentY = margin + 20
        // Add header to new pages
        pdf.setFillColor(249, 250, 251)
        pdf.rect(0, 0, a4Width, 40, 'F')
        pdf.setDrawColor(229, 231, 235)
        pdf.line(0, 40, a4Width, 40)
      }

      switch (element.tagName.toLowerCase()) {
        case 'h1':
          currentY += 20
          const h1Height = addTextWithBreaks(element.textContent, margin, currentY, contentWidth, {
            fontSize: 18,
            fontStyle: 'bold',
            lineSpacing: 1.3,
            color: [17, 24, 39]
          })
          currentY += h1Height + 6
          // Add section divider
          pdf.setDrawColor(229, 231, 235)
          pdf.setLineWidth(0.5)
          pdf.line(margin, currentY, a4Width - margin, currentY)
          currentY += 12
          break

        case 'h2':
          currentY += 16
          const h2Height = addTextWithBreaks(element.textContent, margin, currentY, contentWidth, {
            fontSize: 14,
            fontStyle: 'bold',
            lineSpacing: 1.3,
            color: [31, 41, 55]
          })
          currentY += h2Height + 10
          break

        case 'p':
          currentY += 8
          const pHeight = addTextWithBreaks(element.textContent, margin, currentY, contentWidth, {
            lineSpacing: 1.6,
            color: [75, 85, 99]
          })
          currentY += pHeight + 10
          break

        case 'ul':
        case 'ol':
          currentY += 8
          const items = element.getElementsByTagName('li')
          for (let i = 0; i < items.length; i++) {
            const isOrdered = element.tagName.toLowerCase() === 'ol'
            const bullet = isOrdered ? `${i + 1}.` : '•'
            const itemText = items[i].textContent.trim()
            const bulletWidth = pdf.getTextWidth(bullet + '  ')
            
            // Add bullet/number with proper alignment
            addTextWithBreaks(bullet, margin, currentY, bulletWidth, {
              align: isOrdered ? 'right' : 'center',
              color: [107, 114, 128]
            })
            
            // Add list item text with indent
            const itemHeight = addTextWithBreaks(
              itemText,
              margin + bulletWidth,
              currentY,
              contentWidth - bulletWidth,
              { 
                lineSpacing: 1.5,
                indent: 12,
                color: [75, 85, 99]
              }
            )
            
            currentY += itemHeight + 8

            if (currentY > a4Height - (margin + 50) && i < items.length - 1) {
              pdf.addPage()
              currentPage++
              currentY = margin + 20
              pdf.setFillColor(249, 250, 251)
              pdf.rect(0, 0, a4Width, 40, 'F')
              pdf.line(0, 40, a4Width, 40)
            }
          }
          currentY += 10
          break
      }
    }

    // Enhanced footer styling
    for (let i = 1; i <= currentPage; i++) {
      pdf.setPage(i)
      pdf.setDrawColor(229, 231, 235)
      pdf.setLineWidth(0.5)
      pdf.line(margin, a4Height - 35, a4Width - margin, a4Height - 35)
      pdf.setFontSize(8)
      pdf.setTextColor(156, 163, 175)
      pdf.text('Generated by GTMGuy.ai', margin, a4Height - 18)
      pdf.text(`Page ${i} of ${currentPage}`, a4Width - margin - 50, a4Height - 18)
    }

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
  .prose strong {
    font-weight: 600;
    font-size: 14px;
  }
}
</style> 
