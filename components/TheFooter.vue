<template>
  <footer class="bg-stone-50/50 border-t border-stone-200">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 py-12">
        <!-- Brand Column -->
        <div class="space-y-4 md:col-span-3">
          <NuxtLink to="/" class="flex items-center gap-3">
            <div class="bg-neutral-900 text-white p-1.5 rounded-lg flex items-center justify-center">
              <Icon name="ph:rocket-duotone" class="text-xl" />
            </div>
            <span class="text-neutral-900 font-semibold">GTMGuy</span>
          </NuxtLink>
          <p class="text-sm text-neutral-600 leading-relaxed">
            AI-powered go-to-market tools to help you launch products with confidence.
          </p>
          <!-- Social Links -->
          <div class="flex items-center gap-3 pt-2">
            <NuxtLink 
              to="https://x.com/thetronjohnson" 
              class="p-2.5 text-neutral-600 hover:text-neutral-900 hover:bg-stone-100 rounded-lg transition-all"
              target="_blank"
            >
              <Icon name="ph:twitter-logo-duotone" class="text-xl" />
            </NuxtLink>
            <NuxtLink 
              href="https://www.linkedin.com/in/kiranjohns" 
              class="p-2.5 text-neutral-600 hover:text-neutral-900 hover:bg-stone-100 rounded-lg transition-all"
              target="_blank"
            >
              <Icon name="ph:linkedin-logo-duotone" class="text-xl" />
            </NuxtLink>
          </div>
        </div>

        <!-- Navigation Columns -->
        <div class="md:col-span-9 grid grid-cols-1 sm:grid-cols-4 gap-8">
          <!-- Tools Column -->
          <div class="sm:col-span-2">
            <h3 class="font-semibold text-neutral-900 mb-4">Tools</h3>
            <div class="grid grid-cols-2 gap-x-8 gap-y-6">
              <div v-for="stage in ['understand', 'build', 'launch', 'grow']" :key="stage">
                <span class="text-sm font-medium text-sky-600 block mb-2 capitalize">{{ stage }}</span>
                <div class="grid gap-y-2">
                  <NuxtLink 
                    v-for="tool in toolsArray.filter(t => t.stage === stage)" 
                    :key="tool.id"
                    :to="`/tools/${tool.id}`" 
                    class="text-neutral-600 hover:text-neutral-900 hover:translate-x-1 transition-all text-sm"
                  >
                    {{ tool.shortName }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Column -->
          <div>
            <h3 class="font-semibold text-neutral-900 mb-4">Product</h3>
            <ul class="space-y-2">
              <li v-for="link in ['Features', 'Pricing', 'Blog']" :key="link">
                <a 
                  :href="link === 'Blog' ? '/blog' : `/#${link.toLowerCase()}-section`" 
                  class="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  {{ link }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Legal Column -->
          <div>
            <h3 class="font-semibold text-neutral-900 mb-4">Legal</h3>
            <ul class="space-y-2">
              <li v-for="(path, link) in {
                'Privacy Policy': '/privacy',
                'Terms of Service': '/terms',
                'Refund Policy': '/refund',
                'Contact': 'mailto:support@gtmguy.ai'
              }" :key="link">
                <NuxtLink 
                  :to="path"
                  class="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  {{ link }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="border-t border-stone-200 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-neutral-600">
            &copy; {{ new Date().getFullYear() }} GTMGuy. All rights reserved.
          </p>
          <div class="flex items-center gap-4 text-sm text-neutral-600">
            <span>Made with ❤️</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template> 

<script setup>
import { tools } from '~/config/tools'

// Convert tools object to array
const toolsArray = computed(() => Object.values(tools))
</script> 