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

// Componente mejorado para Adsterra con múltiples formatos
export function AdsterraBanner({ 
  adId, 
  format = 'banner', 
  className = '', 
  trackClick = true, 
  size = '300x250' 
}: AdProps & { size?: string }) {
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    if (!isLoaded && adId && typeof window !== 'undefined') {
      const container = document.getElementById(`adsterra-${adId}`)
      if (container && !container.hasChildNodes()) {
        // Adsterra Display Banner
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.innerHTML = `
          atOptions = {
            'key': '${adId}',
            'format': 'iframe',
            'height': ${size.split('x')[1] || '250'},
            'width': ${size.split('x')[0] || '300'},
            'params': {}
          };
        `
        container.appendChild(script)
        
        const adScript = document.createElement('script')
        adScript.type = 'text/javascript'
        adScript.src = `//www.topcreativeformat.com/${adId}/invoke.js`
        container.appendChild(adScript)
        
        setIsLoaded(true)
      }
    }
  }, [adId, size, isLoaded])

  const handleAdClick = () => {
    if (trackClick && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ad_click', {
        event_category: 'advertisement',
        event_label: 'adsterra_banner',
        ad_id: adId,
        ad_format: format,
      })
    }
  }

  return (
    <div 
      className={`ad-container adsterra-container ${className}`} 
      onClick={handleAdClick}
      style={{ textAlign: 'center', margin: '10px auto' }}
    >
      <div id={`adsterra-${adId}`} className="adsterra-ad" />
      <style jsx>{`
        .adsterra-container {
          min-height: ${size.split('x')[1] || '250'}px;
          min-width: ${size.split('x')[0] || '300'}px;
        }
      `}</style>
    </div>
  )
}

// Componente para Adsterra PopUnder mejorado
export function AdsterraPopUnder({ adId }: { adId: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && adId && !document.querySelector(`[data-adsterra-popunder="${adId}"]`)) {
      // Delay para mejor UX
      setTimeout(() => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `//pl22136254.highrevenuegate.com/${adId}/invoke.js`
        script.setAttribute('data-adsterra-popunder', adId)
        script.async = true
        document.head.appendChild(script)

        // Track popunder display
        if (window.gtag) {
          window.gtag('event', 'popunder_display', {
            event_category: 'advertisement',
            event_label: 'adsterra_popunder',
            ad_id: adId,
            custom_parameters: {
              timing: 'delayed_3s'
            }
          })
        }
      }, 3000) // 3 segundos de delay
    }
  }, [adId])

  return null
}

// Nuevo componente para Adsterra Native Ads
export function AdsterraNative({ adId, className = '' }: { adId: string; className?: string }) {
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    if (!isLoaded && adId && typeof window !== 'undefined') {
      const container = document.getElementById(`adsterra-native-${adId}`)
      if (container && !container.hasChildNodes()) {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.innerHTML = `
          atOptions = {
            'key': '${adId}',
            'format': 'iframe',
            'height': 90,
            'width': 728,
            'params': {}
          };
        `
        container.appendChild(script)
        
        const adScript = document.createElement('script')
        adScript.type = 'text/javascript'
        adScript.src = `//www.topcreativeformat.com/${adId}/invoke.js`
        container.appendChild(adScript)
        
        setIsLoaded(true)
      }
    }
  }, [adId, isLoaded])

  return (
    <div className={`adsterra-native-container ${className}`}>
      <div id={`adsterra-native-${adId}`} className="adsterra-native-ad" />
    </div>
  )
}

// Componente para Adsterra Push Notifications
export function AdsterraPush({ adId }: { adId: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && adId && !document.querySelector(`[data-adsterra-push="${adId}"]`)) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.innerHTML = `
        (function(s,u,z,p){
          s.src=u,s.setAttribute('data-adsterra-push','${adId}'),z.appendChild(s);
        })(document.createElement('script'),'//pl22136254.pushvane.com/pfe/current/tag.min.js?z=7569671',document.head||document.documentElement);
      `
      document.head.appendChild(script)
      
      // Track push notification setup
      if (window.gtag) {
        window.gtag('event', 'push_notification_setup', {
          event_category: 'advertisement',
          event_label: 'adsterra_push',
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
    <div className="sticky top-4 space-y-6">
      {/* AdSense Skyscraper */}
      <GoogleAd 
        adId={process.env.NEXT_PUBLIC_SIDEBAR_AD_ID || ""}
        format="vertical"
        className="mb-6"
      />
      
      {/* Adsterra Square Banner */}
      <AdsterraBanner 
        adId={process.env.NEXT_PUBLIC_ADSTERRA_SIDEBAR_ID || ""}
        format="square"
        size="300x250"
        className="mb-6"
      />
      
      {/* Adsterra Small Banner */}
      <AdsterraBanner 
        adId={process.env.NEXT_PUBLIC_ADSTERRA_SIDEBAR_SMALL_ID || ""}
        format="square"
        size="300x100"
        className="mb-6"
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

  const adsterraId = position === "top" 
    ? process.env.NEXT_PUBLIC_ADSTERRA_CONTENT_TOP_ID 
    : position === "middle" 
    ? process.env.NEXT_PUBLIC_ADSTERRA_CONTENT_MIDDLE_ID 
    : process.env.NEXT_PUBLIC_ADSTERRA_CONTENT_BOTTOM_ID

  return (
    <div className="w-full py-8 space-y-6">
      {/* AdSense Responsive */}
      <div className="flex justify-center">
        <GoogleAd 
          adId={adId || ""}
          format="responsive"
          className="max-w-4xl w-full"
        />
      </div>
      
      {/* Adsterra Banner */}
      <div className="flex justify-center">
        <AdsterraBanner 
          adId={adsterraId || ""}
          format="banner"
          size="728x90"
          className="max-w-4xl w-full"
        />
      </div>
      
      {position === "middle" && (
        <div className="flex justify-center">
          <AdsterraNative 
            adId={process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_ID || ""}
            className="max-w-4xl w-full"
          />
        </div>
      )}
    </div>
  )
}

// Nuevo componente para ads entre recetas
export function RecipeAd({ index }: { index: number }) {
  // Mostrar ad cada 3 recetas
  if (index % 3 !== 0) return null
  
  return (
    <div className="w-full py-6 my-8 bg-gray-50 rounded-lg">
      <div className="text-center mb-4">
        <span className="text-sm text-gray-500 uppercase tracking-wide">Publicidad</span>
      </div>
      <div className="flex justify-center">
        <AdsterraBanner 
          adId={process.env.NEXT_PUBLIC_ADSTERRA_RECIPE_ID || ""}
          format="square"
          size="300x250"
          className=""
        />
      </div>
    </div>
  )
}

// Componente para ads flotantes (sticky)
export function StickyAd({ position = "bottom-right" }: { position?: "bottom-left" | "bottom-right" }) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 5000) // Mostrar después de 5 segundos
    return () => clearTimeout(timer)
  }, [])
  
  if (!isVisible) return null
  
  return (
    <div className={`fixed z-50 ${
      position === 'bottom-left' ? 'bottom-4 left-4' : 'bottom-4 right-4'
    }`}>
      <div className="relative">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10"
        >
          ×
        </button>
        <AdsterraBanner 
          adId={process.env.NEXT_PUBLIC_ADSTERRA_STICKY_ID || ""}
          format="square"
          size="200x200"
          className="shadow-lg rounded-lg overflow-hidden"
        />
      </div>
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

// Componente de anuncios para móvil (responsive)
export function MobileAd() {
  return (
    <div className="md:hidden w-full py-4 bg-gray-50">
      <div className="text-center mb-2">
        <span className="text-xs text-gray-500 uppercase tracking-wide">Publicidad</span>
      </div>
      <div className="flex justify-center">
        <AdsterraBanner 
          adId={process.env.NEXT_PUBLIC_ADSTERRA_MOBILE_ID || ""}
          format="banner"
          size="320x50"
          className=""
        />
      </div>
    </div>
  )
}

// Componente para ads entre párrafos de contenido
export function InContentAd({ paragraphIndex }: { paragraphIndex: number }) {
  // Mostrar ad después del párrafo 3 y cada 6 párrafos
  if (paragraphIndex !== 3 && paragraphIndex % 6 !== 0) return null
  
  return (
    <div className="my-8 py-4">
      <div className="text-center mb-4">
        <span className="text-sm text-gray-400 uppercase tracking-wide">Publicidad</span>
      </div>
      <div className="flex justify-center">
        <AdsterraBanner 
          adId={process.env.NEXT_PUBLIC_ADSTERRA_INCONTENT_ID || ""}
          format="responsive"
          size="728x90"
          className="max-w-full"
        />
      </div>
    </div>
  )
}

// Declaración de tipos para TypeScript
declare global {
  interface Window {
    adsbygoogle: any[]
    gtag: (...args: any[]) => void
    atOptions?: any
  }
}