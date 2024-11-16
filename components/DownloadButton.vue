<template>
  <button
    @click="handleDownload"
    class="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 text-neutral-700 rounded-lg hover:bg-stone-200 transition-all duration-200"
  >
    <Icon name="ph:download-simple-duotone" class="text-lg" />
    <span>Download PDF</span>
  </button>
</template>

<script setup>
const props = defineProps({
  content: {
    type: [String, Array, Object],
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const { downloadPdf } = usePdf()

const handleDownload = () => {
  downloadPdf(props.content, props.title)
}
</script> 