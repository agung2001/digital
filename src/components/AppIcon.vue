<script setup lang="ts">
import { computed } from 'vue'
import { icons } from './icons'

const props = defineProps<{ name: string; label?: string }>()

const icon = computed(() => icons[props.name])
</script>

<template>
  <svg
    v-if="icon"
    :viewBox="icon.vb"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    focusable="false"
    class="inline-block h-[1em] w-auto shrink-0 align-[-0.125em]"
    v-html="icon.body"
  />
</template>
