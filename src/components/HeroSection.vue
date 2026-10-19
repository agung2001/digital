<script setup lang="ts">
import { computed } from 'vue'
import AnimatedNumber from './AnimatedNumber.vue'
import AppIcon from './AppIcon.vue'

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

const scrollToProducts = () => {
  const el = document.getElementById('products')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const marqueeTools = [
  {
    name: 'ChatGPT',
    subtitle: 'Prompt & LLM',
    type: 'chatgpt',
    glowClass: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10',
    iconBgClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    badgeClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10',
  },
  {
    name: 'Google Gemini',
    subtitle: 'Multimodal AI',
    type: 'gemini',
    glowClass: 'hover:border-sky-500/50 hover:shadow-sky-500/10',
    iconBgClass: 'bg-sky-500/10',
    badgeClass: 'text-sky-700 dark:text-sky-300 bg-sky-500/10',
  },
  {
    name: 'Claude',
    subtitle: 'Reasoning & Code',
    type: 'claude',
    glowClass: 'hover:border-amber-500/50 hover:shadow-amber-500/10',
    iconBgClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    badgeClass: 'text-amber-700 dark:text-amber-300 bg-amber-500/10',
  },
  {
    name: 'Midjourney',
    subtitle: 'AI Arts & Avatar',
    type: 'midjourney',
    glowClass: 'hover:border-indigo-500/50 hover:shadow-indigo-500/10',
    iconBgClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    badgeClass: 'text-indigo-700 dark:text-indigo-300 bg-indigo-500/10',
  },
  {
    name: 'DeepSeek',
    subtitle: 'Open Model & Code',
    type: 'deepseek',
    glowClass: 'hover:border-sky-500/50 hover:shadow-sky-500/10',
    iconBgClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    badgeClass: 'text-sky-700 dark:text-sky-300 bg-sky-500/10',
  },
  {
    name: 'Notion',
    subtitle: 'Workspace & Systems',
    type: 'notion',
    glowClass: 'hover:border-zinc-500/50 hover:shadow-zinc-500/10',
    iconBgClass: 'bg-zinc-500/10 text-zinc-800 dark:text-zinc-200',
    badgeClass: 'text-zinc-700 dark:text-zinc-300 bg-zinc-500/10',
  },
  {
    name: 'Obsidian',
    subtitle: 'Second Brain',
    type: 'obsidian',
    glowClass: 'hover:border-purple-500/50 hover:shadow-purple-500/10',
    iconBgClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    badgeClass: 'text-purple-700 dark:text-purple-300 bg-purple-500/10',
  },
  {
    name: 'Canva',
    subtitle: 'Design Templates',
    type: 'canva',
    glowClass: 'hover:border-cyan-500/50 hover:shadow-cyan-500/10',
    iconBgClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    badgeClass: 'text-cyan-700 dark:text-cyan-300 bg-cyan-500/10',
  },
  {
    name: 'Adobe AE & Premiere',
    subtitle: 'Video FX & Motion',
    type: 'adobe',
    glowClass: 'hover:border-rose-500/50 hover:shadow-rose-500/10',
    iconBgClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    badgeClass: 'text-rose-700 dark:text-rose-300 bg-rose-500/10',
  },
  {
    name: 'Runway',
    subtitle: 'AI Cinema & Video',
    type: 'runway',
    glowClass: 'hover:border-teal-500/50 hover:shadow-teal-500/10',
    iconBgClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    badgeClass: 'text-teal-700 dark:text-teal-300 bg-teal-500/10',
  },
  {
    name: 'ElevenLabs',
    subtitle: 'Voice & Sound FX',
    type: 'elevenlabs',
    glowClass: 'hover:border-blue-500/50 hover:shadow-blue-500/10',
    iconBgClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    badgeClass: 'text-blue-700 dark:text-blue-300 bg-blue-500/10',
  },
  {
    name: 'Meta AI & Ads',
    subtitle: 'Growth & Ads Audit',
    type: 'meta',
    glowClass: 'hover:border-blue-600/50 hover:shadow-blue-600/10',
    iconBgClass: 'bg-blue-600/10 text-blue-600 dark:text-blue-400',
    badgeClass: 'text-blue-700 dark:text-blue-300 bg-blue-600/10',
  },
]

const doubleMarqueeTools = computed(() => [...marqueeTools, ...marqueeTools])
</script>

<template>
  <section id="hero" class="relative pt-28 sm:pt-36 pb-12 sm:pb-16 overflow-hidden">
    <!-- Ambient Spotlight Glow -->
    <div
      class="absolute top-12 left-1/2 -translate-x-1/2 w-[350px] sm:w-[650px] h-[300px] sm:h-[450px] bg-gradient-to-tr from-teal-500/15 via-cyan-500/10 to-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"
      aria-hidden="true"
    ></div>

    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div
        class="text-center"
        :class="isMounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
        style="transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
      >
        <!-- Top Announcement Badge -->
        <div
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-teal-500/20 dark:border-teal-500/30 backdrop-blur-md shadow-sm mb-6 hover:border-teal-500/40 transition-all duration-300"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <span class="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Ekosistem Aset Digital &amp; AI Tools No. 1
          </span>
        </div>

        <!-- Main Headline -->
        <h1
          class="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl md:text-6xl lg:text-7xl mb-5 leading-[1.12]"
        >
          Agung Sundoro
          <br />
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 animate-gradient-shift"
            >{{ currentText }}</span
          >
          <span
            class="inline-block w-[3px] sm:w-[4px] h-9 sm:h-12 lg:h-14 bg-teal-500 ml-1 sm:ml-1.5 animate-pulse align-middle rounded-full"
          ></span>
        </h1>

        <!-- Supporting Subtitle -->
        <p
          class="text-base sm:text-lg lg:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl sm:max-w-3xl mx-auto mb-8 font-normal"
        >
          Koleksi produk digital premium untuk membantu bisnis Anda berkembang dengan teknologi AI.
          Dapatkan prompt siap pakai, template otomatisasi, software, hingga AI tools terbaik, dan
          gabung
          <a
            href="https://lynk.id/agungsundoro/px748k3j0nvp"
            target="_blank"
            rel="noopener noreferrer"
            class="text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 font-semibold underline decoration-2 decoration-teal-500/30 hover:decoration-teal-500 transition-all inline-flex items-center gap-1"
          >
            komunitas belajar kami untuk diajarin sampai bisa
            <AppIcon name="up-right-from-square" class="text-xs" /> </a
          >.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
          <button
            @click="scrollToProducts"
            class="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600 hover:from-teal-400 hover:via-teal-500 hover:to-cyan-500 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-sm sm:text-base cursor-pointer"
          >
            <span>Jelajahi Katalog Produk</span>
            <AppIcon
              name="arrow-down"
              class="text-xs transition-transform group-hover:translate-y-0.5"
            />
          </button>

          <a
            href="https://lynk.id/agungsundoro/px748k3j0nvp"
            target="_blank"
            rel="noopener noreferrer"
            class="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-medium text-zinc-700 dark:text-zinc-200 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-sm transition-all duration-300 text-sm sm:text-base cursor-pointer"
          >
            <AppIcon name="users" class="text-teal-500 dark:text-teal-400 text-xs" />
            <span>Gabung Komunitas</span>
            <span
              class="inline-flex items-center text-[10px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-500/15 px-2 py-0.5 rounded-full ml-1"
            >
              Diajarin Sampai Bisa ✨
            </span>
          </a>
        </div>

        <!-- Trust Signals / Perks -->
        <div
          class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400 mb-10"
        >
          <div class="inline-flex items-center gap-1.5">
            <AppIcon name="circle-check" class="text-teal-500 text-xs" />
            <span>Akses Sekali untuk Selamanya</span>
          </div>
          <div class="inline-flex items-center gap-1.5">
            <AppIcon name="circle-check" class="text-teal-500 text-xs" />
            <span>Update Materi &amp; Prompt Rutin</span>
          </div>
          <div class="inline-flex items-center gap-1.5">
            <AppIcon name="circle-check" class="text-teal-500 text-xs" />
            <span>Grup Diskusi &amp; Bimbingan</span>
          </div>
        </div>

        <!-- Stats Dashboard Card -->
        <div
          class="max-w-4xl mx-auto bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xl shadow-zinc-900/5 dark:shadow-black/40"
        >
          <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4">
            <!-- Produk -->
            <div
              class="flex flex-col items-center justify-center p-3 rounded-xl sm:rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/15 transition-all hover:scale-[1.02]"
            >
              <div
                class="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1"
              >
                <AppIcon name="box-open" class="text-[11px]" />
                <span>Produk</span>
              </div>
              <span
                class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
              >
                <AnimatedNumber :value="productCount" />
              </span>
              <span class="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium"
                >Koleksi Teruji</span
              >
            </div>

            <!-- Materi -->
            <div
              class="flex flex-col items-center justify-center p-3 rounded-xl sm:rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/15 transition-all hover:scale-[1.02]"
            >
              <div
                class="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1"
              >
                <AppIcon name="book-open" class="text-[11px]" />
                <span>Materi</span>
              </div>
              <span
                class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
              >
                <AnimatedNumber :value="stats.text" />
              </span>
              <span class="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium"
                >Modul &amp; Panduan</span
              >
            </div>

            <!-- Gambar -->
            <div
              class="flex flex-col items-center justify-center p-3 rounded-xl sm:rounded-2xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/15 transition-all hover:scale-[1.02]"
            >
              <div
                class="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1"
              >
                <AppIcon name="image" class="text-[11px]" />
                <span>Gambar</span>
              </div>
              <span
                class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
              >
                <AnimatedNumber :value="stats.image" />
              </span>
              <span class="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium"
                >Aset &amp; Visual</span
              >
            </div>

            <!-- Video -->
            <div
              class="flex flex-col items-center justify-center p-3 rounded-xl sm:rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/15 transition-all hover:scale-[1.02]"
            >
              <div
                class="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1"
              >
                <AppIcon name="film" class="text-[11px]" />
                <span>Video</span>
              </div>
              <span
                class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
              >
                <AnimatedNumber :value="stats.video" />
              </span>
              <span class="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium"
                >Tutorial &amp; FX</span
              >
            </div>

            <!-- Aplikasi -->
            <div
              class="flex flex-col items-center justify-center p-3 rounded-xl sm:rounded-2xl bg-violet-500/5 dark:bg-violet-500/10 border border-violet-500/15 transition-all hover:scale-[1.02]"
            >
              <div
                class="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1"
              >
                <AppIcon name="cubes" class="text-[11px]" />
                <span>Aplikasi</span>
              </div>
              <span
                class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
              >
                <AnimatedNumber :value="stats.application" />
              </span>
              <span class="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium"
                >Software &amp; Bot</span
              >
            </div>
          </div>
        </div>

        <!-- Horizontal Marquee Logo Section -->
        <div class="mt-14 sm:mt-18 pt-2">
          <!-- Marquee Label -->
          <div class="flex items-center justify-center gap-3 mb-5">
            <div
              class="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-zinc-300 dark:to-zinc-700"
            ></div>
            <p
              class="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 flex items-center gap-2"
            >
              <AppIcon name="bolt" class="text-teal-500 text-[10px]" />
              Ekosistem &amp; Tools AI yang Digunakan
            </p>
            <div
              class="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-zinc-300 dark:to-zinc-700"
            ></div>
          </div>

          <!-- Marquee Carousel Track -->
          <div class="marquee-container relative overflow-hidden py-3 mask-marquee">
            <div class="animate-marquee-scroll flex items-center gap-3 sm:gap-4">
              <div
                v-for="(tool, idx) in doubleMarqueeTools"
                :key="`${tool.name}-${idx}`"
                :aria-hidden="idx >= marqueeTools.length"
                class="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-[1.03] cursor-pointer whitespace-nowrap"
                :class="tool.glowClass"
              >
                <div
                  class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  :class="tool.iconBgClass"
                >
                  <!-- OpenAI / ChatGPT -->
                  <svg
                    v-if="tool.type === 'chatgpt'"
                    viewBox="0 0 24 24"
                    class="w-4 h-4 fill-current"
                    fill-rule="evenodd"
                  >
                    <path
                      d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z"
                    />
                  </svg>

                  <!-- Google Gemini -->
                  <svg v-else-if="tool.type === 'gemini'" viewBox="0 0 24 24" class="w-4 h-4">
                    <path
                      d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
                      fill="#38BDF8"
                    />
                  </svg>

                  <!-- Claude (Anthropic) -->
                  <svg v-else-if="tool.type === 'claude'" viewBox="0 0 24 24" class="w-4 h-4">
                    <path
                      d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"
                      fill="#D97757"
                    />
                  </svg>

                  <!-- Midjourney -->
                  <svg
                    v-else-if="tool.type === 'midjourney'"
                    viewBox="0 0 698 583"
                    class="w-4 h-4 fill-none"
                  >
                    <path
                      d="M9 573.5C29 573.5 59 531.5 94 525.5C114 525.5 129 567.5 179 573.5C214 573.5 229 531.5 264 531.5C299 531.5 314 573.5 349 573.5C384 573.5 399 531.5 434 531.5C469 531.5 484 573.5 519 573.5C554 573.5 569 531.5 604 531.5C639 531.5 654 573.5 689 573.5"
                      stroke="currentColor"
                      stroke-width="26"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M77.4 531.7L54.5 487.9L644.5 449.9C598.1 492.1 538.5 526.3 478.2 554.3"
                      stroke="currentColor"
                      stroke-width="26"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M289.4 79.9004C389.8 110.6 530.2 258.9 578 418.3C551.8 408 532.2 397.5 495.4 406.9C459.8 277.4 396.1 153.7 289.4 79.9004Z"
                      stroke="currentColor"
                      stroke-width="26"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M102.7 9.00049C231.3 64.0005 407.7 217.1 440.1 421C291.8 361.2 178.9 393.1 100.3 441.6C220.2 289.2 166.4 115.9 102.7 9.00049Z"
                      stroke="currentColor"
                      stroke-width="26"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <!-- DeepSeek -->
                  <svg v-else-if="tool.type === 'deepseek'" viewBox="0 0 24 24" class="w-4 h-4">
                    <path
                      fill="#4D6BFE"
                      d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 0 1-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 0 0-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 0 1-.465.137 9.597 9.597 0 0 0-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 0 0 1.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 0 1 1.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 0 1 .415-.287.302.302 0 0 1 .2.288.306.306 0 0 1-.31.307.303.303 0 0 1-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 0 1-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 0 1 .016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 0 1-.254-.078.253.253 0 0 1-.114-.358c.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z"
                    />
                  </svg>

                  <!-- Notion -->
                  <svg
                    v-else-if="tool.type === 'notion'"
                    viewBox="0 0 24 24"
                    class="w-4 h-4 fill-current"
                  >
                    <path
                      d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"
                    />
                  </svg>

                  <!-- Obsidian -->
                  <svg
                    v-else-if="tool.type === 'obsidian'"
                    viewBox="0 0 24 24"
                    class="w-4 h-4 fill-purple-500"
                  >
                    <path
                      d="M19.355 18.538a68.967 68.959 0 0 0 1.858-2.954.81.81 0 0 0-.062-.9c-.516-.685-1.504-2.075-2.042-3.362-.553-1.321-.636-3.375-.64-4.377a1.707 1.707 0 0 0-.358-1.05l-3.198-4.064a3.744 3.744 0 0 1-.076.543c-.106.503-.307 1.004-.536 1.5-.134.29-.29.6-.446.914l-.31.626c-.516 1.068-.997 2.227-1.132 3.59-.124 1.26.046 2.73.815 4.481.128.011.257.025.386.044a6.363 6.363 0 0 1 3.326 1.505c.916.79 1.744 1.922 2.415 3.5zM8.199 22.569c.073.012.146.02.22.02.78.024 2.095.092 3.16.29.87.16 2.593.64 4.01 1.055 1.083.316 2.198-.548 2.355-1.664.114-.814.33-1.735.725-2.58l-.01.005c-.67-1.87-1.522-3.078-2.416-3.849a5.295 5.295 0 0 0-2.778-1.257c-1.54-.216-2.952.19-3.84.45.532 2.218.368 4.829-1.425 7.531zM5.533 9.938c-.023.1-.056.197-.098.29L2.82 16.059a1.602 1.602 0 0 0 .313 1.772l4.116 4.24c2.103-3.101 1.796-6.02.836-8.3-.728-1.73-1.832-3.081-2.55-3.831zM9.32 14.01c.615-.183 1.606-.465 2.745-.534-.683-1.725-.848-3.233-.716-4.577.154-1.552.7-2.847 1.235-3.95.113-.235.223-.454.328-.664.149-.297.288-.577.419-.86.217-.47.379-.885.46-1.27.08-.38.08-.72-.014-1.043-.095-.325-.297-.675-.68-1.06a1.6 1.6 0 0 0-1.475.36l-4.95 4.452a1.602 1.602 0 0 0-.513.952l-.427 2.83c.672.59 2.328 2.316 3.335 4.711.09.21.175.43.253.653z"
                    />
                  </svg>

                  <!-- Canva -->
                  <svg v-else-if="tool.type === 'canva'" viewBox="0 0 80 80" class="w-4 h-4">
                    <circle cx="40" cy="40" r="40" fill="#00C4CC" />
                    <path
                      d="M57.2691 48.2052C56.939 48.2052 56.6485 48.484 56.3462 49.0928C52.9323 56.0153 47.0358 60.9134 40.2125 60.9134C32.3228 60.9134 27.437 53.7913 27.437 43.9522C27.437 27.2855 36.7232 17.6491 44.8796 17.6491C48.691 17.6491 51.0186 20.0443 51.0186 23.8559C51.0186 28.3796 48.4485 30.7748 48.4485 32.3702C48.4485 33.0864 48.8939 33.5201 49.7773 33.5201C53.3264 33.5201 57.4918 29.4419 57.4918 23.6808C57.4918 18.0947 52.63 13.9888 44.4737 13.9888C30.994 13.9888 19.0142 26.4858 19.0142 43.777C19.0142 57.1614 26.6572 66.0061 38.45 66.0061C50.9668 66.0061 58.2043 53.5526 58.2043 49.5105C58.2043 48.6153 57.7466 48.2052 57.2691 48.2052Z"
                      fill="white"
                    />
                  </svg>

                  <!-- Adobe -->
                  <svg v-else-if="tool.type === 'adobe'" viewBox="0 0 91 80" class="w-4 h-4">
                    <path d="M56.9686 0H90.4318V80L56.9686 0Z" fill="#EB1000" />
                    <path d="M33.4632 0H0V80L33.4632 0Z" fill="#EB1000" />
                    <path
                      d="M45.1821 29.4668L66.5199 80.0002H52.5657L46.1982 63.9461H30.6182L45.1821 29.4668Z"
                      fill="#EB1000"
                    />
                  </svg>

                  <!-- Runway -->
                  <svg
                    v-else-if="tool.type === 'runway'"
                    viewBox="0 0 300 300"
                    class="w-4 h-4 fill-none"
                  >
                    <path
                      d="M137.645 300C91.5518 300 45.7852 300 0 300C0 200.02 0 100.04 0 0C99.9541 0 199.927 0 300 0C300 99.9603 300 199.98 300 300C246.028 300 191.999 300 137.645 300ZM211.789 104.298C207.039 92.9544 198.41 86.6939 186.234 86.5187C162.54 86.178 138.833 86.1207 115.141 86.5261C99.6132 86.7918 86.9221 100.146 86.8022 115.705C86.6237 138.855 86.5156 162.011 86.8575 185.157C87.0238 196.414 91.9642 205.326 102.523 210.528C118.074 218.188 137.158 212.152 143.923 197.245C145.137 194.569 145.788 191.637 146.794 188.53C148.069 189.879 149.121 191.108 150.293 192.21C156.124 197.695 161.814 203.348 167.876 208.568C180.592 219.518 201.68 214.743 209.953 200.021C216.218 188.871 216.569 174.774 207.343 165.014C203.396 160.838 199.369 156.736 195.312 152.666C193.215 150.561 190.975 148.597 188.534 146.323C198.38 143.802 203.352 140.974 206.863 136.628C214.675 126.956 215.668 116.25 211.789 104.298Z"
                      class="fill-zinc-900 dark:fill-white"
                    />
                    <path
                      d="M212.486 105.22C216.254 116.938 215.261 127.642 207.452 137.312C203.943 141.658 198.973 144.485 189.13 147.005C191.57 149.279 193.809 151.242 195.906 153.347C199.96 157.417 203.986 161.518 207.932 165.693C217.154 175.451 216.804 189.546 210.541 200.693C202.271 215.412 181.191 220.187 168.48 209.238C162.421 204.019 156.733 198.368 150.904 192.884C149.733 191.782 148.681 190.553 147.407 189.205C146.401 192.311 145.751 195.242 144.537 197.918C137.775 212.822 118.698 218.857 103.153 211.198C92.5986 205.997 87.6601 197.087 87.4939 185.832C87.1521 162.69 87.2602 139.539 87.4386 116.393C87.5585 100.838 100.245 87.4862 115.766 87.2205C139.448 86.8152 163.146 86.8725 186.831 87.2132C199.002 87.3883 207.628 93.6476 212.486 105.22ZM125.01 108.086C121.119 105.032 116.875 103.935 112.324 106.343C107.723 108.778 105.575 112.638 105.603 118.003C105.72 140.149 105.625 162.295 105.698 184.441C105.705 186.442 105.972 188.617 106.788 190.405C109.016 195.282 114.992 197.672 120.598 196.281C125.959 194.95 129.101 190.869 129.104 185.111C129.118 162.639 129.062 140.167 129.158 117.695C129.174 113.951 128.015 110.938 125.01 108.086ZM150.442 146.846C149.498 146.891 148.553 146.936 147.39 146.991C147.39 152.27 147.336 157.358 147.443 162.443C147.461 163.291 147.983 164.313 148.597 164.935C158.035 174.501 167.442 184.102 177.083 193.46C178.821 195.148 181.473 196.395 183.878 196.791C188.779 197.599 193.731 194.313 196.144 189.426C198.157 185.348 197.209 180.335 193.55 176.606C185.263 168.162 176.836 159.854 168.643 151.321C165.437 147.981 162.029 146.038 157.259 146.793C155.245 147.112 153.138 146.846 150.442 146.846ZM169.239 105.042C161.272 105.042 153.305 105.042 145.948 105.042C146.614 113.151 147.252 120.934 147.905 128.886C160.176 128.886 172.526 128.917 184.876 128.875C192.21 128.849 196.856 124.101 196.812 116.824C196.77 109.897 191.917 105.095 184.857 105.049C179.869 105.016 174.88 105.042 169.239 105.042Z"
                      class="fill-white dark:fill-zinc-950"
                    />
                    <path
                      d="M125.184 108.249C128.015 110.938 129.174 113.951 129.158 117.695C129.062 140.167 129.118 162.639 129.104 185.111C129.101 190.869 125.959 194.95 120.598 196.281C114.992 197.672 109.016 195.282 106.788 190.405C105.972 188.617 105.705 186.442 105.698 184.441C105.625 162.295 105.72 140.149 105.603 118.003C105.575 112.638 107.723 108.778 112.324 106.343C116.875 103.935 121.119 105.032 125.184 108.249Z"
                      class="fill-zinc-900 dark:fill-white"
                    />
                    <path
                      d="M150.758 146.846C153.138 146.846 155.245 147.112 157.259 146.793C162.029 146.038 165.437 147.981 168.643 151.321C176.836 159.854 185.263 168.162 193.55 176.606C197.209 180.335 198.157 185.348 196.144 189.426C193.731 194.313 188.779 197.599 183.878 196.791C181.473 196.395 178.821 195.148 177.083 193.46C167.442 184.102 158.035 174.501 148.597 164.935C147.983 164.313 147.461 163.291 147.443 162.443C147.336 157.358 147.39 152.27 147.39 146.991C148.553 146.936 149.498 146.891 150.758 146.846Z"
                      class="fill-zinc-900 dark:fill-white"
                    />
                    <path
                      d="M169.565 105.042C174.88 105.042 179.869 105.016 184.857 105.049C191.917 105.095 196.77 109.897 196.812 116.824C196.857 124.101 192.21 128.849 184.876 128.875C172.526 128.917 160.176 128.886 147.905 128.886C147.252 120.934 146.614 113.151 145.948 105.042C153.305 105.042 161.272 105.042 169.565 105.042Z"
                      class="fill-zinc-900 dark:fill-white"
                    />
                  </svg>

                  <!-- ElevenLabs -->
                  <svg
                    v-else-if="tool.type === 'elevenlabs'"
                    viewBox="0 0 24 24"
                    class="w-4 h-4 fill-current"
                  >
                    <path d="M4.6035 0v24h4.9317V0zm9.8613 0v24h4.9317V0z" />
                  </svg>

                  <!-- Meta AI -->
                  <svg
                    v-else-if="tool.type === 'meta'"
                    viewBox="0 0 24 24"
                    class="w-4 h-4 fill-current"
                  >
                    <path
                      d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                    />
                  </svg>
                </div>

                <div class="flex flex-col text-left">
                  <div class="flex items-center gap-1.5">
                    <span
                      class="text-xs font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
                    >
                      {{ tool.name }}
                    </span>
                  </div>
                  <span
                    class="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium leading-tight"
                  >
                    {{ tool.subtitle }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
