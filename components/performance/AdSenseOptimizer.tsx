'use client'

import { useEffect, useCallback, useState } from 'react'

interface AdSenseOptimizerProps {
  enableLazyLoading?: boolean
  enableViewabilityTracking?: boolean
  enableCLSPrevention?: boolean
  minViewportHeight?: number
}

export default function AdSenseOptimizer({
  enableLazyLoading = true,
  enableViewabilityTracking = true,
  enableCLSPrevention = true,
  minViewportHeight = 0.5
}: AdSenseOptimizerProps) {
  const [initialized, setInitialized] = useState(false)

  // Prevent Cumulative Layout Shift (CLS) for ads
  const preventCLS = useCallback(() => {
    if (!enableCLSPrevention) return

    // Add placeholder dimensions to ad containers
    const adContainers = document.querySelectorAll('.adsbygoogle')
    
    adContainers.forEach((container) => {
      const element = container as HTMLElement
      
      // If no explicit height, set minimum height to prevent CLS
      if (!element.style.height && !element.style.minHeight) {
        const slot = element.dataset.adSlot
        
        // Set default heights based on common ad sizes
        const defaultHeights: Record<string, string> = {
          'banner': '90px',
          'leaderboard': '90px',
          'rectangle': '250px',
          'skyscraper': '600px',
          'mobile': '50px'
        }
        
        // Determine ad type from slot or data attributes
        const adType = element.dataset.adFormat || 'rectangle'
        const height = defaultHeights[adType] || '250px'
        
        element.style.minHeight = height
        element.style.backgroundColor = '#f8f9fa'
        element.style.display = 'block'
        
        // Add loading indicator
        if (!element.querySelector('.ad-loading')) {
          const loading = document.createElement('div')
          loading.className = 'ad-loading'
          loading.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #6b7280;
            font-size: 12px;
            opacity: 0.7;
          `
          loading.textContent = 'Cargando anuncio...'
          element.style.position = 'relative'
          element.appendChild(loading)
        }
      }
    })
  }, [enableCLSPrevention])

  // Lazy load ads that are below the fold
  const setupLazyLoading = useCallback(() => {
    if (!enableLazyLoading || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const adElement = entry.target as HTMLElement
          
          // Remove loading placeholder
          const loading = adElement.querySelector('.ad-loading')
          if (loading) {
            loading.remove()
          }
          
          // Initialize the ad
          if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
            try {
              ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
              
              // Track ad load
              if (typeof window !== 'undefined' && (window as any).gtag) {
                ;(window as any).gtag('event', 'ad_lazy_loaded', {
                  event_category: 'ads',
                  event_label: adElement.dataset.adSlot || 'unknown',
                  non_interaction: true
                })
              }
            } catch (error) {
              console.warn('Failed to initialize lazy-loaded ad:', error)
            }
          }
          
          observer.unobserve(adElement)
        }
      })
    }, {
      threshold: minViewportHeight,
      rootMargin: '100px'
    })

    // Observe all unloaded ads
    const adsToLazyLoad = document.querySelectorAll('.adsbygoogle:not([data-lazy-loaded])')
    adsToLazyLoad.forEach((ad) => {
      ad.setAttribute('data-lazy-loaded', 'pending')
      observer.observe(ad)
    })

    return observer
  }, [enableLazyLoading, minViewportHeight])

  // Track ad viewability for optimization
  const setupViewabilityTracking = useCallback(() => {
    if (!enableViewabilityTracking || !('IntersectionObserver' in window)) return

    const viewabilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const adElement = entry.target as HTMLElement
        const adSlot = adElement.dataset.adSlot || 'unknown'
        
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          // Ad is 50%+ visible
          if (typeof window !== 'undefined' && (window as any).gtag) {
            ;(window as any).gtag('event', 'ad_viewable', {
              event_category: 'ads',
              event_label: adSlot,
              value: Math.round(entry.intersectionRatio * 100),
              custom_parameter_1: 'viewability_50_plus',
              non_interaction: true
            })
          }
          
          // Start viewability timer
          const startTime = Date.now()
          adElement.setAttribute('data-viewable-start', startTime.toString())
          
        } else if (!entry.isIntersecting) {
          // Ad left viewport
          const startTime = parseInt(adElement.getAttribute('data-viewable-start') || '0')
          if (startTime > 0) {
            const viewTime = Date.now() - startTime
            
            if (viewTime > 1000) { // Viewed for more than 1 second
              if (typeof window !== 'undefined' && (window as any).gtag) {
                ;(window as any).gtag('event', 'ad_view_time', {
                  event_category: 'ads',
                  event_label: adSlot,
                  value: Math.round(viewTime / 1000),
                  custom_parameter_1: 'engagement_time',
                  non_interaction: true
                })
              }
            }
            
            adElement.removeAttribute('data-viewable-start')
          }
        }
      })
    }, {
      threshold: [0, 0.5, 1.0]
    })

    // Observe all ads for viewability
    const allAds = document.querySelectorAll('.adsbygoogle')
    allAds.forEach(ad => viewabilityObserver.observe(ad))

    return viewabilityObserver
  }, [enableViewabilityTracking])

  // Optimize ad refresh for better revenue
  const setupAdRefresh = useCallback(() => {
    const refreshableAds = document.querySelectorAll('.adsbygoogle[data-refresh="true"]')
    
    refreshableAds.forEach((adElement) => {
      const element = adElement as HTMLElement
      const refreshInterval = parseInt(element.dataset.refreshInterval || '30000') // 30 seconds default
      
      // Don't refresh too frequently (minimum 30 seconds)
      if (refreshInterval < 30000) return
      
      const refreshAd = () => {
        if (typeof window !== 'undefined' && (window as any).googletag) {
          const slot = (window as any).googletag.slots?.find((s: any) => 
            s.getSlotElementId() === element.id
          )
          
          if (slot) {
            ;(window as any).googletag.pubads().refresh([slot])
            
            // Track ad refresh
            if ((window as any).gtag) {
              ;(window as any).gtag('event', 'ad_refresh', {
                event_category: 'ads',
                event_label: element.dataset.adSlot || 'unknown',
                non_interaction: true
              })
            }
          }
        }
      }
      
      // Set up refresh timer
      const intervalId = setInterval(refreshAd, refreshInterval)
      element.setAttribute('data-refresh-interval-id', intervalId.toString())
    })
  }, [])

  // Core Web Vitals optimization for ads
  const optimizeForWebVitals = useCallback(() => {
    // Delay non-critical ads to improve FID
    setTimeout(() => {
      const nonCriticalAds = document.querySelectorAll('.adsbygoogle[data-priority="low"]')
      
      nonCriticalAds.forEach((ad) => {
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          try {
            ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
          } catch (error) {
            console.warn('Failed to initialize non-critical ad:', error)
          }
        }
      })
    }, 2000) // Delay by 2 seconds

    // Optimize ad loading for better LCP
    const aboveFoldAds = document.querySelectorAll('.adsbygoogle[data-priority="high"]')
    
    aboveFoldAds.forEach((ad) => {
      const element = ad as HTMLElement
      
      // Ensure above-the-fold ads don't block LCP
      element.style.willChange = 'transform'
      element.style.contain = 'layout style paint'
      
      // Preload ad script with high priority
      if (!document.querySelector('link[href*="pagead2.googlesyndication.com"]')) {
        const preloadLink = document.createElement('link')
        preloadLink.rel = 'preload'
        preloadLink.href = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`
        preloadLink.as = 'script'
        preloadLink.crossOrigin = 'anonymous'
        document.head.appendChild(preloadLink)
      }
    })
  }, [])

  useEffect(() => {
    if (initialized) return

    // Initialize all optimizations
    preventCLS()
    
    const lazyObserver = setupLazyLoading()
    const viewabilityObserver = setupViewabilityTracking()
    
    setupAdRefresh()
    optimizeForWebVitals()
    
    setInitialized(true)

    // Cleanup function
    return () => {
      lazyObserver?.disconnect()
      viewabilityObserver?.disconnect()
      
      // Clear refresh intervals
      document.querySelectorAll('[data-refresh-interval-id]').forEach((element) => {
        const intervalId = parseInt(element.getAttribute('data-refresh-interval-id') || '0')
        if (intervalId) {
          clearInterval(intervalId)
        }
      })
    }
  }, [initialized, preventCLS, setupLazyLoading, setupViewabilityTracking, setupAdRefresh, optimizeForWebVitals])

  return null
}

// AdSense-optimized ad container component
interface OptimizedAdProps {
  slot: string
  format?: string
  priority?: 'high' | 'medium' | 'low'
  refreshable?: boolean
  refreshInterval?: number
  className?: string
  style?: React.CSSProperties
}

export function OptimizedAd({
  slot,
  format = 'auto',
  priority = 'medium',
  refreshable = false,
  refreshInterval = 30000,
  className = '',
  style = {}
}: OptimizedAdProps) {
  const [adId] = useState(() => `ad-${slot}-${Date.now()}`)

  useEffect(() => {
    // Initialize ad after component mounts
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch (error) {
        console.warn('Failed to initialize optimized ad:', error)
      }
    }
  }, [])

  return (
    <div 
      className={`optimized-ad-container ${className}`}
      style={style}
    >
      <ins
        id={adId}
        className="adsbygoogle"
        style={{ 
          display: 'block',
          minHeight: format === 'rectangle' ? '250px' : format === 'banner' ? '90px' : 'auto'
        }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-priority={priority}
        data-refresh={refreshable.toString()}
        data-refresh-interval={refreshInterval.toString()}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// Performance metrics for AdSense optimization
export const AdSenseMetrics = {
  // Calculate ad density (ads per viewport)
  calculateAdDensity(): number {
    const viewportHeight = window.innerHeight
    const ads = document.querySelectorAll('.adsbygoogle')
    const adsInViewport = Array.from(ads).filter(ad => {
      const rect = ad.getBoundingClientRect()
      return rect.top < viewportHeight && rect.bottom > 0
    })
    
    return adsInViewport.length
  },
  
  // Monitor ad load times
  trackAdLoadTimes() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('googlesyndication.com')) {
          if (typeof window !== 'undefined' && (window as any).gtag) {
            ;(window as any).gtag('event', 'ad_load_performance', {
              event_category: 'ads',
              event_label: 'script_load_time',
              value: Math.round(entry.duration),
              non_interaction: true
            })
          }
        }
      })
    })

    if ('PerformanceObserver' in window) {
      try {
        observer.observe({ entryTypes: ['resource'] })
      } catch (error) {
        console.warn('Performance observer not supported:', error)
      }
    }
  }
}