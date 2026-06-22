<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const isMounted = ref(false)

const roles = ['Digital Product Maker.', 'Course Creator.', 'Design Engineer.']
const currentRoleIndex = ref(0)
const currentText = ref('')
const isDeleting = ref(false)
const typingSpeed = ref(150)

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

const imageContainerRef = ref<HTMLElement | null>(null)
const tilt = ref({ rotateX: 0, rotateY: 0 })

const handleMouseMove = (e: MouseEvent) => {
  if (!imageContainerRef.value) return
  const rect = imageContainerRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateX = ((y - centerY) / centerY) * -15
  const rotateY = ((x - centerX) / centerX) * 15

  tilt.value = { rotateX, rotateY }
}

const handleMouseLeave = () => {
  tilt.value = { rotateX: 0, rotateY: 0 }
}

const tiltStyle = computed(() => ({
  transform: `perspective(1000px) rotateX(${tilt.value.rotateX}deg) rotateY(${tilt.value.rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
  transition:
    tilt.value.rotateX === 0 && tilt.value.rotateY === 0
      ? 'transform 0.5s ease-out'
      : 'transform 0.1s ease-out',
}))

const scrollToProducts = () => {
  const el = document.getElementById('products-section')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  isMounted.value = true
  setTimeout(typeText, 1000)
})
</script>

<template>
  <section id="hero" class="pt-8 pb-16 sm:pt-16 relative">
    <div class="flex flex-col-reverse md:flex-row items-center justify-between gap-12 lg:gap-24 relative z-10">
      <div
        class="max-w-2xl flex-1"
        :class="isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        style="transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1)"
      >
        <h1 class="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-6xl leading-[1.1]">
          I'm
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400"
            >Agung Sundoro.</span
          >
        </h1>

        <p
          class="mt-6 text-2xl sm:text-3xl font-medium text-zinc-600 dark:text-zinc-300 h-10 flex items-center"
        >
          I am a
          <span class="ml-2 text-teal-500 dark:text-teal-400 font-semibold">{{ currentText }}</span
          ><span
            class="inline-block w-[3px] h-8 bg-teal-500 dark:bg-teal-400 ml-1 animate-pulse"
          ></span>
        </p>

        <p class="mt-6 text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
          I craft premium digital products that empower creators and developers. From in-depth
          courses to polished templates and tools, every product is designed to help you ship
          faster, learn smarter, and turn ideas into reality.
        </p>

        <div class="mt-10 flex flex-wrap gap-4">
          <button
            @click="scrollToProducts"
            class="group relative px-6 py-4 rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 text-white font-bold text-sm tracking-wide transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(20,184,166,0.3)] active:scale-95 overflow-hidden shadow-xl flex items-center justify-center min-w-[140px]"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            ></div>
            <div class="relative flex items-center gap-3 w-full justify-center">
              <i
                class="fa-solid fa-bag-shopping group-hover:rotate-12 group-hover:-translate-y-1 transition-all duration-300"
              ></i>
              <div class="overflow-hidden flex">
                <span>Browse</span>
                <span
                  class="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-1 transition-all duration-500 ease-out whitespace-nowrap"
                  >products</span
                >
              </div>
            </div>
          </button>

          <a
            href="https://agungsundoro.com"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative px-6 py-4 rounded-full bg-white dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 font-bold text-sm tracking-wide transition-all duration-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:scale-105 active:scale-95 border border-zinc-200 dark:border-zinc-700/50 shadow-sm flex items-center justify-center min-w-[140px]"
          >
            <div class="relative flex items-center gap-3 w-full justify-center">
              <i
                class="fa-solid fa-graduation-cap group-hover:rotate-12 group-hover:-translate-y-1 transition-all duration-300 text-teal-500"
              ></i>
              <div class="overflow-hidden flex">
                <span>Explore</span>
                <span
                  class="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-1 transition-all duration-500 ease-out whitespace-nowrap"
                  >courses</span
                >
              </div>
            </div>
          </a>

          <a
            href="https://lynk.id/agungsundoro"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative px-6 py-4 rounded-full bg-white dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 font-bold text-sm tracking-wide transition-all duration-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:scale-105 active:scale-95 border border-zinc-200 dark:border-zinc-700/50 shadow-sm flex items-center justify-center min-w-[110px]"
          >
            <div class="relative flex items-center gap-3 w-full justify-center">
              <i
                class="fa-solid fa-store group-hover:rotate-12 group-hover:-translate-y-1 transition-all duration-300 text-emerald-500"
              ></i>
              <div class="overflow-hidden flex">
                <span>Visit</span>
                <span
                  class="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-1 transition-all duration-500 ease-out whitespace-nowrap"
                  >my store</span
                >
              </div>
            </div>
          </a>
        </div>
      </div>

      <div
        class="flex-none relative mt-10 md:mt-0"
        :class="isMounted ? 'scale-100 opacity-100' : 'scale-90 opacity-0'"
        style="transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); transition-delay: 200ms"
      >
        <div
          class="absolute -top-6 -left-6 z-20 animate-bounce bg-white dark:bg-zinc-800 p-3.5 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-700/50 flex items-center justify-center"
          style="animation-duration: 3s; animation-timing-function: ease-in-out"
        >
          <i class="fa-solid fa-palette text-4xl text-teal-500 drop-shadow-md"></i>
        </div>
        <div
          class="absolute top-1/2 -right-8 z-20 animate-bounce bg-white dark:bg-zinc-800 p-3.5 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-700/50 flex items-center justify-center"
          style="animation-duration: 4s; animation-timing-function: ease-in-out; animation-delay: 0.5s"
        >
          <i class="fa-solid fa-code text-4xl text-emerald-500 drop-shadow-md"></i>
        </div>
        <div
          class="absolute -bottom-6 left-10 z-20 animate-bounce bg-white dark:bg-zinc-800 p-3.5 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-700/50 flex items-center justify-center"
          style="animation-duration: 3.5s; animation-timing-function: ease-in-out; animation-delay: 1s"
        >
          <i class="fa-solid fa-graduation-cap text-4xl text-blue-500 drop-shadow-md"></i>
        </div>

        <div
          ref="imageContainerRef"
          class="relative group cursor-pointer"
          style="perspective: 1000px"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
        >
          <div
            class="absolute -inset-4 bg-gradient-to-tr from-teal-500/30 to-emerald-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"
          ></div>
          <img
            src="https://agungsundoro.com/img/avatar.jpg"
            alt="Agung Sundoro"
            :style="tiltStyle"
            class="relative h-64 w-64 md:h-80 md:w-80 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800 shadow-2xl shadow-zinc-800/10 dark:shadow-teal-500/20 ring-1 ring-zinc-900/5 dark:ring-white/10"
          />
        </div>
      </div>
    </div>
  </section>
</template>
