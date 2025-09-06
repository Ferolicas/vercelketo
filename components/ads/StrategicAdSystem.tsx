'use client'

import { useState, useEffect, useRef } from 'react'

interface AdConfig {
  position: 'hero-banner' | 'content-inline' | 'sidebar-sticky' | 'between-sections' | 'footer' | 'mobile-interstitial'
  priority: 'high' | 'medium' | 'low'
  frequency: number // veces por página
  minViewTime: number // segundos antes de mostrar
  viewportThreshold: number // % de visibilidad para contar impresión
  maxPerSession: number // máximo por sesión de usuario
  targeting: {
    pageTypes: string[]
    categories: string[]
    timeOnPage?: number
    scrollDepth?: number
  }
  adSense: {
    slot: string
    format: 'auto' | 'rectangle' | 'banner' | 'leaderboard' | 'skyscraper'
    responsive: boolean
  }
  placement: {
    afterElement?: string
    beforeElement?: string
    replaceElement?: string
    insertAfterParagraph?: number
  }
}

interface StrategicAdSystemProps {
  pageType: 'home' | 'recipe' | 'blog' | 'products' | 'forum'
  category?: string
  adConfigs: AdConfig[]
  enableUserExperienceOptimization?: boolean
}

// Configuraciones optimizadas de anuncios por tipo de página
const defaultAdConfigs: Record<string, AdConfig[]> = {
  recipe: [
    {
      position: 'hero-banner',
      priority: 'high',
      frequency: 1,
      minViewTime: 3,
      viewportThreshold: 50,
      maxPerSession: 2,
      targeting: {
        pageTypes: ['recipe'],
        categories: ['all'],
        timeOnPage: 10
      },
      adSense: {
        slot: 'recipe-hero-banner',
        format: 'leaderboard',
        responsive: true
      },
      placement: {
        afterElement: 'recipe-hero'
      }
    },
    {
      position: 'content-inline',
      priority: 'high',
      frequency: 2,
      minViewTime: 15,
      viewportThreshold: 70,
      maxPerSession: 3,
      targeting: {
        pageTypes: ['recipe'],
        categories: ['all'],
        scrollDepth: 25
      },
      adSense: {
        slot: 'recipe-content-1',
        format: 'rectangle',
        responsive: true
      },
      placement: {
        insertAfterParagraph: 2
      }
    },
    {
      position: 'sidebar-sticky',
      priority: 'medium',
      frequency: 1,
      minViewTime: 10,
      viewportThreshold: 30,
      maxPerSession: 1,
      targeting: {
        pageTypes: ['recipe'],
        categories: ['all'],
        timeOnPage: 20
      },
      adSense: {
        slot: 'recipe-sidebar-sticky',
        format: 'skyscraper',
        responsive: false
      },
      placement: {
        replaceElement: 'sidebar-ad-slot'
      }
    }
  ],
  home: [
    {
      position: 'hero-banner',
      priority: 'medium',
      frequency: 1,
      minViewTime: 5,
      viewportThreshold: 60,
      maxPerSession: 1,
      targeting: {
        pageTypes: ['home'],
        categories: ['all']
      },
      adSense: {
        slot: 'home-hero-banner',
        format: 'banner',
        responsive: true
      },
      placement: {
        afterElement: 'hero-section'
      }
    },
    {
      position: 'between-sections',
      priority: 'high',
      frequency: 2,
      minViewTime: 8,
      viewportThreshold: 80,
      maxPerSession: 3,
      targeting: {
        pageTypes: ['home'],
        categories: ['all'],
        scrollDepth: 40
      },
      adSense: {
        slot: 'home-between-sections',
        format: 'rectangle',
        responsive: true
      },
      placement: {
        afterElement: 'featured-categories'
      }
    }
  ]
}

export default function StrategicAdSystem({ 
  pageType, 
  category,
  adConfigs,
  enableUserExperienceOptimization = true 
}: StrategicAdSystemProps) {
  const [visibleAds, setVisibleAds] = useState<Set<string>>(new Set())
  const [sessionAdCount, setSessionAdCount] = useState<Record<string, number>>({})
  const [userMetrics, setUserMetrics] = useState({
    timeOnPage: 0,
    scrollDepth: 0,
    interactionCount: 0
  })\n  const observerRef = useRef<IntersectionObserver | null>(null)\n  const adsRef = useRef<Map<string, HTMLElement>>(new Map())\n\n  // Tracking de métricas del usuario\n  useEffect(() => {\n    const startTime = Date.now()\n    let maxScroll = 0\n    let interactions = 0\n\n    const updateTimeOnPage = () => {\n      setUserMetrics(prev => ({\n        ...prev,\n        timeOnPage: Math.floor((Date.now() - startTime) / 1000)\n      }))\n    }\n\n    const updateScrollDepth = () => {\n      const scrollPercent = Math.round(\n        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100\n      )\n      if (scrollPercent > maxScroll) {\n        maxScroll = scrollPercent\n        setUserMetrics(prev => ({ ...prev, scrollDepth: scrollPercent }))\n      }\n    }\n\n    const trackInteractions = () => {\n      interactions++\n      setUserMetrics(prev => ({ ...prev, interactionCount: interactions }))\n    }\n\n    // Timers y event listeners\n    const timeTimer = setInterval(updateTimeOnPage, 1000)\n    window.addEventListener('scroll', updateScrollDepth)\n    document.addEventListener('click', trackInteractions)\n    document.addEventListener('keydown', trackInteractions)\n\n    return () => {\n      clearInterval(timeTimer)\n      window.removeEventListener('scroll', updateScrollDepth)\n      document.removeEventListener('click', trackInteractions)\n      document.removeEventListener('keydown', trackInteractions)\n    }\n  }, [])\n\n  // Sistema de observación de visibilidad\n  useEffect(() => {\n    observerRef.current = new IntersectionObserver(\n      (entries) => {\n        entries.forEach((entry) => {\n          const adId = entry.target.getAttribute('data-ad-id')\n          if (!adId) return\n\n          const config = adConfigs.find(c => c.adSense.slot === adId)\n          if (!config) return\n\n          const visibilityRatio = entry.intersectionRatio * 100\n          \n          if (visibilityRatio >= config.viewportThreshold) {\n            // Ad es visible según criterios\n            setTimeout(() => {\n              setVisibleAds(prev => new Set([...prev, adId]))\n              \n              // Analytics tracking\n              if (typeof window !== 'undefined' && (window as any).gtag) {\n                (window as any).gtag('event', 'ad_impression', {\n                  ad_slot: adId,\n                  ad_position: config.position,\n                  page_type: pageType,\n                  time_on_page: userMetrics.timeOnPage,\n                  scroll_depth: userMetrics.scrollDepth\n                })\n              }\n            }, config.minViewTime * 1000)\n          }\n        })\n      },\n      {\n        threshold: [0.3, 0.5, 0.7, 0.9]\n      }\n    )\n\n    return () => {\n      observerRef.current?.disconnect()\n    }\n  }, [adConfigs, pageType, userMetrics])\n\n  // Decidir qué anuncios mostrar basado en métricas del usuario\n  const shouldShowAd = (config: AdConfig): boolean => {\n    // Verificar límites de sesión\n    if (sessionAdCount[config.adSense.slot] >= config.maxPerSession) {\n      return false\n    }\n\n    // Verificar targeting\n    if (config.targeting.pageTypes.length > 0 && !config.targeting.pageTypes.includes(pageType)) {\n      return false\n    }\n\n    if (config.targeting.timeOnPage && userMetrics.timeOnPage < config.targeting.timeOnPage) {\n      return false\n    }\n\n    if (config.targeting.scrollDepth && userMetrics.scrollDepth < config.targeting.scrollDepth) {\n      return false\n    }\n\n    // UX Optimization: No saturar al usuario\n    if (enableUserExperienceOptimization) {\n      const totalVisibleAds = visibleAds.size\n      if (totalVisibleAds >= 3 && config.priority === 'low') {\n        return false\n      }\n      if (totalVisibleAds >= 5 && config.priority === 'medium') {\n        return false\n      }\n    }\n\n    return true\n  }\n\n  // Componente de anuncio individual\n  const AdUnit = ({ config }: { config: AdConfig }) => {\n    const [isLoaded, setIsLoaded] = useState(false)\n    const adRef = useRef<HTMLDivElement>(null)\n\n    useEffect(() => {\n      if (adRef.current && observerRef.current) {\n        observerRef.current.observe(adRef.current)\n      }\n\n      return () => {\n        if (adRef.current && observerRef.current) {\n          observerRef.current.unobserve(adRef.current)\n        }\n      }\n    }, [])\n\n    useEffect(() => {\n      if (visibleAds.has(config.adSense.slot) && !isLoaded) {\n        // Cargar anuncio de AdSense\n        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {\n          try {\n            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})\n            setIsLoaded(true)\n            \n            // Actualizar contador de sesión\n            setSessionAdCount(prev => ({\n              ...prev,\n              [config.adSense.slot]: (prev[config.adSense.slot] || 0) + 1\n            }))\n          } catch (error) {\n            console.error('Error loading AdSense ad:', error)\n          }\n        }\n      }\n    }, [visibleAds, config.adSense.slot, isLoaded])\n\n    if (!shouldShowAd(config)) {\n      return null\n    }\n\n    const getAdStyles = () => {\n      switch (config.position) {\n        case 'hero-banner':\n          return 'my-8 text-center'\n        case 'content-inline':\n          return 'my-12 p-4 bg-gray-50 rounded-lg border border-gray-200'\n        case 'sidebar-sticky':\n          return 'sticky top-4 mb-6'\n        case 'between-sections':\n          return 'my-16 py-8 border-t border-b border-gray-200'\n        case 'footer':\n          return 'mt-8 pt-8 border-t border-gray-200'\n        case 'mobile-interstitial':\n          return 'fixed inset-x-4 top-1/2 transform -translate-y-1/2 z-50 bg-white rounded-lg shadow-2xl p-4 md:hidden'\n        default:\n          return 'my-6'\n      }\n    }\n\n    return (\n      <div\n        ref={adRef}\n        data-ad-id={config.adSense.slot}\n        className={`strategic-ad ${getAdStyles()}`}\n        data-ad-position={config.position}\n      >\n        {/* Label discreto para anuncios */}\n        <div className=\"text-xs text-gray-400 mb-2 text-center\">\n          Publicidad\n        </div>\n        \n        {/* AdSense Ad Unit */}\n        <ins\n          className=\"adsbygoogle\"\n          style={{ display: 'block' }}\n          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}\n          data-ad-slot={config.adSense.slot}\n          data-ad-format={config.adSense.responsive ? 'auto' : config.adSense.format}\n          data-full-width-responsive={config.adSense.responsive ? 'true' : 'false'}\n        />\n        \n        {/* Placeholder mientras carga */}\n        {!isLoaded && (\n          <div className=\"bg-gray-100 rounded-lg p-8 text-center\">\n            <div className=\"animate-pulse\">\n              <div className=\"bg-gray-300 h-4 rounded mb-2 mx-auto w-32\"></div>\n              <div className=\"bg-gray-300 h-20 rounded\"></div>\n            </div>\n          </div>\n        )}\n      </div>\n    )\n  }\n\n  // Obtener configuraciones para el tipo de página actual\n  const currentConfigs = adConfigs.length > 0 ? adConfigs : defaultAdConfigs[pageType] || []\n\n  return (\n    <>\n      {currentConfigs.map((config, index) => (\n        <AdUnit key={`${config.adSense.slot}-${index}`} config={config} />\n      ))}\n      \n      {/* AdSense Auto Ads Script */}\n      <script\n        async\n        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}\n        crossOrigin=\"anonymous\"\n      />\n    </>\n  )\n}\n\n// Hook para usar el sistema estratégico de anuncios\nexport const useStrategicAds = (pageType: string, category?: string) => {\n  const [adMetrics, setAdMetrics] = useState({\n    impressions: 0,\n    clicks: 0,\n    revenue: 0,\n    ctr: 0\n  })\n\n  const trackAdClick = (adSlot: string) => {\n    setAdMetrics(prev => ({ ...prev, clicks: prev.clicks + 1 }))\n    \n    if (typeof window !== 'undefined' && (window as any).gtag) {\n      (window as any).gtag('event', 'ad_click', {\n        ad_slot: adSlot,\n        page_type: pageType,\n        category: category\n      })\n    }\n  }\n\n  const trackAdImpression = (adSlot: string) => {\n    setAdMetrics(prev => ({ ...prev, impressions: prev.impressions + 1 }))\n  }\n\n  return {\n    adMetrics,\n    trackAdClick,\n    trackAdImpression\n  }\n}