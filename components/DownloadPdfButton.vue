<template>
  <button
    @click="downloadPdf"
    class="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-stone-100 hover:bg-stone-200 text-neutral-700 rounded-lg transition-colors duration-200"
  >
    <Icon name="ph:file-pdf-duotone" class="text-base" />
    Download PDF
  </button>
</template>

<script setup>
import { generatePdf } from '~/utils/generatePdf'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
})

const downloadPdf = () => {
  generatePdf(props.title, props.content)
}
</script> 