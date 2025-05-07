"use client"

import { useEffect, useRef } from "react"

// interface Confetti {
//   x: number
//   y: number
//   z: number
//   rotationX: number
//   rotationY: number
//   rotationZ: number
//   vx: number
//   vy: number
//   vz: number
//   rotationVelocityX: number
//   rotationVelocityY: number
//   rotationVelocityZ: number
//   width: number
//   height: number
//   color: string
//   opacity: number
//   type: "flat" | "swirled" | "curled" | "ribbon"
//   swirl: number
//   swirlDirection: number
//   curl: number
//   curlDirection: number
//   oscillationSpeed: number
//   oscillationDistance: number
//   oscillationTime: number
//   isSpecial: boolean
//   shimmerOffset: number
// }

export default function ConfettiAnimation() {
  const canvasRef = useRef(null)
  const confettiPieces = useRef([])
  const animationFrameId = useRef(0)
  const lastFrameTime = useRef(0)
  const mousePosition = useRef({ x: 0, y: 0 })
  const isMouseMoving = useRef(false)
  const lastMouseMoveTime = useRef(0)

  // Vibrant, bright color palette
  const colors = [
    // Bright primary colors
    "#FF1744", // Bright red
    "#2979FF", // Bright blue
    "#00E676", // Bright green
    "#FFEA00", // Bright yellow
    "#D500F9", // Bright purple
    "#FF9100", // Bright orange

    // Neon colors
    "#00FFF0", // Cyan
    "#FF00FF", // Magenta
    "#76FF03", // Lime

    // Metallic/shiny colors
    "#FFD700", // Gold
    "#E6BE8A", // Bronze
    "#C0C0C0", // Silver

    // Pastel accents for contrast
    "#FFCDD2", // Light pink
    "#BBDEFB", // Light blue
    "#C8E6C9", // Light green
  ]

  const getRandomFloat = (min, max) => Math.random() * (max - min) + min
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

  const createConfetti = (canvas, isInitial = false, isSpecial = false) => {
    // For initial confetti, distribute across the entire canvas
    // For new confetti, create them above the viewport
    const x = getRandomFloat(0, canvas.width)
    const y = isInitial ? getRandomFloat(-100, canvas.height) : getRandomFloat(-200, -50)

    // Add more randomness to z position for depth
    const z = getRandomFloat(0, 300)

    // Determine confetti type
    let type
    const typeRandom = Math.random()

    if (isSpecial) {
      // Special pieces are either ribbons or highly curled pieces
      type = Math.random() < 0.5 ? "ribbon" : "curled"
    } else {
      if (typeRandom < 0.3) {
        type = "flat" // Perfectly flat rectangle
      } else if (typeRandom < 0.6) {
        type = "swirled" // Swirled rectangle
      } else {
        type = "curled" // Curled rectangle
      }
    }

    // Size based on type - PERFECTLY RECTANGULAR PROPORTIONS
    let width, height
    if (type === "flat") {
      width = getRandomFloat(44, 20)
      height = getRandomFloat(28, 15)
    } else if (type === "swirled") {
      width = getRandomFloat(35, 25)
      height = getRandomFloat(20, 18)
    } else if (type === "curled") {
      width = getRandomFloat(18, 30)
      height = getRandomFloat(22, 20)
    } else {
      // ribbon
      width = getRandomFloat(26, 10)
      height = getRandomFloat(40, 70) // Long ribbons
    }

    // Initial rotation angles
    const rotationX = getRandomFloat(0, Math.PI * 2)
    const rotationY = getRandomFloat(0, Math.PI * 2)
    const rotationZ = getRandomFloat(0, Math.PI * 2)

    // More realistic initial velocities
    const vx = getRandomFloat(-1.5, 1.5)
    const vy = getRandomFloat(1, 2.5) // Slower initial fall

    return {
      x,
      y,
      z,
      rotationX,
      rotationY,
      rotationZ,
      vx,
      vy,
      vz: getRandomFloat(-0.15, 0.15),
      rotationVelocityX: getRandomFloat(-0.04, 0.04),
      rotationVelocityY: getRandomFloat(-0.04, 0.04),
      rotationVelocityZ: getRandomFloat(-0.04, 0.04),
      width,
      height,
      color: colors[getRandomInt(0, colors.length - 1)],
      opacity: isInitial ? getRandomFloat(0.6, 1) : 0, // Start with 0 opacity for new particles
      type,
      swirl: getRandomFloat(0.2, 0.6), // How much the piece is swirled
      swirlDirection: getRandomInt(0, 1) ? 1 : -1, // Direction of the swirl
      curl: getRandomFloat(0.2, 0.6), // How much the piece is curled
      curlDirection: getRandomInt(0, 1) ? 1 : -1, // Direction of the curl
      oscillationSpeed: getRandomFloat(0.01, 0.04), // Speed of side-to-side movement
      oscillationDistance: getRandomFloat(10, 25), // Distance of side-to-side movement
      oscillationTime: 0, // Time counter for oscillation
      isSpecial,
      shimmerOffset: Math.random() * 100, // For shimmer effect timing
    }
  }

  const initConfetti = (canvas) => {
    confettiPieces.current = []

    // Create regular confetti pieces
    for (let i = 0; i < 130; i++) {
      confettiPieces.current.push(createConfetti(canvas, true, false))
    }

    // Add some special larger/longer pieces
    for (let i = 0; i < 20; i++) {
      confettiPieces.current.push(createConfetti(canvas, true, true))
    }
  }

  const updateConfetti = (ctx, deltaTime) => {
    const gravity = 0.4 * deltaTime
    const airResistance = 0.94
    const mouseInfluenceRadius = 150 // Radius of influence around cursor
    const mouseForceStrength = 0.7 * deltaTime // Strength of the mouse influence
    const mouseActive = isMouseMoving.current || Date.now() - lastMouseMoveTime.current < 1000

    for (let i = 0; i < confettiPieces.current.length; i++) {
      const confetti = confettiPieces.current[i]

      // Update position
      confetti.x += confetti.vx * deltaTime
      confetti.y += confetti.vy * deltaTime
      confetti.z += confetti.vz * deltaTime

      // Update rotation
      confetti.rotationX += confetti.rotationVelocityX * deltaTime
      confetti.rotationY += confetti.rotationVelocityY * deltaTime
      confetti.rotationZ += confetti.rotationVelocityZ * deltaTime

      // Apply gravity
      confetti.vy += gravity

      // Apply air resistance
      confetti.vx *= airResistance
      confetti.vy *= airResistance
      confetti.vz *= airResistance

      // Slow down rotation over time
      confetti.rotationVelocityX *= 0.995
      confetti.rotationVelocityY *= 0.995
      confetti.rotationVelocityZ *= 0.995

      // Add some randomness to movement (wind effect)
      confetti.vx += getRandomFloat(-0.03, 0.03) * deltaTime
      confetti.vz += getRandomFloat(-0.03, 0.03) * deltaTime

      // Oscillation for fluttering effect
      confetti.oscillationTime += confetti.oscillationSpeed * deltaTime
      const oscillationEffect = Math.sin(confetti.oscillationTime) * confetti.oscillationDistance * 0.01
      confetti.vx += oscillationEffect * deltaTime

      // Mouse interaction
      if (mouseActive) {
        const dx = mousePosition.current.x - confetti.x
        const dy = mousePosition.current.y - confetti.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < mouseInfluenceRadius) {
          // Calculate influence based on distance (closer = stronger)
          const influence = (1 - distance / mouseInfluenceRadius) * mouseForceStrength

          // Apply force - push away from cursor
          confetti.vx -= (dx / distance) * influence * 1.2
          confetti.vy -= (dy / distance) * influence * 1.2

          // Add some spin based on cursor movement
          confetti.rotationVelocityZ += influence * 0.08

          // Special pieces react more dramatically
          if (confetti.isSpecial) {
            confetti.rotationVelocityX += influence * 0.15
            confetti.rotationVelocityY += influence * 0.15
          }
        }
      }

      // Handle opacity for fade in/out
      if (confetti.opacity < 1) {
        confetti.opacity += 0.015 * deltaTime // Fade in
      } else if (confetti.y > ctx.canvas.height - 150) {
        // Start fading out as it approaches the bottom
        confetti.opacity -= 0.015 * deltaTime
      }

      // Replace confetti that have exited the screen or faded out
      if (confetti.y > ctx.canvas.height || confetti.opacity <= 0) {
        // Maintain the same ratio of special to regular pieces
        confettiPieces.current[i] = createConfetti(ctx.canvas, false, confetti.isSpecial)
      }

      // Handle confetti that drift off the sides
      if (confetti.x < -100 || confetti.x > ctx.canvas.width + 100) {
        confetti.vx = -confetti.vx * 0.5 // Bounce back with reduced velocity
      }
    }

    // Occasionally add new confetti to maintain density
    if (Math.random() < 0.01 * deltaTime && confettiPieces.current.length < 200) {
      // 20% chance of creating a special piece
      confettiPieces.current.push(createConfetti(ctx.canvas, false, Math.random() < 0.2))
    }
  }

  const drawConfetti = (ctx, timestamp) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Sort confetti by z-index for pseudo-3D effect
    const sortedConfetti = [...confettiPieces.current].sort((a, b) => a.z - b.z)

    for (const confetti of sortedConfetti) {
      ctx.save()

      // Calculate scale based on z position (perspective effect)
      const scale = 1 - confetti.z / 500

      ctx.translate(confetti.x, confetti.y)
      ctx.scale(scale, scale)

      // Apply 3D-like rotations
      // X rotation (pitch)
      ctx.transform(1, 0, 0, Math.cos(confetti.rotationX), 0, Math.sin(confetti.rotationX))

      // Y rotation (yaw)
      ctx.transform(Math.cos(confetti.rotationY), 0, 0, 1, Math.sin(confetti.rotationY), 0)

      // Z rotation (roll)
      ctx.rotate(confetti.rotationZ)

      // Set opacity
      ctx.globalAlpha = confetti.opacity

      // Draw different types of confetti
      ctx.fillStyle = confetti.color

      switch (confetti.type) {
        case "flat":
          // Draw perfectly flat rectangle
          drawFlatRectangle(ctx, confetti.width, confetti.height)
          break

        case "swirled":
          // Draw swirled rectangle
          drawSwirledRectangle(ctx, confetti.width, confetti.height, confetti.swirl, confetti.swirlDirection)
          break

        case "curled":
          // Draw curled rectangle
          drawCurledRectangle(ctx, confetti.width, confetti.height, confetti.curl, confetti.curlDirection)
          break

        case "ribbon":
          // Draw ribbon
          drawRibbon(ctx, confetti.width, confetti.height, confetti.rotationZ, timestamp + confetti.shimmerOffset)
          break
      }

      ctx.restore()
    }
  }

  // Draw a perfectly flat rectangle
  const drawFlatRectangle = (ctx, width, height) => {
    const halfWidth = width / 2
    const halfHeight = height / 2

    ctx.beginPath()
    ctx.rect(-halfWidth, -halfHeight, width, height)
    ctx.fill()

    // Add shimmer effect
    const gradient = ctx.createLinearGradient(-halfWidth, -halfHeight, halfWidth, halfHeight)
    gradient.addColorStop(0, "rgba(255, 255, 255, 0)")
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.2)")
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

    ctx.fillStyle = gradient
    ctx.fill()
  }

  // Draw a swirled rectangle (rectangle with a twist)
  const drawSwirledRectangle = (
    ctx,
    width,
    height,
    swirl,
    swirlDirection,
  ) => {
    const halfWidth = width / 2
    const halfHeight = height / 2
    const steps = 5 // Number of segments to create the swirl effect
    const stepHeight = height / steps

    for (let i = 0; i < steps; i++) {
      const y = -halfHeight + i * stepHeight
      const swirledAngle = swirlDirection * swirl * Math.sin((i / steps) * Math.PI)

      ctx.save()
      ctx.translate(0, y + stepHeight / 2)
      ctx.rotate(swirledAngle)

      // Draw segment
      ctx.fillRect(-halfWidth, -stepHeight / 2, width, stepHeight)

      // Add highlight to create shiny effect
      if (i % 2 === 0) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
        ctx.fillRect(-halfWidth, -stepHeight / 2, width, stepHeight / 3)
      }

      ctx.restore()
    }
  }

  // Draw a curled rectangle (rectangle with a bend)
  const drawCurledRectangle = (
    ctx,
    width,
    height,
    curl,
    curlDirection,
  ) => {
    const halfWidth = width / 2
    const halfHeight = height / 2

    ctx.beginPath()

    // Create a curved path that maintains rectangular shape
    ctx.moveTo(-halfWidth, -halfHeight)
    ctx.lineTo(halfWidth, -halfHeight)
    ctx.quadraticCurveTo(halfWidth + curlDirection * width * curl, 0, halfWidth, halfHeight)
    ctx.lineTo(-halfWidth, halfHeight)
    ctx.quadraticCurveTo(-halfWidth + curlDirection * width * curl, 0, -halfWidth, -halfHeight)

    ctx.closePath()
    ctx.fill()

    // Add highlight to create shiny effect
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
    ctx.beginPath()
    ctx.moveTo(-halfWidth, -halfHeight)
    ctx.lineTo(halfWidth, -halfHeight)
    ctx.lineTo(halfWidth, -halfHeight + height * 0.3)
    ctx.lineTo(-halfWidth, -halfHeight + height * 0.3)
    ctx.closePath()
    ctx.fill()
  }

  // Draw a ribbon (long, twisting strip)
  const drawRibbon = (
    ctx,
    width,
    height,
    rotation,
    timestamp,
  ) => {
    const halfWidth = width / 2
    const steps = Math.max(10, Math.floor(height / 5)) // More steps for longer pieces
    const stepHeight = height / steps

    for (let i = 0; i < steps; i++) {
      const y = -height / 2 + i * stepHeight
      const twistAngle = (i / steps) * Math.PI * 2 + rotation
      const shimmerPhase = (timestamp / 1000 + i / steps) % 1

      ctx.save()
      ctx.translate(0, y)
      ctx.rotate(twistAngle)

      // Draw segment
      ctx.fillRect(-halfWidth, -stepHeight / 2, width, stepHeight)

      // Add dynamic shimmer effect
      if (shimmerPhase > 0.3 && shimmerPhase < 0.7) {
        const shimmerOpacity = Math.sin(((shimmerPhase - 0.3) * Math.PI) / 0.4) * 0.3
        ctx.fillStyle = `rgba(255, 255, 255, ${shimmerOpacity})`
        ctx.fillRect(-halfWidth, -stepHeight / 2, width, stepHeight)
      }

      ctx.restore()
    }
  }

  const animate = (timestamp) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")

    if (canvas && ctx) {
      // Calculate delta time for smooth animation regardless of frame rate
      const deltaTime = lastFrameTime.current ? (timestamp - lastFrameTime.current) / 16 : 1
      lastFrameTime.current = timestamp

      updateConfetti(ctx, deltaTime)
      drawConfetti(ctx, timestamp)
    }

    animationFrameId.current = requestAnimationFrame(animate)
  }

  const handleResize = () => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initConfetti(canvas)
    }
  }

  const handleMouseMove = (e) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
      isMouseMoving.current = true
      lastMouseMoveTime.current = Date.now()

      // Reset the flag after a short delay
      setTimeout(() => {
        isMouseMoving.current = false
      }, 100)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current

    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      initConfetti(canvas)
      animationFrameId.current = requestAnimationFrame(animate)

      window.addEventListener("resize", handleResize)
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("touchmove", (e) => {
        if (e.touches[0]) {
          handleMouseMove(e.touches[0])
        }
      })
    }

    return () => {
      cancelAnimationFrame(animationFrameId.current)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}
