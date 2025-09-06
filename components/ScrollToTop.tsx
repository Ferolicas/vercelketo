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
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Scroll Position:', {
          'window.scrollY': window.scrollY,
          'window.pageYOffset': window.pageYOffset,
          'documentElement.scrollTop': document.documentElement.scrollTop,
          'body.scrollTop': document.body.scrollTop,
          'final scrollY': scrollY
        })
      }
      
      const shouldShow = scrollY > 50 // Reducido a 50px para que sea más fácil de activar
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🎯 Should show button: ${shouldShow} (scroll: ${scrollY}px)`)
      }
      
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
    // Múltiples métodos para scroll to top para máxima compatibilidad
    const scrollToTopMethods = [
      () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      () => window.scrollTo(0, 0),
      () => document.documentElement.scrollTop = 0,
      () => document.body.scrollTop = 0
    ]

    // Intentar cada método hasta que uno funcione
    for (const method of scrollToTopMethods) {
      try {
        method()
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Scroll to top executed successfully')
        }
        break
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Scroll method failed, trying next:', error)
        }
      }
    }
  }

  // No renderizar si no está visible
  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95"
      aria-label="Volver arriba"
      title="Volver arriba"
    >
      <ArrowUp size={20} />
    </button>
  )
}