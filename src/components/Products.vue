<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Product from './Product.vue'
import { useMarketplace } from '@/composables/useMarketplace'

const { products, isLoading, loadError, loadProducts } = useMarketplace()
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 15
const isMounted = ref(false)

const roles = ['Software Engineer.', 'Digital Product Maker.', 'Digital Creator.', 'AI Enthusiast.']
const currentRoleIndex = ref(0)
const currentText = ref('')
const isDeleting = ref(false)
const typingSpeed = ref(150)

const filteredProducts = computed(() => {
  let result = products.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((p) => p.title.toLowerCase().includes(query))
  }
  return result
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const productCount = computed(() => products.value.length)

watch(searchQuery, () => {
  currentPage.value = 1
})

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

onMounted(() => {
  loadProducts()
  setTimeout(() => {
    isMounted.value = true
  }, 100)
  setTimeout(typeText, 800)
})
</script>

<template>
  <section id="products" class="relative min-h-screen pt-28 pb-12">
    <div class="mx-auto max-w-6xl px-4">
      <div
        class="text-center mb-16"
        :class="isMounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
        style="transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
      >
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6 ring-1 ring-inset ring-teal-500/20">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          Digital Products & AI Tools
        </div>

        <h1 class="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl lg:text-6xl mb-4 leading-tight">
          Agung Sundoro
          <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 animate-gradient-shift">{{ currentText }}</span>
          <span class="inline-block w-[3px] h-10 sm:h-12 lg:h-14 bg-teal-500 ml-1 animate-pulse align-middle"></span>
        </h1>

        <p class="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-8">
          Koleksi produk digital premium untuk membantu bisnis Anda berkembang dengan teknologi AI. Prompt, template, software, hingga AI tools terbaik.
        </p>

        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{{ productCount }}</span>
          <span class="text-xs text-zinc-500 dark:text-zinc-400">Products Available</span>
        </div>
      </div>

      <div
        class="mb-12"
        :class="isMounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
        style="transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s"
      >
        <div class="relative w-full max-w-2xl mx-auto">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              class="h-5 w-5 text-zinc-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari produk digital..."
            class="block w-full pl-12 pr-4 py-3.5 border border-zinc-200 dark:border-zinc-700/50 rounded-xl bg-white/80 dark:bg-zinc-800/50 text-base placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all shadow-sm shadow-zinc-800/5 backdrop-blur-sm"
          />
        </div>
      </div>

      <div class="relative min-h-[400px]">
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
          <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            No products yet
          </h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 text-center">
            Check back later for new products.
          </p>
        </div>

        <div
          v-else-if="filteredProducts.length === 0"
          class="flex flex-col items-center justify-center min-h-[400px] p-8"
        >
          <div
            class="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4"
          >
            <i class="fas fa-search text-2xl text-zinc-400 dark:text-zinc-500"></i>
          </div>
          <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            No results found
          </h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 text-center">
            Try a different search term.
          </p>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="(product, index) in paginatedProducts"
              :key="product.uuid"
              class="vault-card-animate"
              :style="{ animationDelay: `${index * 0.08}s` }"
            >
              <Product :product="product" />
            </div>
          </div>

          <div v-if="totalPages > 1" class="mt-16 flex items-center justify-center gap-4">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm cursor-pointer"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div class="flex items-center gap-2">
              <button
                v-for="p in totalPages"
                :key="p"
                @click="currentPage = p"
                class="w-10 h-10 rounded-xl text-sm font-bold transition-all cursor-pointer"
                :class="
                  currentPage === p
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                    : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                "
              >
                {{ p }}
              </button>
            </div>

            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm cursor-pointer"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
