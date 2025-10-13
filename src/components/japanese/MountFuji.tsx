'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MountFuji() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / 400, 0.1, 1000)
    camera.position.set(0, 5, 25)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, 400)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    const mountainGeometry = new THREE.ConeGeometry(15, 20, 32)
    const mountainMaterial = new THREE.MeshPhongMaterial({
      color: 0x4a5568,
      flatShading: true,
      transparent: true,
      opacity: 0.15,
    })
    const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial)
    mountain.position.y = 0
    scene.add(mountain)

    const snowCapGeometry = new THREE.ConeGeometry(7, 8, 32)
    const snowCapMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
      transparent: true,
      opacity: 0.2,
    })
    const snowCap = new THREE.Mesh(snowCapGeometry, snowCapMaterial)
    snowCap.position.y = 8
    scene.add(snowCap)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 5)
    scene.add(directionalLight)

    const fogColor = 0xe5e7eb
    scene.fog = new THREE.Fog(fogColor, 20, 50)

    let animationId: number = 0

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      mountain.rotation.y += 0.001
      snowCap.rotation.y += 0.001
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / 400
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, 400)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      const container = containerRef.current
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      mountainGeometry.dispose()
      mountainMaterial.dispose()
      snowCapGeometry.dispose()
      snowCapMaterial.dispose()
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-x-0 bottom-0 pointer-events-none"
      style={{ height: '400px' }}
    />
  )
}
