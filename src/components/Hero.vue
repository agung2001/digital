<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isMounted = ref(false)

const roles = ['Digital Product Maker.', 'Course Creator.', 'Design Engineer.']
const currentRoleIndex = ref(0)
const currentText = ref('')
const isDeleting = ref(false)
const typingSpeed = ref(150)

const productCount = ref(0)

const typeText = () => {
  const fullText = roles[currentRoleIndex.value]

  if (isDeleting.value) {
    currentText.value = fullText.substring(0, currentText.value.length - 1)
    typingSpeed.value = 50
  } else {
    currentText.value = fullText.substring(0, currentText.value.length + 1)
    typingSpeed.value = 100
  }

  if (!isDeleting.value && currentText.value === fullText) {
    typingSpeed.value = 2000
    isDeleting.value = true
  } else if (isDeleting.value && currentText.value === '') {
    isDeleting.value = false
    currentRoleIndex.value = (currentRoleIndex.value + 1) % roles.length
    typingSpeed.value = 500
  }

  setTimeout(typeText, typingSpeed.value)
}

const loadProductCount = async () => {
  try {
    const response = await fetch('/marketplace.json')
    if (response.ok) {
      const data = await response.json()
      productCount.value = data.products?.length || 0
    }
  } catch {
    productCount.value = 0
  }
}

onMounted(() => {
  isMounted.value = true
  loadProductCount()
  setTimeout(typeText, 1000)
})
</script>

<template>
  <section id="hero" class="relative">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative z-10"
      :class="isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
      style="transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1)"
    >
      <div class="flex items-center gap-4">
        <div
          class="h-12 w-12 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-700/50 flex items-center justify-center shrink-0 shadow-sm hover:scale-105 transition-transform"
        >
          <img
            src="/img/avatar.jpg"
            alt="Agung Sundoro"
            class="h-full w-full object-cover"
          />
        </div>
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100 leading-tight">
            I'm Agung Sundoro
          </h1>
          <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400 flex items-center">
            I am a
            <span class="ml-1.5 text-teal-500 dark:text-teal-400 font-semibold">{{ currentText }}</span>
            <span
              class="inline-block w-[2px] h-4 bg-teal-500 dark:bg-teal-400 ml-1 animate-pulse"
            ></span>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-4 bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 px-5 py-3 rounded-2xl shadow-sm backdrop-blur-sm shrink-0">
        <div class="text-center px-3">
          <span class="block text-xl font-bold text-zinc-900 dark:text-white">
            {{ productCount }}
          </span>
          <span class="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Products
          </span>
        </div>
      </div>
    </div>

    <div
      class="mt-4 relative z-10"
      :class="isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
      style="transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1); transition-delay: 150ms"
    >
      <p class="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
        I craft premium digital products that empower creators and developers. From in-depth
        courses to polished templates and tools, every product is designed to help you ship
        faster, learn smarter, and turn ideas into reality.
      </p>
    </div>
  </section>
</template>
