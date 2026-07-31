<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 1000
  }
})

const displayValue = ref(0)
const formattedValue = ref('0')

const formatNumber = (num: number) => {
  // Mobile check (e.g. max-width: 640px for tailwind sm breakpoint or matchMedia)
  if (window.innerWidth < 640) {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
    }
    return num.toString()
  }
  return num.toLocaleString()
}

const animate = () => {
  const start = performance.now()
  const startVal = displayValue.value
  const targetVal = props.value

  const step = (timestamp: number) => {
    const progress = Math.min((timestamp - start) / props.duration, 1)
    const current = Math.floor(progress * (targetVal - startVal) + startVal)
    displayValue.value = current
    formattedValue.value = formatNumber(current)
    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }
  requestAnimationFrame(step)
}

onMounted(animate)
watch(() => props.value, animate)
</script>

<template>
  <span>{{ formattedValue }}</span>
</template>
