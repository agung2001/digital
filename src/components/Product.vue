<script setup lang="ts">
import { ref, computed } from 'vue'

interface Composition {
  image: number
  video: number
  text: number
  application: number
}

interface Product {
  uuid: string
  title: string
  url: string
  coverImage: string
  featured?: boolean
  score?: number | null
  ranking?: number | null
  composition?: Composition
  stage?: string
}

const props = defineProps<{
  product: Product
  isFeatured?: boolean
}>()

const emit = defineEmits<{
  (e: 'show-rating', score: number): void
  (e: 'show-ranking', ranking: number): void
  (e: 'show-composition', composition: Composition): void
}>()

const imageError = ref(false)

const hasComposition = computed(() => {
  const comp = props.product.composition
  if (!comp) return false
  return (comp.image || 0) + (comp.video || 0) + (comp.text || 0) + (comp.application || 0) > 0
})

const compositionStats = computed(() => {
  const comp = props.product.composition
  if (!comp) return { imagePct: 0, videoPct: 0, textPct: 0, appPct: 0, total: 0 }
  const img = comp.image || 0
  const vid = comp.video || 0
  const txt = comp.text || 0
  const app = comp.application || 0
  const total = img + vid + txt + app
  if (total === 0) return { imagePct: 0, videoPct: 0, textPct: 0, appPct: 0, total: 0 }
  return {
    imagePct: (img / total) * 100,
    videoPct: (vid / total) * 100,
    textPct: (txt / total) * 100,
    appPct: (app / total) * 100,
    total
  }
})

const openProduct = (event: Event) => {
  // Prevent redirection when clicking action buttons (Affiliate, Buy Now)
  if ((event.target as HTMLElement).closest('a')) return
  window.open(props.product.url, '_blank')
}

const affiliateUrl = computed(() => {
  if (props.product.uuid === 'd3020f09-4f4c-402e-9f96-3517be6fa517') {
    return props.product.url
  }
  const firstChunk = props.product.uuid.split('-')[0]
  return `https://lynk.id/admin/affiliate-add?search=AS-${firstChunk}`
})

const isLeadMagnet = computed(() => {
  return props.product.stage?.toLowerCase() === 'lead magnet' || props.product.stage?.toLowerCase() === 'lead magnets'
})

const actionButtonLabel = computed(() => {
  return isLeadMagnet.value ? 'Free' : 'Buy Now'
})

const actionButtonIcon = computed(() => {
  return isLeadMagnet.value ? 'fas fa-download text-base' : 'fas fa-bag-shopping text-base'
})

const handleImageError = () => {
  imageError.value = true
}
</script>

<template>
  <div
    class="group relative flex flex-col bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-teal-400/60 dark:hover:border-teal-500/50 hover:shadow-2xl hover:shadow-teal-500/15 hover:-translate-y-2 transition-all duration-500 h-full cursor-pointer"
    @click="openProduct($event)"
  >
    <div
      v-if="isFeatured"
      class="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-teal-500/20 border border-white/20"
    >
      <i class="fas fa-star text-[9px]"></i>
      Featured
    </div>

    <!-- Ranking Badge -->
    <div
      v-if="product.ranking !== undefined && product.ranking !== null"
      class="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider shadow-lg cursor-help transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20 backdrop-blur-md"
      :class="{
        'bg-gradient-to-r from-teal-400/90 to-cyan-500/90 shadow-teal-500/20': product.ranking === 1,
        'bg-gradient-to-r from-cyan-400/90 to-blue-500/90 shadow-cyan-500/20': product.ranking === 2,
        'bg-gradient-to-r from-blue-400/90 to-indigo-500/90 shadow-blue-500/20': product.ranking === 3,
        'bg-zinc-800/80 shadow-zinc-900/30': product.ranking > 3
      }"
      @click.stop="emit('show-ranking', product.ranking)"
    >
      <i class="fas text-[9px]" :class="product.ranking <= 3 ? 'fa-trophy' : 'fa-medal'"></i>
      Top {{ product.ranking }}
    </div>

    <div
      class="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none z-10"
    ></div>

    <div
      class="w-full aspect-square relative overflow-hidden bg-zinc-200/40 dark:bg-zinc-800/40 flex-none"
    >
      <div
        v-if="product.coverImage && !imageError"
        class="absolute inset-0 bg-center bg-no-repeat bg-cover blur-md scale-125 transition-transform duration-500 group-hover:scale-150 opacity-60"
        :style="{ backgroundImage: `url('${product.coverImage}')` }"
        aria-hidden="true"
      />
      <div
        v-if="product.coverImage && !imageError"
        class="absolute inset-0 bg-white/10 dark:bg-black/20 transition-opacity duration-500 group-hover:bg-transparent"
        aria-hidden="true"
      />
      <img
        v-if="product.coverImage && !imageError"
        :src="product.coverImage"
        :alt="product.title"
        class="relative w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
        loading="lazy"
        decoding="async"
        @error="handleImageError"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
      >
        <i class="fas fa-box text-6xl text-zinc-300 dark:text-zinc-600"></i>
      </div>
    </div>

    <div
      class="bg-white/30 dark:bg-zinc-900/30 backdrop-blur-md border-t border-white/40 dark:border-white/10 flex flex-col justify-between flex-1"
    >
      <div class="p-4 flex-1 flex flex-col justify-between">
        <h3
          class="text-zinc-900 dark:text-white text-sm font-medium leading-snug break-words tracking-tight mb-3"
          :title="product.title"
        >
          {{ product.title }}
        </h3>

        <!-- Score Progress Bar -->
        <div 
          v-if="product.score !== undefined && product.score !== null" 
          class="mt-auto pt-2 group/score cursor-help select-none"
          @click.stop="emit('show-rating', product.score)"
        >
          <div class="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400 mb-1 font-medium transition-colors group-hover/score:text-cyan-600 dark:group-hover/score:text-cyan-400">
            <span>Rating Score</span>
            <span>{{ product.score }}/100</span>
          </div>
          <div class="relative h-2 w-full bg-zinc-200/60 dark:bg-zinc-700/40 rounded-full overflow-visible transition-all duration-300 group-hover/score:shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <!-- Progress Line -->
            <div 
              class="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-300"
              :style="{ width: `${product.score}%` }"
            ></div>
            <!-- Sparkle Emoji Indicator -->
            <div 
              class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-sm z-10 drop-shadow select-none pointer-events-none transition-transform duration-300 group-hover/score:scale-130 group-hover/score:-translate-y-[65%] animate-wiggle"
              :style="{ left: `${product.score}%` }"
            >
              💎
            </div>
          </div>
        </div>

        <!-- Composition Progress Bar -->
        <div 
          v-if="hasComposition" 
          class="mt-2 pt-2 group/comp cursor-help select-none"
          @click.stop="emit('show-composition', product.composition!)"
        >
          <div class="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400 mb-1 font-medium transition-colors group-hover/comp:text-teal-600 dark:group-hover/comp:text-teal-400">
            <span>Composition</span>
            <span>{{ compositionStats.total }} Files</span>
          </div>
          <div class="relative h-2 w-full bg-zinc-200/60 dark:bg-zinc-700/40 rounded-full overflow-visible transition-all duration-300 flex group-hover/comp:shadow-[0_0_12px_rgba(20,184,166,0.2)]">
            <!-- Stacked Segments aligned with Hero stat palette (cyan = text/materi, blue = image/gambar, indigo = video, violet = application) -->
            <div 
              v-if="compositionStats.textPct > 0"
              class="h-full bg-cyan-500 first:rounded-l-full last:rounded-r-full transition-all duration-300"
              :style="{ width: `${compositionStats.textPct}%` }"
              title="Text"
            ></div>
            <div 
              v-if="compositionStats.imagePct > 0"
              class="h-full bg-blue-500 first:rounded-l-full last:rounded-r-full transition-all duration-300"
              :style="{ width: `${compositionStats.imagePct}%` }"
              title="Image"
            ></div>
            <div 
              v-if="compositionStats.videoPct > 0"
              class="h-full bg-indigo-500 first:rounded-l-full last:rounded-r-full transition-all duration-300"
              :style="{ width: `${compositionStats.videoPct}%` }"
              title="Video"
            ></div>
            <div 
              v-if="compositionStats.appPct > 0"
              class="h-full bg-violet-500 first:rounded-l-full last:rounded-r-full transition-all duration-300"
              :style="{ width: `${compositionStats.appPct}%` }"
              title="Application"
            ></div>
          </div>
        </div>
      </div>
      <div class="p-3 pt-0 flex flex-col xl:flex-row gap-2">
        <a
          :href="affiliateUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click.stop
          aria-label="View affiliate link"
          class="w-full py-2.5 px-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-xs bg-white/50 dark:bg-zinc-800/40 hover:bg-cyan-600 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-zinc-950 text-zinc-700 dark:text-zinc-200 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-700/50 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 shadow-sm hover:shadow-md hover:shadow-cyan-500/20 active:scale-98"
        >
          <i class="fas fa-link text-base"></i>
          Affiliate
        </a>
        <a
          :href="product.url"
          target="_blank"
          rel="noopener noreferrer"
          @click.stop
          aria-label="Buy or download this product"
          class="w-full py-2.5 px-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-xs bg-teal-500/10 dark:bg-teal-500/15 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-400 dark:hover:text-zinc-950 text-teal-700 dark:text-teal-300 font-semibold backdrop-blur-md border border-teal-500/20 dark:border-teal-400/20 shadow-sm hover:shadow-md hover:shadow-teal-500/25 active:scale-98"
        >
          <i :class="actionButtonIcon"></i>
          {{ actionButtonLabel }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes wiggle {
  0%, 100% { transform: translateY(-50%) translateX(-50%) rotate(0deg); }
  25% { transform: translateY(-65%) translateX(-50%) rotate(-8deg) scale(1.3); }
  75% { transform: translateY(-65%) translateX(-50%) rotate(8deg) scale(1.3); }
}

.group\/score:hover .animate-wiggle {
  animation: wiggle 0.6s ease-in-out infinite alternate;
}
</style>
