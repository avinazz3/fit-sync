"use client"

import { useEffect, useRef, useState } from "react"

interface ParticleProps {
  type: "waves" | "particles"
  color1?: string
  color2?: string
  color3?: string
  opacity?: number
  speed?: number
}

export const AnimatedBackground = ({
  type = "waves",
  color1 = "#9333ea", // Purple
  color2 = "#3b82f6", // Blue
  color3 = "#06b6d4", // Cyan
  opacity = 0.15,
  speed = 1,
}: ParticleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== "undefined") {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    let animationFrameId: number

    if (type === "waves") {
      // Wave animation
      const waves = [
        {
          color: color1,
          amplitude: canvas.height * 0.05,
          frequency: 0.02,
          speed: 0.02 * speed,
          offset: 0,
          opacity: opacity,
        },
        {
          color: color2,
          amplitude: canvas.height * 0.03,
          frequency: 0.03,
          speed: 0.03 * speed,
          offset: canvas.height * 0.2,
          opacity: opacity * 0.8,
        },
        {
          color: color3,
          amplitude: canvas.height * 0.04,
          frequency: 0.01,
          speed: 0.01 * speed,
          offset: canvas.height * 0.4,
          opacity: opacity * 0.6,
        },
      ]

      let phase = 0

      const drawWaves = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        waves.forEach((wave) => {
          ctx.beginPath()
          ctx.moveTo(0, canvas.height / 2 + wave.offset)

          for (let x = 0; x < canvas.width; x++) {
            const y =
              Math.sin(x * wave.frequency + phase * wave.speed) * wave.amplitude + canvas.height / 2 + wave.offset

            ctx.lineTo(x, y)
          }

          // Complete the wave by drawing to the bottom and back
          ctx.lineTo(canvas.width, canvas.height)
          ctx.lineTo(0, canvas.height)
          ctx.closePath()

          ctx.fillStyle = `${wave.color}${Math.floor(wave.opacity * 255)
            .toString(16)
            .padStart(2, "0")}`
          ctx.fill()
        })

        phase += 1
        animationFrameId = requestAnimationFrame(drawWaves)
      }

      drawWaves()
    } else {
      // Particle animation
      const particles: {
        x: number
        y: number
        radius: number
        color: string
        speedX: number
        speedY: number
        opacity: number
      }[] = []

      const colors = [color1, color2, color3]

      // Create particles
      for (let i = 0; i < Math.min(dimensions.width * 0.05, 100); i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: (Math.random() - 0.5) * speed * 0.5,
          speedY: (Math.random() - 0.5) * speed * 0.5,
          opacity: Math.random() * opacity,
        })
      }

      const drawParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Update and draw particles
        particles.forEach((particle) => {
          particle.x += particle.speedX
          particle.y += particle.speedY

          // Bounce off edges
          if (particle.x < 0 || particle.x > canvas.width) {
            particle.speedX *= -1
          }
          if (particle.y < 0 || particle.y > canvas.height) {
            particle.speedY *= -1
          }

          // Draw particle
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          ctx.closePath()
          ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255)
            .toString(16)
            .padStart(2, "0")}`
          ctx.fill()
        })

        // Draw connections between nearby particles
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.strokeStyle = `${color2}${Math.floor(opacity * 0.5 * (1 - distance / 100) * 255)
                .toString(16)
                .padStart(2, "0")}`
              ctx.stroke()
            }
          }
        }

        animationFrameId = requestAnimationFrame(drawParticles)
      }

      drawParticles()
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [dimensions, type, color1, color2, color3, opacity, speed])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full" style={{ pointerEvents: "none" }} />
}
