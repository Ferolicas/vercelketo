'use client'

import { useState, useEffect, useRef } from 'react'

// Configuración simplificada de AdSense
interface AdConfig {
  position: string
  slot: string
  responsive: boolean
  priority: 'high' | 'medium' | 'low'
}

interface StrategicAdSystemProps {
  pageType: string
  adConfigs?: AdConfig[]
  enableUserExperienceOptimization?: boolean
}

export default function StrategicAdSystem({
  pageType,
  adConfigs = [],
  enableUserExperienceOptimization = true
}: StrategicAdSystemProps) {
  const [visibleAds, setVisibleAds] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const adId = entry.target.getAttribute('data-ad-id')
          if (!adId) return

          if (entry.isIntersecting) {
            setVisibleAds(prev => new Set([...prev, adId]))
          }
        })
      },
      { threshold: 0.5 }
    )

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  const AdUnit = ({ config }: { config: AdConfig }) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const adRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (adRef.current && observerRef.current) {
        observerRef.current.observe(adRef.current)
      }

      return () => {
        if (adRef.current && observerRef.current) {
          observerRef.current.unobserve(adRef.current)
        }
      }
    }, [])

    useEffect(() => {
      if (visibleAds.has(config.slot) && !isLoaded) {
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
            setIsLoaded(true)
          } catch (error) {
            console.error('Error loading AdSense ad:', error)
          }
        }
      }
    }, [visibleAds, config.slot, isLoaded])

    const getAdStyles = () => {
      switch (config.position) {
        case 'header': return 'my-8 text-center'
        case 'sidebar': return 'sticky top-4 mb-6'
        case 'footer': return 'mt-8 pt-8 border-t border-gray-200'
        default: return 'my-6'
      }
    }

    return (
      <div
        ref={adRef}
        data-ad-id={config.slot}
        className={`strategic-ad ${getAdStyles()}`}
      >
        <div className="text-xs text-gray-400 mb-2 text-center">
          Publicidad
        </div>
        
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
          data-ad-slot={config.slot}
          data-ad-format={config.responsive ? 'auto' : 'rectangle'}
          data-full-width-responsive={config.responsive ? 'true' : 'false'}
        />
        
        {!isLoaded && (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <div className="animate-pulse">
              <div className="bg-gray-300 h-4 rounded mb-2 mx-auto w-32"></div>
              <div className="bg-gray-300 h-20 rounded"></div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {adConfigs.map((config, index) => (
        <AdUnit key={`${config.slot}-${index}`} config={config} />
      ))}
    </>
  )
}

export const useStrategicAds = (pageType: string) => {
  const [adMetrics, setAdMetrics] = useState({
    impressions: 0,
    clicks: 0
  })

  const trackAdClick = (adSlot: string) => {
    setAdMetrics(prev => ({ ...prev, clicks: prev.clicks + 1 }))
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ad_click', {
        ad_slot: adSlot,
        page_type: pageType
      })
    }
  }

  return {
    adMetrics,
    trackAdClick
  }
}