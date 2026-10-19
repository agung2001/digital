type Gtag = (...args: unknown[]) => void

declare global {
  interface Window {
    gtag?: Gtag
  }
}

/**
 * Fire a GA4 event through the `gtag` snippet loaded in `index.html`.
 * Safe to call anywhere: it no-ops when analytics is blocked or not loaded.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return
  const { gtag } = window
  if (typeof gtag === 'function') {
    gtag('event', name, params)
  }
}
