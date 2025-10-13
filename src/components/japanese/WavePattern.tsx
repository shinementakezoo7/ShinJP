'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function WavePattern() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 200, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, 200)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    const geometry = new THREE.PlaneGeometry(20, 4, 100, 20)
    const material = new THREE.MeshPhongMaterial({
      color: 0x3b5998,
      wireframe: false,
      flatShading: true,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    })

    const wave = new THREE.Mesh(geometry, material)
    wave.rotation.x = -Math.PI / 4
    scene.add(wave)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(0, 5, 5)
    scene.add(directionalLight)

    let animationId: number = 0
    let time = 0

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      time += 0.03

      const positions = geometry.attributes.position
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i)
        const y = Math.sin(x * 0.5 + time) * 0.3 + Math.sin(x * 0.3 + time * 0.5) * 0.2
        positions.setY(i, y)
      }
      positions.needsUpdate = true

      wave.rotation.z = Math.sin(time * 0.2) * 0.1

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / 200
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, 200)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      const container = containerRef.current
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full pointer-events-none" style={{ height: '200px' }} />
  )
}
