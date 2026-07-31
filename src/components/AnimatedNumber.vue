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

const animate = () => {
  const start = performance.now()
  const startVal = displayValue.value
  const targetVal = props.value

  const step = (timestamp: number) => {
    const progress = Math.min((timestamp - start) / props.duration, 1)
    displayValue.value = Math.floor(progress * (targetVal - startVal) + startVal)
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
  <span>{{ displayValue }}</span>
</template>
