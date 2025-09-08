'use client'

import { memo, useState } from 'react'
import { BookOpen, Star, Users, Clock, Download, Shield, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface DigitalBook {
  id: string
  title: string
  description: string
  price: number
  originalPrice: number
  coverImage: string
  rating: number
  totalBuyers: number
  category: string
  features: string[]
  previewUrl?: string
}

interface BookRecommendationWidgetProps {
  recipeCategory: string
  className?: string
  position?: 'inline' | 'sidebar' | 'floating'
  priority?: 'high' | 'medium' | 'low'
}

// REAL DATA FROM SANITY - Only show actual products
const digitalBooks: DigitalBook[] = [
  {
    id: '83f184b6-1e92-4d97-ad0b-9273de28eadc',
    title: 'Planeta Keto - Guía Completa 2025',
    description: 'La guía más completa para dominar la dieta cetogénica con menús planificados, recetas deliciosas y resultados garantizados en 30 días.',
    price: 14.75,
    originalPrice: 29.99,
    coverImage: '/guia.png',
    rating: 4.8,
    totalBuyers: 10000,
    category: 'general',
    features: [
      'Calculadora de macros personalizada',
      '30 días de menús planificados',
      '4 listas de compra semanales',
      'Sistema Batch Cooking completo',
      'Plantillas de seguimiento'
    ]
  },
]

function BookRecommendationWidget({ 
  recipeCategory, 
  className = '', 
  position = 'inline',
  priority = 'medium' 
}: BookRecommendationWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Only show the real book from Sanity
  const recommendedBook = digitalBooks[0] // Only one real book
  const savings = recommendedBook.originalPrice - recommendedBook.price
  const discountPercent = Math.round((savings / recommendedBook.originalPrice) * 100)

  // Diferentes layouts según posición
  if (position === 'sidebar') {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-green-200 overflow-hidden sticky top-4 ${className}`}>
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 text-white text-center">
          <div className="inline-flex items-center bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
            🔥 Más Popular
          </div>
          <h3 className="font-bold text-lg">{recommendedBook.title}</h3>
        </div>
        
        <div className="p-4">
          <div className="relative mb-4">
            <Image 
              src={recommendedBook.coverImage}
              alt={recommendedBook.title}
              width={120}
              height={160}
              className="w-full max-w-[120px] mx-auto rounded-lg shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-book.jpg'
              }}
            />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{discountPercent}%
            </div>
          </div>
          
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-semibold text-gray-900">{recommendedBook.rating}</span>
              <span className="text-sm text-gray-600">({recommendedBook.totalBuyers.toLocaleString()})</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl font-bold text-green-600">€{recommendedBook.price}</span>
              <span className="text-sm text-gray-500 line-through">€{recommendedBook.originalPrice}</span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{recommendedBook.description}</p>
          </div>
          
          <Link 
            href={`/productos-y-servicios/${recommendedBook.id}`}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition-all flex items-center justify-center gap-2 group"
          >
            <Download className="w-4 h-4" />
            Acceso Inmediato
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Garantía 30 días
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Descarga instantánea
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Layout inline (por defecto)
  return (
    <div className={`bg-gradient-to-br from-green-50 via-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BookOpen className="text-green-600 mr-2 w-5 h-5" />
          <h3 className="font-bold text-gray-900">💡 ¿Te gustó esta receta?</h3>
        </div>
        <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          -{discountPercent}% HOY
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="relative flex-shrink-0">
          <Image 
            src={recommendedBook.coverImage}
            alt={recommendedBook.title}
            width={80}
            height={112}
            className="w-20 h-28 rounded-lg shadow-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-book.jpg'
            }}
          />
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-lg text-gray-900 mb-1">{recommendedBook.title}</h4>
          <p className="text-gray-600 text-sm mb-3">{recommendedBook.description}</p>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-semibold text-gray-900">{recommendedBook.rating}</span>
            </div>
            <span className="text-sm text-gray-600">
              <Users className="w-4 h-4 inline mr-1" />
              {recommendedBook.totalBuyers.toLocaleString()} compradores
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">€{recommendedBook.price}</span>
              <span className="text-sm text-gray-500 line-through">€{recommendedBook.originalPrice}</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                Ahorras €{savings.toFixed(2)}
              </span>
            </div>
            
            <Link
              href={`/productos-y-servicios/${recommendedBook.id}`}
              className="bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2 group"
            >
              Ver Todas las Recetas
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features expandibles */}
      <div className="mt-4">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors"
        >
          {isExpanded ? 'Ver menos ↑' : 'Ver qué incluye ↓'}
        </button>
        
        {isExpanded && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            {recommendedBook.features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-700">
                <span className="text-green-500 mr-2">✓</span>
                {feature}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Garantía 30 días devolución
        </span>
        <span className="flex items-center gap-1">
          <Download className="w-3 h-3" />
          Descarga inmediata
        </span>
        <span>🔒 Pago 100% seguro</span>
      </div>
    </div>
  )
}

export default memo(BookRecommendationWidget)