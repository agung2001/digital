import type { Product } from '@/types'

export type SortKey = 'alphabet' | 'score' | 'ranking'
export type StageFilter = 'all' | 'core' | 'tripwire' | 'lead'

const STAGE_MATCHERS: Record<Exclude<StageFilter, 'all'>, (stage: string) => boolean> = {
  core: (stage) => stage === 'core offer',
  tripwire: (stage) => stage === 'tripwire',
  lead: (stage) => stage === 'lead magnet' || stage === 'lead magnets',
}

export function matchesStage(product: Product, stage: StageFilter): boolean {
  if (stage === 'all') return true
  if (!product.stage) return false
  return STAGE_MATCHERS[stage](product.stage.toLowerCase())
}

export interface FilterOptions {
  query?: string
  stage?: StageFilter
}

/** Case-insensitive search across the fields a visitor would expect to match. */
export function filterProducts(
  products: readonly Product[],
  { query = '', stage = 'all' }: FilterOptions = {},
): Product[] {
  const needle = query.trim().toLowerCase()
  return products.filter((product) => {
    if (!matchesStage(product, stage)) return false
    if (!needle) return true
    return [product.title, product.stage].some((field) => field?.toLowerCase().includes(needle))
  })
}

/** Featured products always float to the top, then the chosen key applies. */
export function sortProducts(products: readonly Product[], sort: SortKey = 'alphabet'): Product[] {
  return [...products].sort((a, b) => {
    const featured = Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    if (featured !== 0) return featured

    if (sort === 'score') {
      return (b.score ?? -1) - (a.score ?? -1)
    }
    if (sort === 'ranking') {
      return (a.ranking ?? Number.MAX_SAFE_INTEGER) - (b.ranking ?? Number.MAX_SAFE_INTEGER)
    }
    return a.title.localeCompare(b.title)
  })
}

export function filterAndSortProducts(
  products: readonly Product[],
  { sort = 'alphabet', ...filters }: FilterOptions & { sort?: SortKey } = {},
): Product[] {
  return sortProducts(filterProducts(products, filters), sort)
}

export type PaginationItem = number | 'ellipsis'

/**
 * Windowed pagination list, e.g. `[1, 'ellipsis', 4, 5, 6, 'ellipsis', 12]`.
 * Keeps the control bounded regardless of how many pages exist (item #32).
 */
export function getPaginationItems(
  current: number,
  total: number,
  maxVisible = 7,
): PaginationItem[] {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  const items: PaginationItem[] = [1]
  if (start > 2) items.push('ellipsis')
  for (let page = start; page <= end; page += 1) items.push(page)
  if (end < total - 1) items.push('ellipsis')
  items.push(total)
  return items
}
