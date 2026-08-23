<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Product from './Product.vue'
import AnimatedNumber from './AnimatedNumber.vue'
import { useMarketplace } from '@/composables/useMarketplace'

interface Composition {
  image: number
  video: number
  text: number
  application: number
}

const { products, stats, isLoading, loadError, loadProducts } = useMarketplace()
const searchQuery = ref('')
const sortBy = ref<'alphabet' | 'score' | 'ranking'>('alphabet')
const selectedStage = ref<string>('all')
const currentPage = ref(1)
const itemsPerPage = 16
const isMounted = ref(false)

const isRatingModalOpen = ref(false)
const isRankingModalOpen = ref(false)
const isCompositionModalOpen = ref(false)
const selectedProductScore = ref<number | null>(null)
const selectedProductRanking = ref<number | null>(null)
const selectedProductComposition = ref<Composition | null>(null)

const openRatingModal = (score: number) => {
  selectedProductScore.value = score
  isRatingModalOpen.value = true
}

const openRankingModal = (ranking: number) => {
  selectedProductRanking.value = ranking
  isRankingModalOpen.value = true
}

const openCompositionModal = (composition: Composition) => {
  selectedProductComposition.value = composition
  isCompositionModalOpen.value = true
}

let isSyncing = false

// Sync URL search params
const syncUrlParams = () => {
  isSyncing = true
  const params = new URLSearchParams(window.location.search)
  const s = params.get('s') || ''
  const sort = params.get('sort') || 'alphabet'
  const stage = params.get('stage') || 'all'
  const page = parseInt(params.get('page') || '1', 10)

  if (searchQuery.value !== s) {
    searchQuery.value = s
  }
  if (['alphabet', 'score', 'ranking'].includes(sort) && sortBy.value !== sort) {
    sortBy.value = sort as 'alphabet' | 'score' | 'ranking'
  }
  if (selectedStage.value !== stage) {
    selectedStage.value = stage
  }
  if (!isNaN(page) && currentPage.value !== page) {
    currentPage.value = page
  }
  isSyncing = false
}

const updateUrlParams = () => {
  const url = new URL(window.location.href)
  if (searchQuery.value) {
    url.searchParams.set('s', searchQuery.value)
  } else {
    url.searchParams.delete('s')
  }

  if (sortBy.value && sortBy.value !== 'alphabet') {
    url.searchParams.set('sort', sortBy.value)
  } else {
    url.searchParams.delete('sort')
  }

  if (selectedStage.value && selectedStage.value !== 'all') {
    url.searchParams.set('stage', selectedStage.value)
  } else {
    url.searchParams.delete('stage')
  }

  if (currentPage.value > 1) {
    url.searchParams.set('page', String(currentPage.value))
  } else {
    url.searchParams.delete('page')
  }

  const newUrl = url.pathname + url.search + url.hash
  if (window.location.search !== url.search) {
    window.history.replaceState(null, '', newUrl)
  }
}

watch([searchQuery, sortBy, selectedStage, currentPage], () => {
  updateUrlParams()
})

// Listen to popstate event (back/forward browser buttons)
onMounted(() => {
  window.addEventListener('popstate', syncUrlParams)
})

const roles = ['Software Engineer.', 'Digital Product Maker.', 'Digital Creator.', 'AI Enthusiast.']
const currentRoleIndex = ref(0)
const currentText = ref('')
const isDeleting = ref(false)
const typingSpeed = ref(150)

const filteredProducts = computed(() => {
  let result = [...products.value]

  // Filter by stage
  if (selectedStage.value && selectedStage.value !== 'all') {
    result = result.filter((p) => {
      if (!p.stage) return false
      const pStage = p.stage.toLowerCase()
      if (selectedStage.value === 'core') {
        return pStage === 'core offer'
      } else if (selectedStage.value === 'tripwire') {
        return pStage === 'tripwire'
      } else if (selectedStage.value === 'lead') {
        return pStage === 'lead magnet' || pStage === 'lead magnets'
      }
      return true
    })
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((p) => p.title.toLowerCase().includes(query))
  }
  // Sort featured products to the top, then by chosen sort mode
  result.sort((a, b) => {
    // 1. Featured priority
    const aFeat = a.featured ? 1 : 0
    const bFeat = b.featured ? 1 : 0
    if (bFeat !== aFeat) return bFeat - aFeat

    // 2. Sort mode
    if (sortBy.value === 'score') {
      const aScore = a.score !== null && a.score !== undefined ? a.score : -1
      const bScore = b.score !== null && b.score !== undefined ? b.score : -1
      return bScore - aScore
    } else if (sortBy.value === 'ranking') {
      const aRank = a.ranking !== null && a.ranking !== undefined ? a.ranking : 999999
      const bRank = b.ranking !== null && b.ranking !== undefined ? b.ranking : 999999
      return aRank - bRank
    } else {
      // Default: Alphabetical (A-Z)
      return a.title.localeCompare(b.title)
    }
  })
  return result
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// Removed hardcoded featured titles list; now dynamic via marketplace.json.

const productCount = computed(() => products.value.length)

watch(searchQuery, () => {
  if (!isSyncing) {
    currentPage.value = 1
  }
})

watch(selectedStage, () => {
  if (!isSyncing) {
    currentPage.value = 1
  }
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
  syncUrlParams()
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
        class="text-center mt-6 mb-12"
        :class="isMounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
        style="transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
      >
        <div
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6 ring-1 ring-inset ring-teal-500/20"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          Digital Products & AI Tools
        </div>

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

      <div
        class="mb-12"
        :class="isMounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
        style="transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s"
      >
        <div class="relative w-full flex flex-col sm:flex-row gap-4">
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
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
              placeholder="Temukan tools, prompt, atau template AI impianmu..."
              class="block w-full pl-12 pr-4 py-3.5 border border-zinc-200 dark:border-zinc-700/50 rounded-xl bg-white/80 dark:bg-zinc-800/50 text-base placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all shadow-sm shadow-zinc-800/5"
            />
          </div>
          <select
            v-model="selectedStage"
            class="block w-full sm:w-48 px-4 py-3.5 border border-zinc-200 dark:border-zinc-700/50 rounded-xl bg-white/80 dark:bg-zinc-800/50 text-base focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all shadow-sm shadow-zinc-800/5 cursor-pointer text-zinc-700 dark:text-zinc-300"
          >
            <option value="all">Semua Jenis</option>
            <option value="core">Paket</option>
            <option value="tripwire">Modul</option>
            <option value="lead">Gratis</option>
          </select>
          <select
            v-model="sortBy"
            class="block w-full sm:w-48 px-4 py-3.5 border border-zinc-200 dark:border-zinc-700/50 rounded-xl bg-white/80 dark:bg-zinc-800/50 text-base focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all shadow-sm shadow-zinc-800/5 cursor-pointer text-zinc-700 dark:text-zinc-300"
          >
            <option value="alphabet">Alfabet (A-Z)</option>
            <option value="score">Skor</option>
            <option value="ranking">Popularitas</option>
          </select>
        </div>
      </div>

      <div class="relative min-h-[400px]">
        <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[400px] p-8">
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
              <Product 
                :product="product" 
                :is-featured="product.featured" 
                @show-rating="openRatingModal"
                @show-ranking="openRankingModal"
                @show-composition="openCompositionModal"
              />
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
  <!-- Rating System Explanation Modal -->
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isRatingModalOpen" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
        @click="isRatingModalOpen = false"
      >
        <div 
          class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden"
          @click.stop
        >
          <!-- Decorative Top Grid -->
          <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500"></div>

          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <span class="text-3xl select-none">⭐</span>
              <div>
                <h4 class="text-lg font-bold text-zinc-900 dark:text-white">Rating Score: {{ selectedProductScore }}/100</h4>
                <p class="text-xs text-zinc-500 dark:text-zinc-400">Sistem Penilaian Otomatis</p>
              </div>
            </div>
            <button 
              @click="isRatingModalOpen = false" 
              class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
            >
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>

          <div class="space-y-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <p>
              <strong>Rating Score</strong> merupakan bagian dari upaya kami untuk terus menyajikan produk digital terbaik untuk Anda.
            </p>
            <p>
              Skor ini dihasilkan secara otomatis oleh <strong>sistem AI</strong> yang menganalisis, menilai, dan memverifikasi kelengkapan serta kualitas isi konten produk tersebut secara objektif.
            </p>
          </div>

          <div class="mt-6 flex justify-end">
            <button 
              @click="isRatingModalOpen = false" 
              class="px-5 py-2 rounded-xl text-xs font-bold bg-yellow-500 hover:bg-yellow-600 text-zinc-950 transition-colors shadow-lg shadow-yellow-500/20 cursor-pointer"
            >
              Mengerti
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Ranking System Explanation Modal -->
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isRankingModalOpen" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
        @click="isRankingModalOpen = false"
      >
        <div 
          class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden"
          @click.stop
        >
          <!-- Decorative Top Grid -->
          <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-500"></div>

          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <span class="text-3xl select-none">🏆</span>
              <div>
                <h4 class="text-lg font-bold text-zinc-900 dark:text-white">Top {{ selectedProductRanking }} Terbaik</h4>
                <p class="text-xs text-zinc-500 dark:text-zinc-400">Sistem Pemeringkatan Produk</p>
              </div>
            </div>
            <button 
              @click="isRankingModalOpen = false" 
              class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
            >
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>

          <div class="space-y-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <p>
              Label <strong>Top {{ selectedProductRanking }}</strong> menunjukkan bahwa produk digital ini merupakan salah satu produk yang <strong>paling laku</strong> dan <strong>paling diminati</strong> oleh customer kami.
            </p>
            <p>
              Peringkat ini diperbarui secara berkala berdasarkan tingkat popularitas, jumlah penjualan, serta tingkat kepuasan pelanggan terhadap produk tersebut.
            </p>
          </div>

          <div class="mt-6 flex justify-end">
            <button 
              @click="isRankingModalOpen = false" 
              class="px-5 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white transition-colors shadow-lg shadow-teal-500/20 cursor-pointer"
            >
              Mengerti
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Composition Explanation Modal -->
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isCompositionModalOpen && selectedProductComposition" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
        @click="isCompositionModalOpen = false"
      >
        <div 
          class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden"
          @click.stop
        >
          <!-- Decorative Top Grid -->
          <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-500"></div>

          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <span class="text-3xl select-none">📁</span>
              <div>
                <h4 class="text-lg font-bold text-zinc-900 dark:text-white">Komposisi Produk</h4>
                <p class="text-xs text-zinc-500 dark:text-zinc-400">Rincian jenis & jumlah berkas produk</p>
              </div>
            </div>
            <button 
              @click="isCompositionModalOpen = false" 
              class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
            >
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>

          <div class="space-y-4">
            <p class="text-sm text-zinc-600 dark:text-zinc-300">
              Berikut adalah rincian jumlah dan klasifikasi file yang terdapat di dalam produk digital ini:
            </p>

            <div class="space-y-3">
              <!-- Image Item -->
              <div class="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                <div class="flex items-center gap-3">
                  <span class="text-xl">🖼️</span>
                  <span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Gambar / Grafis</span>
                </div>
                <span class="text-sm font-bold text-emerald-600 dark:text-emerald-400">{{ selectedProductComposition.image }} file</span>
              </div>

              <!-- Video Item -->
              <div class="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                <div class="flex items-center gap-3">
                  <span class="text-xl">🎥</span>
                  <span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Video / Animasi</span>
                </div>
                <span class="text-sm font-bold text-blue-600 dark:text-blue-400">{{ selectedProductComposition.video }} file</span>
              </div>

              <!-- Text Item -->
              <div class="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                <div class="flex items-center gap-3">
                  <span class="text-xl">📝</span>
                  <span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Teks / Dokumen</span>
                </div>
                <span class="text-sm font-bold text-amber-600 dark:text-amber-400">{{ selectedProductComposition.text }} file</span>
              </div>

              <!-- Application Item -->
              <div class="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
                <div class="flex items-center gap-3">
                  <span class="text-xl">⚙️</span>
                  <span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Aplikasi / Lainnya</span>
                </div>
                <span class="text-sm font-bold text-purple-600 dark:text-purple-400">{{ selectedProductComposition.application }} file</span>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button 
              @click="isCompositionModalOpen = false" 
              class="px-5 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white transition-colors shadow-lg shadow-teal-500/20 cursor-pointer"
            >
              Mengerti
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
