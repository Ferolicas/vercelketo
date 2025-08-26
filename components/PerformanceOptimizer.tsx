'use client'

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

interface PerformanceOptimizerProps {
  enablePreloading?: boolean;
  enableServiceWorker?: boolean;
  enableImageOptimization?: boolean;
  enableResourceHints?: boolean;
}

export default function PerformanceOptimizer({
  enablePreloading = true,
  enableServiceWorker = true,
  enableImageOptimization = true,
  enableResourceHints = true
}: PerformanceOptimizerProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  });
  
  const router = useRouter();

  // Medición de Core Web Vitals
  const measureWebVitals = useCallback(() => {
    if (typeof window === 'undefined') return;

    // First Contentful Paint (FCP)
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
    }

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Time to First Byte (TTFB)
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigationEntry) {
          const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
          setMetrics(prev => ({ ...prev, ttfb }));
        }

      } catch (error) {
        console.error('Error setting up performance observers:', error);
      }
    }
  }, []);

  // Precargar recursos críticos
  const preloadCriticalResources = useCallback(() => {
    if (!enablePreloading) return;

    const criticalImages = [
      '/og-image.jpg',
      '/favicon.ico'
    ];

    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];

    // Precargar imágenes críticas
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Precargar fuentes críticas
    criticalFonts.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }, [enablePreloading]);

  // Registrar Service Worker
  const registerServiceWorker = useCallback(async () => {
    if (!enableServiceWorker || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nuevo service worker disponible
              console.log('New service worker available');
            }
          });
        }
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }, [enableServiceWorker]);

  // Optimización lazy loading de imágenes
  const optimizeImageLoading = useCallback(() => {
    if (!enableImageOptimization) return;

    // Intersection Observer para lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observar todas las imágenes con data-src
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }, [enableImageOptimization]);

  // Agregar resource hints
  const addResourceHints = useCallback(() => {
    if (!enableResourceHints) return;

    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
      { rel: 'dns-prefetch', href: '//cdn.sanity.io' },
      { rel: 'dns-prefetch', href: '//www.googletagmanager.com' },
      { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.crossOrigin) {
        link.crossOrigin = hint.crossOrigin;
      }
      document.head.appendChild(link);
    });
  }, [enableResourceHints]);

  // Prefetch de rutas probables
  const prefetchRoutes = useCallback(() => {
    if (!enablePreloading) return;

    const probableRoutes = [
      '/recetas-keto',
      '/tienda-keto',
      '/blog'
    ];

    probableRoutes.forEach(route => {
      router.prefetch(route as any);
    });
  }, [enablePreloading, router]);

  // Optimizar scroll performance
  const optimizeScrollPerformance = useCallback(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Lazy load visible elements
          optimizeImageLoading();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Usar passive listener para mejor performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [optimizeImageLoading]);

  // Detectar y reportar problemas de rendimiento
  const detectPerformanceIssues = useCallback(() => {
    const issues: string[] = [];

    // Detectar images sin lazy loading
    const images = document.querySelectorAll('img:not([loading="lazy"])');
    if (images.length > 5) {
      issues.push(`${images.length} images without lazy loading detected`);
    }

    // Detectar CSS crítico bloqueante
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([media])');
    if (stylesheets.length > 3) {
      issues.push(`${stylesheets.length} potentially render-blocking stylesheets detected`);
    }

    // Detectar JavaScript bloqueante
    const scripts = document.querySelectorAll('script:not([async]):not([defer])');
    if (scripts.length > 2) {
      issues.push(`${scripts.length} potentially render-blocking scripts detected`);
    }

    // Reportar Core Web Vitals problemáticos
    if (metrics.lcp && metrics.lcp > 2500) {
      issues.push(`LCP is ${Math.round(metrics.lcp)}ms (should be < 2500ms)`);
    }

    if (metrics.fid && metrics.fid > 100) {
      issues.push(`FID is ${Math.round(metrics.fid)}ms (should be < 100ms)`);
    }

    if (metrics.cls && metrics.cls > 0.1) {
      issues.push(`CLS is ${metrics.cls.toFixed(3)} (should be < 0.1)`);
    }

    if (issues.length > 0 && process.env.NODE_ENV === 'development') {
      console.warn('Performance issues detected:', issues);
    }

    return issues;
  }, [metrics]);

  // Optimizar recursos no utilizados
  const removeUnusedResources = useCallback(() => {
    // Remover event listeners no utilizados
    const unusedListeners = ['resize', 'orientationchange'];
    
    unusedListeners.forEach(eventType => {
      const listeners = document.querySelectorAll(`[data-listener="${eventType}"]`);
      listeners.forEach(element => {
        element.removeAttribute(`data-listener`);
      });
    });

    // Limpiar algunos timers conocidos (simplificado para evitar problemas de tipos)
    for (let i = 1; i <= 1000; i++) {
      clearTimeout(i);
      clearInterval(i);
    }
  }, []);

  useEffect(() => {
    // Inicializar optimizaciones
    const initOptimizations = async () => {
      // Esperar a que el DOM esté completamente cargado
      if (document.readyState !== 'complete') {
        await new Promise(resolve => {
          window.addEventListener('load', resolve, { once: true });
        });
      }

      // Ejecutar optimizaciones
      measureWebVitals();
      preloadCriticalResources();
      await registerServiceWorker();
      addResourceHints();
      prefetchRoutes();
      
      // Optimizaciones que requieren interacción
      setTimeout(() => {
        optimizeImageLoading();
        const cleanupScroll = optimizeScrollPerformance();
        
        // Limpiar cuando el componente se desmonte
        return cleanupScroll;
      }, 100);

      // Detectar problemas después de la carga inicial
      setTimeout(() => {
        detectPerformanceIssues();
        removeUnusedResources();
      }, 2000);
    };

    initOptimizations();

    // Cleanup al desmontar
    return () => {
      // Limpiar observers y listeners si es necesario
    };
  }, [
    measureWebVitals,
    preloadCriticalResources,
    registerServiceWorker,
    addResourceHints,
    prefetchRoutes,
    optimizeImageLoading,
    optimizeScrollPerformance,
    detectPerformanceIssues,
    removeUnusedResources
  ]);

  // Solo mostrar métricas en desarrollo
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white text-xs p-2 rounded z-50 font-mono">
        <div>FCP: {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : '...'}</div>
        <div>LCP: {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : '...'}</div>
        <div>FID: {metrics.fid ? `${Math.round(metrics.fid)}ms` : '...'}</div>
        <div>CLS: {metrics.cls ? metrics.cls.toFixed(3) : '...'}</div>
        <div>TTFB: {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : '...'}</div>
      </div>
    );
  }

  return null;
}