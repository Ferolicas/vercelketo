'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Función para verificar scroll desde múltiples fuentes
    const checkScrollPosition = () => {
      // Múltiples métodos para obtener la posición de scroll
      const scrollY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
      
      console.log('📊 Scroll Position:', {
        'window.scrollY': window.scrollY,
        'window.pageYOffset': window.pageYOffset,
        'documentElement.scrollTop': document.documentElement.scrollTop,
        'body.scrollTop': document.body.scrollTop,
        'final scrollY': scrollY
      })
      
      const shouldShow = scrollY > 50 // Reducido a 50px para que sea más fácil de activar
      
      console.log(`🎯 Should show button: ${shouldShow} (scroll: ${scrollY}px)`)
      
      setIsVisible(shouldShow)
    }

    // Verificar posición inicial después de un pequeño delay
    const initialCheck = setTimeout(checkScrollPosition, 100)

    // Event listeners en diferentes elementos para máxima compatibilidad
    const handleScroll = () => {
      requestAnimationFrame(checkScrollPosition)
    }

    // Múltiples listeners para asegurar compatibilidad
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('scroll', handleScroll, { passive: true })
    document.body.addEventListener('scroll', handleScroll, { passive: true })
    
    // Para detectar scroll en contenedores específicos
    const rootElement = document.querySelector('#__next') || document.querySelector('main') || document.body
    if (rootElement && rootElement !== document.body) {
      rootElement.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      clearTimeout(initialCheck)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('scroll', handleScroll)
      document.body.removeEventListener('scroll', handleScroll)
      if (rootElement && rootElement !== document.body) {
        rootElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const scrollToTop = () => {
    console.log('🔝 Scrolling to top...')
    
    // Múltiples métodos para scroll to top
    if (window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    
    // Fallbacks
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    
    // Reset para contenedores específicos
    const rootElement = document.querySelector('#__next') || document.querySelector('main')
    if (rootElement) {
      rootElement.scrollTop = 0
    }
  }

  console.log('🔄 Component render - isVisible:', isVisible)

  // Siempre renderizar el botón, pero controlarlo con CSS
  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-6 right-6 z-[9999]
        bg-emerald-600 hover:bg-emerald-700 text-white 
        p-3 rounded-full shadow-lg 
        transition-all duration-300 hover:scale-110 
        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
        ${isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
        }
      `}
      aria-label="Volver arriba"
      style={{
        display: 'block', // Forzar display
        visibility: isVisible ? 'visible' : 'hidden' // Doble seguridad
      }}
    >
      <ArrowUp size={24} />
    </button>
  )
}