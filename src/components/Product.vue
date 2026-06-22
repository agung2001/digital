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
</script>

<template>
  <div
    class="group h-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm shadow-sm rounded-2xl overflow-hidden flex flex-col border border-zinc-200/50 dark:border-zinc-700/50 hover:shadow-lg hover:shadow-zinc-900/5 dark:hover:shadow-zinc-950/20 hover:border-teal-500/30 dark:hover:border-teal-500/30 transition-all duration-300"
  >
    <div class="aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
      <img
        :src="product.coverImage"
        :alt="product.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <div class="p-5 flex-1 flex flex-col">
      <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100">{{ product.title }}</h3>
    </div>
    <div class="px-5 pb-5">
      <a
        :href="product.url"
        target="_blank"
        class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-300 text-white bg-teal-500 hover:bg-teal-600 shadow-sm shadow-teal-500/20"
      >
        <i class="fas fa-external-link-alt text-xs"></i>
        View Product
      </a>
    </div>
  </div>
</template>
