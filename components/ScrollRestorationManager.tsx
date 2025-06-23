'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function ScrollRestorationManager() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Clave única para cada ruta
    const routeKey = pathname + (searchParams.toString() ? '?' + searchParams.toString() : '')
    
    // Guardar posición actual antes de navegar
    const saveScrollPosition = () => {
      const positions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}')
      positions[routeKey] = window.scrollY
      sessionStorage.setItem('scrollPositions', JSON.stringify(positions))
    }

    // Restaurar posición si existe
    const restoreScrollPosition = () => {
      const positions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}')
      const savedPosition = positions[routeKey]
      
      if (savedPosition !== undefined) {
        // Usar requestAnimationFrame para asegurar que el DOM esté listo
        requestAnimationFrame(() => {
          window.scrollTo(0, savedPosition)
        })
      }
    }

    // Guardar posición cuando se va a cambiar de página
    const handleBeforeUnload = () => {
      saveScrollPosition()
    }

    // Restaurar posición cuando cambia la ruta
    restoreScrollPosition()

    // Agregar listeners
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    // Limpiar listeners
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [pathname, searchParams])

  // Este componente no renderiza nada
  return null
}