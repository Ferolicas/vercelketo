'use client'

import { memo, useEffect, useState, useRef } from 'react'

interface AdOptimizerProps {
  children: React.ReactNode
  adSlot: string
  maxAdsPerPage?: number
  minScrollDistance?: number
  viewabilityThreshold?: number
  className?: string
}

interface AdMetrics {
  viewability: number
  timeVisible: number
  scrollDepth: number
  clicks: number
  impressions: number
}

function AdOptimizer({
  children,
  adSlot,
  maxAdsPerPage = 3,
  minScrollDistance = 1000,
  viewabilityThreshold = 0.5,
  className = ''
}: AdOptimizerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenViewed, setHasBeenViewed] = useState(false)
  const [metrics, setMetrics] = useState<AdMetrics>({
    viewability: 0,
    timeVisible: 0,
    scrollDepth: 0,
    clicks: 0,
    impressions: 0
  })
  
  const adRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const startTime = useRef<number>(0)
  const scrollDistance = useRef<number>(0)

  // Control de frecuencia de anuncios por página
  useEffect(() => {
    const adsCount = document.querySelectorAll('[data-ad-optimizer]').length
    if (adsCount >= maxAdsPerPage) {
      return // No mostrar más anuncios si se alcanzó el límite
    }
  }, [maxAdsPerPage])

  // Tracking de scroll distance
  useEffect(() => {
    let lastScrollY = window.scrollY
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      scrollDistance.current += Math.abs(currentScrollY - lastScrollY)
      lastScrollY = currentScrollY
      
      setMetrics(prev => ({
        ...prev,
        scrollDepth: Math.max(prev.scrollDepth, window.scrollY)
      }))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Intersection Observer para viewability
  useEffect(() => {
    if (!adRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isCurrentlyVisible = entry.intersectionRatio >= viewabilityThreshold
          
          if (isCurrentlyVisible && !hasBeenViewed) {
            // Primera vez que se hace visible
            setHasBeenViewed(true)
            startTime.current = Date.now()
            setMetrics(prev => ({ ...prev, impressions: prev.impressions + 1 }))
          }
          
          if (isCurrentlyVisible !== isVisible) {
            setIsVisible(isCurrentlyVisible)
            
            if (isCurrentlyVisible) {
              startTime.current = Date.now()
            } else if (startTime.current > 0) {
              const timeVisible = Date.now() - startTime.current
              setMetrics(prev => ({
                ...prev,
                timeVisible: prev.timeVisible + timeVisible,
                viewability: entry.intersectionRatio
              }))
            }
          }
        })
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
        rootMargin: '10px'
      }
    )

    observerRef.current.observe(adRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasBeenViewed, isVisible, viewabilityThreshold])

  // Condiciones para mostrar anuncio
  const shouldShowAd = 
    scrollDistance.current >= minScrollDistance && 
    hasBeenViewed === false || isVisible

  // Tracking de clicks
  const handleAdClick = () => {
    setMetrics(prev => ({ ...prev, clicks: prev.clicks + 1 }))
    
    // Enviar métricas a Analytics si está disponible
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ad_click', {
        ad_slot: adSlot,
        viewability: metrics.viewability,
        time_visible: metrics.timeVisible,
        scroll_depth: metrics.scrollDepth
      })
    }
  }

  // No renderizar si no cumple condiciones
  if (!shouldShowAd) {
    return <div ref={adRef} className="h-0 w-0" data-ad-optimizer />
  }

  return (
    <div 
      ref={adRef}
      className={`ad-optimizer-container ${className}`}
      data-ad-optimizer
      onClick={handleAdClick}
      role="complementary"
      aria-label="Anuncio publicitario"
    >
      {/* Optimización de CLS con placeholder */}
      <div 
        className="min-h-[90px] flex items-center justify-center bg-gray-50"
        style={{ 
          aspectRatio: isVisible ? 'auto' : '728/90',
          transition: 'all 0.3s ease'
        }}
      >
        {children}
      </div>
      
      {/* Debug info en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 mt-1 p-1 bg-gray-100">
          Viewability: {Math.round(metrics.viewability * 100)}% | 
          Visible: {metrics.timeVisible}ms | 
          Clicks: {metrics.clicks} | 
          Scroll: {Math.round(scrollDistance.current)}px
        </div>
      )}
    </div>
  )
}

export default memo(AdOptimizer)