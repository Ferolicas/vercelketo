'use client'

import { memo, useEffect, useRef, useState } from 'react'
import ResponsiveAdUnit from './ResponsiveAdUnit'

interface InContentAdProps {
  adSlot: string
  insertAfterParagraph?: number
  className?: string
  minViewportHeight?: number
}

function InContentAd({ 
  adSlot, 
  insertAfterParagraph = 3,
  className = '',
  minViewportHeight = 600
}: InContentAdProps) {
  const [shouldShow, setShouldShow] = useState(false)
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Solo mostrar anuncio en viewport suficientemente grande
    const checkViewport = () => {
      setShouldShow(window.innerHeight >= minViewportHeight)
    }

    checkViewport()
    window.addEventListener('resize', checkViewport)
    
    return () => window.removeEventListener('resize', checkViewport)
  }, [minViewportHeight])

  useEffect(() => {
    if (!shouldShow || !adRef.current) return

    // Lazy loading cuando el anuncio esté cerca del viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // El anuncio está visible, se puede cargar
            observer.unobserve(entry.target)
          }
        })
      },
      { 
        rootMargin: '50px 0px',
        threshold: 0.1 
      }
    )

    observer.observe(adRef.current)
    
    return () => observer.disconnect()
  }, [shouldShow])

  if (!shouldShow) {
    return null
  }

  return (
    <div 
      ref={adRef}
      className={`my-8 border-t border-b border-gray-200 py-4 ${className}`}
    >
      <div className="text-center text-xs text-gray-400 mb-2 uppercase tracking-wide">
        Publicidad
      </div>
      <ResponsiveAdUnit 
        adSlot={adSlot}
        minHeight={90}
        maxHeight={280}
        className="max-w-2xl mx-auto"
      />
    </div>
  )
}

export default memo(InContentAd)