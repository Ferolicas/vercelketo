import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { client, queries, getPostsByCategory  } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'
import type { Post, Category, HomePage } from '@/types/sanity'
import { Youtube, Mail, ShoppingCart, ExternalLink, Clock, ChefHat } from 'lucide-react'

// Generar metadatos dinámicos
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category: Category = await client.fetch(queries.categoryBySlug, { slug: params.slug })
  
  return {
    title: `${category?.title || 'Categoría'} - Recetas Keto`,
    description: `Recetas de ${category?.title || 'esta categoría'} para tu estilo de vida keto`,
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  console.log('📂 PÁGINA DE CATEGORÍA CARGANDO:', params.slug)
  
  // Primero obtenemos la categoría para obtener su ID
  const category: Category = await client.fetch(queries.categoryBySlug, { slug: params.slug })
  
  if (!category) {
    return <div>Categoría no encontrada</div>
  }

  // Luego obtenemos los datos restantes
  const [homePageData, posts]: [HomePage, Post[]] = await Promise.all([
    client.fetch(queries.homePage),
    getPostsByCategory(category._id, 1, 12)
  ])

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header Sticky - Reutilizado de la página principal */}
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
        {/* Título de la categoría */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {category.title}
          </h1>
          {category.description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {category.description}
            </p>
          )}
        </div>

        {/* Grid de recetas */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <Link href={`/categorias/${params.slug}/${post.slug.current}`}>
                  {/* Imagen de la receta */}
                  <div className="relative h-48 w-full">
                    {post.mainImage ? (
                      <Image
                        src={urlFor(post.mainImage).width(400).height(300).url()}
                        alt={post.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ChefHat size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Contenido de la tarjeta */}
                  <div className="p-4">
                    {/* Título de la receta */}
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 hover:text-emerald-600 transition-colors">
                      {post.title}
                    </h3>

                    {/* Duración y Dificultad */}
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Clock size={16} className="text-emerald-600" />
                        <span>{post.preparationTime || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ChefHat size={16} className="text-emerald-600" />
                        <span className="capitalize">{post.level || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Autor */}
                    {post.author && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Por: <span className="font-medium">{post.author.name}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ChefHat size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No hay recetas disponibles
            </h3>
            <p className="text-gray-500">
              Aún no se han publicado recetas en esta categoría.
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

// Generar rutas estáticas para mejor rendimiento
export async function generateStaticParams() {
  const categories: Category[] = await client.fetch(queries.categories)
  
  return categories.map((category) => ({
    slug: category.slug.current,
  }))
}

// Configurar revalidación para ISR
export const revalidate = 60 // Revalida cada 60 segundos