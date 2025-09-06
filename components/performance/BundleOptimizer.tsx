'use client'

import { useEffect } from 'react'

// Bundle optimization utilities
export class BundleOptimizer {
  private static loadedModules = new Set<string>()
  
  // Preload critical modules
  static preloadCriticalModules() {
    const criticalModules = [
      '@/components/Navigation',
      '@/components/RecipeCard', 
      '@/components/performance/OptimizedImage'
    ]
    
    criticalModules.forEach(module => {
      if (!this.loadedModules.has(module)) {
        import(module).then(() => {
          this.loadedModules.add(module)
        })
      }
    })
  }
  
  // Lazy load non-critical modules
  static lazyLoadModule<T = any>(modulePath: string): Promise<T> {
    if (this.loadedModules.has(modulePath)) {
      return import(modulePath)
    }
    
    return new Promise((resolve) => {
      // Use requestIdleCallback for better performance
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          import(modulePath).then((module) => {
            this.loadedModules.add(modulePath)
            resolve(module)
          })
        })
      } else {
        setTimeout(() => {
          import(modulePath).then((module) => {
            this.loadedModules.add(modulePath)
            resolve(module)
          })
        }, 100)
      }
    })
  }
  
  // Clean up unused modules (for SPA navigation)
  static cleanupUnusedModules() {
    // This would integrate with webpack module federation
    // or Next.js dynamic imports to cleanup unused chunks
    console.log('Cleaning up unused modules...')
  }
}

// Critical resource preloader
interface CriticalResourcesProps {
  fonts?: string[]
  images?: string[]
  scripts?: string[]
}

export function CriticalResourcePreloader({
  fonts = [],
  images = [],
  scripts = []
}: CriticalResourcesProps) {
  useEffect(() => {
    // Preload critical fonts
    fonts.forEach(font => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = font
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
    
    // Preload critical images
    images.forEach(image => {
      const img = new Image()
      img.src = image
    })
    
    // Preload critical scripts
    scripts.forEach(script => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = script
      link.as = 'script'
      document.head.appendChild(link)
    })
  }, [fonts, images, scripts])
  
  return null
}

// Component for managing JavaScript bundle loading
export function JavaScriptOptimizer() {
  useEffect(() => {
    // Initialize bundle optimizer
    BundleOptimizer.preloadCriticalModules()
    
    // Setup intersection observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement
          const moduleToLoad = element.dataset.lazyModule
          
          if (moduleToLoad) {
            BundleOptimizer.lazyLoadModule(moduleToLoad)
            observer.unobserve(element)
          }
        }
      })
    }, {
      rootMargin: '50px'
    })
    
    // Observe all elements with lazy modules
    document.querySelectorAll('[data-lazy-module]').forEach(el => {
      observer.observe(el)
    })
    
    // Cleanup on unmount
    return () => {
      observer.disconnect()
    }
  }, [])
  
  return null
}

// Tree shaking optimizer for unused dependencies
export const TreeShakingHelper = {
  // Mark frequently used utilities for bundling
  markAsUsed: (modulePath: string) => {
    if (typeof window !== 'undefined') {
      ;(window as any).__usedModules = (window as any).__usedModules || new Set()
      ;(window as any).__usedModules.add(modulePath)
    }
  },
  
  // Get usage statistics
  getUsageStats: () => {
    if (typeof window !== 'undefined') {
      return Array.from((window as any).__usedModules || [])
    }
    return []
  }
}

// Webpack bundle analyzer helper
export function BundleAnalyzer() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // In development, log bundle information
      const logBundleInfo = () => {
        const scripts = Array.from(document.querySelectorAll('script[src]'))
        const totalSize = scripts.reduce((acc, script) => {
          const src = (script as HTMLScriptElement).src
          if (src.includes('_next/static')) {
            // Estimate size (in production this would be actual sizes)
            return acc + 100 // KB estimate
          }
          return acc
        }, 0)
        
        console.group('📦 Bundle Analysis')
        console.log(`Total estimated JS size: ${totalSize}KB`)
        console.log(`Number of chunks: ${scripts.length}`)
        console.log('Loaded modules:', BundleOptimizer['loadedModules'])
        console.groupEnd()
      }
      
      // Log bundle info after page load
      window.addEventListener('load', logBundleInfo)
      
      return () => {
        window.removeEventListener('load', logBundleInfo)
      }
    }
  }, [])
  
  return null
}

// Resource hints component
export function ResourceHints() {
  useEffect(() => {
    // Add DNS prefetch for external domains
    const domains = [
      'cdn.sanity.io',
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'www.google-analytics.com',
      'pagead2.googlesyndication.com'
    ]
    
    domains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = `//${domain}`
      document.head.appendChild(link)
    })
    
    // Add preconnect for critical domains
    const criticalDomains = [
      'cdn.sanity.io',
      'fonts.gstatic.com'
    ]
    
    criticalDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = `https://${domain}`
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }, [])
  
  return null
}

// Code splitting utility for route-based splitting
export function RouteSplitter() {
  useEffect(() => {
    // Preload likely next pages based on current route
    const currentPath = window.location.pathname
    
    const preloadMap: Record<string, string[]> = {
      '/': ['/recetas', '/blog', '/dieta-keto'],
      '/recetas': ['/recetas/[slug]', '/categoria/[slug]'],
      '/blog': ['/blog/[slug]', '/recetas'],
      '/foro': ['/foro/[slug]', '/recetas']
    }
    
    const toPreload = preloadMap[currentPath] || []
    
    // Preload likely next routes after 2 seconds
    setTimeout(() => {
      toPreload.forEach(route => {
        if (route.includes('[slug]')) {
          // For dynamic routes, we can't preload specific pages
          // but we can preload the component
          return
        }
        
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = route
        document.head.appendChild(link)
      })
    }, 2000)
  }, [])
  
  return null
}