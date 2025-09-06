'use client'

import { memo, useEffect, useState } from 'react'
import Script from 'next/script'

interface AdSenseAutoAdsProps {
  clientId?: string
  enableAutoAds?: boolean
  enableManualControl?: boolean
  adDensity?: 'low' | 'medium' | 'high'
  adFormats?: {
    display: boolean
    inFeed: boolean
    inArticle: boolean
    matchedContent: boolean
    link: boolean
    multiplex: boolean
  }
  pageExclusions?: string[]
  className?: string
}

interface AdSenseConfig {
  enable_page_level_ads: boolean
  google_ad_client: string
  overlays?: {
    bottom: boolean
  }
  auto_ad_client?: string
}

declare global {
  interface Window {
    adsbygoogle: any[]
    googletag: any
    adSenseConfig?: AdSenseConfig
    adSensePerformance?: {
      [key: string]: {
        impressions: number
        clicks: number
        ctr: number
        revenue: number
        viewability: number
      }
    }
  }
}

function AdSenseAutoAds({
  clientId,
  enableAutoAds = true,
  enableManualControl = true,
  adDensity = 'medium',
  adFormats = {
    display: true,
    inFeed: true,
    inArticle: true,
    matchedContent: true,
    link: false,
    multiplex: true
  },
  pageExclusions = [],
  className = ''
}: AdSenseAutoAdsProps) {
  const [isConfigured, setIsConfigured] = useState(false)
  const [performanceData, setPerformanceData] = useState<any>({})
  const adsenseClient = clientId || process.env.NEXT_PUBLIC_ADSENSE_CLIENT

  useEffect(() => {
    if (!adsenseClient || typeof window === 'undefined') return

    // Verificar si la página actual está excluida
    const currentPath = window.location.pathname
    const isExcluded = pageExclusions.some(path => currentPath.includes(path))
    
    if (isExcluded) {
      console.log('AdSense Auto Ads disabled for this page:', currentPath)
      return
    }

    // Configurar AdSense Auto Ads
    const configureAutoAds = () => {
      try {
        // Configuración global de AdSense
        window.adSenseConfig = {
          enable_page_level_ads: enableAutoAds,
          google_ad_client: adsenseClient,
          overlays: {
            bottom: adFormats.display
          },
          auto_ad_client: adsenseClient
        }

        // Configurar densidad de anuncios
        const densityMap = {
          low: 0.3,
          medium: 0.6,
          high: 0.9
        }

        // Auto ads configuration
        if (window.adsbygoogle && enableAutoAds) {
          window.adsbygoogle.push({
            google_ad_client: adsenseClient,
            enable_page_level_ads: true,
            tag_partner: "site_kit"
          })

          // Configuración avanzada de Auto Ads
          window.adsbygoogle.push({
            google_ad_client: adsenseClient,
            enable_page_level_ads: true,
            page_level_ad_types: [
              ...(adFormats.display ? ['anchor'] : []),
              ...(adFormats.inFeed ? ['vignette'] : []),
            ],
            ad_density: densityMap[adDensity]
          })
        }

        setIsConfigured(true)
        console.log('AdSense Auto Ads configured successfully')
        
      } catch (error) {
        console.error('Error configuring AdSense Auto Ads:', error)
      }
    }

    // Configurar cuando el script esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', configureAutoAds)
    } else {
      configureAutoAds()
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', configureAutoAds)
    }
  }, [adsenseClient, enableAutoAds, adDensity, adFormats, pageExclusions])

  // Monitoring y control manual
  useEffect(() => {
    if (!enableManualControl || !isConfigured) return

    // Función para obtener métricas de rendimiento
    const getPerformanceMetrics = () => {
      try {
        // Simular métricas (en producción vendría de AdSense Reporting API)
        const metrics = {
          autoAds: {
            impressions: Math.floor(Math.random() * 1000) + 500,
            clicks: Math.floor(Math.random() * 50) + 10,
            ctr: (Math.random() * 3 + 1).toFixed(2),
            revenue: (Math.random() * 5 + 1).toFixed(2),
            viewability: (Math.random() * 30 + 70).toFixed(1)
          }
        }
        
        setPerformanceData(metrics)
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('adsense_performance', JSON.stringify(metrics))
        
      } catch (error) {
        console.error('Error getting performance metrics:', error)
      }
    }

    // Obtener métricas cada 30 minutos
    const metricsInterval = setInterval(getPerformanceMetrics, 30 * 60 * 1000)
    
    // Obtener métricas iniciales
    getPerformanceMetrics()
    
    return () => clearInterval(metricsInterval)
  }, [enableManualControl, isConfigured])

  // Funciones de control manual
  const toggleAutoAds = (enabled: boolean) => {
    if (typeof window !== 'undefined' && window.adSenseConfig) {
      window.adSenseConfig.enable_page_level_ads = enabled
      
      // Recargar configuración
      if (window.adsbygoogle) {
        window.adsbygoogle.push({
          google_ad_client: adsenseClient,
          enable_page_level_ads: enabled
        })
      }
      
      console.log(`Auto Ads ${enabled ? 'enabled' : 'disabled'}`)
    }
  }

  const adjustAdDensity = (density: 'low' | 'medium' | 'high') => {
    const densityMap = { low: 0.3, medium: 0.6, high: 0.9 }
    
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      window.adsbygoogle.push({
        google_ad_client: adsenseClient,
        enable_page_level_ads: true,
        ad_density: densityMap[density]
      })
      
      console.log(`Ad density adjusted to: ${density}`)
    }
  }

  if (!adsenseClient) {
    console.warn('AdSense client ID not found')
    return null
  }

  return (
    <>
      {/* AdSense Auto Ads Script */}
      <Script
        id="adsense-auto-ads"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('AdSense Auto Ads script loaded')
          setIsConfigured(true)
        }}
        onError={(error) => {
          console.error('Error loading AdSense Auto Ads:', error)
        }}
      />

      {/* Configuración Auto Ads */}
      <Script
        id="adsense-auto-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.adsbygoogle = window.adsbygoogle || [];
            
            // Configuración principal Auto Ads
            window.adsbygoogle.push({
              google_ad_client: "${adsenseClient}",
              enable_page_level_ads: ${enableAutoAds},
              tag_partner: "site_kit"
            });
            
            // Configuración avanzada
            window.adsbygoogle.push({
              google_ad_client: "${adsenseClient}",
              enable_page_level_ads: ${enableAutoAds},
              page_level_ad_types: [${
                Object.entries(adFormats)
                  .filter(([_, enabled]) => enabled)
                  .map(([format, _]) => {
                    const formatMap: { [key: string]: string } = {
                      display: 'anchor',
                      inFeed: 'vignette',
                      inArticle: 'auto',
                      matchedContent: 'matched_content',
                      multiplex: 'multiplex'
                    }
                    return `"${formatMap[format] || format}"`
                  })
                  .join(', ')
              }],
              ad_density: ${adDensity === 'low' ? 0.3 : adDensity === 'medium' ? 0.6 : 0.9}
            });

            // Control manual functions
            window.toggleAutoAds = function(enabled) {
              window.adsbygoogle.push({
                google_ad_client: "${adsenseClient}",
                enable_page_level_ads: enabled
              });
              console.log('Auto Ads ' + (enabled ? 'enabled' : 'disabled'));
            };

            window.adjustAdDensity = function(density) {
              const densityValue = density === 'low' ? 0.3 : density === 'medium' ? 0.6 : 0.9;
              window.adsbygoogle.push({
                google_ad_client: "${adsenseClient}",
                enable_page_level_ads: true,
                ad_density: densityValue
              });
              console.log('Ad density adjusted to: ' + density);
            };

            // Performance tracking
            window.trackAdSensePerformance = function() {
              // Esta función se puede expandir para integrar con AdSense Reporting API
              const performance = {
                timestamp: new Date().toISOString(),
                page: window.location.pathname,
                autoAdsEnabled: ${enableAutoAds},
                adDensity: "${adDensity}",
                formats: ${JSON.stringify(adFormats)}
              };
              
              console.log('AdSense Performance:', performance);
              
              // Enviar a analytics si está disponible
              if (typeof gtag !== 'undefined') {
                gtag('event', 'adsense_performance_check', {
                  event_category: 'monetization',
                  auto_ads_enabled: ${enableAutoAds},
                  ad_density: "${adDensity}",
                  custom_parameter_1: 'auto_ads_performance'
                });
              }
            };

            // Ejecutar tracking cada 5 minutos
            setInterval(window.trackAdSensePerformance, 5 * 60 * 1000);
          `
        }}
      />

      {/* Control Panel Debug (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && enableManualControl && (
        <div className={`fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg z-50 text-xs ${className}`}>
          <div className="mb-2 font-semibold">AdSense Auto Ads Control</div>
          
          <div className="space-y-2">
            <div>
              <strong>Status:</strong> {isConfigured ? '✅ Active' : '⏳ Loading'}
            </div>
            
            <div>
              <strong>Density:</strong> {adDensity}
              <div className="flex gap-1 mt-1">
                <button
                  onClick={() => adjustAdDensity('low')}
                  className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
                >
                  Low
                </button>
                <button
                  onClick={() => adjustAdDensity('medium')}
                  className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
                >
                  Med
                </button>
                <button
                  onClick={() => adjustAdDensity('high')}
                  className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
                >
                  High
                </button>
              </div>
            </div>
            
            <div>
              <strong>Auto Ads:</strong>
              <button
                onClick={() => toggleAutoAds(!enableAutoAds)}
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  enableAutoAds ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {enableAutoAds ? 'ON' : 'OFF'}
              </button>
            </div>

            {performanceData.autoAds && (
              <div className="border-t pt-2 mt-2">
                <div className="text-xs opacity-80">Performance (Est.):</div>
                <div>CTR: {performanceData.autoAds.ctr}%</div>
                <div>Revenue: €{performanceData.autoAds.revenue}</div>
                <div>Views: {performanceData.autoAds.viewability}%</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default memo(AdSenseAutoAds)