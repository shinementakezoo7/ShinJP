'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function CherryBlossomScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    petals: THREE.Mesh[]
    animationId: number
  } | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Performance detection - skip on low-end devices
    const isMobile = window.innerWidth < 768
    const isLowEndDevice =
      navigator.userAgent.includes('Mobile') && window.deviceMemory && window.deviceMemory < 4

    if (isLowEndDevice) return

    // Delay loading to prioritize main content
    const loadTimer = setTimeout(() => {
      setIsVisible(true)
      initializeScene()
    }, 300)

    return () => clearTimeout(loadTimer)
  }, [])

  const initializeScene = () => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Performance optimization
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)) // Cap DPI
    containerRef.current.appendChild(renderer.domElement)

    const petalGeometry = new THREE.PlaneGeometry(0.5, 0.7)
    const petalMaterial = new THREE.MeshBasicMaterial({
      color: 0xffb7c5,
      transparent: true,
      opacity: 0.6, // Reduced opacity for performance
      side: THREE.DoubleSide,
    })

    const petals: THREE.Mesh[] = []
    // Reduced from 50 to 20 petals for better performance
    for (let i = 0; i < 20; i++) {
      const petal = new THREE.Mesh(petalGeometry, petalMaterial)
      petal.position.set(
        (Math.random() - 0.5) * 80,
        Math.random() * 40 + 20,
        (Math.random() - 0.5) * 30
      )
      petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      petal.userData = {
        speed: Math.random() * 0.01 + 0.005, // Slower animations
        rotationSpeed: (Math.random() - 0.5) * 0.02, // Reduced rotation
        swayAmplitude: Math.random() * 0.15, // Less movement
        swaySpeed: Math.random() * 0.01,
      }
      scene.add(petal)
      petals.push(petal)
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6) // Reduced intensity
    scene.add(ambientLight)

    let animationId: number = 0
    let lastTime = 0

    const animate = (currentTime: number) => {
      animationId = requestAnimationFrame(animate)

      // Throttle to ~30fps for performance
      if (currentTime - lastTime < 33) return
      lastTime = currentTime

      petals.forEach((petal) => {
        petal.position.y -= petal.userData.speed
        petal.position.x +=
          Math.sin(Date.now() * petal.userData.swaySpeed) * petal.userData.swayAmplitude * 0.01

        petal.rotation.x += petal.userData.rotationSpeed * 0.3 // Slower rotation
        petal.rotation.y += petal.userData.rotationSpeed * 0.15
        petal.rotation.z += petal.userData.rotationSpeed * 0.1

        if (petal.position.y < -20) {
          petal.position.y = 40
          petal.position.x = (Math.random() - 0.5) * 80
          petal.position.z = (Math.random() - 0.5) * 30
        }
      })

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    sceneRef.current = { scene, camera, renderer, petals, animationId }

    return () => {
      const container = containerRef.current
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      petalGeometry.dispose()
      petalMaterial.dispose()
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
    }
  }

  if (!isVisible) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}
