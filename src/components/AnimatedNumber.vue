<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    default: 1000,
  },
})

const displayValue = ref(0)
const formattedValue = ref('0')
let rafId: number | null = null

const formatNumber = (num: number) => {
  return num.toLocaleString()
}

const animate = () => {
  // Cancel any in-flight animation so rapid prop changes can't stack RAF loops.
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }

  const start = performance.now()
  const startVal = displayValue.value
  const targetVal = props.value

  const step = (timestamp: number) => {
    const progress = Math.min((timestamp - start) / props.duration, 1)
    const current = Math.floor(progress * (targetVal - startVal) + startVal)
    displayValue.value = current
    formattedValue.value = formatNumber(current)
    if (progress < 1) {
      rafId = requestAnimationFrame(step)
    } else {
      rafId = null
    }
  }
  rafId = requestAnimationFrame(step)
}

onMounted(animate)
watch(() => props.value, animate)

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
})
</script>

<template>
  <span>{{ formattedValue }}</span>
</template>
