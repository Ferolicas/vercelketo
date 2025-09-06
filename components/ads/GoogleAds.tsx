'use client'

import { useEffect, useRef } from 'react'

interface GoogleAdsProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal' | 'fluid'
  adLayout?: string
  responsive?: boolean
  className?: string
  style?: React.CSSProperties
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export default function GoogleAds({
  adSlot,
  adFormat = 'auto',
  adLayout,
  responsive = true,
  className = '',
  style = {}
}: GoogleAdsProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Solo ejecutar anuncios en el cliente
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error('Error al cargar anuncio AdSense:', error)
      }
    }
  }, [])

  // No renderizar en servidor para evitar hidratación incorrecta
  if (typeof window === 'undefined') {
    return <div className={`h-32 bg-gray-100 flex items-center justify-center text-gray-400 ${className}`} style={style}>
      Anuncio
    </div>
  }

  return (
    <div className={className} style={style} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        {...(adLayout && { 'data-ad-layout': adLayout })}
        {...(responsive && { 'data-full-width-responsive': 'true' })}
      />
    </div>
  )
}