'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
    gtag: (...args: any[]) => void
  }
}

interface AdSenseTrackingProps {
  clientId: string
  enableTracking?: boolean
}

export default function AdSenseTracking({ clientId, enableTracking = true }: AdSenseTrackingProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!clientId || !enableTracking) return

    // Load AdSense script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`
    script.crossOrigin = 'anonymous'
    
    script.onload = () => {
      setIsLoaded(true)
      // Initialize AdSense
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      
      // Set up performance monitoring
      setupAdSenseMonitoring()
    }

    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [clientId, enableTracking])

  const setupAdSenseMonitoring = () => {
    // Monitor ad load times
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('googlesyndication.com')) {
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'ad_load_time', {
              event_category: 'adsense_performance',
              event_label: 'script_load',
              value: Math.round(entry.duration),
              custom_parameter_1: 'performance_monitoring'
            })
          }
        }
      })
    })

    if ('PerformanceObserver' in window) {
      observer.observe({ entryTypes: ['resource'] })
    }

    // Monitor viewport intersections for ads
    const adElements = document.querySelectorAll('.adsbygoogle')
    if (adElements.length > 0 && 'IntersectionObserver' in window) {
      const adObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const adElement = entry.target as HTMLElement
            const adSlot = adElement.getAttribute('data-ad-slot') || 'unknown'
            
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'ad_impression', {
                event_category: 'adsense',
                event_label: adSlot,
                custom_parameter_1: 'viewability',
                non_interaction: true
              })
            }
          }
        })
      }, { threshold: 0.5 })

      adElements.forEach(ad => adObserver.observe(ad))
    }
  }

  return null
}

// AdSense performance utilities
export const AdSenseUtils = {
  // Track ad click events
  trackAdClick: (adSlot: string, adUnit: string, placement: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ad_click', {
        event_category: 'adsense',
        event_label: adSlot,
        custom_parameter_1: placement,
        custom_parameter_2: adUnit,
        value: 1
      })
    }
  },

  // Track ad revenue (when available)
  trackAdRevenue: (value: number, currency: string = 'EUR', adUnit: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ad_impression', {
        event_category: 'adsense_revenue',
        event_label: adUnit,
        value: value,
        currency: currency,
        custom_parameter_1: 'revenue_tracking'
      })
    }
  },

  // Monitor ad block detection
  detectAdBlock: () => {
    const testAd = document.createElement('div')
    testAd.innerHTML = '&nbsp;'
    testAd.className = 'adsbox'
    testAd.style.cssText = 'position:absolute;left:-10000px;'
    document.body.appendChild(testAd)

    setTimeout(() => {
      const isBlocked = testAd.offsetHeight === 0
      document.body.removeChild(testAd)
      
      if (isBlocked && typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'ad_block_detected', {
          event_category: 'adsense',
          event_label: 'ad_blocker_active',
          custom_parameter_1: 'monetization_impact',
          non_interaction: true
        })
      }
    }, 100)
  },

  // Track page value for AdSense optimization
  trackPageValue: (pageType: 'recipe' | 'blog' | 'forum' | 'product', engagement: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      const pageValue = pageType === 'recipe' ? engagement * 0.1 : 
                      pageType === 'product' ? engagement * 0.5 : 
                      pageType === 'blog' ? engagement * 0.3 : 
                      engagement * 0.2

      window.gtag('event', 'page_value', {
        event_category: 'adsense_optimization',
        event_label: pageType,
        value: Math.round(pageValue * 100) / 100,
        custom_parameter_1: 'page_monetization',
        custom_parameter_2: `engagement_${Math.round(engagement)}`
      })
    }
  }
}

// AdSense ad units configuration for Planeta Keto
export const AdUnits = {
  // High-performing recipe page ads
  RECIPE_TOP_BANNER: {
    slot: '1234567890', // Replace with actual ad slot
    size: [[728, 90], [320, 50]],
    placement: 'recipe_top',
    priority: 'high'
  },
  
  RECIPE_SIDEBAR: {
    slot: '2345678901', // Replace with actual ad slot
    size: [[300, 250], [300, 600]],
    placement: 'recipe_sidebar',
    priority: 'high'
  },

  RECIPE_IN_CONTENT: {
    slot: '3456789012', // Replace with actual ad slot
    size: [[320, 100], [728, 90]],
    placement: 'recipe_content',
    priority: 'medium'
  },

  // Blog and forum ads
  BLOG_HEADER: {
    slot: '4567890123', // Replace with actual ad slot
    size: [[728, 90], [970, 90]],
    placement: 'blog_header',
    priority: 'medium'
  },

  FORUM_SIDEBAR: {
    slot: '5678901234', // Replace with actual ad slot
    size: [[300, 250]],
    placement: 'forum_sidebar',
    priority: 'low'
  },

  // Mobile-specific ads
  MOBILE_STICKY: {
    slot: '6789012345', // Replace with actual ad slot
    size: [[320, 50], [320, 100]],
    placement: 'mobile_sticky',
    priority: 'high'
  }
}

// AdSense responsive ad component
interface ResponsiveAdProps {
  adSlot: string
  adFormat?: string
  style?: React.CSSProperties
  className?: string
}

export function ResponsiveAd({ adSlot, adFormat = 'auto', style, className = '' }: ResponsiveAdProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error('AdSense error:', error)
      }
    }
  }, [])

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}