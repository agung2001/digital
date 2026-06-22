<script setup lang="ts">
import Nav from '@/components/Nav.vue'
import Hero from '@/components/Hero.vue'
import Products from '@/components/Products.vue'
import SectionGrid from '@/components/SectionGrid.vue'
</script>

<template>
  <div
    class="relative min-h-screen bg-zinc-50 transition-colors duration-500 selection:bg-teal-100 selection:text-teal-900 dark:bg-black dark:selection:bg-teal-500/30 dark:selection:text-teal-200"
  >
    <SectionGrid />
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-teal-500/5 blur-[120px] animate-blob"
      ></div>
      <div
        class="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-blue-500/5 blur-[100px] animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-purple-500/5 blur-[110px] animate-blob animation-delay-4000"
      ></div>
    </div>

    <div class="relative z-10 p-8">
      <Hero />

      <main id="products-section" class="pt-8 pb-8">
        <Nav />
        <Products />
      </main>
    </div>
  </div>
</template>
