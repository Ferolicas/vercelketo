'use client'

import { useState } from 'react'
import { ShoppingCartIcon, BookOpenIcon } from '@heroicons/react/24/outline'

interface ForumConversionFunnelProps {
  position: 'header' | 'sidebar' | 'inline' | 'footer'
}

export default function ForumConversionFunnel({
  position = 'sidebar'
}: ForumConversionFunnelProps) {
  const [showModal, setShowModal] = useState(false)

  if (position === 'sidebar') {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 mb-8">
        <div className="text-center">
          <BookOpenIcon className="h-12 w-12 mx-auto text-green-600 mb-4" />
          <h3 className="font-bold text-lg text-gray-900 mb-2">
            ¿Te ayudan estas respuestas?
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Imagínate tener TODO mi conocimiento organizado en un método completo
          </p>
          
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            <ShoppingCartIcon className="h-5 w-5 inline mr-2" />
            Ver Método Completo
          </button>
          
          <div className="mt-3 text-center">
            <span className="text-lg font-bold text-green-600">€14.75</span>
            <span className="text-sm text-gray-500 line-through ml-2">€29.99</span>
          </div>
        </div>
      </div>
    )
  }

  return null
}