'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  StarIcon as StarOutline,
  CheckIcon,
  ShoppingCartIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import ProductRecommendations from './ProductRecommendations'
import AdPlacement from './ads/AdPlacement'
import PurchaseModal from './PurchaseModal'

interface HomePageProps {
  featuredRecipes?: any[]
  categories?: any[]
  stats?: {
    totalRecipes: number
    happyUsers: number
    avgRating: number
  }
}

// Book product data for modal - Professional version
const bookProduct = {
  _id: '83f184b6-1e92-4d97-ad0b-9273de28eadc',
  title: 'Planeta Keto - Guía Completa 2025',
  name: 'Planeta Keto - Guía Completa 2025',
  price: 14.75,
  originalPrice: 29.99,
  stripePriceId: 'price_1QMdJ3JiCY7fqO2f9aXZKhHp',
  image: '/guia.png',
  description: `🎯 TRANSFORMA TU VIDA CON LA DIETA KETO

✅ QUÉ INCLUYE ESTA GUÍA COMPLETA:

📊 CALCULADORA DE MACROS PERSONALIZADA
- Según tu peso, altura y objetivo específico
- Cantidad exacta de proteína, grasa y carbohidratos

📅 30 DÍAS COMPLETAMENTE PLANIFICADOS
- Menús diarios con desayuno, almuerzo y cena
- Combinaciones que nunca se repiten
- Todo keto ESTRICTO (sin harinas ni edulcorantes)

🛒 4 LISTAS DE COMPRA SEMANALES
- Organizadas por categorías para facilitar tu compra
- Cantidades exactas para evitar desperdicios

⏰ SISTEMA BATCH COOKING
- Prepara comida para toda la semana en 2 horas
- Técnicas profesionales de conservación

📝 PLANTILLAS DE SEGUIMIENTO
- Control de peso y medidas
- Registro de energía y estado de ánimo

🎁 BONUS EXCLUSIVOS:
- 10 snacks de emergencia keto
- Qué comer fuera de casa
- Soluciones a problemas comunes

💳 Pago seguro - Descarga inmediata
📧 Soporte por email incluido
♻️ Actualizaciones gratis de por vida`,
  includes: [
    'Calculadora de macros personalizada',
    '30 días de menús planificados',
    '4 listas de compra semanales', 
    'Sistema Batch Cooking completo',
    'Plantillas de seguimiento',
    '10 snacks de emergencia keto',
    'Guía para comer fuera de casa',
    'Soluciones a problemas comunes',
    'Pago seguro - Descarga inmediata',
    'Soporte por email incluido',
    'Actualizaciones gratis de por vida'
  ],
  category: 'ebooks',
  type: 'digital' as const,
  createdAt: '2025-01-15T10:00:00.000Z'
}

// Professional testimonials
const testimonials = [
  {
    id: 1,
    name: 'María González',
    rating: 5,
    comment: 'Una guía completa que me ayudó a perder 12kg en 3 meses. Los menús son deliciosos y fáciles de seguir.',
    verified: true
  },
  {
    id: 2,
    name: 'Carlos Ramírez', 
    rating: 5,
    comment: 'Excelente inversión. El sistema batch cooking me ahorra horas cada semana. Muy recomendado.',
    verified: true
  },
  {
    id: 3,
    name: 'Ana Martín',
    rating: 5, 
    comment: 'Después de probar muchas dietas, esta guía fue la que realmente funcionó. Resultados desde la primera semana.',
    verified: true
  }
]

export default function HomePage({ 
  featuredRecipes = [], 
  categories = [],
  stats = { totalRecipes: 38, happyUsers: 10000, avgRating: 4.8 }
}: HomePageProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  const handlePurchaseBook = () => {
    setShowPurchaseModal(true)
    
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'begin_checkout', {
        currency: 'EUR',
        value: bookProduct.price,
        items: [{
          item_id: bookProduct._id,
          item_name: bookProduct.title,
          category: 'Ebooks',
          quantity: 1,
          price: bookProduct.price
        }]
      })
    }

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'product_view',
        properties: {
          product_id: bookProduct._id,
          product_name: bookProduct.title,
          price: bookProduct.price,
          source: 'homepage'
        }
      })
    }).catch(() => {})
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left side - Book image */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <Image
                  src="/guia.png"
                  alt="Planeta Keto - Guía Completa 2025"
                  width={400}
                  height={600}
                  className="w-full h-auto rounded-2xl shadow-lg"
                  priority
                />
                <div className="absolute -top-4 -right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  50% OFF
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  ✨ Bestseller Keto
                </div>
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  Transforma Tu Vida con 
                  <span className="text-green-600"> Keto</span>
                </h1>
                <p className="text-xl text-gray-600 mt-4 leading-relaxed">
                  La guía más completa para dominar la dieta cetogénica con menús planificados, 
                  recetas deliciosas y resultados garantizados en 30 días.
                </p>
              </div>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">30 días planificados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Calculadora de macros</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Sistema Batch Cooking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Soporte incluido</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">€14.75</span>
                    <span className="text-lg text-gray-500 line-through ml-2">€29.99</span>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-600 font-semibold">Ahorras €15.24</div>
                    <div className="text-sm text-gray-500">50% descuento</div>
                  </div>
                </div>
                
                <button
                  onClick={handlePurchaseBook}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  <span>Conseguir Mi Guía Ahora</span>
                </button>
                
                <p className="text-center text-sm text-gray-500 mt-3">
                  ✅ Descarga inmediata • ✅ Pago seguro • ✅ Garantía de satisfacción
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10,000+</div>
                  <div className="text-sm text-gray-600">Usuarios felices</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">4.8/5 estrellas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">38+</div>
                  <div className="text-sm text-gray-600">Recetas incluidas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-gray-600">
              Miles de personas ya han transformado su vida con nuestra guía
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                  {testimonial.verified && (
                    <span className="ml-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      ✓ Verificado
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Book */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Sobre la Guía
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Esta guía, <strong>Planeta Keto</strong>, es perfecta para principiantes y cualquier persona 
                  que quiera dominar la dieta cetogénica. Simplifica el keto con orientación paso a paso, 
                  para que puedas lograr tus objetivos de salud con confianza.
                </p>
                <p>
                  Descubre consejos, trucos y consejos de expertos para hacer que el keto sea agradable y 
                  libre de estrés. Ya sea que estés comenzando o buscando mejorar tus resultados, 
                  esta guía te tiene cubierto.
                </p>
              </div>

              {/* Formats */}
              <div className="mt-12 space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    📱
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Edición Digital</div>
                    <div className="text-gray-600">Acceso instantáneo en cualquier dispositivo</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePurchaseBook}
                className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Comprar Ahora
              </button>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-8">
                <Image
                  src="/guia.png"
                  alt="Vista detallada del libro"
                  width={400}
                  height={600}
                  className="w-full h-auto rounded-2xl shadow-xl"
                />
                <div className="absolute top-4 right-4 bg-green-600 text-white p-3 rounded-full">
                  <ShoppingCartIcon className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inside the Book */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Dentro de la Guía
            </h2>
            <p className="text-xl text-gray-600">
              Consejos simples para transformar tu salud y bienestar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                🥗
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Menús Planificados</h3>
              <p className="text-gray-600">
                Aprende a planificar y preparar menús keto deliciosos con instrucciones claras y fáciles.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Seguimiento Experto</h3>
              <p className="text-gray-600">
                Descubre consejos probados para hacer que tu progreso keto sea próspero, 
                desde la preparación hasta el seguimiento.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                🔧
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Soluciones Simples</h3>
              <p className="text-gray-600">
                Encuentra soluciones rápidas a desafíos comunes del keto, 
                como la mejor salud intestinal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      {featuredRecipes && featuredRecipes.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900">Recetas Destacadas</h2>
                <p className="text-xl text-gray-600 mt-2">Prueba algunas de nuestras recetas más populares</p>
              </div>
              <Link 
                href="/recetas"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Ver Todas →
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRecipes.slice(0, 6).map((recipe) => (
                <Link key={recipe._id} href={`/recetas/${recipe.slug?.current}`}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                    {recipe.mainImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={recipe.mainImage}
                          alt={recipe.title}
                          width={400}
                          height={240}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {recipe.description}
                      </p>
                      {recipe.cookingTime && (
                        <div className="flex items-center text-gray-500 text-sm">
                          <span>⏱️ {recipe.cookingTime} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para Transformar tu Vida?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Únete a miles de personas que ya han logrado sus objetivos con nuestra guía completa
          </p>
          <button
            onClick={handlePurchaseBook}
            className="bg-white text-green-600 font-bold py-4 px-12 rounded-xl text-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Conseguir Mi Guía Por €14.75
          </button>
          <p className="text-green-100 mt-4">
            ✅ Descarga inmediata • ✅ Garantía de satisfacción • ✅ Soporte incluido
          </p>
        </div>
      </section>

      {/* Ad Placements */}
      <AdPlacement position="content-bottom" />

      {/* Product Recommendations */}
      <ProductRecommendations />

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <PurchaseModal
          product={bookProduct}
          onClose={() => setShowPurchaseModal(false)}
        />
      )}
    </div>
  )
}