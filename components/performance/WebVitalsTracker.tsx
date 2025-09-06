'use client'

import { useEffect, useState } from 'react'

interface WebVitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

interface WebVitalsData {
  fcp?: WebVitalMetric
  lcp?: WebVitalMetric
  inp?: WebVitalMetric  // Cambiado de fid a inp
  cls?: WebVitalMetric
  ttfb?: WebVitalMetric
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

export default function WebVitalsTracker() {
  const [vitals, setVitals] = useState<WebVitalsData>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development or when debug flag is present
    const showDebug = process.env.NODE_ENV === 'development' || 
                     new URLSearchParams(window.location.search).has('debug-vitals')
    setIsVisible(showDebug)

    // Import web-vitals dynamically to avoid SSR issues
    let cleanup: (() => void) | undefined

    const initWebVitals = async () => {
      // Cambiado onFID por onINP
      const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals')

      const handleMetric = (metric: any) => {
        const rating = getRating(metric.name, metric.value)
        const webVitalMetric: WebVitalMetric = {
          name: metric.name,
          value: metric.value,
          rating,
          timestamp: Date.now()
        }

        // Update local state
        setVitals(prev => ({
          ...prev,
          [metric.name.toLowerCase()]: webVitalMetric
        }))

        // Send to Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'performance',
            event_label: metric.name,
            value: Math.round(metric.value),
            custom_parameter_1: rating,
            non_interaction: true
          })
        }

        // Send to analytics API
        fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: 'web_vital',
            properties: {
              metric: metric.name,
              value: metric.value,
              rating,
              url: window.location.href,
              timestamp: Date.now()
            }
          })
        }).catch(err => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Failed to send web vital to analytics:', err)
          }
        })

        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 Web Vital - ${metric.name}:`, {
            value: metric.value,
            rating,
            threshold: getThresholds(metric.name)
          })
        }
      }

      // Setup metric observers - Cambiado onFID por onINP
      onCLS(handleMetric)
      onINP(handleMetric)  // Cambiado de onFID
      onFCP(handleMetric)
      onLCP(handleMetric)
      onTTFB(handleMetric)

      cleanup = () => {
        // Web vitals doesn't provide cleanup, but we can clear our state
        setVitals({})
      }
    }

    if (typeof window !== 'undefined') {
      initWebVitals()
    }

    return cleanup
  }, [])

  // Don't render in production unless debug flag is present
  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg shadow-lg z-50 text-xs font-mono">
      <div className="mb-2 font-bold">🚀 Web Vitals (Debug)</div>
      <div className="space-y-1">
        {Object.entries(vitals).map(([key, metric]) => (
          <div key={key} className="flex justify-between items-center">
            <span className="mr-2">{metric.name}:</span>
            <div className="flex items-center space-x-2">
              <span>{formatValue(metric.name, metric.value)}</span>
              <span className={`w-2 h-2 rounded-full ${getRatingColor(metric.rating)}`}></span>
            </div>
          </div>
        ))}
      </div>
      
      {Object.keys(vitals).length === 0 && (
        <div className="text-gray-400">Midiendo métricas...</div>
      )}
      
      <div className="mt-2 pt-2 border-t border-gray-600 text-xs">
        <div className="flex justify-between">
          <span>🟢 Good</span>
          <span>🟡 Needs Improvement</span>
          <span>🔴 Poor</span>
        </div>
      </div>
    </div>
  )
}

// Utility functions
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = getThresholds(name)
  
  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.poor) return 'needs-improvement'
  return 'poor'
}

function getThresholds(name: string): { good: number; poor: number } {
  const thresholds: Record<string, { good: number; poor: number }> = {
    CLS: { good: 0.1, poor: 0.25 },
    INP: { good: 200, poor: 500 },  // Cambiado FID por INP con nuevos thresholds
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    TTFB: { good: 800, poor: 1800 }
  }
  
  return thresholds[name] || { good: 0, poor: 0 }
}

function getRatingColor(rating: string): string {
  switch (rating) {
    case 'good': return 'bg-green-400'
    case 'needs-improvement': return 'bg-yellow-400'
    case 'poor': return 'bg-red-400'
    default: return 'bg-gray-400'
  }
}

function formatValue(name: string, value: number): string {
  switch (name) {
    case 'CLS':
      return value.toFixed(3)
    case 'INP':  // Cambiado FID por INP
    case 'FCP':
    case 'LCP':
    case 'TTFB':
      return `${Math.round(value)}ms`
    default:
      return value.toString()
  }
}

// Performance observer for additional metrics
export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            if (process.env.NODE_ENV === 'development') {
              console.warn('🐌 Long Task detected:', {
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name
              })
            }
            
            // Send to analytics
            if (window.gtag) {
              window.gtag('event', 'long_task', {
                event_category: 'performance',
                value: Math.round(entry.duration),
                event_label: entry.name,
                non_interaction: true
              })
            }
          }
        })
      })

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] })
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Long task observer not supported')
        }
      }

      // Monitor resource loading
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const resourceEntry = entry as PerformanceResourceTiming
          
          // Check for slow resources (>2s)
          if (resourceEntry.duration > 2000) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('🐌 Slow Resource:', {
                name: resourceEntry.name,
                duration: resourceEntry.duration,
                size: resourceEntry.transferSize
              })
            }
            
            if (window.gtag) {
              window.gtag('event', 'slow_resource', {
                event_category: 'performance',
                event_label: resourceEntry.name,
                value: Math.round(resourceEntry.duration),
                non_interaction: true
              })
            }
          }
        })
      })

      try {
        resourceObserver.observe({ entryTypes: ['resource'] })
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Resource observer not supported')
        }
      }

      return () => {
        longTaskObserver.disconnect()
        resourceObserver.disconnect()
      }
    }
  }, [])

  return null
}

// AdSense performance specific monitoring
export function AdSensePerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Monitor AdSense script loading performance
    const checkAdSensePerformance = () => {
      const adElements = document.querySelectorAll('.adsbygoogle')
      const loadedAds = document.querySelectorAll('.adsbygoogle[data-ad-status="filled"]')
      
      const metrics = {
        totalAds: adElements.length,
        loadedAds: loadedAds.length,
        fillRate: loadedAds.length / Math.max(adElements.length, 1),
        timestamp: Date.now()
      }
      
      if (window.gtag) {
        window.gtag('event', 'adsense_performance', {
          event_category: 'ads',
          event_label: 'fill_rate',
          value: Math.round(metrics.fillRate * 100),
          custom_parameter_1: `${metrics.loadedAds}/${metrics.totalAds}`,
          non_interaction: true
        })
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📱 AdSense Performance:', metrics)
      }
    }

    // Check AdSense performance after 3 seconds
    const timeoutId = setTimeout(checkAdSensePerformance, 3000)
    
    return () => clearTimeout(timeoutId)
  }, [])

  return null
}