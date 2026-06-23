<script setup lang="ts">
import { ref, computed } from 'vue'

interface Product {
  uuid: string
  title: string
  url: string
  coverImage: string
}

const props = defineProps<{
  product: Product
}>()

const imageError = ref(false)

const openProduct = () => {
  window.open(props.product.url, '_blank')
}

const affiliateUrl = computed(() => {
  const firstChunk = props.product.uuid.split('-')[0]
  return `https://lynk.id/admin/affiliate-add?search=AS-${firstChunk}`
})

const handleImageError = () => {
  imageError.value = true
}
</script>

<template>
  <div
    class="group relative flex flex-col bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-zinc-300/60 dark:border-zinc-600/60 hover:border-teal-500 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-2 transition-all duration-500 h-full cursor-pointer"
    @click="openProduct"
  >
    <div class="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none z-10"></div>

    <div class="w-full aspect-square relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-none">
      <div
        v-if="product.coverImage && !imageError"
        class="absolute inset-0 bg-center bg-no-repeat bg-cover blur-sm scale-125 transition-transform duration-500 group-hover:scale-150"
        :style="{ backgroundImage: `url('${product.coverImage}')` }"
        aria-hidden="true"
      />
      <div
        v-if="product.coverImage && !imageError"
        class="absolute inset-0 bg-black/15 transition-opacity duration-500 group-hover:bg-black/25"
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
      class="bg-white/60 dark:bg-zinc-900/60 border-t border-zinc-200/50 dark:border-zinc-700/50 flex flex-col justify-between flex-1"
    >
      <div class="p-4">
        <h3
          class="text-zinc-900 dark:text-white text-sm leading-snug break-words tracking-tight"
          :title="product.title"
        >
          {{ product.title }}
        </h3>
      </div>
      <div class="flex flex-col xl:flex-row">
        <a
          :href="affiliateUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click.stop
          aria-label="View affiliate link"
          class="w-full py-3 font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-xs bg-zinc-50 hover:bg-blue-500 dark:bg-zinc-800 dark:hover:bg-blue-600 text-zinc-600 hover:text-white dark:text-zinc-400 dark:hover:text-white border-t border-zinc-200/50 dark:border-zinc-700/50 xl:border-r border-r-zinc-200/50 dark:border-r-zinc-700/50"
        >
          <i class="fas fa-link text-base"></i>
          Affiliate
        </a>
        <a
          :href="product.url"
          target="_blank"
          rel="noopener noreferrer"
          @click.stop
          aria-label="Buy this product"
          class="w-full py-3 font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-xs bg-zinc-50 hover:bg-teal-500 dark:bg-zinc-800 dark:hover:bg-teal-600 text-zinc-600 hover:text-white dark:text-zinc-400 dark:hover:text-white border-t border-zinc-200/50 dark:border-zinc-700/50"
        >
          <i class="fas fa-bag-shopping text-base"></i>
          Buy Now
        </a>
      </div>
    </div>
  </div>
</template>
