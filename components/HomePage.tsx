'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ClockIcon, 
  HeartIcon,
  TrophyIcon,
  UsersIcon,
  SparklesIcon,
  ArrowRightIcon,
  ShoppingCartIcon,
  BookOpenIcon,
  StarIcon as StarSolid,
  FireIcon,
  BoltIcon
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

// Book product data for modal - UPDATED with new description and pricing
const bookProduct = {
  _id: 'planeta-keto-planificador-2025',
  title: 'Planeta Keto - Planificador Completo 2025',
  name: 'Planeta Keto - Planificador Completo 2025',
  description: `🎯 ORGANIZA TU KETO DE UNA VEZ POR TODAS

✅ QUÉ INCLUYE ESTE PLANIFICADOR:

📊 CALCULADORA DE MACROS PERSONALIZADA
- Según tu peso, altura y objetivo
- Cantidad exacta de proteína/grasa/carbos

📅 30 DÍAS COMPLETAMENTE PLANIFICADOS
- Qué desayunar, almorzar y cenar cada día
- Combinaciones que no se repiten
- Todo keto ESTRICTO (sin harinas ni edulcorantes)

🛒 4 LISTAS DE COMPRA SEMANALES
- Cantidades exactas para 1, 2 o 4 personas
- Organizado por secciones del super
- Presupuesto estimado incluido

⏰ SISTEMA BATCH COOKING
- Cocina 2 horas el domingo
- Come organizado toda la semana
- Guía de congelación incluida

📝 PLANTILLAS DE SEGUIMIENTO
- Control diario de cetosis
- Registro de peso y medidas
- Cómo saber si estás en cetosis

🎁 BONUS EXTRA:
- 10 snacks de emergencia keto
- Qué comer fuera de casa
- Soluciones a problemas comunes

⚠️ IMPORTANTE:
Este NO es un libro de recetas (esas las tienes gratis en mi canal).
Es un SISTEMA DE ORGANIZACIÓN completo.

💳 Pago seguro - Descarga inmediata
📧 Soporte por email incluido
♻️ Actualizaciones gratis de por vida`,
  price: 14.75,
  originalPrice: 30.00,
  image: '/book-cover-3d.jpg',
  includes: [
    '📊 CALCULADORA DE MACROS PERSONALIZADA',
    '📅 30 DÍAS COMPLETAMENTE PLANIFICADOS',
    '🛒 4 LISTAS DE COMPRA SEMANALES', 
    '⏰ SISTEMA BATCH COOKING',
    '📝 PLANTILLAS DE SEGUIMIENTO',
    '🎁 BONUS: 10 snacks de emergencia keto',
    '🎁 BONUS: Qué comer fuera de casa',
    '🎁 BONUS: Soluciones a problemas comunes',
    '💳 Pago seguro - Descarga inmediata',
    '📧 Soporte por email incluido',
    '♻️ Actualizaciones gratis de por vida'
  ]
}

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
          item_name: bookProduct.name,
          category: 'Digital Book',
          quantity: 1,
          price: bookProduct.price
        }]
      })
    }
  }
  
  return (
    <>
      
      {/* Hero Section - Redesigned with Planeta Keto brand colors */}
      <section className="relative bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 pt-20 pb-16 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        
        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-16 h-16 bg-orange-400/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-10 w-12 h-12 bg-red-400/20 rounded-full animate-ping"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Mensaje principal */}
            <div className="text-center lg:text-left">
              {/* Social proof badge */}
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-8">
                <div className="flex -space-x-2 mr-3">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(i => (
                      <StarIcon key={i} className="h-4 w-4" />
                    ))}
                  </div>
                  <span className="text-sm text-white font-medium">+10.000 personas transformadas</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                Organiza tu
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mt-2">
                  Keto Completo
                </span>
                <span className="block text-3xl md:text-4xl font-light mt-2">
                  de una vez por todas
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light mb-8">
                <span className="font-bold text-brand-yellow-400">¡NO vendemos recetas!</span> 
                <span className="block mt-2">
                  Las tienes GRATIS en nuestro YouTube, TikTok e Instagram.
                </span>
                <span className="block mt-2 font-medium text-planetaketo-200">
                  Vendemos el <strong>PLANIFICADOR COMPLETO</strong> para organizarte paso a paso.
                </span>
              </p>
              
              {/* CTA Principal - Libro */}
              <div className="bg-gradient-to-r from-brand-red-500 to-brand-orange-500 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center mb-3">
                  <ClockIcon className="h-6 w-6 mr-2 animate-pulse text-white" />
                  <span className="font-bold text-lg text-white">🔥 OFERTA LIMITADA - Solo hoy</span>
                </div>
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-2xl font-bold line-through opacity-75 text-white">€30.00</span>
                    <span className="text-4xl font-bold text-white">€14.75</span>
                  </div>
                  <div className="text-orange-200 text-lg">Ahorras €15.25 (51% descuento)</div>
                </div>
                <button
                  onClick={handlePurchaseBook}
                  className="w-full bg-white text-brand-red-600 font-bold py-4 px-8 rounded-xl text-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center mb-3"
                >
                  <ShoppingCartIcon className="h-6 w-6 mr-3" />
                  🚀 CONSEGUIR MI PLANIFICADOR KETO AHORA
                </button>
                <div className="text-orange-200 text-sm text-center">
                  ✅ Acceso inmediato • ✅ Garantía 30 días • ✅ Sistema completo de organización
                </div>
              </div>
              
              {/* CTAs secundarios */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/recetas"
                  className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
                >
                  <span className="mr-2">🍽️</span>
                  Ver {stats.totalRecipes} Recetas GRATIS
                </Link>
                <Link
                  href="https://youtube.com/@PlanetaKeto"
                  target="_blank"
                  className="bg-brand-red-600/80 backdrop-blur-sm border-2 border-brand-red-500/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-red-600 hover:border-brand-red-400 hover:shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer transform hover:scale-105"
                >
                  <span className="mr-2">📺</span>
                  YouTube Canal
                </Link>
              </div>
            </div>
            
            {/* Right Column - Libro mockup */}
            <div className="relative lg:order-2">
              <div className="relative max-w-sm mx-auto">
                {/* Book mockup */}
                <div className="relative transform rotate-6 hover:rotate-3 transition-transform duration-500">
                  <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="text-center">
                      <div className="text-5xl mb-4">📊</div>
                      <h3 className="font-black text-2xl text-gray-900 mb-2">PLANETA KETO</h3>
                      <h2 className="font-black text-3xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                        PLANIFICADOR 2025
                      </h2>
                      <div className="text-sm text-gray-800 font-medium mb-6">
                        ✅ Calculadora Macros Personalizada<br/>
                        ✅ 30 Días Completamente Planificados<br/>
                        ✅ 4 Listas Compra Semanales<br/>
                        ✅ Sistema Batch Cooking<br/>
                        ✅ 3 Bonus Incluidos GRATIS
                      </div>
                      <div className="bg-gradient-to-r from-brand-yellow-400 to-brand-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold mb-4">
                        🏆 SISTEMA DE ORGANIZACIÓN #1
                      </div>
                      <div className="flex justify-center text-brand-yellow-400 mb-2">
                        {[1,2,3,4,5].map(i => (
                          <StarIcon key={i} className="h-5 w-5" />
                        ))}
                      </div>
                      <div className="text-xs text-gray-800 font-medium">4.9/5 - Más de 2,000 usuarios satisfechos</div>
                    </div>
                  </div>
                  
                  {/* Floating badges */}
                  <div className="absolute -top-4 -left-4 bg-brand-red-500 text-white px-3 py-2 rounded-full text-sm font-bold transform -rotate-12 shadow-lg animate-pulse">
                    🔥 51% OFF
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-planetaketo-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                    ✅ Garantizado
                  </div>
                </div>
                
                {/* Stats floating */}
                <div className="absolute -left-8 top-1/3 hidden lg:block">
                  <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                    <div className="text-2xl font-bold text-planetaketo-600">10K+</div>
                    <div className="text-xs text-gray-600">Transformados</div>
                  </div>
                </div>
                <div className="absolute -right-8 top-1/4 hidden lg:block">
                  <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                    <div className="text-2xl font-bold text-brand-blue-600">Sistema</div>
                    <div className="text-xs text-gray-600">Completo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats mejorados */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-6 text-white text-center">
              <div className="text-3xl mb-2">🍽️</div>
              <div className="text-2xl font-bold">{stats.totalRecipes}</div>
              <div className="text-sm opacity-90">Recetas GRATIS</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-6 text-white text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold">{(stats.happyUsers / 1000).toFixed(0)}K+</div>
              <div className="text-sm opacity-90">Transformados</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-6 text-white text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold">{stats.avgRating}/5</div>
              <div className="text-sm opacity-90">Rating Sistema</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-6 text-white text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold">51%</div>
              <div className="text-sm opacity-90">Descuento</div>
            </div>
          </div>
        </div>
      </section>

      {/* Anuncio Header - Solo desktop */}
      <AdPlacement 
        position="header" 
        className="py-4 bg-gray-50"
        showOnMobile={false}
        showOnDesktop={true}
      />

      {/* Sección de Acceso Rápido - Optimizada para conversión */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Banner de conversión libro */}
          <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 rounded-3xl p-8 mb-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              🎯 ¿Por qué necesitas el PLANIFICADOR si las recetas son gratis?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl mb-3">📅</div>
                <h3 className="font-bold mb-2">ORGANIZACIÓN Total</h3>
                <p className="text-sm">30 días completamente planificados con menús, listas y batch cooking</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-bold mb-2">Personalización</h3>
                <p className="text-sm">Calcula TUS macros exactos según tu peso, altura y objetivo</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl mb-3">⏰</div>
                <h3 className="font-bold mb-2">Ahorro de Tiempo</h3>
                <p className="text-sm">Sistema batch cooking: cocina 2h domingos, come organizado toda la semana</p>
              </div>
            </div>
            <button
              onClick={handlePurchaseBook}
              className="bg-white text-brand-blue-600 font-bold py-4 px-8 rounded-xl text-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Ver Qué Incluye El Planificador →
            </button>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Acceso Rápido a Todo
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Recetas gratis, productos premium, comunidad y más
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {([
              { name: 'Recetas GRATIS', emoji: '🍽️', count: `${stats.totalRecipes} recetas`, color: 'from-planetaketo-400 to-planetaketo-600', href: '/recetas', highlight: true, isBook: false, external: false },
              { name: 'Mi Planificador Keto', emoji: '📊', count: '51% OFF hoy', color: 'from-brand-red-400 to-brand-orange-500', href: '/planificador-keto-2025', highlight: true, isBook: true, external: false },
              { name: 'Productos Premium', emoji: '🛒', count: 'Herramientas', color: 'from-brand-blue-400 to-brand-blue-600', href: '/productos-y-servicios', highlight: false, isBook: false, external: false },
              { name: 'Foro Comunidad', emoji: '💬', count: 'Apoyo 24/7', color: 'from-brand-blue-400 to-planetaketo-500', href: '/foro', highlight: false, isBook: false, external: false },
              { name: 'Blog Keto', emoji: '📝', count: 'Artículos', color: 'from-brand-yellow-400 to-brand-orange-500', href: '/blog', highlight: false, isBook: false, external: false },
              { name: 'Mi YouTube', emoji: '📺', count: 'Videos gratis', color: 'from-brand-red-500 to-brand-red-600', href: 'https://youtube.com/@PlanetaKeto', external: true, highlight: false, isBook: false },
              { name: 'Bajar de Peso', emoji: '⚖️', count: 'Guías', color: 'from-planetaketo-400 to-brand-orange-500', href: '/bajar-de-peso', highlight: false, isBook: false, external: false },
              { name: 'Quemar Grasa', emoji: '🔥', count: 'Estrategias', color: 'from-brand-orange-400 to-brand-red-500', href: '/quemar-grasa', highlight: false, isBook: false, external: false },
            ] as const).map((category, index) => (
              <div key={category.name} className={`relative ${category.highlight ? 'md:col-span-1' : ''}`}>
                {category.highlight && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10 animate-pulse">
                    HOT
                  </div>
                )}
                {category.isBook ? (
                  <button
                    onClick={handlePurchaseBook}
                    className="w-full text-left group"
                  >
                    <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border-2 ${category.highlight ? 'border-brand-red-200 bg-gradient-to-br from-brand-red-50 to-brand-orange-50' : 'border-gray-100'}`}>
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl`}>
                        {category.emoji}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 text-center">
                        {category.name}
                      </h3>
                      <p className="text-sm text-brand-red-600 font-medium text-center">
                        {category.count}
                      </p>
                    </div>
                  </button>
                ) : (
                  <Link
                    href={category.href}
                    className="block group"
                    target={category.external ? '_blank' : '_self'}
                  >
                    <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border-2 ${category.highlight ? 'border-planetaketo-200 bg-gradient-to-br from-planetaketo-50 to-brand-blue-50' : 'border-gray-100'}`}>
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl`}>
                        {category.emoji}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 text-center">
                        {category.name}
                      </h3>
                      <p className={`text-sm text-center ${category.highlight ? 'text-planetaketo-600 font-medium' : 'text-gray-600'}`}>
                        {category.count}
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Why Choose Keto */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por Qué Elegir la Dieta Keto?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre los increíbles beneficios de la dieta cetogénica respaldados por la ciencia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Pérdida de Peso Rápida',
                description: 'Pierde peso de forma eficiente quemando grasa como combustible principal',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                icon: '🧠',
                title: 'Mayor Claridad Mental',
                description: 'Mejora tu concentración y función cerebral con cetonas',
                color: 'from-blue-400 to-indigo-500'
              },
              {
                icon: '💪',
                title: 'Más Energía Sostenida',
                description: 'Elimina los picos de azúcar y mantén energía constante todo el día',
                color: 'from-green-400 to-green-600'
              },
              {
                icon: '❤️',
                title: 'Salud Cardiovascular',
                description: 'Mejora tus niveles de colesterol y presión arterial',
                color: 'from-red-400 to-pink-500'
              },
              {
                icon: '🎯',
                title: 'Control del Apetito',
                description: 'Reduce naturalmente el hambre y los antojos',
                color: 'from-purple-400 to-pink-500'
              },
              {
                icon: '🔥',
                title: 'Metabolismo Optimizado',
                description: 'Convierte tu cuerpo en una máquina quema-grasa 24/7',
                color: 'from-orange-400 to-red-500'
              },
            ].map((benefit, index) => (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center text-2xl`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anuncio Content Middle */}
      <div className="py-8 bg-gray-50">
        <AdPlacement 
          position="content-middle" 
          className="max-w-4xl mx-auto px-4"
        />
      </div>

      {/* CTA Section - Mega optimizado para libro */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 relative overflow-hidden">
        {/* Efectos de fondo */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-bounce"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              ¿Listo para organizar tu keto
              <span className="block text-brand-yellow-300">de una vez por todas?</span>
            </h2>
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Deja de hacer keto "sin organización". Consigue el <span className="font-bold text-white">planificador completo</span> 
              que ya usaron +10,000 personas para organizar su keto en 30 días.
            </p>
          </div>

          {/* Mega CTA para el libro */}
          <div className="bg-white rounded-3xl p-8 md:p-12 mb-8 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Libro visual */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 transform rotate-3 shadow-xl">
                    <div className="text-4xl mb-3">📊</div>
                    <h3 className="text-white font-black text-xl mb-2">PLANIFICADOR KETO COMPLETO</h3>
                    <div className="text-planetaketo-100 text-sm">Sistema organización • 30 días planificados • Listas compras</div>
                  </div>
                  <div className="absolute -top-3 -right-3 bg-brand-red-500 text-white px-3 py-2 rounded-full text-sm font-bold animate-pulse">
                    51% OFF
                  </div>
                </div>
              </div>
              
              {/* CTA copy */}
              <div className="text-left md:text-left">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                  Solo por hoy: <span className="text-brand-red-600">€14.75</span>
                  <span className="text-lg text-gray-500 line-through ml-2">€30.00</span>
                </h3>
                <ul className="text-gray-700 mb-6 space-y-2">
                  <li className="flex items-center">
                    <span className="text-planetaketo-600 mr-2">✅</span>
                    Calculadora de macros personalizada
                  </li>
                  <li className="flex items-center">
                    <span className="text-planetaketo-600 mr-2">✅</span>
                    30 días completamente planificados
                  </li>
                  <li className="flex items-center">
                    <span className="text-planetaketo-600 mr-2">✅</span>
                    Sistema batch cooking completo
                  </li>
                  <li className="flex items-center">
                    <span className="text-planetaketo-600 mr-2">✅</span>
                    3 BONUS valorados en €25
                  </li>
                </ul>
                <button
                  onClick={handlePurchaseBook}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-8 rounded-2xl text-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                >
                  <ShoppingCartIcon className="h-6 w-6 mr-3" />
                  CONSEGUIR PLANIFICADOR COMPLETO AHORA
                </button>
                <div className="text-center mt-3 text-sm text-gray-500">
                  💳 Pago seguro • ⚡ Acceso inmediato • 🔄 Garantía 30 días
                </div>
              </div>
            </div>
          </div>

          {/* CTAs secundarios */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/recetas"
              className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
            >
              <span className="mr-2">🍽️</span>
              Recetas GRATIS
            </Link>
            <Link
              href="https://youtube.com/@PlanetaKeto"
              target="_blank"
              className="bg-brand-red-600/80 backdrop-blur-sm border-2 border-brand-red-500/30 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-brand-red-600 transition-all duration-300 flex items-center justify-center"
            >
              <span className="mr-2">📺</span>
              Mi YouTube
            </Link>
            <Link
              href="/foro"
              className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
            >
              <span className="mr-2">💬</span>
              Únete al Foro
            </Link>
          </div>
        </div>
      </section>

      {/* Anuncio Footer */}
      <div className="py-6 bg-white border-t">
        <AdPlacement 
          position="footer" 
          className="max-w-6xl mx-auto px-4"
        />
      </div>

      {/* Anuncio Mobile Sticky - Solo móviles */}
      <AdPlacement 
        position="mobile-sticky" 
        showOnMobile={true}
        showOnDesktop={false}
      />

      {/* Sticky CTA para móviles - Libro */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <button
          onClick={handlePurchaseBook}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-6 rounded-xl shadow-2xl flex items-center justify-center text-lg"
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          Mi Planificador Keto €14.75 
          <span className="ml-2 text-sm opacity-80 line-through">€30</span>
        </button>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <PurchaseModal
          product={bookProduct}
          onClose={() => setShowPurchaseModal(false)}
        />
      )}

    </>
  )
}