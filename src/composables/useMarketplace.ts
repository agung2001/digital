import { ref } from 'vue'

interface ProductType {
  uuid: string
  title: string
  url: string
  coverImage: string
  featured?: boolean
}

interface StatsType {
  materi: number
  media: number
}

const products = ref<ProductType[]>([])
const stats = ref<StatsType>({ materi: 12, media: 34 })
const isLoading = ref(true)
const loadError = ref<string | null>(null)
let fetchPromise: Promise<void> | null = null

const loadProducts = async () => {
  if (fetchPromise) return fetchPromise

  fetchPromise = (async () => {
    try {
      isLoading.value = true
      loadError.value = null
      
      const [productsRes, statsRes] = await Promise.allSettled([
        fetch('/marketplace.json'),
        fetch('/stats.json')
      ])

      if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
        const data = await productsRes.value.json()
        products.value = data.products
      } else {
        throw new Error('Failed to load products')
      }

      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        try {
          const statsData = await statsRes.value.json()
          stats.value = {
            materi: typeof statsData.materi === 'number' ? statsData.materi : 12,
            media: typeof statsData.media === 'number' ? statsData.media : 34
          }
        } catch {
          // Keep default stats
        }
      }
    } catch (err) {
      loadError.value = err instanceof Error ? err.message : String(err)
      products.value = []
    } finally {
      isLoading.value = false
    }
  })()

  return fetchPromise
}

export function useMarketplace() {
  return { products, stats, isLoading, loadError, loadProducts }
}
