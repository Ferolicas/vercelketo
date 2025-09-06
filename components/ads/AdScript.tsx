'use client'

import { memo } from 'react'
import Script from 'next/script'

interface AdScriptProps {
  clientId?: string
}

function AdScript({ clientId }: AdScriptProps) {
  const adsenseClient = clientId || process.env.NEXT_PUBLIC_ADSENSE_CLIENT

  if (!adsenseClient) {
    // Solo mostrar warning en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.warn('AdSense client ID no encontrado - normal en desarrollo')
    }
    return null
  }

  return (
    <>
      <Script
        id="adsense-script"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onLoad={() => {
          if (process.env.NODE_ENV === 'development') {
            console.log('AdSense script cargado correctamente')
          }
        }}
        onError={(error) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error cargando AdSense:', error)
          }
        }}
      />
      
      <Script
        id="adsense-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.adsbygoogle = window.adsbygoogle || [];
            
            // Configuración global de AdSense con IDs reales
            window.adsenseConfig = {
              clientId: '${adsenseClient}',
              publisherId: '${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || adsenseClient}',
              clientIdNumber: '${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''}',
              enableLazyLoading: true,
              enableSingleRequest: true,
              enableAutoRefresh: false,
              refreshInterval: 0
            };
            
            // Funciones de utilidad para métricas
            window.trackAdPerformance = function(adSlot, event, data) {
              if (typeof gtag !== 'undefined') {
                gtag('event', 'ad_' + event, {
                  ad_slot: adSlot,
                  ...data
                });
              }
            };
            
            // Optimización de rendimiento
            window.optimizeAdLoading = function() {
              const ads = document.querySelectorAll('.adsbygoogle');
              ads.forEach((ad, index) => {
                // Lazy loading para anuncios no visibles
                if (!ad.hasAttribute('data-initialized')) {
                  const observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                      if (entry.isIntersecting) {
                        try {
                          (adsbygoogle = window.adsbygoogle || []).push({});
                          ad.setAttribute('data-initialized', 'true');
                          observer.unobserve(ad);
                        } catch (error) {
                          if (${process.env.NODE_ENV === 'development'}) {
                            console.error('Error inicializando anuncio:', error);
                          }
                        }
                      }
                    });
                  }, { 
                    rootMargin: '50px',
                    threshold: 0.1 
                  });
                  
                  observer.observe(ad);
                }
              });
            };
            
            // Auto-ejecutar optimización cuando el DOM esté listo
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', window.optimizeAdLoading);
            } else {
              window.optimizeAdLoading();
            }
          `
        }}
      />
    </>
  )
}

export default memo(AdScript)