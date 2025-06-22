import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { client, queries } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'
import type { HomePage } from '@/types/sanity'
import { Youtube, Mail, ShoppingCart, ExternalLink } from 'lucide-react'
import { Header } from '@/components/Header' // ✅ Importar el componente

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
      {/* ✅ Usar el componente Header */}
      <Header homePageData={homePageData} />

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