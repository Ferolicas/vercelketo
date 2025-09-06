'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  BookOpenIcon, 
  ShoppingCartIcon, 
  StarIcon as StarSolid,
  ClockIcon,
  CheckCircleIcon,
  FireIcon,
  BoltIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import PurchaseModal from '../PurchaseModal'

interface BookUpsellWidgetProps {
  position: 'inline' | 'floating' | 'exit-intent' | 'scroll-trigger'
  recipeCategory?: string
  trigger?: 'time' | 'scroll' | 'exit' | 'immediate'
  priority?: 'high' | 'medium' | 'low'
  context?: string
}

// Book product data
const bookProduct = {
  _id: 'guia-completa-keto-2025',
  name: 'Guía Completa Keto 2025 - El Método Definitivo',
  description: 'El ÚNICO libro que necesitas para dominar la dieta cetogénica y transformar tu cuerpo. +200 recetas, plan de 30 días, calculadora de macros y mucho más.',
  price: 29.99,
  originalPrice: 89.00,
  image: '/book-cover-3d.jpg',
  includes: [
    'Más de 200 recetas keto probadas',
    'Plan completo de menús para 30 días',
    'Calculadora de macros personalizada',
    'Guía de alimentos permitidos',
    'Estrategias para superar mesetas',
    'BONUS: Guía de ejercicios keto',
    'BONUS: 50 recetas express',
    'BONUS: Lista de compras inteligente',
    'BONUS: Tracker digital de progreso',
    'Acceso inmediato tras la compra',
    'Garantía de satisfacción de 30 días'
  ]
}

const contextualMessages = {
  'desayunos': {
    headline: '¿Te encantan estos desayunos keto?',
    subtext: '¡Tengo 50 desayunos MÁS como este en mi método completo!',
    benefit: '50+ desayunos keto variados'
  },
  'postres': {
    headline: '¿Quieres más postres sin culpa?',
    subtext: 'En mi libro encontrarás 50 postres keto que no te harán salir de cetosis',
    benefit: '50+ postres sin azúcar'
  },
  'platos-principales': {
    headline: '¿Buscas más comidas como esta?',
    subtext: 'Tengo 60 platos principales keto igual de deliciosos',
    benefit: '60+ platos principales'
  },
  'general': {
    headline: '¿Te gustó esta receta?',
    subtext: 'En mi método completo tienes 200+ recetas como esta',
    benefit: '200+ recetas probadas'
  }
}

export default function BookUpsellWidget({ 
  position, 
  recipeCategory = 'general',
  trigger = 'immediate',
  priority = 'medium',
  context 
}: BookUpsellWidgetProps) {
  const [showModal, setShowModal] = useState(false)
  const [isVisible, setIsVisible] = useState(position === 'inline')
  const [isDismissed, setIsDismissed] = useState(false)

  const contextMsg = contextualMessages[recipeCategory as keyof typeof contextualMessages] || contextualMessages.general

  const handlePurchase = () => {
    setShowModal(true)
    
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'recipe_book_upsell_click', {
        currency: 'EUR',
        value: bookProduct.price,
        position: position,
        category: recipeCategory,
        context: context || 'recipe_page'
      })
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }

  if (isDismissed) return null

  // Inline version (dentro del contenido de la receta)
  if (position === 'inline') {
    return (
      <>
        <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-3xl p-8 border-2 border-orange-200 shadow-xl">
          {/* Urgency header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse mb-4">
              <ClockIcon className="h-4 w-4 mr-2" />
              🔥 OFERTA POR TIEMPO LIMITADO
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
              {contextMsg.headline}
            </h3>
            <p className="text-lg text-gray-700">
              {contextMsg.subtext}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Book visual */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl p-6 transform rotate-3 shadow-2xl">
                  <div className="text-4xl mb-3">📖</div>
                  <h4 className="text-white font-black text-xl mb-2">MÉTODO KETO COMPLETO</h4>
                  <div className="text-green-100 text-sm">
                    ✅ {contextMsg.benefit}<br/>
                    ✅ Plan personalizado 30 días<br/>
                    ✅ Calculadora de macros<br/>
                    ✅ 4 BONUS valorados en €55
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 bg-red-500 text-white px-3 py-2 rounded-full text-sm font-bold animate-bounce">
                  67% OFF
                </div>
              </div>
            </div>

            {/* Offer details */}
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <span className="text-3xl font-bold text-red-600">€29.99</span>
                  <span className="text-xl text-gray-500 line-through">€89.00</span>
                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                    Ahorras €59
                  </span>
                </div>
                
                <div className="flex justify-center md:justify-start text-yellow-400 mb-3">
                  {[1,2,3,4,5].map(i => (
                    <StarIcon key={i} className="h-5 w-5" />
                  ))}
                  <span className="ml-2 text-gray-700 text-sm font-semibold">4.9/5 (2,000+ valoraciones)</span>
                </div>

                <ul className="text-gray-700 space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                    No son solo recetas, es el MÉTODO completo
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                    Plan personalizado para TU cuerpo y objetivos  
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                    Estrategias para superar mesetas de peso
                  </li>
                </ul>
              </div>

              <button
                onClick={handlePurchase}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
              >
                <ShoppingCartIcon className="h-6 w-6 mr-3" />
                CONSEGUIR MÉTODO COMPLETO
              </button>
              
              <div className="text-center mt-3 text-sm text-gray-600">
                💳 Pago seguro • ⚡ Descarga inmediata • 🔄 Garantía 30 días
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <PurchaseModal
            product={bookProduct}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    )
  }

  // Floating version (sticky sidebar)
  if (position === 'floating') {
    return (
      <>
        <div className="sticky top-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">¡Oferta Especial!</h3>
                <p className="text-orange-100 text-sm">Solo para hoy</p>
              </div>
              <div className="text-2xl">🔥</div>
            </div>
          </div>

          <div className="p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">📖</div>
              <h4 className="font-black text-lg text-gray-900 mb-2">
                Mi Método Keto Completo
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                +200 recetas • Plan 30 días • Calculadora macros
              </p>
            </div>

            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold text-red-600">€29.99</span>
                <span className="text-lg text-gray-500 line-through">€89</span>
              </div>
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold mt-2">
                67% descuento HOY
              </div>
            </div>

            <button
              onClick={handlePurchase}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
            >
              <ShoppingCartIcon className="h-4 w-4 inline mr-2" />
              LO QUIERO AHORA
            </button>

            <div className="text-center mt-3">
              <div className="flex justify-center text-yellow-400">
                {[1,2,3,4,5].map(i => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </div>
              <p className="text-xs text-gray-600">4.9/5 • +2,000 valoraciones</p>
            </div>
          </div>
        </div>

        {showModal && (
          <PurchaseModal
            product={bookProduct}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    )
  }

  // Exit intent modal
  if (position === 'exit-intent' && isVisible) {
    return (
      <>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            </button>

            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🚨</div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">
                ¡Espera! ¿Te vas sin tu método completo?
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                Si te gustó esta receta, imagínate tener <strong>200+ recetas como esta</strong> + 
                el método completo para hacer keto correctamente.
              </p>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 mb-6">
                <div className="text-2xl mb-3">🎁</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Oferta Especial para ti
                </h3>
                <div className="flex items-center justify-center gap-4 mb-3">
                  <span className="text-3xl font-bold text-red-600">€29.99</span>
                  <span className="text-xl text-gray-500 line-through">€89.00</span>
                  <span className="bg-red-500 text-white px-3 py-2 rounded-full text-sm font-bold animate-pulse">
                    67% OFF
                  </span>
                </div>
                <p className="text-gray-700">Ahorras €59 - Solo válido HOY</p>
              </div>

              <button
                onClick={handlePurchase}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 mb-4"
              >
                <ShoppingCartIcon className="h-6 w-6 inline mr-3" />
                SÍ, QUIERO MI MÉTODO COMPLETO
              </button>

              <p className="text-sm text-gray-600">
                💳 Pago 100% seguro • ⚡ Descarga inmediata • 🛡️ Garantía 30 días
              </p>
            </div>
          </div>
        </div>

        {showModal && (
          <PurchaseModal
            product={bookProduct}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    )
  }

  return null
}