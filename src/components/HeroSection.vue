<script setup lang="ts">
import AnimatedNumber from './AnimatedNumber.vue'

defineProps<{
  currentText: string
  productCount: number
  stats: {
    image: number
    video: number
    text: number
    application: number
  }
  isMounted: boolean
}>()
</script>

<template>
  <section id="hero" class="relative pt-28 pb-10 sm:pb-14">
    <div class="mx-auto max-w-6xl px-4">
      <div
        class="text-center mt-6"
        :class="isMounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
        style="transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
      >
        <h1
          class="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl lg:text-6xl mb-4 leading-tight"
        >
          Agung Sundoro
          <br />
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 animate-gradient-shift"
            >{{ currentText }}</span
          >
          <span
            class="inline-block w-[3px] h-10 sm:h-12 lg:h-14 bg-teal-500 ml-1 animate-pulse align-middle"
          ></span>
        </h1>

        <p class="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-8">
          Koleksi produk digital premium untuk membantu bisnis Anda berkembang dengan teknologi AI.
          Dapatkan prompt, template, software, hingga AI tools terbaik, dan gabung
          <a
            href="https://lynk.id/agungsundoro/px748k3j0nvp"
            target="_blank"
            rel="noopener noreferrer"
            class="text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 font-semibold underline decoration-2 decoration-teal-500/30 hover:decoration-teal-500 transition-all inline-flex items-center gap-1"
          >
            komunitas belajar kami untuk diajarin sampai bisa <i class="fas fa-external-link-alt text-xs"></i></a>.
        </p>

        <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-2xl mx-auto bg-white/40 dark:bg-zinc-800/40 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl p-4 shadow-sm">
          <div class="flex flex-col items-center justify-center p-2 border-r border-zinc-200/50 dark:border-zinc-700/50 col-span-2 sm:col-span-1 border-b sm:border-b-0 pb-4 sm:pb-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400">
              <AnimatedNumber :value="productCount" />
            </span>
            <span class="text-[10px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">Produk</span>
          </div>
          <div class="flex flex-col items-center justify-center p-2 border-r border-zinc-200/50 dark:border-zinc-700/50">
            <span class="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">
              <AnimatedNumber :value="stats.text" />
            </span>
            <span class="text-[10px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">Materi</span>
          </div>
          <div class="flex flex-col items-center justify-center p-2 border-r border-zinc-200/50 dark:border-zinc-700/50">
            <span class="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              <AnimatedNumber :value="stats.image" />
            </span>
            <span class="text-[10px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">Gambar</span>
          </div>
          <div class="flex flex-col items-center justify-center p-2 border-r border-zinc-200/50 dark:border-zinc-700/50">
            <span class="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              <AnimatedNumber :value="stats.video" />
            </span>
            <span class="text-[10px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">Video</span>
          </div>
          <div class="flex flex-col items-center justify-center p-2">
            <span class="text-2xl sm:text-3xl font-extrabold text-violet-600 dark:text-violet-400">
              <AnimatedNumber :value="stats.application" />
            </span>
            <span class="text-[10px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">Aplikasi</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
