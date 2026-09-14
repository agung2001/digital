<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FloatingNav from '@/components/FloatingNav.vue'
import Footer from '@/components/Footer.vue'
import SectionGrid from '@/components/SectionGrid.vue'
import HeroSection from '@/components/HeroSection.vue'
import ProductsSection from '@/components/ProductsSection.vue'

const isMounted = ref(false)
const productCount = ref(0)
const stats = ref({
  image: 0,
  video: 0,
  text: 0,
  application: 0,
})

const roles = ['Software Engineer.', 'Digital Product Maker.', 'Digital Creator.', 'AI Enthusiast.']
const currentRoleIndex = ref(0)
const currentText = ref('')
const isDeleting = ref(false)
const typingSpeed = ref(150)

const typeText = () => {
  const fullText = roles[currentRoleIndex.value]

  if (isDeleting.value) {
    currentText.value = fullText.substring(0, currentText.value.length - 1)
    typingSpeed.value = 50
  } else {
    currentText.value = fullText.substring(0, currentText.value.length + 1)
    typingSpeed.value = 100
  }

  if (!isDeleting.value && currentText.value === fullText) {
    typingSpeed.value = 2000
    isDeleting.value = true
  } else if (isDeleting.value && currentText.value === '') {
    isDeleting.value = false
    currentRoleIndex.value = (currentRoleIndex.value + 1) % roles.length
    typingSpeed.value = 500
  }

  setTimeout(typeText, typingSpeed.value)
}

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 100)
  setTimeout(typeText, 800)
})
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

    <main class="relative z-10">
      <HeroSection
        :current-text="currentText"
        :product-count="productCount"
        :stats="stats"
        :is-mounted="isMounted"
      />

      <ProductsSection
        :is-mounted="isMounted"
        @update:product-count="productCount = $event"
        @update:stats="stats = $event"
      />
    </main>

    <div class="relative z-10 px-12">
      <Footer />
    </div>
  </div>
</template>
