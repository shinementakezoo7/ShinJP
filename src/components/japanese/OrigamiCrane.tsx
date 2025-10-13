'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function OrigamiCrane({ color = 0xff6b9d }: { color?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
    camera.position.set(0, 2, 8)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(200, 200)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    const craneGroup = new THREE.Group()

    const bodyGeometry = new THREE.TetrahedronGeometry(1)
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color,
      flatShading: true,
      shininess: 100,
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    craneGroup.add(body)

    const wingGeometry = new THREE.BoxGeometry(2.5, 0.1, 1)
    const wingMaterial = new THREE.MeshPhongMaterial({
      color,
      flatShading: true,
      shininess: 100,
    })

    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial)
    leftWing.position.set(-1.5, 0, 0)
    leftWing.rotation.z = -0.3
    craneGroup.add(leftWing)

    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial)
    rightWing.position.set(1.5, 0, 0)
    rightWing.rotation.z = 0.3
    craneGroup.add(rightWing)

    const neckGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1.5)
    const neckMaterial = new THREE.MeshPhongMaterial({
      color,
      flatShading: true,
    })
    const neck = new THREE.Mesh(neckGeometry, neckMaterial)
    neck.position.set(0, 0.5, 0.8)
    neck.rotation.x = -0.5
    craneGroup.add(neck)

    const headGeometry = new THREE.SphereGeometry(0.3, 8, 8)
    const head = new THREE.Mesh(headGeometry, bodyMaterial)
    head.position.set(0, 1.2, 1.2)
    craneGroup.add(head)

    scene.add(craneGroup)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    let animationId: number = 0
    let time = 0

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      time += 0.01

      craneGroup.rotation.y += 0.01

      if (isHovered) {
        leftWing.rotation.z = -0.3 + Math.sin(time * 3) * 0.3
        rightWing.rotation.z = 0.3 - Math.sin(time * 3) * 0.3
        craneGroup.position.y = Math.sin(time * 2) * 0.3
      } else {
        leftWing.rotation.z = -0.3 + Math.sin(time) * 0.1
        rightWing.rotation.z = 0.3 - Math.sin(time) * 0.1
        craneGroup.position.y = Math.sin(time) * 0.1
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      const container = containerRef.current
      cancelAnimationFrame(animationId)
      renderer.dispose()
      bodyGeometry.dispose()
      bodyMaterial.dispose()
      wingGeometry.dispose()
      wingMaterial.dispose()
      neckGeometry.dispose()
      neckMaterial.dispose()
      headGeometry.dispose()
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [color, isHovered])

  return (
    <div
      ref={containerRef}
      className="cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: '200px', height: '200px' }}
    />
  )
}
