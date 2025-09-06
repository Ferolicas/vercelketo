'use client'

import { memo, Suspense } from 'react'
import dynamic from 'next/dynamic'

// Carga dinámica del componente de anuncios
const GoogleAds = dynamic(() => import('./GoogleAds'), { 
  ssr: false,
  loading: () => (
    <div className="h-32 bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400 text-sm">Cargando anuncio...</div>
    </div>
  )
})

interface AdPlacementProps {
  position: 'header' | 'sidebar' | 'content-top' | 'content-middle' | 'content-bottom' | 'footer' | 'mobile-sticky'
  className?: string
  showOnMobile?: boolean
  showOnDesktop?: boolean
}

// Configuración optimizada de anuncios por posición
const adConfig = {
  header: {
    slot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER || 'auto',
    format: 'horizontal' as const,
    style: { minHeight: '90px' },
    className: 'w-full max-w-4xl mx-auto'
  },
  sidebar: {
    slot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || 'auto',
    format: 'vertical' as const,
    style: { minHeight: '250px' },
    className: 'sticky top-4'
  },
  'content-top': {
    slot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT_TOP || 'auto',
    format: 'rectangle' as const,
    style: { minHeight: '250px' },
    className: 'my-6'
  },
  'content-middle': {
    slot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT_MIDDLE || 'auto',
    format: 'rectangle' as const,
    style: { minHeight: '250px' },
    className: 'my-8'
  },
  'content-bottom': {
    slot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT_BOTTOM || 'auto',
    format: 'rectangle' as const,
    style: { minHeight: '250px' },
    className: 'mt-8'
  },
  footer: {
    slot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || 'auto',
    format: 'horizontal' as const,
    style: { minHeight: '90px' },
    className: 'w-full'
  },
  'mobile-sticky': {
    slot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOBILE_STICKY || 'auto',
    format: 'horizontal' as const,
    style: { minHeight: '50px' },
    className: 'fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg md:hidden'
  }
}

function AdPlacement({ 
  position, 
  className = '', 
  showOnMobile = true, 
  showOnDesktop = true 
}: AdPlacementProps) {
  const config = adConfig[position]
  
  // Lógica de visibilidad responsive
  let visibilityClass = ''
  if (!showOnMobile && showOnDesktop) {
    visibilityClass = 'hidden md:block'
  } else if (showOnMobile && !showOnDesktop) {
    visibilityClass = 'md:hidden'
  }

  return (
    <div className={`${config.className} ${visibilityClass} ${className}`}>
      <Suspense fallback={
        <div className="h-32 bg-gray-50 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Preparando anuncio...</div>
        </div>
      }>
        <GoogleAds
          adSlot={config.slot}
          adFormat={config.format}
          style={config.style}
          className="w-full"
        />
      </Suspense>
    </div>
  )
}

export default memo(AdPlacement)