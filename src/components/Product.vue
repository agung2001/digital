<script setup lang="ts">
interface Product {
  uuid: string
  title: string
  url: string
  coverImage: string
}

const { product } = defineProps({
  product: {
    type: Object as () => Product,
    required: true,
  },
})

const openProduct = () => {
  window.open(product.url, '_blank')
}
</script>

<template>
  <div
    class="group relative flex flex-col bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 vault-card-glow h-full cursor-pointer"
    @click="openProduct"
  >
    <div class="w-full aspect-square relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-none">
      <div
        v-if="product.coverImage"
        class="absolute inset-0 bg-center bg-no-repeat bg-cover blur-sm scale-125 transition-transform duration-500 group-hover:scale-150"
        :style="{ backgroundImage: `url('${product.coverImage}')` }"
        aria-hidden="true"
      />
      <div
        v-if="product.coverImage"
        class="absolute inset-0 bg-black/15 transition-opacity duration-500 group-hover:bg-black/25"
        aria-hidden="true"
      />
      <img
        v-if="product.coverImage"
        :src="product.coverImage"
        :alt="product.title"
        class="relative w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
        <i class="fas fa-box text-6xl text-zinc-300 dark:text-zinc-600"></i>
      </div>
    </div>

    <div class="p-4 bg-white/60 dark:bg-zinc-900/60 border-t border-zinc-200/50 dark:border-zinc-700/50 flex flex-col justify-between flex-1">
      <div>
        <h3
          class="font-bold text-zinc-900 dark:text-white text-sm leading-snug break-words tracking-tight"
          :title="product.title"
        >
          {{ product.title }}
        </h3>
      </div>
      <div class="mt-4 flex flex-col gap-2">
        <a
          :href="product.url"
          target="_blank"
          @click.stop
          class="w-full py-2 px-3 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500 text-white shadow-sm hover:shadow-md hover:scale-[1.02]"
        >
          <i class="fas fa-external-link-alt text-base"></i>
          VIEW
        </a>
      </div>
    </div>
  </div>
</template>
