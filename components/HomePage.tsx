'use client'

// Remove unused imports that were causing hydration issues
// import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
// Remove framer-motion for better performance in Next.js 15
// import { motion } from 'framer-motion'
import { 
  ClockIcon, 
  HeartIcon,
  TrophyIcon,
  UsersIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import ProductRecommendations from './ProductRecommendations'

interface HomePageProps {
  featuredRecipes?: any[]
  categories?: any[]
  stats?: {
    totalRecipes: number
    happyUsers: number
    avgRating: number
  }
}

export default function HomePage({ 
  featuredRecipes = [], 
  categories = [],
  stats = { totalRecipes: 500, happyUsers: 10000, avgRating: 4.8 }
}: HomePageProps) {
  // Remove mounted state completely to fix hydration issues
  // const [mounted, setMounted] = useState(false)
  // useEffect(() => {
  //   setMounted(true)
  // }, [])

  // Add console log for debugging in production
  console.log('HomePage rendered with:', { featuredRecipes: featuredRecipes?.length, categories: categories?.length, stats });
  
  return (
    <>
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 pt-20 pb-16 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        
        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-10 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div>
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 shadow-2xl">
                <img
                  src="/logo.webp"
                  alt="Logo Planeta Keto"
                  className="w-16 h-16 object-contain rounded-2xl"
                />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                Las Mejores
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mt-2">
                  Recetas Keto
                </span>
                <span className="block text-4xl md:text-5xl font-light mt-2">
                  en Español
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-green-50 max-w-3xl mx-auto leading-relaxed font-light mb-8">
                Transforma tu cuerpo con recetas cetogénicas deliciosas.
                <span className="block mt-2 font-medium">
                  ¡Desayunos, comidas, cenas y postres sin sacrificar sabor!
                </span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                <Link
                  href="/recetas"
                  className="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-50 transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <span className="mr-2">🍽️</span>
                  Ver Todas las Recetas
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                
                <Link
                  href="/productos-y-servicios"
                  className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="mr-2">🛒</span>
                  Productos y Servicios
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-white text-center">
                <div className="text-2xl font-bold">{stats.totalRecipes}+</div>
                <div className="text-sm opacity-90">Recetas Keto</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-white text-center">
                <div className="text-2xl font-bold">{(stats.happyUsers / 1000).toFixed(0)}K+</div>
                <div className="text-sm opacity-90">Usuarios Felices</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-white text-center">
                <div className="text-2xl font-bold">⭐ {stats.avgRating}</div>
                <div className="text-sm opacity-90">Rating Promedio</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Categories */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explora por Categorías
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encuentra exactamente lo que buscas con nuestras categorías organizadas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {([
              { name: 'Recetas Keto', emoji: '🍽️', count: '500+', color: 'from-green-400 to-green-600', href: '/recetas' },
              { name: 'Productos y Servicios', emoji: '🛒', count: 'Premium', color: 'from-blue-400 to-indigo-500', href: '/productos-y-servicios' },
              { name: 'Blog Keto', emoji: '📝', count: 'Artículos', color: 'from-yellow-400 to-orange-500', href: '/blog' },
              { name: 'Foro Keto', emoji: '💬', count: 'Comunidad', color: 'from-indigo-400 to-blue-500', href: '/foro' },
              { name: 'Bajar de Peso', emoji: '⚖️', count: 'Guías', color: 'from-red-400 to-pink-500', href: '/bajar-de-peso' },
              { name: 'Quemar Grasa', emoji: '🔥', count: 'Tips', color: 'from-orange-400 to-red-500', href: '/quemar-grasa' },
              { name: 'Dieta Keto', emoji: '🧠', count: 'Ciencia', color: 'from-teal-400 to-cyan-500', href: '/dieta-keto' },
            ] as const).map((category, index) => (
              <div
                key={category.name}
              >
                <Link
                  href={category.href}
                  className="block group"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-gray-100">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl`}>
                      {category.emoji}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 text-center">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 text-center">
                      {category.count} recetas
                    </p>
                  </div>
                </Link>
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
          >
            <SparklesIcon className="h-12 w-12 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¡Comienza Tu Transformación Keto Hoy!
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Únete a miles de personas que ya han transformado su vida con nuestras recetas keto probadas y deliciosas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-4xl mx-auto">
              <Link
                href="/recetas"
                className="bg-white text-green-600 px-6 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all duration-200 inline-flex items-center justify-center"
              >
                <span className="mr-2">👨‍🍳</span>
                Explorar Recetas
              </Link>
              <Link
                href="/productos-y-servicios"
                className="border-2 border-white text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-200 inline-flex items-center justify-center"
              >
                <span className="mr-2">🛒</span>
                Productos y Servicios
              </Link>
            </div>
          </div>
        </div>
      </section>


    </>
  )
}