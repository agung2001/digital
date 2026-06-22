<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isDark = ref(false)

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Products', href: '#products' },
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
  <header
    class="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
  >
    <div
      class="relative pointer-events-auto flex items-center justify-between w-full max-w-5xl px-4 py-2.5 rounded-full bg-white/70 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md dark:bg-zinc-800/80 dark:ring-white/10 transition-all duration-300"
      :class="isScrolled ? 'scale-95' : 'scale-100'"
    >
      <!-- Left: Profile Icon / Logo -->
      <div class="flex-1 flex justify-start">
        <a
          href="#hero"
          @click.prevent="scrollTo('#hero')"
          class="group relative flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <div
            class="h-9 w-9 overflow-hidden rounded-full bg-zinc-100 ring-2 ring-zinc-100 dark:bg-zinc-800 dark:ring-zinc-700/50 flex items-center justify-center"
          >
            <img
              src="/img/avatar.webp"
              alt="Avatar"
              class="h-full w-full object-cover group-hover:brightness-110 transition-all"
            />
          </div>
          <span class="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight hidden sm:block">
            Digital
          </span>
        </a>
      </div>

      <!-- Center: Navigation Links -->
      <div class="flex-2 flex justify-center">
        <nav class="hidden md:flex">
          <ul
            class="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-200"
          >
            <li
              v-for="link in navLinks"
              :key="link.href"
              class="relative group"
            >
              <button
                @click="scrollTo(link.href)"
                class="relative block px-3 py-1.5 transition-all rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-700/50 cursor-pointer text-zinc-600 dark:text-zinc-200 hover:text-teal-500 dark:hover:text-teal-400"
              >
                {{ link.label }}
              </button>
            </li>
          </ul>
        </nav>
        
        <!-- Mobile Name -->
        <div class="md:hidden text-sm font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
          Digital
        </div>
      </div>

      <!-- Right: Theme Toggle -->
      <div class="flex-1 flex justify-end">
        <button
          @click="toggleTheme"
          class="group rounded-full bg-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20 cursor-pointer"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <div class="relative h-6 w-6">
            <i
              v-if="!isDark"
              class="fas fa-sun absolute inset-0 flex items-center justify-center text-amber-500"
            ></i>
            <i
              v-else
              class="fas fa-moon absolute inset-0 flex items-center justify-center text-teal-400"
            ></i>
          </div>
        </button>
      </div>
    </div>
  </header>
</template>
