<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isMounted = ref(false)
const isDark = ref(false)

const roles = ['Software Engineer.', 'Digital Product Maker.', 'Digital Creator', 'AI Enthusiast.']
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
  const savedTheme = localStorage.getItem('theme')
  if (
    savedTheme === 'dark' ||
    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }

  isMounted.value = true
  loadProductCount()
  setTimeout(typeText, 1000)
})
</script>

<template>
  <section id="hero" class="relative">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-12 relative z-10"
      :class="isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
      style="transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1)"
    >
      <div class="flex items-center gap-4 shrink-0">
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
          <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100 leading-tight whitespace-nowrap">
            Hi, my name is Agung Sundoro 👋
          </h1>
          <p class="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 flex items-center">
            I am a
            <span class="ml-1.5 text-teal-500 dark:text-teal-400 font-semibold">{{ currentText }}</span>
            <span
              class="inline-block w-[2px] h-4 bg-teal-500 dark:bg-teal-400 ml-1 animate-pulse"
            ></span>
          </p>
        </div>
      </div>

      <div class="block flex-grow text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <p class="animate-fade-in">
          Halo! Saya kreator digital asal Jakarta 🇮🇩 yang siap membantu pebisnis pemula melejitkan usahanya lewat teknologi AI 🚀. Di sini, saya menyediakan produk digital premium mulai dari prompt siap pakai, template bisnis praktis, perangkat lunak (software), hingga hasil riset dan AI tools terbaik 🛠️. Misi saya membantu Anda mengeksekusi ide bisnis dengan lebih cepat 🧠, dan mengubah strategi menjadi keuntungan ✨. Baik Anda seorang pengusaha baru maupun pemilik bisnis yang ingin berkembang, mari berkolaborasi dan ciptakan kesuksesan digital bersama! 🤝🎁
        </p>
      </div>

      <div class="flex items-center gap-0 bg-white dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl shadow-sm backdrop-blur-sm shrink-0">
        <div class="text-center px-5 py-3">
          <span class="block text-xl font-bold text-zinc-900 dark:text-white">
            {{ productCount }}
          </span>
          <span class="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Products
          </span>
        </div>
        <div class="w-px h-8 bg-zinc-200 dark:bg-zinc-700"></div>
        <button
          @click="toggleTheme"
          class="group flex flex-col items-center justify-center px-5 py-3 transition hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Toggle dark mode"
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
          <span class="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mt-1">
            {{ isDark ? 'Dark' : 'Light' }}
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
}
</style>
