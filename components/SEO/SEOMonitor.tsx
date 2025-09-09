'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface SEOIssue {
  type: 'error' | 'warning' | 'info'
  message: string
  fix?: string
}

export default function SEOMonitor() {
  const pathname = usePathname()
  const [issues, setIssues] = useState<SEOIssue[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<any>({})

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkSEOIssues = () => {
      const foundIssues: SEOIssue[] = []

      // Check title
      const title = document.title
      if (!title || title.length < 30 || title.length > 60) {
        foundIssues.push({
          type: 'warning',
          message: `Title length is ${title?.length || 0} characters (optimal: 30-60)`,
          fix: 'Adjust title length for better SERP display'
        })
      }

      // Check meta description
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content')
      if (!metaDescription || metaDescription.length < 120 || metaDescription.length > 160) {
        foundIssues.push({
          type: 'warning',
          message: `Meta description length is ${metaDescription?.length || 0} characters (optimal: 120-160)`,
          fix: 'Optimize meta description for better CTR'
        })
      }

      // Check H1
      const h1Elements = document.querySelectorAll('h1')
      if (h1Elements.length === 0) {
        foundIssues.push({
          type: 'error',
          message: 'No H1 tag found',
          fix: 'Add exactly one H1 tag per page'
        })
      } else if (h1Elements.length > 1) {
        foundIssues.push({
          type: 'warning',
          message: `Multiple H1 tags found (${h1Elements.length})`,
          fix: 'Use only one H1 tag per page'
        })
      }

      // Check heading hierarchy
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      for (let i = 1; i < headings.length; i++) {
        const currentLevel = parseInt(headings[i].tagName.charAt(1))
        const prevLevel = parseInt(headings[i - 1].tagName.charAt(1))
        
        if (currentLevel > prevLevel + 1) {
          foundIssues.push({
            type: 'warning',
            message: 'Heading hierarchy skip detected',
            fix: 'Maintain proper heading hierarchy (H1 → H2 → H3, etc.)'
          })
          break
        }
      }

      // Check images without alt text
      const imagesWithoutAlt = document.querySelectorAll('img:not([alt])')
      if (imagesWithoutAlt.length > 0) {
        foundIssues.push({
          type: 'warning',
          message: `${imagesWithoutAlt.length} images without alt text`,
          fix: 'Add descriptive alt text to all images'
        })
      }

      // Check for structured data
      const structuredData = document.querySelector('script[type="application/ld+json"]')
      if (!structuredData) {
        foundIssues.push({
          type: 'info',
          message: 'No structured data found',
          fix: 'Add JSON-LD structured data for better rich snippets'
        })
      }

      // Check page speed insights
      if ('performance' in window && 'navigation' in performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const loadTime = navigation.loadEventEnd - navigation.fetchStart
        
        if (loadTime > 3000) {
          foundIssues.push({
            type: 'warning',
            message: `Page load time: ${Math.round(loadTime)}ms (target: <3000ms)`,
            fix: 'Optimize images, minify CSS/JS, use CDN'
          })
        }
      }

      // Check Core Web Vitals
      if ('web-vitals' in window) {
        // This would integrate with web-vitals library
        // For now, we'll simulate some checks
      }

      setIssues(foundIssues)
    }

    // Run checks after page load
    const timer = setTimeout(checkSEOIssues, 2000)
    return () => clearTimeout(timer)
  }, [pathname])

  // Performance monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Monitor performance metrics
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navigation = entry as PerformanceNavigationTiming
          setPerformanceMetrics((prev: any) => ({
            ...prev,
            dns: navigation.domainLookupEnd - navigation.domainLookupStart,
            connect: navigation.connectEnd - navigation.connectStart,
            response: navigation.responseEnd - navigation.responseStart,
            dom: navigation.domContentLoadedEventEnd - navigation.responseEnd,
            load: navigation.loadEventEnd - navigation.fetchStart
          }))
        }
      })
    })

    observer.observe({ entryTypes: ['navigation'] })

    return () => observer.disconnect()
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  if (issues.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900">SEO Monitor</h3>
          <button
            onClick={() => setIssues([])}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {issues.map((issue, index) => (
            <div
              key={index}
              className={`text-xs p-2 rounded ${
                issue.type === 'error' 
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : issue.type === 'warning'
                  ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              <div className="font-medium">{issue.message}</div>
              {issue.fix && (
                <div className="mt-1 text-xs opacity-75">{issue.fix}</div>
              )}
            </div>
          ))}
        </div>

        {Object.keys(performanceMetrics).length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-700 mb-1">Performance</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {Object.entries(performanceMetrics).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600 capitalize">{key}:</span>
                  <span className="font-mono">{Math.round(value as number)}ms</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}