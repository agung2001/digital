import { ref } from 'vue'

interface Composition {
  image: number
  video: number
  text: number
  application: number
}

interface ProductType {
  uuid: string
  title: string
  url: string
  coverImage: string
  featured?: boolean
  score?: number | null
  ranking?: number | null
  composition?: Composition
}

interface StatsType {
  image: number
  video: number
  text: number
  application: number
}

const products = ref<ProductType[]>([])
const stats = ref<StatsType>({ image: 0, video: 0, text: 0, application: 0 })
const isLoading = ref(true)
const loadError = ref<string | null>(null)
let fetchPromise: Promise<void> | null = null

const loadProducts = async () => {
  if (fetchPromise) return fetchPromise

  fetchPromise = (async () => {
    try {
      isLoading.value = true
      loadError.value = null
      
      const res = await fetch('/marketplace.json')

      if (res.ok) {
        const data = await res.json()
        products.value = data.products
        if (data.composition) {
          stats.value = {
            image: typeof data.composition.image === 'number' ? data.composition.image : 0,
            video: typeof data.composition.video === 'number' ? data.composition.video : 0,
            text: typeof data.composition.text === 'number' ? data.composition.text : 0,
            application: typeof data.composition.application === 'number' ? data.composition.application : 0
          }
        }
      } else {
        throw new Error('Failed to load products')
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
