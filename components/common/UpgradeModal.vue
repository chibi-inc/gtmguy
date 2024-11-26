<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100">
        <div class="max-w-[500px] w-[90%] rounded-2xl overflow-hidden" role="dialog" aria-labelledby="modalTitle"
          aria-describedby="modalDescription">
          <div class="bg-gradient-to-br from-neutral-900 to-stone-900 p-8 text-white relative">
            <!-- Gradient Orbs -->
            <div class="absolute inset-0">
              <div class="absolute top-0 left-0 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl"></div>
              <div class="absolute bottom-0 right-0 w-64 h-64 bg-stone-400/10 rounded-full blur-3xl"></div>
            </div>

            <!-- Content -->
            <div class="relative">
              <div class="flex justify-between items-start mb-6">
                <div>
                  <h3 id="modalTitle" class="text-2xl font-bold mb-2">
                    Lifetime Pro
                  </h3>
                  <p class="text-neutral-300">Best value for serious users</p>
                </div>
                <span class="bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Limited Time
                </span>
              </div>

              <div class="mb-8">
                <div class="text-5xl font-bold mb-1">∞</div>
                <p class="text-neutral-300">Unlimited reports forever</p>
              </div>

              <div class="mb-8">
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-bold">${{ price }}</span>
                  <span class="text-neutral-300">one-time payment</span>
                </div>
                <p class="text-sm text-neutral-300 mt-1">
                  Lifetime access, unlimited value
                </p>
              </div>

              <ul class="space-y-4 mb-8">
                <li class="flex items-center gap-3 text-neutral-200">
                  <svg class="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Everything in Free Trial</span>
                </li>
                <li class="flex items-center gap-3 text-neutral-200">
                  <svg class="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Unlimited reports</span>
                </li>
                <li class="flex items-center gap-3 text-neutral-200">
                  <svg class="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Priority support</span>
                </li>
                <li class="flex items-center gap-3 text-neutral-200">
                  <svg class="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Lifetime updates</span>
                </li>
              </ul>

              <div class="flex gap-3">
                <button @click="$emit('close')"
                  class="flex-1 px-4 py-3 text-neutral-300 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-all duration-200">
                  Maybe Later
                </button>
                <button
                  class="flex-1 px-4 py-3 bg-white text-neutral-900 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  @click="handlePayment">
                  Make Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>


import { initializePaddle } from '@paddle/paddle-js'
const Paddle = ref(null)
const config = useRuntimeConfig()

defineEmits(['close'])

const { data: price } = await useFetch('/api/payments/fetch-price')

const handlePayment = () => {
  if (!Paddle.value) {
    console.error('Paddle is not initialized')
    return
  }

  Paddle.value.Checkout.open({
    items: [{ 
      priceId: config.public.priceId, 
      quantity: 1 
    }],
    customer: { email: useSupabaseUser().value.email }
  })
}

const verifyPayment = async (data) => {
  
  console.log("Verifying payment", data)
  $fetch('/api/payments/verify-payment', {
    method: 'POST',
    body: data
  }).then(res => {
    Paddle.value.Checkout.close()
    // window.location.href = '/app'
  })
}

onMounted(async () => {
  const paddleInstance = await initializePaddle({
    environment: 'sandbox',
    token: config.public.clientToken,
    eventCallback: function (data) {
      console.log("Paddle event", data)
      if(data.name == 'checkout.completed'){
        verifyPayment(data)
      }
    }
  })
  Paddle.value = paddleInstance
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
