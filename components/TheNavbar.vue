<template>
  <nav class="fixed w-full bg-stone-50/50 backdrop-blur-sm border-b border-stone-200 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-8">
          <NuxtLink to="/" class="flex items-center gap-3">
            <div class="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-2 rounded-xl shadow-lg">
              <Icon name="ph:rocket-launch-duotone" class="text-3xl" />
            </div>
            <h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-800">GTMGuy</h1>
          </NuxtLink>
          <div class="hidden md:flex items-center gap-6">
            <a href="/#features" class="text-neutral-700 hover:text-neutral-900 transition-colors">Features</a>
            <a href="/#pricing-section" class="text-neutral-700 hover:text-neutral-900 transition-colors">Pricing</a>
            <a href="/#benefits-section" class="text-neutral-700 hover:text-neutral-900 transition-colors">Benefits</a>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <NuxtLink to="/app" class="px-6 py-2.5 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 font-medium">
            <Icon name="ph:lightning-duotone" class="text-lg" />
            Get Started Free
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template> 