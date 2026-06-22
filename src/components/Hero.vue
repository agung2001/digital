<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useMarketplace } from '@/composables/useMarketplace'

const isMounted = ref(false)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const heroRef = ref<HTMLElement | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)

const roles = ['Software Engineer.', 'Digital Product Maker.', 'Digital Creator.', 'AI Enthusiast.']
const currentRoleIndex = ref(0)
const currentText = ref('')
const isDeleting = ref(false)
const typingSpeed = ref(150)

const { products } = useMarketplace()
const productCount = computed(() => products.value.length)

const parallaxX = computed(() => (mouseX.value - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * -0.02)
const parallaxY = computed(() => (mouseY.value - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * -0.02)

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  pulseSpeed: number
  pulsePhase: number
}

interface Connection {
  from: number
  to: number
  alpha: number
}

let particles: Particle[] = []
let connections: Connection[] = []
let animationId: number
let canvasWidth = 0
let canvasHeight = 0

const colors = [
  'rgba(20, 184, 166, ',
  'rgba(59, 130, 246, ',
  'rgba(168, 85, 247, ',
  'rgba(236, 72, 153, ',
  'rgba(34, 211, 238, ',
]

const initParticles = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  canvasWidth = canvas.offsetWidth
  canvasHeight = canvas.offsetHeight
  canvas.width = canvasWidth * window.devicePixelRatio
  canvas.height = canvasHeight * window.devicePixelRatio

  const ctx = canvas.getContext('2d')
  if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

  const count = Math.min(Math.floor((canvasWidth * canvasHeight) / 12000), 80)
  particles = []
  connections = []

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2.5 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.3,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulsePhase: Math.random() * Math.PI * 2,
    })
  }
}

const drawFrame = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  const time = Date.now() * 0.001

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]

    const dx = mouseX.value - p.x
    const dy = mouseY.value - p.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 200) {
      const force = (200 - dist) / 200
      p.vx += (dx / dist) * force * 0.02
      p.vy += (dy / dist) * force * 0.02
    }

    p.x += p.vx
    p.y += p.vy

    p.vx *= 0.99
    p.vy *= 0.99

    if (p.x < 0) p.x = canvasWidth
    if (p.x > canvasWidth) p.x = 0
    if (p.y < 0) p.y = canvasHeight
    if (p.y > canvasHeight) p.y = 0

    const pulse = Math.sin(time * p.pulseSpeed * 10 + p.pulsePhase) * 0.3 + 0.7
    const currentAlpha = p.alpha * pulse

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2)
    ctx.fillStyle = p.color + (currentAlpha * 0.15) + ')'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = p.color + currentAlpha + ')'
    ctx.fill()
  }

  connections = []
  const connectionDist = 150
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < connectionDist) {
        const alpha = (1 - dist / connectionDist) * 0.25
        connections.push({ from: i, to: j, alpha })

        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)

        const gradient = ctx.createLinearGradient(
          particles[i].x,
          particles[i].y,
          particles[j].x,
          particles[j].y,
        )
        gradient.addColorStop(0, particles[i].color + alpha + ')')
        gradient.addColorStop(1, particles[j].color + alpha + ')')
        ctx.strokeStyle = gradient
        ctx.lineWidth = 0.8
        ctx.stroke()
      }
    }
  }

  animationId = requestAnimationFrame(drawFrame)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!heroRef.value) return
  const rect = heroRef.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}

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

const loadProductCount = async () => {
  const { loadProducts } = useMarketplace()
  await loadProducts()
}

const handleResize = () => {
  initParticles()
}

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 100)

  loadProductCount()
  setTimeout(typeText, 1000)

  setTimeout(() => {
    initParticles()
    drawFrame()
  }, 200)

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <section
    id="hero"
    ref="heroRef"
    @mousemove="handleMouseMove"
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
  >
    <canvas
      ref="canvasRef"
      class="absolute inset-0 w-full h-full z-0"
    ></canvas>

    <div
      class="absolute text-teal-500/5 dark:text-teal-400/5 text-[12rem] pointer-events-none select-none z-0"
      :style="{ transform: `translate(${parallaxX * 3}px, ${parallaxY * 3}px)`, top: '5%', right: '5%' }"
    >
      <i class="fas fa-brain"></i>
    </div>
    <div
      class="absolute text-blue-500/5 dark:text-blue-400/5 text-[10rem] pointer-events-none select-none z-0"
      :style="{ transform: `translate(${parallaxX * -2}px, ${parallaxY * -2}px)`, bottom: '10%', left: '5%' }"
    >
      <i class="fas fa-robot"></i>
    </div>
    <div
      class="absolute text-purple-500/5 dark:text-purple-400/5 text-[8rem] pointer-events-none select-none z-0"
      :style="{ transform: `translate(${parallaxX * 1.5}px, ${parallaxY * -1}px)`, top: '60%', right: '15%' }"
    >
      <i class="fas fa-microchip"></i>
    </div>

    <div class="relative z-10 mx-auto max-w-5xl px-4 py-32">
      <div class="flex flex-col lg:flex-row gap-16 items-center">
        <div
          class="flex-1 max-w-2xl"
          :class="isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          style="transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1)"
        >
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6 ring-1 ring-inset ring-teal-500/20">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            Digital Products & AI Tools
          </div>

          <h1 class="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl lg:text-6xl mb-6 leading-tight">
            Hi, I'm Agung Sundoro
            <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 animate-gradient-shift">{{ currentText }}</span>
            <span class="inline-block w-[3px] h-10 sm:h-12 lg:h-14 bg-teal-500 ml-1 animate-pulse align-middle"></span>
          </h1>

          <p class="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg mb-8">
            Saya kreator digital asal Jakarta yang siap membantu pebisnis pemula melejitkan usahanya lewat teknologi AI. Produk digital premium mulai dari prompt, template, software, hingga AI tools terbaik.
          </p>

          <div class="flex items-center gap-4">
            <button
              @click="$emit('scrollToProducts')"
              class="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <i class="fas fa-cube"></i>
              Explore Products
              <i class="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
            </button>
            <div class="flex items-center gap-2 px-4 py-3 rounded-full bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50">
              <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{{ productCount }}</span>
              <span class="text-xs text-zinc-500 dark:text-zinc-400">Products</span>
            </div>
          </div>
        </div>

        <div
          class="w-full lg:w-[400px] shrink-0"
          :class="isMounted ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'"
          style="transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s"
        >
          <div class="relative">
            <div class="absolute -inset-4 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl animate-pulse-glow"></div>

            <div class="relative rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-700/50 p-6 shadow-2xl overflow-hidden">
              <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwIDBMMCAwaDB2MjBoMjBWMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMjAgMGgtMXYyMGgxVjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PHBhdGggZD0iTTAgMjBoMjBWMTloLTIwdjF6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9zdmc+')] opacity-60 pointer-events-none"></div>

              <div class="flex items-center gap-3 mb-5 relative z-10">
                <div class="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500">
                  <i class="fas fa-wand-magic-sparkles"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">AI-Powered</h3>
                  <p class="text-xs text-zinc-500 dark:text-zinc-400">Digital Products</p>
                </div>
              </div>

              <div class="space-y-3 relative z-10">
                <div class="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 group hover:border-teal-500/30 transition-colors">
                  <div class="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500 text-xs">
                    <i class="fas fa-bolt"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Prompt Siap Pakai</p>
                    <p class="text-[10px] text-zinc-500 dark:text-zinc-400">AI prompts for business</p>
                  </div>
                  <i class="fas fa-chevron-right text-[10px] text-zinc-400 group-hover:text-teal-500 transition-colors"></i>
                </div>

                <div class="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 group hover:border-cyan-500/30 transition-colors">
                  <div class="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500 text-xs">
                    <i class="fas fa-code"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Software & Tools</p>
                    <p class="text-[10px] text-zinc-500 dark:text-zinc-400">Ready-to-use solutions</p>
                  </div>
                  <i class="fas fa-chevron-right text-[10px] text-zinc-400 group-hover:text-cyan-500 transition-colors"></i>
                </div>

                <div class="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 group hover:border-blue-500/30 transition-colors">
                  <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs">
                    <i class="fas fa-file-lines"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Template Bisnis</p>
                    <p class="text-[10px] text-zinc-500 dark:text-zinc-400">Practical business templates</p>
                  </div>
                  <i class="fas fa-chevron-right text-[10px] text-zinc-400 group-hover:text-blue-500 transition-colors"></i>
                </div>

                <div class="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 group hover:border-purple-500/30 transition-colors">
                  <div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 text-xs">
                    <i class="fas fa-chart-line"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Riset & Analitik</p>
                    <p class="text-[10px] text-zinc-500 dark:text-zinc-400">Research & AI analytics</p>
                  </div>
                  <i class="fas fa-chevron-right text-[10px] text-zinc-400 group-hover:text-purple-500 transition-colors"></i>
                </div>
              </div>

              <div class="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 relative z-10">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="flex -space-x-2">
                      <div class="w-6 h-6 rounded-full bg-teal-500 ring-2 ring-white dark:ring-zinc-900 flex items-center justify-center text-[8px] text-white font-bold">A</div>
                      <div class="w-6 h-6 rounded-full bg-cyan-500 ring-2 ring-white dark:ring-zinc-900 flex items-center justify-center text-[8px] text-white font-bold">I</div>
                      <div class="w-6 h-6 rounded-full bg-blue-500 ring-2 ring-white dark:ring-zinc-900 flex items-center justify-center text-[8px] text-white font-bold">+</div>
                    </div>
                    <span class="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Powered by AI</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <i class="fas fa-star text-amber-400 text-[10px]"></i>
                    <span class="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">Premium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
      <button
        @click="$emit('scrollToProducts')"
        class="flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-500 hover:text-teal-500 dark:hover:text-teal-400 transition-colors cursor-pointer"
      >
        <span class="text-[10px] font-bold uppercase tracking-widest">Scroll</span>
        <i class="fas fa-chevron-down text-xs animate-bounce"></i>
      </button>
    </div>
  </section>
</template>
