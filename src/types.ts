/** Shared marketplace domain types (single source of truth, see item #30). */

/** File-type breakdown of a product, also used for the global totals. */
export interface Composition {
  image: number
  video: number
  text: number
  application: number
}

/** Aggregate composition across every product. */
export type MarketplaceStats = Composition

export interface Product {
  uuid: string
  title: string
  url: string
  coverImage: string
  featured?: boolean
  score?: number | null
  ranking?: number | null
  composition?: Composition
  stage?: string
}

/** Shape of `public/marketplace.json` as returned by the API. */
export interface MarketplaceData {
  notification?: string
  products?: Product[]
  composition?: Partial<MarketplaceStats>
}
