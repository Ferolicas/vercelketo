'use client'

import { memo, useEffect, useState } from 'react'
import GoogleAds from './GoogleAds'

interface ResponsiveAdUnitProps {
  adSlot: string
  minHeight?: number
  maxHeight?: number
  className?: string
}

interface AdSize {
  width: number
  height: number
  format: 'auto' | 'rectangle' | 'vertical' | 'horizontal' | 'fluid'
}

// Configuraciones de tamaño responsive optimizadas para AdSense
const getAdSize = (width: number): AdSize => {
  if (width >= 1200) {
    // Desktop grande - Leaderboard grande
    return { width: 970, height: 250, format: 'horizontal' }
  } else if (width >= 768) {
    // Tablet/Desktop - Leaderboard estándar
    return { width: 728, height: 90, format: 'horizontal' }
  } else if (width >= 480) {
    // Móvil horizontal - Banner móvil
    return { width: 468, height: 60, format: 'horizontal' }
  } else {
    // Móvil pequeño - Banner móvil pequeño
    return { width: 320, height: 50, format: 'horizontal' }
  }
}

function ResponsiveAdUnit({ 
  adSlot, 
  minHeight = 50, 
  maxHeight = 250,
  className = '' 
}: ResponsiveAdUnitProps) {
  const [adSize, setAdSize] = useState<AdSize>({ width: 320, height: 50, format: 'horizontal' })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const updateAdSize = () => {
      const width = window.innerWidth
      setAdSize(getAdSize(width))
    }

    updateAdSize()
    window.addEventListener('resize', updateAdSize)
    
    return () => window.removeEventListener('resize', updateAdSize)
  }, [])

  if (!isClient) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ minHeight, maxHeight, height: minHeight }}
      >
        <span className="text-gray-400 text-sm">Anuncio</span>
      </div>
    )
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <GoogleAds
        adSlot={adSlot}
        adFormat={adSize.format}
        responsive={true}
        style={{ 
          minHeight: Math.max(adSize.height, minHeight),
          maxHeight: Math.min(adSize.height, maxHeight),
          width: '100%',
          maxWidth: adSize.width
        }}
      />
    </div>
  )
}

export default memo(ResponsiveAdUnit)