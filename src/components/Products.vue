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
  <section>
    <div class="mb-10">
      <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        I craft premium digital products that empower creators and developers. From in-depth courses to polished templates and tools, every product is designed to help you ship faster, learn smarter, and turn ideas into reality.
      </p>
    </div>

    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center min-h-[400px] p-8"
    >
      <div
        class="w-12 h-12 rounded-full border-2 border-zinc-200 dark:border-zinc-700 border-t-teal-500 animate-spin mb-4"
      ></div>
      <p class="text-sm text-zinc-500 dark:text-zinc-400">Loading products...</p>
    </div>

    <div
      v-else-if="loadError"
      class="flex flex-col items-center justify-center min-h-[400px] p-8"
    >
      <div
        class="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4"
      >
        <i class="fas fa-exclamation-triangle text-2xl text-red-500"></i>
      </div>
      <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
        Failed to load products
      </h3>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 text-center mb-6">{{ loadError }}</p>
      <button
        @click="loadProducts"
        class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-teal-500 hover:bg-teal-600 transition-colors cursor-pointer"
      >
        <i class="fas fa-redo mr-2"></i>
        Try Again
      </button>
    </div>

    <div
      v-else-if="products.length === 0"
      class="flex flex-col items-center justify-center min-h-[400px] p-8"
    >
      <div
        class="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4"
      >
        <i class="fas fa-box-open text-2xl text-zinc-400 dark:text-zinc-500"></i>
      </div>
      <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">No products yet</h3>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 text-center">
        Check back later for new products.
      </p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-6">
      <div
        v-for="(product, index) in products"
        :key="product.uuid"
        class="vault-card-animate"
        :style="{ animationDelay: `${index * 0.08}s` }"
      >
        <Product :product="product" />
      </div>
    </div>
  </section>
</template>
