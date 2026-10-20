<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import { useMarketplace } from '@/composables/useMarketplace'
import { isCommandPaletteOpen } from '@/state'
import type { Product } from '@/types'

interface PaletteItem {
  id: string
  group: 'Sections' | 'Products' | 'Links'
  title: string
  subtitle?: string
  keywords?: string
  icon?: string
  color?: string
  thumb?: string
  type: 'section' | 'external'
  target: string
}

interface DisplayGroup {
  label: string
  items: PaletteItem[]
}

type Row =
  | { type: 'header'; key: string; label: string }
  | { type: 'item'; key: string; item: PaletteItem }

const RECENT_KEY = 'digital-command-palette-recent'
const MAX_RECENT = 5
const RESULTS_PER_GROUP = 10
const HIGHLIGHT_PRODUCTS = 6
const GROUP_ORDER: PaletteItem['group'][] = ['Sections', 'Products', 'Links']

const GROUP_LABELS: Record<PaletteItem['group'], string> = {
  Sections: 'Bagian',
  Products: 'Produk',
  Links: 'Tautan',
}

const KBD_CLASS =
  'inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 px-1 text-[10px] font-semibold text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'

const shortcutLabel =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)
    ? '⌘K'
    : 'Ctrl K'

const { products, isLoading } = useMarketplace()

const inputRef = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const query = ref('')
const activeIndex = ref(0)
const recentIds = ref<string[]>(readRecent())
const failedThumbs = ref<Record<string, boolean>>({})

let lastFocused: HTMLElement | null = null
let previousOverflow = ''

function readRecent(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = JSON.parse(window.localStorage.getItem(RECENT_KEY) || '[]')
    return Array.isArray(stored) ? stored.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

const normalize = (value: unknown) =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const scoreItem = (item: PaletteItem, rawQuery: string) => {
  const q = normalize(rawQuery)
  const title = normalize(item.title)
  const subtitle = normalize(item.subtitle)
  const keywords = normalize(item.keywords)
  const haystack = `${title} ${subtitle} ${keywords}`
  const words = haystack.split(/[^a-z0-9]+/)
  const tokens = q.split(/\s+/).filter(Boolean)

  // Very short queries ("ai", "ui") must match a whole word, otherwise they
  // also match unrelated substrings such as "utama" or "bagian".
  const matchesToken = (token: string) =>
    token.length <= 2 ? words.includes(token) : haystack.includes(token)

  if (!tokens.length || !tokens.every(matchesToken)) {
    return 0
  }

  let score = 0

  if (title === q) score += 1000
  else if (title.startsWith(q)) score += 600
  else if (title.includes(q)) score += 250

  if (title.split(/[^a-z0-9]+/).some((word) => word && word.startsWith(q))) {
    score += 350
  }

  if (subtitle.includes(q)) score += 120
  if (keywords.includes(q)) score += 80

  tokens.forEach((token) => {
    if (title.includes(token)) score += 40
    if (subtitle.includes(token)) score += 15
  })

  return score
}

const sectionItems: PaletteItem[] = [
  {
    id: 'section-home',
    group: 'Sections',
    title: 'Beranda',
    subtitle: 'Kembali ke bagian atas halaman',
    icon: 'bolt',
    color: '#14b8a6',
    type: 'section',
    target: '#hero',
    keywords: 'home beranda hero atas utama mulai',
  },
  {
    id: 'section-products',
    group: 'Sections',
    title: 'Katalog Produk',
    subtitle: 'Jelajahi semua produk digital',
    icon: 'box-open',
    color: '#0ea5e9',
    type: 'section',
    target: '#products',
    keywords: 'products produk katalog daftar belanja semua koleksi',
  },
]

const linkItems: PaletteItem[] = [
  {
    id: 'link-community',
    group: 'Links',
    title: 'Komunitas Belajar',
    subtitle: 'Gabung grup diskusi & bimbingan',
    icon: 'users',
    color: '#14b8a6',
    type: 'external',
    target: 'https://lynk.id/agungsundoro/px748k3j0nvp',
    keywords: 'community komunitas discord grup belajar bimbingan diajarin',
  },
  {
    id: 'link-portfolio',
    group: 'Links',
    title: 'Agung Sundoro',
    subtitle: 'Portfolio & profil utama',
    icon: 'up-right-from-square',
    color: '#0ea5e9',
    type: 'external',
    target: 'https://agungsundoro.com',
    keywords: 'portfolio profil website utama tentang agung sundoro',
  },
]

const isLeadMagnet = (product: Product) => /lead/i.test(product.stage ?? '')

const toProductItem = (product: Product): PaletteItem => ({
  id: `product-${product.uuid}`,
  group: 'Products',
  title: product.title,
  subtitle: [product.stage || 'Produk digital', product.ranking ? `Top ${product.ranking}` : '']
    .filter(Boolean)
    .join(' · '),
  thumb: product.coverImage,
  icon: 'box-open',
  color: '#14b8a6',
  type: 'external',
  target: product.url,
  keywords: [
    'produk product digital katalog',
    product.stage ?? '',
    product.ranking ? `top ${product.ranking} populer` : '',
    product.score != null ? `rating ${product.score}` : '',
    product.featured ? 'unggulan featured' : '',
    isLeadMagnet(product) ? 'gratis free lead magnet' : '',
    product.title,
  ].join(' '),
})

const productItems = computed(() => products.value.map(toProductItem))

// With 66 products, the empty palette shows a short featured/top-ranked shelf
// instead of every item; typing searches the full catalog.
const highlightProductItems = computed(() => {
  const sorted = [...products.value].sort((a, b) => {
    const featured = Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    if (featured) return featured

    const rankA = a.ranking ?? Number.MAX_SAFE_INTEGER
    const rankB = b.ranking ?? Number.MAX_SAFE_INTEGER
    if (rankA !== rankB) return rankA - rankB

    return a.title.localeCompare(b.title)
  })

  return sorted.slice(0, HIGHLIGHT_PRODUCTS).map(toProductItem)
})

const allItems = computed<PaletteItem[]>(() => [
  ...sectionItems,
  ...productItems.value,
  ...linkItems,
])

const itemById = computed(() => new Map(allItems.value.map((item) => [item.id, item])))

const groups = computed<DisplayGroup[]>(() => {
  const q = normalize(query.value)

  if (!q) {
    const recent = recentIds.value
      .map((id) => itemById.value.get(id))
      .filter((item): item is PaletteItem => Boolean(item))
      .slice(0, MAX_RECENT)
    const recentSet = new Set(recent.map((item) => item.id))

    const base: DisplayGroup[] = [
      {
        label: GROUP_LABELS.Sections,
        items: sectionItems.filter((item) => !recentSet.has(item.id)),
      },
      {
        label: GROUP_LABELS.Products,
        items: highlightProductItems.value.filter((item) => !recentSet.has(item.id)),
      },
      { label: GROUP_LABELS.Links, items: linkItems.filter((item) => !recentSet.has(item.id)) },
    ].filter((group) => group.items.length)

    return recent.length ? [{ label: 'Terbaru', items: recent }, ...base] : base
  }

  return GROUP_ORDER.map((group) => {
    const items = allItems.value
      .map((item) => ({ item, score: scoreItem(item, q) }))
      .filter((entry) => entry.score > 0 && entry.item.group === group)
      .sort((a, b) => b.score - a.score)
      .slice(0, RESULTS_PER_GROUP)
      .map((entry) => entry.item)

    return { label: GROUP_LABELS[group], items }
  }).filter((group) => group.items.length)
})

const flatResults = computed(() => groups.value.flatMap((group) => group.items))

const rows = computed<Row[]>(() =>
  groups.value.flatMap((group) => [
    { type: 'header' as const, key: `header-${group.label}`, label: group.label },
    ...group.items.map((item) => ({ type: 'item' as const, key: item.id, item })),
  ]),
)

const activeItem = computed(() => flatResults.value[activeIndex.value] ?? null)
const resultCount = computed(() => flatResults.value.length)
const activeItemId = computed(() =>
  activeItem.value ? `palette-item-${activeItem.value.id}` : undefined,
)

const isActive = (item: PaletteItem) => activeItem.value?.id === item.id
const isUrlIcon = (icon?: string) => typeof icon === 'string' && icon.startsWith('http')
const hasThumb = (thumb?: string) => Boolean(thumb && !failedThumbs.value[thumb])
const markThumbFailed = (src?: string) => {
  if (src) failedThumbs.value[src] = true
}

const scrollActiveIntoView = () => {
  nextTick(() => {
    if (!activeItemId.value || typeof document === 'undefined') return
    document.getElementById(activeItemId.value)?.scrollIntoView({ block: 'nearest' })
  })
}

const move = (delta: number) => {
  const total = flatResults.value.length
  if (!total) return
  activeIndex.value = (activeIndex.value + delta + total) % total
}

const setActiveById = (id: string) => {
  const index = flatResults.value.findIndex((item) => item.id === id)
  if (index >= 0) activeIndex.value = index
}

const remember = (item: PaletteItem) => {
  const next = [item.id, ...recentIds.value.filter((id) => id !== item.id)].slice(0, MAX_RECENT)
  recentIds.value = next
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {
    // Storage can be unavailable (private mode); recents are best-effort.
  }
}

const openPalette = () => {
  if (isCommandPaletteOpen.value) return
  isCommandPaletteOpen.value = true
}

const close = () => {
  isCommandPaletteOpen.value = false
}

const clearQuery = () => {
  query.value = ''
  nextTick(() => inputRef.value?.focus())
}

const scrollToSection = (target: string) => {
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth'

  if (target === '#hero') {
    window.scrollTo({ top: 0, behavior })
    return
  }

  document.querySelector<HTMLElement>(target)?.scrollIntoView({ behavior, block: 'start' })

  if (target === '#products') {
    window.setTimeout(() => {
      document
        .querySelector<HTMLInputElement>('input[aria-label="Cari produk"]')
        ?.focus({ preventScroll: true })
    }, 350)
  }
}

const select = (item: PaletteItem | null) => {
  if (!item) return

  remember(item)
  close()

  if (item.type === 'section') {
    scrollToSection(item.target)
    return
  }

  window.open(item.target, '_blank', 'noopener,noreferrer')
}

const trapFocus = (event: KeyboardEvent) => {
  const panel = panelRef.value
  if (!panel) return

  const focusable = Array.from(
    panel.querySelectorAll<HTMLElement>('input, button, a[href]'),
  ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null)

  if (!focusable.length) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

const onPanelKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }

  if (event.key === 'Tab') {
    trapFocus(event)
    return
  }

  // Let the clear/close buttons activate normally when they hold focus.
  if (event.key === 'Enter') {
    if (event.target !== inputRef.value) return
    event.preventDefault()
    select(activeItem.value)
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      move(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      move(-1)
      break
    case 'Home':
      event.preventDefault()
      activeIndex.value = 0
      break
    case 'End':
      event.preventDefault()
      activeIndex.value = Math.max(flatResults.value.length - 1, 0)
      break
  }
}

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

const onGlobalKeydown = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase()

  if ((event.metaKey || event.ctrlKey) && key === 'k') {
    event.preventDefault()
    event.stopImmediatePropagation()
    if (isCommandPaletteOpen.value) close()
    else openPalette()
    return
  }

  if (event.key === 'Escape' && isCommandPaletteOpen.value) {
    event.preventDefault()
    event.stopImmediatePropagation()
    close()
    return
  }

  if (
    event.key === '/' &&
    !isCommandPaletteOpen.value &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !isTypingTarget(event.target)
  ) {
    event.preventDefault()
    event.stopImmediatePropagation()
    openPalette()
  }
}

watch(query, () => {
  activeIndex.value = 0
})

watch(flatResults, () => {
  if (activeIndex.value >= flatResults.value.length) activeIndex.value = 0
})

watch(activeIndex, scrollActiveIntoView)

watch(isCommandPaletteOpen, async (open) => {
  if (open) {
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    previousOverflow = document.body.style.overflow
    query.value = ''
    activeIndex.value = 0
    recentIds.value = readRecent()
    document.body.style.overflow = 'hidden'
    await nextTick()
    inputRef.value?.focus()
    return
  }

  document.body.style.overflow = previousOverflow
  lastFocused?.focus?.()
  lastFocused = null
})

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown, true)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown, true)
})
</script>

<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isCommandPaletteOpen"
        class="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto px-4 pb-8 pt-[12vh]"
      >
        <div
          class="fixed inset-0 bg-zinc-950/30 backdrop-blur-sm dark:bg-black/60"
          aria-hidden="true"
          @click="close"
        ></div>

        <div
          ref="panelRef"
          class="palette-panel relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/95 shadow-2xl shadow-zinc-950/20 ring-1 ring-white/50 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/95 dark:ring-white/5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="command-palette-heading"
          @keydown="onPanelKeydown"
        >
          <h2 id="command-palette-heading" class="sr-only">Pencarian cepat</h2>

          <!-- Search field -->
          <div
            class="flex items-center gap-3 border-b border-zinc-100 px-5 py-4 dark:border-zinc-800"
          >
            <AppIcon name="search" class="text-sm text-zinc-400" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              class="min-w-0 flex-1 bg-transparent text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
              placeholder="Cari produk, bagian, tautan…"
              autocomplete="off"
              autocorrect="off"
              spellcheck="false"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="true"
              aria-controls="command-palette-results"
              :aria-activedescendant="activeItemId"
            />
            <button
              v-if="query"
              type="button"
              class="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              aria-label="Bersihkan pencarian"
              @mousedown.prevent
              @click="clearQuery"
            >
              <AppIcon name="xmark" class="text-xs" />
            </button>
            <button
              type="button"
              class="hidden sm:flex"
              aria-label="Tutup pencarian cepat"
              @click="close"
            >
              <kbd :class="KBD_CLASS">esc</kbd>
            </button>
          </div>

          <!-- Results -->
          <div
            id="command-palette-results"
            role="listbox"
            aria-label="Hasil pencarian"
            class="max-h-[55vh] overflow-y-auto overscroll-contain p-2"
          >
            <template v-for="row in rows" :key="row.key">
              <div
                v-if="row.type === 'header'"
                class="px-3 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500"
              >
                {{ row.label }}
              </div>

              <button
                v-else
                :id="`palette-item-${row.item.id}`"
                type="button"
                role="option"
                tabindex="-1"
                :aria-selected="isActive(row.item)"
                class="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                :class="
                  isActive(row.item)
                    ? 'bg-teal-500/10 text-teal-700 ring-1 ring-inset ring-teal-500/20 dark:text-teal-300'
                    : 'text-zinc-700 hover:bg-zinc-100/70 dark:text-zinc-200 dark:hover:bg-zinc-800/70'
                "
                @mouseenter="setActiveById(row.item.id)"
                @mousedown.prevent
                @click="select(row.item)"
              >
                <span
                  class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl transition-colors"
                  :class="isActive(row.item) ? 'bg-teal-500/15' : 'bg-zinc-100 dark:bg-zinc-800'"
                >
                  <img
                    v-if="hasThumb(row.item.thumb)"
                    :src="row.item.thumb"
                    alt=""
                    loading="lazy"
                    class="h-full w-full object-cover"
                    @error="markThumbFailed(row.item.thumb)"
                  />
                  <img
                    v-else-if="isUrlIcon(row.item.icon)"
                    :src="row.item.icon"
                    alt=""
                    loading="lazy"
                    class="h-4 w-4 object-contain"
                  />
                  <AppIcon
                    v-else
                    :name="row.item.icon || 'box-open'"
                    class="text-sm"
                    :style="row.item.color ? { color: row.item.color } : undefined"
                  />
                </span>

                <span class="min-w-0 flex-1">
                  <span class="block truncate text-sm font-medium">{{ row.item.title }}</span>
                  <span
                    v-if="row.item.subtitle"
                    class="block truncate text-xs text-zinc-400 dark:text-zinc-500"
                  >
                    {{ row.item.subtitle }}
                  </span>
                </span>

                <kbd v-if="isActive(row.item)" :class="KBD_CLASS" class="shrink-0">↵</kbd>
                <AppIcon
                  v-else-if="row.item.type === 'external'"
                  name="up-right-from-square"
                  class="shrink-0 text-[10px] text-zinc-300 dark:text-zinc-600"
                />
              </button>
            </template>

            <div
              v-if="!resultCount"
              class="flex flex-col items-center gap-2 px-4 py-12 text-center"
            >
              <AppIcon name="search" class="text-2xl text-zinc-300 dark:text-zinc-700" />
              <p class="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                {{ isLoading ? 'Memuat produk…' : `Tidak ada hasil untuk “${query}”` }}
              </p>
              <p v-if="!isLoading" class="text-xs text-zinc-400 dark:text-zinc-500">
                Coba “AI”, “template”, atau “komunitas”.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex items-center justify-between gap-4 border-t border-zinc-100 px-4 py-2.5 dark:border-zinc-800"
          >
            <div class="flex items-center gap-3 text-[11px] text-zinc-400 dark:text-zinc-500">
              <span class="flex items-center gap-1">
                <kbd :class="KBD_CLASS">↑</kbd>
                <kbd :class="KBD_CLASS">↓</kbd>
                <span class="hidden sm:inline">navigasi</span>
              </span>
              <span class="flex items-center gap-1">
                <kbd :class="KBD_CLASS">↵</kbd>
                <span class="hidden sm:inline">pilih</span>
              </span>
              <span class="hidden items-center gap-1 sm:flex">
                <kbd :class="KBD_CLASS">{{ shortcutLabel }}</kbd>
                <span>tutup</span>
              </span>
            </div>
            <span class="shrink-0 text-[11px] text-zinc-400 dark:text-zinc-500">
              {{ resultCount }} hasil
            </span>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.palette-panel {
  animation: palette-in 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes palette-in {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .palette-panel {
    animation: none;
  }
}
</style>
