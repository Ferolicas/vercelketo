import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { client, queries } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'
import type { Category, HomePage } from '@/types/sanity'
import { Youtube, Mail, ShoppingCart, ExternalLink, ChefHat } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Categorías - Recetas Keto',
  description: 'Explora todas nuestras categorías de recetas keto',
}

export default async function CategoriasPage() {
  console.log('📂 PÁGINA CATEGORÍAS CARGANDO')
  
  // Obtener datos de la homepage y categorías
  const [homePageData, categories]: [HomePage, Category[]] = await Promise.all([
    client.fetch(queries.homePage),
    client.fetch(queries.categories)
  ])

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header Sticky - Mismo estilo que la página de categoría */}
      <header className="sticky top-0 z-50 bg-emerald-600 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center h-20">
            {/* Logo */}
            <div className="w-2/5 flex justify-center">
              {homePageData.heroImage && (
                <Link href="/">
                  <div className="relative w-20 h-20 cursor-pointer">
                    <Image
                      src={urlFor(homePageData.heroImage).width(80).height(80).url()}
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>
              )}
            </div>

            {/* Contenido del sitio */}
            <div className="w-3/5 flex flex-col justify-center pl-6">
              <Link href="/">
                <h1 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight cursor-pointer hover:text-emerald-100 transition-colors">
                  {homePageData.siteTitle || 'Mi Sitio'}
                </h1>
              </Link>

              {/* Iconos en fila */}
              <div className="flex space-x-3">
                {homePageData.youtubeUrl && (
                  <Link 
                    href={homePageData.youtubeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-red-300 transition-colors"
                  >
                    <Youtube size={20} />
                  </Link>
                )}

                {homePageData.email && (
                  <Link 
                    href={`mailto:${homePageData.email}`}
                    className="text-white hover:text-blue-300 transition-colors"
                  >
                    <Mail size={20} />
                  </Link>
                )}

                <Link 
                  href="#" 
                  className="text-white hover:text-yellow-300 transition-colors"
                >
                  <ShoppingCart size={20} />
                </Link>

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

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Título de la página */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Todas las Categorías
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre nuestras deliciosas recetas organizadas por categorías
          </p>
        </div>

        {/* Grid de categorías */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <Link href={`/categorias/${category.slug.current}`}>
                  {/* Imagen de la categoría */}
                  <div className="relative w-full h-58 bg-gradient-to-br from-orange-50 to-emerald-50 flex items-center justify-center">
                      {category.categoryImage ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={urlFor(category.categoryImage).url()}
                            alt={category.title}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                            sizes="100vw"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ChefHat size={48} className="text-emerald-600" />
                        </div>
                      )}
                    </div>


                  {/* Contenido de la tarjeta */}
                  <div className="p-6">
                    {/* Título de la categoría */}
                    <h3 className="font-bold text-xl text-gray-800 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {category.title}
                    </h3>

                    {/* Descripción */}
                    {category.description && (
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {category.description}
                      </p>
                    )}

                    {/* Indicador visual */}
                    <div className="mt-4 flex items-center text-emerald-600 text-sm font-medium">
                      <span>Ver recetas</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ChefHat size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No hay categorías disponibles
            </h3>
            <p className="text-gray-500">
              Aún no se han creado categorías.
            </p>
            <Link href="/">
              <button className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
                Volver al inicio
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

// Configurar revalidación para ISR
export const revalidate = 60
