<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer>
    <div class="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
      <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <p class="text-sm text-zinc-400 dark:text-zinc-500">
          Build with &#x1F496;,
          <a
            href="https://github.com/agung2001/agung2001.github.io"
            target="_blank"
            rel="noopener noreferrer"
            class="text-zinc-600 dark:text-zinc-300 font-medium hover:text-teal-500 dark:hover:text-teal-400 transition-colors cursor-pointer"
            >explore the code</a
          >.
        </p>
        <p class="text-sm text-zinc-400 dark:text-zinc-500">
          &copy; {{ currentYear }} Agung Sundoro. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
