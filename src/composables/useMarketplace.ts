import { ref } from 'vue'
import type { MarketplaceData, MarketplaceStats, Product } from '@/types'

const products = ref<Product[]>([])
const stats = ref<MarketplaceStats>({ image: 0, video: 0, text: 0, application: 0 })
const notification = ref('')
const isLoading = ref(true)
const loadError = ref<string | null>(null)
let fetchPromise: Promise<void> | null = null

const toStats = (composition: MarketplaceData['composition']): MarketplaceStats => ({
  image: typeof composition?.image === 'number' ? composition.image : 0,
  video: typeof composition?.video === 'number' ? composition.video : 0,
  text: typeof composition?.text === 'number' ? composition.text : 0,
  application: typeof composition?.application === 'number' ? composition.application : 0,
})

const loadProducts = async (): Promise<void> => {
  if (fetchPromise) return fetchPromise

  const promise = (async () => {
    try {
      isLoading.value = true
      loadError.value = null

      const res = await fetch('/marketplace.json')

      if (!res.ok) {
        throw new Error('Gagal memuat produk')
      }

      const data = (await res.json()) as MarketplaceData
      products.value = Array.isArray(data.products) ? data.products : []
      notification.value = typeof data.notification === 'string' ? data.notification : ''
      if (data.composition) {
        stats.value = toStats(data.composition)
      }
    } catch (err) {
      loadError.value = err instanceof Error ? err.message : String(err)
      products.value = []
    } finally {
      isLoading.value = false
    }
  })()

  // Keep the promise cached only while the request is in flight, so a failed
  // load can be retried (previously the cached promise made "Try Again" a no-op).
  fetchPromise = promise
  try {
    await promise
  } finally {
    if (fetchPromise === promise) fetchPromise = null
  }
}

export function useMarketplace() {
  return { products, stats, notification, isLoading, loadError, loadProducts }
}
