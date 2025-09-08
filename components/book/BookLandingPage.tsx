'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  StarIcon as StarSolid,
  ShoppingCartIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  UsersIcon,
  BookOpenIcon,
  GiftIcon,
  LockClosedIcon,
  CreditCardIcon
} from '@heroicons/react/24/solid'
import { 
  StarIcon,
  HeartIcon,
  FireIcon,
  BoltIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import PurchaseModal from '../PurchaseModal'
import TestimonialsSection from './TestimonialsSection'
import ContentPreviewSection from './ContentPreviewSection'

// Book product data for the modal - CONSISTENT ACROSS ALL COMPONENTS
const bookProduct = {
  _id: '83f184b6-1e92-4d97-ad0b-9273de28eadc',
  title: 'Planeta Keto - Guía Completa 2025',
  name: 'Planeta Keto - Guía Completa 2025',
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
  price: 14.75,
  originalPrice: 29.99,
  image: '/guia.png',
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
  ]
}

export default function BookLandingPage() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  const handlePurchase = () => {
    setShowPurchaseModal(true)
    
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'begin_checkout', {
        currency: 'EUR',
        value: bookProduct.price,
        items: [{
          item_id: bookProduct._id,
          item_name: bookProduct.name,
          category: 'Digital Book',
          quantity: 1,
          price: bookProduct.price
        }]
      })
    }
  }

  const discount = Math.round(((bookProduct.originalPrice! - bookProduct.price) / bookProduct.originalPrice!) * 100)
  const savings = bookProduct.originalPrice! - bookProduct.price

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-blue-50 pt-20 pb-16 lg:pb-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-yellow-400 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Copy */}
            <div className="text-center lg:text-left">
              {/* Social proof badge */}
              <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg mb-8">
                <div className="flex -space-x-2 mr-3">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(i => (
                      <StarSolid key={i} className="h-4 w-4" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">+10.000 personas ya lo tienen</span>
                </div>
              </div>

              {/* Main headline */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                Transforma tu{' '}
                <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  cuerpo
                </span>
                <br />
                en 30 días con
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Keto
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
                El único libro que necesitas para <span className="font-bold text-green-600">perder peso</span>, 
                <span className="font-bold text-blue-600"> ganar energía</span> y 
                <span className="font-bold text-purple-600"> sentirte increíble</span> con la dieta cetogénica.
              </p>

              {/* Key benefits */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: '🔥', text: 'Pierde 5-15kg en 30 días' },
                  { icon: '⚡', text: 'Energía constante todo el día' },
                  { icon: '🧠', text: 'Claridad mental increíble' },
                  { icon: '❤️', text: 'Mejora tu salud cardiovascular' }
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center bg-white rounded-xl p-4 shadow-md">
                    <div className="text-2xl mr-3">{benefit.icon}</div>
                    <span className="font-semibold text-gray-800">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Urgency + CTA */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white mb-8">
                <div className="flex items-center justify-center mb-4">
                  <ClockIcon className="h-6 w-6 mr-2 animate-pulse" />
                  <span className="font-bold text-lg">🔥 OFERTA LIMITADA - Solo por hoy</span>
                </div>
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-3xl font-bold line-through opacity-75">€{bookProduct.originalPrice}</span>
                    <span className="text-5xl font-bold">€{bookProduct.price}</span>
                  </div>
                  <div className="text-orange-100 text-lg">
                    Ahorras €{savings} ({discount}% descuento)
                  </div>
                </div>
                <button
                  onClick={handlePurchase}
                  className="w-full bg-white text-red-600 font-bold py-4 px-8 rounded-xl text-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                >
                  <ShoppingCartIcon className="h-6 w-6 mr-3" />
                  🚀 DESCARGAR MI LIBRO AHORA
                </button>
                <div className="flex items-center justify-center mt-3 text-orange-100 text-sm">
                  <ShieldCheckIcon className="h-4 w-4 mr-2" />
                  Garantía de 30 días • Pago 100% seguro • Acceso inmediato
                </div>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <LockClosedIcon className="h-4 w-4 mr-1" />
                  Pago seguro SSL
                </div>
                <div className="flex items-center">
                  <CreditCardIcon className="h-4 w-4 mr-1" />
                  Stripe & PayPal
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Descarga inmediata
                </div>
              </div>
            </div>

            {/* Right Column - Book mockup */}
            <div className="relative">
              <div className="relative max-w-md mx-auto">
                {/* Book cover mockup */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl shadow-2xl transform rotate-6 hover:rotate-3 transition-transform duration-300">
                    <div className="bg-white rounded-2xl m-2 p-8 relative overflow-hidden">
                      {/* Placeholder book cover - replace with actual design */}
                      <div className="text-center">
                        <div className="text-6xl mb-4">🥑</div>
                        <h3 className="font-bold text-2xl text-gray-900 mb-2">GUÍA COMPLETA</h3>
                        <h2 className="font-bold text-3xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                          KETO 2025
                        </h2>
                        <div className="text-sm text-gray-800 font-medium mb-4">
                          +200 Recetas • Plan 30 Días<br />
                          Calculadora de Macros
                        </div>
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                          #1 BESTSELLER
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-4 -left-4 bg-yellow-400 text-yellow-900 px-3 py-2 rounded-full text-sm font-bold transform -rotate-12 shadow-lg">
                    ⭐ #1 Libro Keto
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-green-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                    ✅ Garantizado
                  </div>
                </div>

                {/* Stats */}
                <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
                  <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">300+</div>
                    <div className="text-xs text-gray-600">Páginas</div>
                  </div>
                </div>
                <div className="absolute -right-8 top-1/3">
                  <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">200+</div>
                    <div className="text-xs text-gray-600">Recetas</div>
                  </div>
                </div>
                <div className="absolute -right-8 bottom-1/3">
                  <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">10K+</div>
                    <div className="text-xs text-gray-600">Usuarios</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Preview Section */}
      <ContentPreviewSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Guarantee Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="text-6xl mb-6">🛡️</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Garantía de Satisfacción Total
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Estoy tan seguro de que este libro cambiará tu vida que te ofrezco una 
            <span className="font-bold text-white"> garantía total de 30 días</span>. 
            Si no estás 100% satisfecho, te devuelvo tu dinero sin preguntas.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-bold mb-2">Dinero de vuelta</h3>
              <p className="text-green-100 text-sm">Sin preguntas, sin complicaciones</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold mb-2">Proceso rápido</h3>
              <p className="text-green-100 text-sm">Reembolso en 24-48 horas</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-bold mb-2">Mi compromiso</h3>
              <p className="text-green-100 text-sm">Tu éxito es mi prioridad #1</p>
            </div>
          </div>
          <button
            onClick={handlePurchase}
            className="bg-white text-green-600 font-bold py-4 px-8 rounded-xl text-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Probar Sin Riesgo Por 30 Días
          </button>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para transformar tu vida?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Más de 10,000 personas ya lo hicieron. Ahora es tu turno.
          </p>
          
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 mb-8">
            <div className="text-center mb-6">
              <div className="text-orange-200 text-lg font-semibold mb-2">
                🔥 ÚLTIMA OPORTUNIDAD - Solo por hoy
              </div>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-3xl font-bold line-through opacity-75">€{bookProduct.originalPrice}</span>
                <span className="text-5xl font-bold">€{bookProduct.price}</span>
              </div>
              <div className="text-orange-200 text-lg mb-6">
                Ahorras €{savings} ({discount}% descuento)
              </div>
            </div>
            
            <button
              onClick={handlePurchase}
              className="w-full bg-white text-red-600 font-bold py-6 px-8 rounded-xl text-2xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 mb-4"
            >
              <ShoppingCartIcon className="h-8 w-8 inline mr-3" />
              SÍ, QUIERO TRANSFORMAR MI VIDA AHORA
            </button>
            
            <div className="text-orange-200 text-sm">
              ✅ Acceso inmediato • ✅ Garantía 30 días • ✅ Pago 100% seguro
            </div>
          </div>

          {/* FAQ Quick */}
          <div className="text-left max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4 text-center">Preguntas Frecuentes</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-300 mb-2">¿Funciona realmente?</h4>
                <p className="text-gray-400 text-sm">Más de 10,000 personas han conseguido resultados siguiendo esta guía. Con garantía de 30 días.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-300 mb-2">¿Cuándo recibo el libro?</h4>
                <p className="text-gray-400 text-sm">Inmediatamente después del pago recibirás el enlace de descarga por email.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-300 mb-2">¿Es seguro el pago?</h4>
                <p className="text-gray-400 text-sm">Sí, utilizamos Stripe y PayPal con encriptación SSL de nivel bancario.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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