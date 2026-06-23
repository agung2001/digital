<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)

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

let particles: Particle[] = []
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

  canvasWidth = window.innerWidth
  canvasHeight = window.innerHeight
  canvas.width = canvasWidth * window.devicePixelRatio
  canvas.height = canvasHeight * window.devicePixelRatio

  const ctx = canvas.getContext('2d')
  if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

  const count = Math.min(Math.floor((canvasWidth * canvasHeight) / 15000), 60)
  particles = []

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.4 + 0.2,
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
      p.vx += (dx / dist) * force * 0.015
      p.vy += (dy / dist) * force * 0.015
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
    ctx.fillStyle = p.color + currentAlpha * 0.12 + ')'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = p.color + currentAlpha + ')'
    ctx.fill()
  }

  const connectionDist = 140
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < connectionDist) {
        const alpha = (1 - dist / connectionDist) * 0.2

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
        ctx.lineWidth = 0.6
        ctx.stroke()
      }
    }
  }

  animationId = requestAnimationFrame(drawFrame)
}

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

const handleResize = () => {
  initParticles()
}

onMounted(() => {
  setTimeout(() => {
    initParticles()
    drawFrame()
  }, 200)

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 w-screen h-screen z-0 pointer-events-none"
  ></canvas>
</template>
