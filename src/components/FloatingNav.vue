<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isDark = ref(false)

const navLinks = [
  { label: 'Home', href: '#hero', icon: 'fas fa-home' },
  { label: 'Products', href: '#products', icon: 'fas fa-cube' },
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

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

const scrollTo = (href: string) => {
  const el = document.querySelector(href)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  const savedTheme = localStorage.getItem('theme')
  if (
    savedTheme === 'dark' ||
    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    class="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500"
    :class="isScrolled ? 'scale-95' : 'scale-100'"
  >
    <div
      class="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg shadow-zinc-900/5 dark:shadow-black/20 transition-all duration-300"
      :class="isScrolled ? 'shadow-xl shadow-zinc-900/10 dark:shadow-black/30' : ''"
    >
      <div
        class="h-8 w-8 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-700/50 flex items-center justify-center shrink-0 shadow-sm mr-2"
      >
        <img src="/img/avatar.jpg" alt="AS" class="h-full w-full object-cover" />
      </div>

      <div class="hidden sm:flex items-center gap-1">
        <button
          v-for="link in navLinks"
          :key="link.href"
          @click="scrollTo(link.href)"
          class="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-full transition-all duration-300 hover:bg-teal-50 dark:hover:bg-teal-500/10 cursor-pointer"
        >
          {{ link.label }}
        </button>
      </div>

      <div class="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-1"></div>

      <button
        @click="toggleTheme"
        class="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <i :class="isDark ? 'fas fa-moon text-teal-400' : 'fas fa-sun text-amber-500'" class="text-sm transition-transform duration-300"></i>
      </button>
    </div>
  </nav>
</template>
