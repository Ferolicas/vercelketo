import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { client, queries } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'
import type { HomePage } from '@/types/sanity'
import { Youtube, Mail, ShoppingCart, ExternalLink } from 'lucide-react'

// Generar metadatos dinámicos
export async function generateMetadata(): Promise<Metadata> {
  const homePageData: HomePage = await client.fetch(queries.homePage)
  
  return {
    title: homePageData.siteTitle || 'Recetas Keto',
    description: homePageData.heroDescription || 'Las mejores recetas keto para tu estilo de vida saludable',
  }
}

export default async function HomePage() {
  // Obtener datos desde Sanity
  console.log('🏠 PÁGINA PRINCIPAL CARGANDO')
  const homePageData: HomePage = await client.fetch(queries.homePage)

  return (
    <div className="h-screen bg-orange-50 overflow-hidden">
      {/* Header Sticky - Altura reducida para dar más espacio al contenido */}
      <header className="sticky top-0 z-50 bg-emerald-600 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center h-20">
            {/* Logo - Más grande y mejor proporcionado */}
            <div className="w-2/5 flex justify-start">
              {homePageData.heroImage && (
                <div className="relative w-23 h-23">
                  <Image
                    src={urlFor(homePageData.heroImage).width(80).height(80).url()}
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            {/* Contenido del sitio - Ajustado para mejor balance */}
            <div className="w-5/5 flex flex-col justify-center pl-6">
              {/* Nombre del sitio - Tamaño reducido para mejor proporción */}
              <h1 className="text-3xl md:text-6xl font-bold text-white mb-2 leading-tight">
                {homePageData.siteTitle || 'Mi Sitio'}
              </h1>

              {/* Iconos en fila - Tamaño ligeramente reducido */}
              <div className="flex justify-center space-x-3">
                {/* YouTube */}
                {homePageData.youtubeUrl && (
                  <Link 
                    href={homePageData.youtubeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-red-300 transition-colors"
                  >
                    <Youtube size={30} />
                  </Link>
                )}

                {/* Email */}
                {homePageData.email && (
                  <Link 
                    href={`mailto:${homePageData.email}`}
                    className="text-white hover:text-blue-300 transition-colors"
                  >
                    <Mail size={30} />
                  </Link>
                )}

                {/* Amazon (icono de carrito de compras) */}
                <Link 
                  href="#" 
                  className="text-white hover:text-yellow-300 transition-colors"
                >
                  <ShoppingCart size={30} />
                </Link>

                {/* Hotmart */}
                {homePageData.hotmartUrl && (
                  <Link 
                    href={homePageData.hotmartUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-orange-300 transition-colors"
                  >
                    <ExternalLink size={20} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal - Mejor distribución del espacio vertical */}
      <main className="flex flex-col" style={{ height: 'calc(100vh - 104px)' }}>
        {/* Título y descripción centrados - Espacio optimizado */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 py-8">
          <div className="text-center max-w-4xl">
            {/* Título principal - Tamaño responsivo mejorado */}
            <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight">
              {homePageData.heroTitle}
            </h2>
            
            {/* Descripción - Tamaño y espaciado optimizado */}
            {homePageData.heroDescription && (
              <p className="text-xl sm:text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                {homePageData.heroDescription}
              </p>
            )}
          </div>
        </div>

        {/* Botón en la parte inferior - Espaciado reducido */}
        <div className="pb-8 flex justify-center">
          <Link href="/categorias">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full text-3xl md:text-xl shadow-lg transition-all duration-300 transform hover:scale-110 animate-bounce">
              Ver Recetas
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}

// Configurar revalidación para ISR
export const revalidate = 60 // Revalida cada 60 segundos