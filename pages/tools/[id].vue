<template>
<TheNavbar />
  <ToolLanding :tool="currentTool" />
</template>

<script setup>
import { tools } from '~/config/tools'
import ToolLanding from '~/components/landing/ToolLanding.vue'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const currentTool = tools[route.params.id]
const { signInWithGoogle, isLoading } = useAuth()

// Add SEO
useHead({
  title: currentTool.seo.title,
  meta: [
    { name: 'description', content: currentTool.seo.description },
    { name: 'keywords', content: currentTool.seo.keywords.join(', ') },
    // Add Open Graph tags...
  ]
})
</script> 