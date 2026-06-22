<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer>
    <div class="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
      <div class="flex items-center justify-center">
        <p class="text-sm text-zinc-400 dark:text-zinc-500">
          &copy; {{ currentYear }} Agung Sundoro. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
