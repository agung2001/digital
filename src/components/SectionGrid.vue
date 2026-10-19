<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const gridContainer = ref<HTMLDivElement | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)

let frameId = 0
let pendingX = 0
let pendingY = 0

// Coalesce raw pointer events into a single reactive update per animation frame,
// so Vue re-renders the gradient layers at most once per frame instead of on
// every mousemove.
const commitPointer = () => {
  frameId = 0
  const el = gridContainer.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  mouseX.value = pendingX - rect.left
  mouseY.value = pendingY - rect.top
}

const handleMouseMove = (e: MouseEvent) => {
  pendingX = e.clientX
  pendingY = e.clientY
  if (frameId) return
  frameId = requestAnimationFrame(commitPointer)
}

const handleVisibility = () => {
  if (document.hidden && frameId) {
    cancelAnimationFrame(frameId)
    frameId = 0
  }
}

onMounted(() => {
  // Skip the effect entirely for users who prefer reduced motion.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  document.addEventListener('visibilitychange', handleVisibility)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('visibilitychange', handleVisibility)
  if (frameId) cancelAnimationFrame(frameId)
})
</script>

<template>
  <div ref="gridContainer" class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]"
    ></div>

    <div
      class="absolute inset-0 transition-opacity duration-300"
      :style="{
        background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(20, 184, 166, 0.05), transparent 80%)`,
      }"
    ></div>

    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,rgba(20,184,166,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,184,166,0.15)_1px,transparent_1px)] bg-[size:40px_40px] transition-opacity duration-500"
      :style="{
        maskImage: `radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
        WebkitMaskImage: `radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
      }"
    ></div>
  </div>
</template>
