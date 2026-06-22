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
    class="h-full bg-white shadow-sm rounded-lg overflow-hidden flex flex-col border border-gray-200 hover:shadow-md transition-shadow"
  >
    <div class="aspect-video overflow-hidden bg-gray-100">
      <img 
        :src="product.coverImage" 
        :alt="product.title"
        class="w-full h-full object-cover"
      >
    </div>
    <div class="p-4 flex-1 flex flex-col">
      <h3 class="text-lg font-bold pb-2 text-gray-800">{{ product.title }}</h3>
    </div>
    <div class="border-t border-gray-200">
      <a
        :href="product.url"
        target="_blank"
        class="block px-4 py-3 text-center cursor-pointer transition-all duration-300 text-white bg-primary-600 hover:bg-primary-700"
      >
        <i class="fas fa-external-link-alt pr-1"></i>
        View Product
      </a>
    </div>
  </div>
</template>
