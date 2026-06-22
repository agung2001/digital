<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)
const isMenuOpen = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (
    savedTheme === 'dark' ||
    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      isMenuOpen.value = false
    }
  })
})
</script>

<template>
  <header class="mb-8">
    <div
      class="flex items-center justify-between w-full px-4 py-2.5 rounded-full bg-white/70 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md dark:bg-zinc-800/80 dark:ring-white/10 transition-all duration-300"
    >
      <div class="flex-1 flex justify-start">
        <a
          href="https://agungsundoro.com"
          class="group relative flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <div
            class="h-9 w-9 overflow-hidden rounded-full bg-zinc-100 ring-2 ring-zinc-100 dark:bg-zinc-800 dark:ring-zinc-700/50 flex items-center justify-center"
          >
            <img
              src="/img/avatar.jpg"
              alt="Agung Sundoro"
              class="h-full w-full object-cover group-hover:brightness-110 transition-all"
            />
          </div>
          <span class="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight hidden sm:block">
            Agung Sundoro
          </span>
        </a>
      </div>

      <div class="flex-2 flex justify-center">
        <span class="text-sm font-medium text-zinc-500 dark:text-zinc-400 hidden md:block">Digital Products</span>
        <span class="md:hidden text-sm font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">Digital Products</span>
      </div>

      <div class="flex-1 flex justify-end gap-2">
        <button
          @click="toggleMenu"
          class="md:hidden group flex items-center justify-center rounded-full bg-white/90 p-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20 active:scale-95 cursor-pointer"
          aria-label="Open menu"
        >
          <div class="relative w-6 h-6 flex flex-col justify-center gap-1.5">
            <span
              class="block h-0.5 bg-zinc-600 dark:bg-zinc-300 transition-all duration-300"
              :class="isMenuOpen ? 'rotate-45 translate-y-2 w-6' : 'w-5 ml-auto'"
            ></span>
            <span
              class="block h-0.5 bg-zinc-600 dark:bg-zinc-300 transition-all duration-300"
              :class="isMenuOpen ? 'opacity-0' : 'w-6'"
            ></span>
            <span
              class="block h-0.5 bg-zinc-600 dark:bg-zinc-300 transition-all duration-300"
              :class="isMenuOpen ? '-rotate-45 -translate-y-2 w-6' : 'w-4 ml-auto'"
            ></span>
          </div>
        </button>
      </div>

      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-4 scale-95"
      >
        <div
          v-if="isMenuOpen"
          class="absolute top-full right-0 mt-4 w-56 rounded-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl ring-1 ring-zinc-900/10 dark:ring-white/10 p-2 transform origin-top-right z-50"
        >
          <div class="flex flex-col gap-1">
            <a
              href="https://agungsundoro.com"
              class="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-colors cursor-pointer text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              @click="isMenuOpen = false"
            >
              Home
            </a>
            <a
              href="https://agungsundoro.com"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-colors cursor-pointer text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              @click="isMenuOpen = false"
            >
              About
            </a>
            <div class="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                @click="
                  () => {
                    toggleTheme()
                    isMenuOpen = false
                  }
                "
                class="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <span>{{ isDark ? 'Light' : 'Dark' }} Mode</span>
                <div
                  class="w-8 h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 relative transition-colors"
                  :class="{ 'bg-teal-500/50': isDark }"
                >
                  <div
                    class="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300"
                    :class="{ 'translate-x-4': isDark }"
                  ></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>
