// Service Worker for Planeta Keto - Advanced Caching Strategy
const CACHE_NAME = 'planeta-keto-v1.0.0'
const STATIC_CACHE = `${CACHE_NAME}-static`
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`
const IMAGE_CACHE = `${CACHE_NAME}-images`
const API_CACHE = `${CACHE_NAME}-api`

// Cache strategies
const CACHE_STRATEGIES = {
  NETWORK_FIRST: 'network-first',
  CACHE_FIRST: 'cache-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
}

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/recetas',
  '/blog',
  '/dieta-keto',
  '/offline',
  '/logo.webp',
  '/favicon.ico',
  // Add critical CSS and JS files
  '/_next/static/css/',
  '/_next/static/js/',
]

// Cache limits
const CACHE_LIMITS = {
  [DYNAMIC_CACHE]: 50,
  [IMAGE_CACHE]: 100,
  [API_CACHE]: 30
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static assets...')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName.startsWith('planeta-keto-') && cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('🗑️ Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - handle requests with appropriate caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const { url, method } = request
  
  // Only handle GET requests
  if (method !== 'GET') return
  
  // Skip non-http requests
  if (!url.startsWith('http')) return
  
  // Determine cache strategy based on request type
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE))
  } else if (isImage(url)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE))
  } else if (isAPI(url)) {
    event.respondWith(staleWhileRevalidateStrategy(request, API_CACHE))
  } else if (isPage(url)) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE))
  } else {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE))
  }
})

// Cache-first strategy (for static assets and images)
async function cacheFirstStrategy(request, cacheName) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // If not in cache, fetch from network and cache
    const response = await fetch(request)
    if (response.status === 200) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
      await limitCacheSize(cacheName)
    }
    
    return response
  } catch (error) {
    console.log('Cache-first strategy failed:', error)
    
    // Return offline fallback for images
    if (isImage(request.url)) {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">' +
        '<rect width="300" height="200" fill="#f3f4f6"/>' +
        '<text x="150" y="100" text-anchor="middle" fill="#9ca3af">Imagen no disponible</text>' +
        '</svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      )
    }
    
    throw error
  }
}

// Network-first strategy (for pages)
async function networkFirstStrategy(request, cacheName) {
  try {
    // Try network first
    const response = await fetch(request)
    
    if (response.status === 200) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
      await limitCacheSize(cacheName)
    }
    
    return response
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // If both fail and it's a page request, return offline page
    if (isPage(request.url)) {
      const offlineResponse = await caches.match('/offline')
      if (offlineResponse) {
        return offlineResponse
      }
    }
    
    throw error
  }
}

// Stale-while-revalidate strategy (for API calls)
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  // Fetch fresh data in background
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.status === 200) {
        cache.put(request, response.clone())
        limitCacheSize(cacheName)
      }
      return response
    })
    .catch(error => {
      console.log('Background fetch failed:', error)
      return cachedResponse
    })
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse
  }
  
  // If no cached version, wait for network
  return fetchPromise
}

// Limit cache size to prevent storage overflow
async function limitCacheSize(cacheName) {
  const limit = CACHE_LIMITS[cacheName]
  if (!limit) return
  
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  
  if (keys.length > limit) {
    // Remove oldest entries
    const keysToDelete = keys.slice(0, keys.length - limit)
    await Promise.all(keysToDelete.map(key => cache.delete(key)))
  }
}

// Helper functions to determine request types
function isStaticAsset(url) {
  return url.includes('/_next/static/') || 
         url.includes('/static/') ||
         url.endsWith('.css') ||
         url.endsWith('.js') ||
         url.endsWith('.woff') ||
         url.endsWith('.woff2') ||
         url.endsWith('.ico')
}

function isImage(url) {
  return url.includes('/images/') ||
         url.includes('cdn.sanity.io') ||
         url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)(\?|$)/i)
}

function isAPI(url) {
  return url.includes('/api/') ||
         url.includes('cdn.sanity.io/v') ||
         url.includes('analytics')
}

function isPage(url) {
  return !isStaticAsset(url) && !isImage(url) && !isAPI(url) &&
         (url.endsWith('/') || !url.includes('.'))
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Handle offline form submissions, analytics, etc.
  console.log('🔄 Background sync triggered')
  
  // Process any queued analytics events
  if ('indexedDB' in self) {
    // Implementation would depend on your analytics queuing system
    console.log('📊 Processing queued analytics events')
  }
}

// Push notifications (if needed for user engagement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body,
      icon: '/logo.webp',
      badge: '/badge-icon.png',
      data: data.url,
      actions: [
        {
          action: 'open',
          title: 'Ver receta'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data || '/'
    
    event.waitUntil(
      self.clients.matchAll({ type: 'window' })
        .then(clients => {
          // Check if there's already a window/tab open
          for (const client of clients) {
            if (client.url.includes(url) && 'focus' in client) {
              return client.focus()
            }
          }
          
          // Open new window/tab
          if (self.clients.openWindow) {
            return self.clients.openWindow(url)
          }
        })
    )
  }
})

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATS') {
    getCacheStats().then(stats => {
      event.ports[0].postMessage(stats)
    })
  }
})

async function getCacheStats() {
  const cacheNames = await caches.keys()
  const stats = {}
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    stats[cacheName] = keys.length
  }
  
  return stats
}