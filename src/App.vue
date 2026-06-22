<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import FloatingNav from '@/components/FloatingNav.vue'
import Hero from '@/components/Hero.vue'
import Footer from '@/components/Footer.vue'
import SectionGrid from '@/components/SectionGrid.vue'

const Products = defineAsyncComponent(() => import('@/components/Products.vue'))

const scrollToProducts = () => {
  const el = document.querySelector('#products')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
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

    <FloatingNav />

    <div class="relative z-10">
      <Hero @scroll-to-products="scrollToProducts" />
      <Products />
      <div class="px-12">
        <Footer />
      </div>
    </div>
  </div>
</template>
