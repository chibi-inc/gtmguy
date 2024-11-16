<template>
  <div class="min-h-screen bg-stone-50 flex items-center justify-center">
    <div class="max-w-md w-full px-4">
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-3 mb-6">
          <div class="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-2 rounded-xl shadow-lg">
            <Icon name="ph:rocket-launch-duotone" class="text-3xl" />
          </div>
          <h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-800">GTMGuy</h1>
        </div>
        <div class="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <div class="flex flex-col items-center gap-4">
            <div class="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center">
              <Icon 
                name="ph:circle-notch-duotone" 
                class="text-2xl text-neutral-900 animate-spin"
              />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-neutral-900 mb-2">Setting up your account</h2>
              <p class="text-neutral-600">Please wait while we get everything ready...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Handle the callback
const user = useSupabaseUser()

watch(user, (newUser) => {
  if (newUser) {
    navigateTo('/app')
  }
}, { immediate: true })
</script>