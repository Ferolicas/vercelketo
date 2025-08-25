'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

interface AdProps {
  adId: string
  format?: 'banner' | 'square' | 'vertical' | 'responsive'
  className?: string
  trackClick?: boolean
}

// Componente para AdSense
export function GoogleAd({ adId, format = 'responsive', className = '', trackClick = true }: AdProps) {
  const [adLoaded, setAdLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.adsbygoogle && !adLoaded) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
        setAdLoaded(true)
      } catch (error) {
        console.error('Error loading AdSense ad:', error)
      }
    }
  }, [adLoaded])

  const handleAdClick = () => {
    if (trackClick && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ad_click', {
        event_category: 'advertisement',
        event_label: 'adsense',
        ad_id: adId,
      })
    }
  }

  const getAdFormat = () => {
    switch (format) {
      case 'banner':
        return { width: '728', height: '90' }
      case 'square':
        return { width: '300', height: '250' }
      case 'vertical':
        return { width: '160', height: '600' }
      default:
        return { width: '100%', height: 'auto' }
    }
  }

  const adFormat = getAdFormat()

  return (
    <div className={`ad-container ${className}`} onClick={handleAdClick}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: adFormat.width,
          height: adFormat.height,
        }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={adId}
        data-ad-format={format === 'responsive' ? 'auto' : undefined}
        data-full-width-responsive={format === 'responsive' ? 'true' : undefined}
      />
    </div>
  )
}

// Componente para Adsterra
export function AdsterraBanner({ adId, format = 'banner', className = '', trackClick = true }: AdProps) {
  const handleAdClick = () => {
    if (trackClick && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ad_click', {
        event_category: 'advertisement',
        event_label: 'adsterra',
        ad_id: adId,
      })
    }
  }

  return (
    <div className={`ad-container ${className}`} onClick={handleAdClick}>
      <div id={`adsterra-${adId}`} />
    </div>
  )
}

// Componente para Adsterra PopUnder
export function AdsterraPopUnder({ adId }: { adId: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.querySelector(`[data-adsterra-popunder="${adId}"]`)) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `//pl22136254.highrevenuegate.com/${adId}/invoke.js`
      script.setAttribute('data-adsterra-popunder', adId)
      document.head.appendChild(script)

      // Track popunder display
      if (window.gtag) {
        window.gtag('event', 'popunder_display', {
          event_category: 'advertisement',
          event_label: 'adsterra',
          ad_id: adId,
        })
      }
    }
  }, [adId])

  return null
}

// Componente principal del sistema de publicidad
export default function AdSystem() {
  return (
    <>
      {/* Google AdSense Script */}
      <Script
        id="adsense-script"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Google Analytics para tracking de ads */}
      <Script
        id="gtag-script"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      
      <Script
        id="gtag-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  )
}

// Componentes específicos para diferentes ubicaciones
export function HeaderAd() {
  return (
    <div className="w-full flex justify-center py-4 bg-gray-50">
      <GoogleAd 
        adId={process.env.NEXT_PUBLIC_HEADER_AD_ID || ""}
        format="banner"
        className="max-w-4xl"
      />
    </div>
  )
}

export function SidebarAd() {
  return (
    <div className="sticky top-4">
      <GoogleAd 
        adId={process.env.NEXT_PUBLIC_SIDEBAR_AD_ID || ""}
        format="vertical"
        className="mb-6"
      />
      <AdsterraBanner 
        adId={process.env.NEXT_PUBLIC_ADSTERRA_SIDEBAR_ID || ""}
        format="square"
        className="mt-4"
      />
    </div>
  )
}

export function ContentAd({ position = "middle" }: { position?: "top" | "middle" | "bottom" }) {
  const adId = position === "top" 
    ? process.env.NEXT_PUBLIC_CONTENT_TOP_AD_ID 
    : position === "middle" 
    ? process.env.NEXT_PUBLIC_CONTENT_MIDDLE_AD_ID 
    : process.env.NEXT_PUBLIC_CONTENT_BOTTOM_AD_ID

  return (
    <div className="w-full py-8 flex justify-center">
      <GoogleAd 
        adId={adId || ""}
        format="responsive"
        className="max-w-2xl"
      />
    </div>
  )
}

// Hook personalizado para tracking de ads
export function useAdTracking() {
  const trackAdView = (adType: string, adId: string, position: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ad_impression', {
        event_category: 'advertisement',
        event_label: adType,
        ad_id: adId,
        ad_position: position,
      })
    }
  }

  const trackAdClick = (adType: string, adId: string, position: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ad_click', {
        event_category: 'advertisement',
        event_label: adType,
        ad_id: adId,
        ad_position: position,
        value: 1,
      })
    }
  }

  return { trackAdView, trackAdClick }
}

// Declaración de tipos para TypeScript
declare global {
  interface Window {
    adsbygoogle: any[]
    gtag: (...args: any[]) => void
  }
}