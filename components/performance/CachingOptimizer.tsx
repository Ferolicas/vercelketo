'use client'

import { useEffect } from 'react'

// Service Worker registration for advanced caching
export function ServiceWorkerManager() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register service worker for caching
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration)
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            console.log('🔄 Service Worker update found')
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  console.log('🆕 New version available')
                }
              })
            }
          })
        })
        .catch((error) => {
          console.warn('❌ Service Worker registration failed:', error)
        })
    }
  }, [])
  
  return null
}

// Browser cache optimization
export class CacheOptimizer {
  // Preload critical resources
  static preloadCriticalResources() {
    const criticalResources = [
      { href: '/', as: 'document' },
      { href: '/recetas', as: 'document' },
      { href: '/api/recipes?limit=12', as: 'fetch' },
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' },
      { href: '/logo.webp', as: 'image' }
    ]
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.href
      link.as = resource.as
      if (resource.as === 'font') {
        link.crossOrigin = 'anonymous'
      }
      document.head.appendChild(link)
    })
  }
  
  // Prefetch likely next pages
  static prefetchLikelyPages() {
    const currentPath = window.location.pathname
    const prefetchMap: Record<string, string[]> = {
      '/': ['/recetas', '/blog', '/dieta-keto'],
      '/recetas': ['/categoria/desayuno', '/categoria/almuerzo', '/categoria/cena'],
      '/blog': ['/recetas', '/foro'],
      '/foro': ['/recetas', '/blog']
    }
    
    const toPrefetch = prefetchMap[currentPath] || []
    
    // Prefetch after a delay to not interfere with critical loading
    setTimeout(() => {
      toPrefetch.forEach(path => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = path
        document.head.appendChild(link)
      })
    }, 2000)
  }
  
  // Implement stale-while-revalidate pattern
  static async fetchWithSWR(url: string, options: RequestInit = {}) {
    const cacheKey = `swr-${url}`
    
    // Try to get from cache first
    if ('caches' in window) {
      const cache = await caches.open('swr-cache-v1')
      const cachedResponse = await cache.match(url)
      
      if (cachedResponse) {
        // Serve stale content immediately
        const staleData = await cachedResponse.json()
        
        // Revalidate in background
        fetch(url, options)
          .then(response => response.json())
          .then(freshData => {
            // Update cache with fresh data
            cache.put(url, new Response(JSON.stringify(freshData)))
          })
          .catch(err => console.warn('SWR revalidation failed:', err))
        
        return staleData
      }
    }
    
    // If not in cache, fetch normally
    const response = await fetch(url, options)
    const data = await response.json()
    
    // Store in cache for next time
    if ('caches' in window) {
      const cache = await caches.open('swr-cache-v1')
      cache.put(url, new Response(JSON.stringify(data)))
    }
    
    return data
  }
}

// CDN and static asset optimization
export function StaticAssetOptimizer() {
  useEffect(() => {
    // Optimize font loading
    const optimizeFonts = () => {
      // Add font-display: swap to existing font links
      const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]')
      fontLinks.forEach(link => {
        if (!link.getAttribute('href')?.includes('display=swap')) {
          const href = link.getAttribute('href')
          if (href) {
            const separator = href.includes('?') ? '&' : '?'
            link.setAttribute('href', `${href}${separator}display=swap`)
          }
        }
      })
    }
    
    // Optimize image loading with intersection observer
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]')
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              const src = img.dataset.src
              if (src) {
                img.src = src
                img.removeAttribute('data-src')
                imageObserver.unobserve(img)
              }
            }
          })
        }, {
          rootMargin: '50px'
        })
        
        images.forEach(img => imageObserver.observe(img))
      }
    }
    
    optimizeFonts()
    optimizeImages()
    
    // Setup resource hints
    CacheOptimizer.preloadCriticalResources()
    CacheOptimizer.prefetchLikelyPages()
    
  }, [])
  
  return null
}

// HTTP/2 Server Push simulation (for CDN optimization)
export function HTTP2Optimizer() {
  useEffect(() => {
    // Simulate server push by preloading critical resources
    const criticalCSS = [
      '/css/critical.css',
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ]
    
    const criticalJS = [
      '/_next/static/chunks/framework.js',
      '/_next/static/chunks/main.js',
      '/_next/static/chunks/pages/_app.js'
    ]
    
    // Preload critical CSS
    criticalCSS.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.as = 'style'
      link.onload = () => {
        link.as = 'style'
        link.rel = 'stylesheet'
      }
      document.head.appendChild(link)
    })
    
    // Preload critical JS (but don't execute yet)
    criticalJS.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.as = 'script'
      document.head.appendChild(link)
    })
    
  }, [])
  
  return null
}

// Cache-Control header optimization suggestions
export const CacheHeaders = {
  // Static assets (images, fonts, CSS, JS with hash)
  staticAssets: {
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Expires': new Date(Date.now() + 31536000000).toUTCString()
  },
  
  // HTML pages
  htmlPages: {
    'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
    'Vary': 'Accept-Encoding'
  },
  
  // API responses
  apiResponses: {
    'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
    'Vary': 'Accept-Encoding, Authorization'
  },
  
  // Images from CMS
  dynamicImages: {
    'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
    'Vary': 'Accept'
  }
}

// IndexedDB for client-side data caching
export class ClientSideCache {
  private static dbName = 'PlanetaKetoCache'
  private static version = 1
  
  static async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      
      request.onupgradeneeded = () => {
        const db = request.result
        
        // Recipes cache
        if (!db.objectStoreNames.contains('recipes')) {
          const recipesStore = db.createObjectStore('recipes', { keyPath: 'id' })
          recipesStore.createIndex('category', 'category', { unique: false })
          recipesStore.createIndex('updatedAt', 'updatedAt', { unique: false })
        }
        
        // User preferences cache
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'key' })
        }
      }
    })
  }
  
  static async cacheRecipes(recipes: any[]) {
    try {
      const db = await this.openDB()
      const transaction = db.transaction(['recipes'], 'readwrite')
      const store = transaction.objectStore('recipes')
      
      recipes.forEach(recipe => {
        store.put({ ...recipe, cachedAt: Date.now() })
      })
      
      await transaction.complete
    } catch (error) {
      console.warn('Failed to cache recipes:', error)
    }
  }
  
  static async getCachedRecipes(category?: string): Promise<any[]> {
    try {
      const db = await this.openDB()
      const transaction = db.transaction(['recipes'], 'readonly')
      const store = transaction.objectStore('recipes')
      
      let request: IDBRequest
      if (category) {
        const index = store.index('category')
        request = index.getAll(category)
      } else {
        request = store.getAll()
      }
      
      const result = await request
      
      // Filter out stale data (older than 1 hour)
      const oneHourAgo = Date.now() - (60 * 60 * 1000)
      return result.filter(recipe => recipe.cachedAt > oneHourAgo)
      
    } catch (error) {
      console.warn('Failed to get cached recipes:', error)
      return []
    }
  }
  
  static async clearCache() {
    try {
      const db = await this.openDB()
      const transaction = db.transaction(['recipes', 'preferences'], 'readwrite')
      
      await transaction.objectStore('recipes').clear()
      await transaction.objectStore('preferences').clear()
      
      await transaction.complete
      console.log('✅ Cache cleared')
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  }
}