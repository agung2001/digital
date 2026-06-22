<script setup lang="ts">
</script>

<template>
  <header class="mb-8">
    <div
      class="flex items-center w-full px-3 py-2.5 rounded-2xl bg-white/70 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md dark:bg-zinc-800/80 dark:ring-white/10 transition-all duration-300"
    >
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-4 w-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Find your next favorite thing..."
          class="block w-full pl-10 pr-4 py-2 rounded-xl bg-transparent text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none transition-all"
        />
      </div>
    </div>
  </header>
</template>
