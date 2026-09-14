<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Product from './Product.vue'
import { useMarketplace } from '@/composables/useMarketplace'

interface Composition {
  image: number
  video: number
  text: number
  application: number
}

const props = defineProps<{
  isMounted: boolean
}>()

const emit = defineEmits<{
  (e: 'update:productCount', count: number): void
  (e: 'update:stats', stats: { image: number; video: number; text: number; application: number }): void
}>()

const { products, stats, isLoading, loadError, loadProducts } = useMarketplace()
const searchQuery = ref('')
const sortBy = ref<'alphabet' | 'score' | 'ranking'>('alphabet')
const selectedStage = ref<string>('all')
const currentPage = ref(1)
const itemsPerPage = 16

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

const filteredProducts = computed(() => {
  let result = [...products.value]

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

  result.sort((a, b) => {
    const aFeat = a.featured ? 1 : 0
    const bFeat = b.featured ? 1 : 0
    if (bFeat !== aFeat) return bFeat - aFeat

    if (sortBy.value === 'score') {
      const aScore = a.score !== null && a.score !== undefined ? a.score : -1
      const bScore = b.score !== null && b.score !== undefined ? b.score : -1
      return bScore - aScore
    } else if (sortBy.value === 'ranking') {
      const aRank = a.ranking !== null && a.ranking !== undefined ? a.ranking : 999999
      const bRank = b.ranking !== null && b.ranking !== undefined ? b.ranking : 999999
      return aRank - bRank
    } else {
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

watch(
  products,
  (newVal) => {
    emit('update:productCount', newVal.length)
  },
  { immediate: true },
)

watch(
  stats,
  (newVal) => {
    emit('update:stats', newVal)
  },
  { immediate: true, deep: true },
)

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

onMounted(() => {
  syncUrlParams()
  window.addEventListener('popstate', syncUrlParams)
  loadProducts()
})
</script>

<template>
  <section id="products" class="relative pb-16">
    <div class="mx-auto max-w-6xl px-4">
      <div
        class="mb-6"
        :class="isMounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
        style="transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s"
      >
        <div class="relative w-full flex flex-col sm:flex-row gap-3">
          <!-- Search Field Glass -->
          <div class="relative flex-1 group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 text-zinc-400 group-focus-within:text-teal-500 transition-colors">
              <svg
                class="h-5 w-5"
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
              class="block w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/70 dark:bg-zinc-800/80 backdrop-blur-md ring-1 ring-zinc-900/5 dark:ring-white/10 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 hover:bg-white/80 dark:hover:bg-zinc-800/90 transition-all duration-300"
            />
          </div>

          <!-- Semua Jenis Dropdown Glass -->
          <div class="relative sm:w-48 group">
            <select
              v-model="selectedStage"
              class="appearance-none block w-full pl-4 pr-10 py-3.5 rounded-2xl bg-white/70 dark:bg-zinc-800/80 backdrop-blur-md ring-1 ring-zinc-900/5 dark:ring-white/10 text-zinc-800 dark:text-zinc-200 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 hover:bg-white/80 dark:hover:bg-zinc-800/90 transition-all duration-300 cursor-pointer"
            >
              <option value="all" class="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">Semua Jenis</option>
              <option value="core" class="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">Paket</option>
              <option value="tripwire" class="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">Modul</option>
              <option value="lead" class="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">Gratis</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 group-focus-within:text-teal-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Alphabet Dropdown Glass -->
          <div class="relative sm:w-48 group">
            <select
              v-model="sortBy"
              class="appearance-none block w-full pl-4 pr-10 py-3.5 rounded-2xl bg-white/70 dark:bg-zinc-800/80 backdrop-blur-md ring-1 ring-zinc-900/5 dark:ring-white/10 text-zinc-800 dark:text-zinc-200 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 hover:bg-white/80 dark:hover:bg-zinc-800/90 transition-all duration-300 cursor-pointer"
            >
              <option value="alphabet" class="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">Alfabet (A-Z)</option>
              <option value="score" class="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">Skor</option>
              <option value="ranking" class="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">Popularitas</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 group-focus-within:text-teal-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
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
          <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500"></div>

          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <span class="text-3xl select-none">💎</span>
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
              class="px-5 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white transition-colors shadow-lg shadow-teal-500/20 cursor-pointer"
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
              <div class="flex items-center justify-between p-3 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/30">
                <div class="flex items-center gap-3">
                  <span class="text-xl">📝</span>
                  <span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Teks / Dokumen</span>
                </div>
                <span class="text-sm font-bold text-cyan-600 dark:text-cyan-400">{{ selectedProductComposition.text }} file</span>
              </div>

              <div class="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                <div class="flex items-center gap-3">
                  <span class="text-xl">🖼️</span>
                  <span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Gambar / Grafis</span>
                </div>
                <span class="text-sm font-bold text-blue-600 dark:text-blue-400">{{ selectedProductComposition.image }} file</span>
              </div>

              <div class="flex items-center justify-between p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
                <div class="flex items-center gap-3">
                  <span class="text-xl">🎥</span>
                  <span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Video / Animasi</span>
                </div>
                <span class="text-sm font-bold text-indigo-600 dark:text-indigo-400">{{ selectedProductComposition.video }} file</span>
              </div>

              <div class="flex items-center justify-between p-3 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30">
                <div class="flex items-center gap-3">
                  <span class="text-xl">⚙️</span>
                  <span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Aplikasi / Lainnya</span>
                </div>
                <span class="text-sm font-bold text-violet-600 dark:text-violet-400">{{ selectedProductComposition.application }} file</span>
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
