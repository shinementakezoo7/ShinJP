'use client'

import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    const petalGeometry = new THREE.PlaneGeometry(0.5, 0.7)
    const petalMaterial = new THREE.MeshBasicMaterial({
      color: 0xffb7c5,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    })

    const petals: THREE.Mesh[] = []
    for (let i = 0; i < 50; i++) {
      const petal = new THREE.Mesh(petalGeometry, petalMaterial)
      petal.position.set(
        (Math.random() - 0.5) * 80,
        Math.random() * 40 + 20,
        (Math.random() - 0.5) * 30
      )
      petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      petal.userData = {
        speed: Math.random() * 0.02 + 0.01,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        swayAmplitude: Math.random() * 0.3,
        swaySpeed: Math.random() * 0.02,
      }
      scene.add(petal)
      petals.push(petal)
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    let animationId: number = 0

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      petals.forEach((petal) => {
        petal.position.y -= petal.userData.speed
        petal.position.x +=
          Math.sin(Date.now() * petal.userData.swaySpeed) * petal.userData.swayAmplitude * 0.01

        petal.rotation.x += petal.userData.rotationSpeed
        petal.rotation.y += petal.userData.rotationSpeed * 0.5
        petal.rotation.z += petal.userData.rotationSpeed * 0.3

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
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}
