// Service Worker para Planeta Keto - Optimización de rendimiento y cache

const CACHE_NAME = 'planeta-keto-v1';
const STATIC_CACHE = 'planeta-keto-static-v1';
const DYNAMIC_CACHE = 'planeta-keto-dynamic-v1';

// Recursos que se cachearán inmediatamente
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico'
];

// Recursos que NO se deben cachear
const CACHE_BLACKLIST = [
  '/api/analytics',
  '/admin',
  '/_next/webpack-hmr',
  '/_next/static/chunks/webpack'
];

// Instalar el Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activar el Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    // Limpiar caches antiguos
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE
            )
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// TEMPORARILY DISABLED - Interceptar requests (fetch) to fix navigation
// This Service Worker was interfering with Next.js client-side navigation
/*
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Solo manejar requests HTTP/HTTPS
  if (!request.url.startsWith('http')) return;
  
  // No cachear requests de la blacklist
  if (CACHE_BLACKLIST.some(path => url.pathname.includes(path))) {
    return fetch(request);
  }

  // Estrategia para diferentes tipos de recursos
  if (request.method === 'GET') {
    event.respondWith(handleGetRequest(request));
  }
});
*/

// Manejar requests GET con diferentes estrategias
async function handleGetRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Estrategia para assets estáticos (CSS, JS, imágenes)
    if (isStaticAsset(url)) {
      return await cacheFirstStrategy(request);
    }
    
    // Estrategia para páginas HTML
    if (isHTMLPage(request)) {
      return await networkFirstStrategy(request);
    }
    
    // Estrategia para API calls
    if (isApiCall(url)) {
      return await networkOnlyStrategy(request);
    }
    
    // Estrategia para imágenes de Sanity CDN
    if (isSanityCDN(url)) {
      return await cacheFirstStrategy(request);
    }
    
    // Estrategia por defecto: network first
    return await networkFirstStrategy(request);
    
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    return await getFallbackResponse(request);
  }
}

// Cache First: Para assets que cambian poco
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Actualizar cache en background
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Network First: Para contenido que cambia frecuentemente
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Network Only: Para requests que no se deben cachear
async function networkOnlyStrategy(request) {
  return fetch(request);
}

// Actualizar cache en background
async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      await cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    console.log('[SW] Background update failed:', error);
  }
}

// Respuesta de fallback cuando todo falla
async function getFallbackResponse(request) {
  const url = new URL(request.url);
  
  // Para páginas HTML, devolver página offline
  if (isHTMLPage(request)) {
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) return offlinePage;
    
    // Fallback básico
    return new Response(
      createOfflineHTML(),
      { 
        headers: { 'Content-Type': 'text/html' },
        status: 503,
        statusText: 'Service Unavailable'
      }
    );
  }
  
  // Para imágenes, devolver imagen placeholder
  if (request.destination === 'image') {
    const placeholder = await caches.match('/placeholder.svg');
    if (placeholder) return placeholder;
    
    // SVG placeholder generado
    return new Response(
      createPlaceholderSVG(),
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
  
  // Para otros recursos
  return new Response(
    'Resource not available offline',
    { 
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    }
  );
}

// Utilidades de detección de tipo de recurso
function isStaticAsset(url) {
  const staticExtensions = ['.css', '.js', '.woff', '.woff2', '.ttf', '.eot'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
         url.pathname.includes('/_next/static/');
}

function isHTMLPage(request) {
  return request.mode === 'navigate' || 
         request.headers.get('accept')?.includes('text/html');
}

function isApiCall(url) {
  return url.pathname.startsWith('/api/');
}

function isSanityCDN(url) {
  return url.hostname === 'cdn.sanity.io';
}

// Crear HTML offline básico
function createOfflineHTML() {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sin conexión - Planeta Keto</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            text-align: center;
            padding: 20px;
        }
        .container {
            max-width: 400px;
        }
        .emoji {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        p {
            font-size: 1.1rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        button {
            background: rgba(255,255,255,0.2);
            border: 2px solid rgba(255,255,255,0.3);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        button:hover {
            background: rgba(255,255,255,0.3);
            border-color: rgba(255,255,255,0.5);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="emoji">🥑</div>
        <h1>Sin conexión a internet</h1>
        <p>No tienes conexión a internet en este momento. Revisa tu conexión e intenta nuevamente.</p>
        <button onclick="window.location.reload()">Intentar de nuevo</button>
    </div>
</body>
</html>
  `;
}

// Crear SVG placeholder para imágenes
function createPlaceholderSVG() {
  return `
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f3f4f6"/>
  <circle cx="200" cy="120" r="40" fill="#d1d5db"/>
  <path d="M160 140 L240 140 L200 200 Z" fill="#d1d5db"/>
  <text x="200" y="250" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#6b7280">
    Imagen no disponible
  </text>
</svg>
  `;
}

// Manejar mensajes desde el cliente
self.addEventListener('message', event => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_URLS':
      if (payload.urls) {
        cacheUrls(payload.urls);
      }
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches();
      break;
      
    default:
      console.log('[SW] Unknown message type:', type);
  }
});

// Cache URLs específicas
async function cacheUrls(urls) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.addAll(urls);
    console.log('[SW] Cached URLs:', urls);
  } catch (error) {
    console.error('[SW] Failed to cache URLs:', error);
  }
}

// Limpiar todos los caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('[SW] All caches cleared');
  } catch (error) {
    console.error('[SW] Failed to clear caches:', error);
  }
}

// Notificar al cliente sobre actualizaciones
function notifyClients(message) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(message);
    });
  });
}

console.log('[SW] Service Worker loaded');