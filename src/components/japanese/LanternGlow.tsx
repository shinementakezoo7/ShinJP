'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function LanternGlow() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
    camera.position.set(0, 0, 10)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(150, 150)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    const lanternGroup = new THREE.Group()

    const topCapGeometry = new THREE.CylinderGeometry(0.8, 1, 0.3, 32)
    const capMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b4513,
      shininess: 30,
    })
    const topCap = new THREE.Mesh(topCapGeometry, capMaterial)
    topCap.position.y = 2
    lanternGroup.add(topCap)

    const bodyGeometry = new THREE.CylinderGeometry(1, 1, 2.5, 32)
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0xff6b6b,
      transparent: true,
      opacity: 0.8,
      emissive: 0xff6b6b,
      emissiveIntensity: 0.5,
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.y = 0.5
    lanternGroup.add(body)

    const bottomCapGeometry = new THREE.CylinderGeometry(1, 0.8, 0.3, 32)
    const bottomCap = new THREE.Mesh(bottomCapGeometry, capMaterial)
    bottomCap.position.y = -1
    lanternGroup.add(bottomCap)

    const lightGeometry = new THREE.SphereGeometry(0.5, 16, 16)
    const lightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.7,
    })
    const light = new THREE.Mesh(lightGeometry, lightMaterial)
    light.position.y = 0.5
    lanternGroup.add(light)

    scene.add(lanternGroup)

    const pointLight = new THREE.PointLight(0xffaa00, 1, 50)
    pointLight.position.set(0, 0.5, 0)
    lanternGroup.add(pointLight)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    let animationId: number = 0
    let time = 0

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      time += 0.02

      lanternGroup.rotation.y += 0.005

      const glowIntensity = 0.5 + Math.sin(time) * 0.2
      bodyMaterial.emissiveIntensity = glowIntensity
      pointLight.intensity = 0.8 + Math.sin(time) * 0.3

      lanternGroup.position.y = Math.sin(time * 0.5) * 0.2

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      const container = containerRef.current
      cancelAnimationFrame(animationId)
      renderer.dispose()
      topCapGeometry.dispose()
      capMaterial.dispose()
      bodyGeometry.dispose()
      bodyMaterial.dispose()
      bottomCapGeometry.dispose()
      lightGeometry.dispose()
      lightMaterial.dispose()
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="inline-block" style={{ width: '150px', height: '150px' }} />
  )
}
