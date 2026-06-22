import { ref } from 'vue'

interface ProductType {
  uuid: string
  title: string
  url: string
  coverImage: string
}

const products = ref<ProductType[]>([])
const isLoading = ref(true)
const loadError = ref<string | null>(null)
let fetchPromise: Promise<void> | null = null

const loadProducts = async () => {
  if (fetchPromise) return fetchPromise

  fetchPromise = (async () => {
    try {
      isLoading.value = true
      loadError.value = null
      const response = await fetch('/marketplace.json')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      products.value = data.products
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
  return { products, isLoading, loadError, loadProducts }
}
