'use client'

import EnhancedNavbar3D from '@/components/hero/EnhancedNavbar3D'
import Enhanced3DHero from '@/components/hero/Enhanced3DHero'
import EnhancedFeaturesSection from '@/components/shared/EnhancedFeaturesSection'
import Enhanced3DFooter from '@/components/shared/Enhanced3DFooter'

export default function EnhancedHome() {
  return (
    <div className="min-h-screen">
      {/* Enhanced 3D Navbar */}
      <EnhancedNavbar3D />

      {/* Enhanced 3D Hero Section with Three.js */}
      <main>
        <Enhanced3DHero />

        {/* Enhanced Features Section with 3D Cards */}
        <EnhancedFeaturesSection />
      </main>

      {/* Enhanced 3D Footer */}
      <Enhanced3DFooter />
    </div>
  )
}
