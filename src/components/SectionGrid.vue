<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const gridContainer = ref<HTMLDivElement | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (e: MouseEvent) => {
  if (!gridContainer.value) return
  const rect = gridContainer.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div
    ref="gridContainer"
    class="absolute inset-0 z-0 pointer-events-none overflow-hidden"
  >
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
