'use client'

import { memo, useEffect, useRef } from 'react'
import InContentAd from './InContentAd'
import AdOptimizer from './AdOptimizer'

interface InArticleAdsProps {
  content: string
  adSlots: string[]
  className?: string
}

function InArticleAds({ content, adSlots, className = '' }: InArticleAdsProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current || !content || adSlots.length === 0) return

    // Buscar párrafos en el contenido
    const paragraphs = contentRef.current.querySelectorAll('p')
    const totalParagraphs = paragraphs.length

    // Determinar posiciones óptimas para anuncios
    const getAdPositions = () => {
      if (totalParagraphs < 3) return []
      
      const positions = []
      const minDistance = 3 // Mínimo 3 párrafos entre anuncios
      
      // Primer anuncio después del párrafo 2-3
      if (totalParagraphs >= 3) {
        positions.push(Math.min(2, Math.floor(totalParagraphs * 0.2)))
      }
      
      // Segundo anuncio en el medio
      if (totalParagraphs >= 6 && adSlots.length > 1) {
        positions.push(Math.floor(totalParagraphs * 0.5))
      }
      
      // Tercer anuncio hacia el final
      if (totalParagraphs >= 9 && adSlots.length > 2) {
        positions.push(Math.floor(totalParagraphs * 0.8))
      }
      
      return positions.filter((pos, index, arr) => {
        // Asegurar distancia mínima entre anuncios
        return index === 0 || Math.abs(pos - arr[index - 1]) >= minDistance
      })
    }

    const adPositions = getAdPositions()

    // Insertar anuncios en las posiciones calculadas
    adPositions.forEach((position, index) => {
      if (index >= adSlots.length) return
      
      const targetParagraph = paragraphs[position]
      if (!targetParagraph) return

      const adContainer = document.createElement('div')
      adContainer.innerHTML = `
        <div data-ad-container="${adSlots[index]}" class="my-8 py-4 border-t border-b border-gray-200">
          <div class="text-center text-xs text-gray-400 mb-3 uppercase tracking-wide">
            Publicidad
          </div>
          <div class="flex justify-center">
            <div class="w-full max-w-2xl">
              <!-- Anuncio se insertará aquí via React -->
            </div>
          </div>
        </div>
      `
      
      targetParagraph.parentNode?.insertBefore(adContainer, targetParagraph.nextSibling)
    })

  }, [content, adSlots])

  return (
    <div ref={contentRef} className={className}>
      {/* Renderizar contenido con HTML */}
      <div dangerouslySetInnerHTML={{ __html: content }} />
      
      {/* Renderizar anuncios optimizados */}
      {adSlots.map((adSlot, index) => (
        <div key={`ad-${index}`} data-ad-slot={adSlot} className="hidden">
          <AdOptimizer
            adSlot={adSlot}
            maxAdsPerPage={3}
            minScrollDistance={500 * (index + 1)}
            viewabilityThreshold={0.6}
          >
            <InContentAd 
              adSlot={adSlot}
              minViewportHeight={400}
            />
          </AdOptimizer>
        </div>
      ))}
    </div>
  )
}

export default memo(InArticleAds)