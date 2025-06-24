import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { client, queries } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'
import type { HomePage } from '@/types/sanity'
import { Youtube, Mail, ShoppingCart, ExternalLink } from 'lucide-react'
import { Header } from '@/components/Header'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Recetas Keto Gratis | Planeta Keto Recetas Cetogénicas",
    description: "✅ Pierde peso con nuestras recetas keto comprobadas. desayunos, almuerzos, cenas, postres y aperitivos keto fáciles. Para perder peso y cuidar tu salud",
    keywords: "keto, dieta keto, recetas keto, perder peso, desayuno keto, comida cetogénica, quemar grasa,pan nube keto, pan keto, pan sin harina, receta keto, receta baja en carbohidratos, keto en español, dieta cetogénica, pan esponjoso keto, pan con orégano, pan con queso, keto fácil, keto para principiantes, keto sin gluten, keto sin harina, keto recetas fáciles, keto rápido, keto diet, ketogenic diet, comida keto, recetas saludables, pan keto casero"
  }
}

export default async function HomePage() {
  const homePageData: HomePage = await client.fetch(queries.homePage)

  return (
    <div className="w-full min-h-[100dvh] bg-orange-50 flex flex-col">
      {/* Header */}
      <Header homePageData={homePageData} />

      {/* Contenido principal - Ocupa el resto del espacio disponible */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Título y descripción centrados - Ocupa la mayor parte del espacio */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 py-8">
          <div className="text-center max-w-4xl">
            {/* Título principal - Tamaño responsivo mejorado */}
            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight">
              {homePageData.heroTitle}
            </h1>
            
            {/* Descripción - Tamaño y espaciado optimizado */}
            {homePageData.heroDescription && (
              <p className="text-xl sm:text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                {homePageData.heroDescription}
              </p>
            )}
          </div>
        </div>

        {/* Botón en la parte inferior - Espaciado fijo */}
        <div className="pb-8 pt-4 flex justify-center flex-shrink-0">
          <Link href="/categorias">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full text-4xl md:text-xl shadow-lg transition-all duration-300 transform hover:scale-110 animate-bounce">
              Ver Recetas
            </button>
          </Link>
        </div>
      </main>
      
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Planeta Keto",
            "url": "https://planetaketo.es",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://planetaketo.es/buscar?q={search_term}",
              "query-input": "required name=search_term"
            }
          })
        }}
      />
    </div>
  )
}

// Configurar revalidación para ISR
export const revalidate = 60 // Revalida cada 60 segundos