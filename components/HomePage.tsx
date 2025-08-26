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
import AdSystem, { HeaderAd, ContentAd } from './AdSystem'

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
      <AdSystem />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-green-50 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div>
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-2xl text-4xl">
                  🥑
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Las Mejores{' '}
                <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  Recetas Keto
                </span>{' '}
                en Español
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Transforma tu cuerpo con +500 recetas cetogénicas deliciosas. 
                Desayunos, comidas, cenas y postres para perder peso sin sacrificar sabor.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  href="/recetas-keto"
                  className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-600 transition-all duration-200 flex items-center justify-center"
                >
                  Ver Recetas Keto
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                
                <Link
                  href="/dieta-keto"
                  className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all duration-200"
                >
                  Guía Completa Keto
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="h-8 w-8 text-green-600 flex items-center justify-center text-2xl">👨‍🍳</div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalRecipes}+</div>
                <div className="text-gray-600">Recetas Keto</div>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <UsersIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{(stats.happyUsers / 1000).toFixed(0)}K+</div>
                <div className="text-gray-600">Usuarios Felices</div>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <TrophyIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.avgRating}</div>
                <div className="text-gray-600">Rating Promedio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Header Ad */}
      <HeaderAd />

      {/* Featured Categories */}
      <section className="py-16 bg-white">
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
              { name: 'Recetas Keto', emoji: '🥑', count: '500+', color: 'from-green-400 to-green-600', href: '/recetas-keto' },
              { name: 'Bajar de Peso', emoji: '⚖️', count: 'Guías', color: 'from-blue-400 to-indigo-500', href: '/bajar-de-peso' },
              { name: 'Quemar Grasa', emoji: '🔥', count: 'Tips', color: 'from-red-400 to-pink-500', href: '/quemar-grasa' },
              { name: 'Dieta Keto', emoji: '🧠', count: 'Ciencia', color: 'from-purple-400 to-pink-500', href: '/dieta-keto' },
              { name: 'Blog Keto', emoji: '📝', count: 'Artículos', color: 'from-yellow-400 to-orange-500', href: '/blog' },
              { name: 'Tienda Keto', emoji: '🛒', count: 'Productos', color: 'from-teal-400 to-cyan-500', href: '/tienda-keto' },
              { name: 'Foro Keto', emoji: '💬', count: 'Comunidad', color: 'from-indigo-400 to-blue-500', href: '/foro' },
              { name: 'Low Carb', emoji: '🥬', count: 'Guías', color: 'from-lime-400 to-green-500', href: '/dieta-baja-carbohidratos' },
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

      {/* Content Ad */}
      <ContentAd position="middle" />

      {/* Why Choose Keto */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-white">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center max-w-4xl mx-auto">
              <Link
                href="/recetas-keto"
                className="bg-white text-green-600 px-6 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all duration-200 inline-flex items-center justify-center"
              >
                <span className="mr-2">👨‍🍳</span>
                Recetas Keto
              </Link>
              <Link
                href="/bajar-de-peso"
                className="border-2 border-white text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-200"
              >
                <span className="mr-2">⚖️</span>
                Bajar de Peso
              </Link>
              <Link
                href="/tienda-keto"
                className="bg-yellow-400 text-yellow-900 px-6 py-4 rounded-xl font-semibold text-lg hover:bg-yellow-300 transition-all duration-200"
              >
                <span className="mr-2">🛒</span>
                Tienda Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Content Ad */}
      <ContentAd position="bottom" />
    </>
  )
}