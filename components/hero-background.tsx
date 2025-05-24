"use client"

import { useEffect, useRef } from "react"

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create grid points
    const gridSize = 30
    const points: { x: number; y: number; vx: number; vy: number }[] = []

    const cols = Math.ceil(canvas.width / gridSize) + 1
    const rows = Math.ceil(canvas.height / gridSize) + 1

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        points.push({
          x: i * gridSize,
          y: j * gridSize,
          vx: Math.random() * 0.2 - 0.1,
          vy: Math.random() * 0.2 - 0.1,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update points position
      points.forEach((point) => {
        point.x += point.vx
        point.y += point.vy

        // Bounce on edges
        if (point.x <= 0 || point.x >= canvas.width) point.vx *= -1
        if (point.y <= 0 || point.y >= canvas.height) point.vy *= -1

        // Draw point
        ctx.beginPath()
        ctx.arc(point.x, point.y, 1, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(72, 187, 120, 0.3)"
        ctx.fill()
      })

      // Draw connections
      ctx.strokeStyle = "rgba(72, 187, 120, 0.1)"
      ctx.lineWidth = 0.5

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < gridSize * 1.5) {
            ctx.beginPath()
            ctx.moveTo(points[i].x, points[i].y)
            ctx.lineTo(points[j].x, points[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full opacity-40" style={{ filter: "blur(1px)" }} />
}
