<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isDark = ref(false)

const menuItems = [
  {
    name: 'About',
    path: 'https://agungsundoro.com/about',
    children: [
      { name: 'Engineering', path: 'https://agungsundoro.com/engineering' },
      { name: 'Broadcasting', path: 'https://agungsundoro.com/broadcasting' },
    ],
  },
  { name: 'Products', path: 'https://digital.agungsundoro.com', external: true },
  { name: 'Community', path: 'https://discord.gg/qrNDAjEE', external: true },
  { name: 'Journey', path: 'https://agungsundoro.com/journey' },
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
  <header class="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
    <div
      class="relative pointer-events-auto flex items-center justify-between w-full max-w-5xl px-4 py-2.5 rounded-full bg-white/70 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md dark:bg-zinc-800/80 dark:ring-white/10 transition-all duration-300"
      :class="isScrolled ? 'scale-95' : 'scale-100'"
    >
      <!-- Left: Profile Icon / Logo -->
      <div class="flex-1 flex justify-start">
        <a
          href="https://agungsundoro.com"
          target="_blank"
          rel="noopener noreferrer"
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

      <!-- Center: Navigation Links -->
      <div class="flex-2 flex justify-center">
        <nav class="hidden md:flex">
          <ul class="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-200">
            <li v-for="item in menuItems" :key="item.name" class="relative group">
              <a
                v-if="item.external"
                :href="item.path"
                target="_blank"
                rel="noopener noreferrer"
                class="relative block px-3 py-1.5 transition-all rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-700/50 cursor-pointer text-zinc-600 dark:text-zinc-200 hover:text-teal-500 dark:hover:text-teal-400"
              >
                {{ item.name }}
              </a>
              <a
                v-else
                :href="item.path"
                class="relative block px-3 py-1.5 transition-all rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-700/50 cursor-pointer text-zinc-600 dark:text-zinc-200 hover:text-teal-500 dark:hover:text-teal-400"
              >
                {{ item.name }}
              </a>

              <!-- Dropdown menu (Desktop) -->
              <div
                v-if="item.children"
                class="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              >
                <div
                  class="bg-white dark:bg-zinc-800 rounded-xl shadow-lg ring-1 ring-zinc-900/5 dark:ring-white/10 p-1 w-32 flex flex-col gap-1 pointer-events-auto"
                >
                  <a
                    v-for="child in item.children"
                    :key="child.name"
                    :href="child.path"
                    class="block px-3 py-2 text-sm rounded-lg hover:text-teal-500 dark:hover:text-teal-400 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors text-center cursor-pointer"
                  >
                    {{ child.name }}
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </nav>

        <!-- Mobile Name -->
        <div class="md:hidden text-sm font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
          Agung Sundoro
        </div>
      </div>

      <!-- Right: Theme Toggle -->
      <div class="flex-1 flex justify-end gap-2">
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
