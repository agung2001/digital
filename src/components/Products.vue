<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Product from './Product.vue'

interface ProductType {
  uuid: string
  title: string
  url: string
  coverImage: string
}

const products = ref<ProductType[]>([])
const isLoading = ref(true)
const loadError = ref<string | null>(null)

const loadProducts = async () => {
  try {
    isLoading.value = true
    loadError.value = null

    const response = await fetch('/marketplace.json')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    products.value = data.products
  } catch (err) {
    console.error('Failed to load products:', err)
    loadError.value = err instanceof Error ? err.message : String(err)
    products.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="min-h-screen bg-[#f0f0f1] p-6 flex flex-col gap-y-4">
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center min-h-[400px] mx-auto p-8"
    >
      <i class="fas fa-spinner fa-spin text-6xl text-gray-700 mb-4"></i>
      <h3 class="text-xl font-medium text-gray-700 mb-2">Loading products...</h3>
      <p class="text-gray-500 text-center">Please wait while we fetch the latest products.</p>
    </div>

    <div
      v-else-if="loadError"
      class="flex flex-col items-center justify-center min-h-[400px] mx-auto p-8"
    >
      <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
      <h3 class="text-xl font-medium text-gray-700 mb-2">Failed to load products</h3>
      <p class="text-gray-500 text-center mb-6">{{ loadError }}</p>
      <button
        @click="loadProducts"
        class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        <i class="fas fa-redo mr-2"></i>
        Try Again
      </button>
    </div>

    <div
      v-else-if="products.length === 0"
      class="flex flex-col items-center justify-center min-h-[400px] mx-auto p-8"
    >
      <i class="fas fa-box-open text-6xl text-gray-700 mb-4"></i>
      <h3 class="text-xl font-medium text-gray-700 mb-2">No products available</h3>
      <p class="text-gray-500 text-center">Check back later for new products.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="product in products" :key="product.uuid">
        <Product :product="product" />
      </div>
    </div>
  </div>
</template>
