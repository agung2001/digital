<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppIcon from './AppIcon.vue'
import { isCommandPaletteOpen } from '@/state'

const isScrolled = ref(false)
const isDark = ref(false)

const searchShortcut =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)
    ? '⌘K'
    : 'Ctrl K'

const openSearch = () => {
  isCommandPaletteOpen.value = true
}

// Hysteresis (60px down / 40px up) avoids the nav flickering when scrolling
// near the threshold.
const handleScroll = () => {
  const y = window.scrollY
  if (!isScrolled.value && y > 60) isScrolled.value = true
  else if (isScrolled.value && y < 40) isScrolled.value = false
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

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
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
  <header class="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
    <div
      class="relative pointer-events-auto flex items-center justify-between w-full max-w-5xl px-4 py-2.5 rounded-full bg-white/70 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md dark:bg-zinc-800/80 dark:ring-white/10 transition-all duration-300"
      :class="isScrolled ? 'scale-95' : 'scale-100'"
    >
      <!-- Left: Profile Icon / Logo -->
      <div class="flex-1 flex justify-start">
        <a
          href="https://agungsundoro.com"
          class="group relative flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <div
            class="h-9 w-9 overflow-hidden rounded-full bg-zinc-100 ring-2 ring-zinc-100 dark:bg-zinc-800 dark:ring-zinc-700/50 flex items-center justify-center"
          >
            <img
              src="/img/avatar.webp"
              alt="Agung Sundoro"
              class="h-full w-full object-cover group-hover:brightness-110 transition-all"
            />
          </div>
          <span
            class="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight hidden sm:block"
          >
            Agung Sundoro
          </span>
        </a>
      </div>

      <!-- Center: Title Text -->
      <div class="flex-2 flex justify-center text-center">
        <span class="font-signature text-xl font-normal text-zinc-500 dark:text-zinc-400">
          Digital Products &amp; AI Tools
        </span>
      </div>

      <!-- Right: Search & Theme Toggle -->
      <div class="flex-1 flex justify-end gap-2">
        <button
          @click="openSearch"
          class="flex group items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition hover:ring-teal-500/30 dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-teal-400/30 cursor-pointer"
          :aria-label="`Cari (${searchShortcut})`"
          :title="`Cari (${searchShortcut})`"
        >
          <AppIcon
            name="search"
            class="text-xs text-zinc-500 transition-colors group-hover:text-teal-500 dark:text-zinc-400 dark:group-hover:text-teal-400"
          />
          <span
            class="hidden lg:inline text-[11px] font-semibold text-zinc-400 transition-colors group-hover:text-teal-500 dark:text-zinc-500 dark:group-hover:text-teal-400"
          >
            {{ searchShortcut }}
          </span>
        </button>

        <button
          @click="toggleTheme"
          class="group rounded-full bg-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20 cursor-pointer"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <div class="relative h-6 w-6">
            <svg
              viewBox="0 0 24 24"
              class="absolute inset-0 h-6 w-6 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 dark:hidden"
            >
              <path
                d="M8 12.25A4.25 4.25 0 0 1 12.25 8v0a4.25 4.25 0 0 1 4.25 4.25v0a4.25 4.25 0 0 1-4.25 4.25v0A4.25 4.25 0 0 1 8 12.25v0Z"
              ></path>
              <path
                d="M12.25 3v1.5M21.5 12.25H20M18.791 18.791l-1.06-1.06M12.25 21.5V20M5.209 18.791l1.06-1.06M3 12.25h1.5M5.209 5.209l1.06 1.06M18.791 5.209l-1.06 1.06"
                fill="none"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            <svg
              viewBox="0 0 24 24"
              class="hidden h-6 w-6 fill-teal-400/10 stroke-teal-500 transition dark:block group-hover:dark:stroke-teal-400"
            >
              <path
                d="M17.25 16.22a6.937 6.937 0 0 1-9.47-9.47 7.451 7.451 0 1 0 9.47 9.47ZM12.75 7C17 7 17 2.75 17 2.75S17 7 21.25 7C17 7 17 11.25 17 11.25S17 7 12.75 7Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </div>
        </button>
      </div>
    </div>
  </header>
</template>
