<template>
  <footer class="bg-stone-50/50 border-t border-stone-200">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 py-16">
        <!-- Brand Column -->
        <div class="space-y-4 md:col-span-2">
          <NuxtLink to="/" class="flex items-center gap-3">
            <div class="bg-neutral-900 text-white p-1.5 rounded-lg flex items-center justify-center">
              <Icon name="ph:rocket-duotone" class="text-xl" />
            </div>
            <span class="text-neutral-900 font-semibold">GTMGuy</span>
          </NuxtLink>
          <p class="text-sm text-neutral-600">
            AI-powered go-to-market tools to help you launch products with confidence.
          </p>
          <div class="flex items-center gap-4">
            <a href="#" class="text-neutral-600 hover:text-neutral-900 transition-colors">
              <Icon name="ph:twitter-logo-duotone" class="text-xl" />
            </a>
            <a href="#" class="text-neutral-600 hover:text-neutral-900 transition-colors">
              <Icon name="ph:github-logo-duotone" class="text-xl" />
            </a>
          </div>
        </div>

        <!-- Product Column -->
        <div>
          <h3 class="font-semibold text-neutral-900 mb-4">Product</h3>
          <ul class="space-y-3">
            <li>
              <a href="/#features" class="text-neutral-600 hover:text-neutral-900 transition-colors">Features</a>
            </li>
            <li>
              <a href="/#pricing-section" class="text-neutral-600 hover:text-neutral-900 transition-colors">Pricing</a>
            </li>
            <li>
              <NuxtLink to="/blog" class="text-neutral-600 hover:text-neutral-900 transition-colors">Blog</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Legal Column -->
        <div>
          <h3 class="font-semibold text-neutral-900 mb-4">Legal</h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/privacy" class="text-neutral-600 hover:text-neutral-900 transition-colors">Privacy Policy</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/terms" class="text-neutral-600 hover:text-neutral-900 transition-colors">Terms of Service</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/refund" class="text-neutral-600 hover:text-neutral-900 transition-colors">Refund Policy</NuxtLink>
            </li>
            <li>
              <a href="mailto:support@gtmguy.com" class="text-neutral-600 hover:text-neutral-900 transition-colors">Contact</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-stone-200 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-neutral-600">&copy; {{ new Date().getFullYear() }} GTMGuy. All rights reserved.</p>
          <div class="flex items-center gap-4 text-sm text-neutral-600">
            <span>Made with ❤️</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template> 