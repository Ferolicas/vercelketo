import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { client, queries, getPostsByCategory  } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'
import type { Post, Category, HomePage } from '@/types/sanity'
import { Clock, ChefHat, ArrowLeft } from 'lucide-react'
import { Header } from '@/components/Header' // ✅ Importar el componente
import { ScrollToTop } from '@/components/ScrollToTop' // ✅ Importar ScrollToTop


// ✅ CORREGIDO: generateMetadata con params como Promise
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params
  const category: Category = await client.fetch(queries.categoryBySlug, { slug })
  
  return {
    title: `${category?.title || 'Categoría'} - Recetas Keto`,
    description: `Recetas de ${category?.title || 'esta categoría'} para tu estilo de vida keto`,
  }
}

// ✅ CORREGIDO: params como Promise en Next.js 15
export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // ✅ CORREGIDO: Await params para obtener los valores
  const { slug } = await params
  
  console.log('📂 PÁGINA DE CATEGORÍA CARGANDO:', slug)
  
  // Primero obtenemos la categoría para obtener su ID
  const category: Category = await client.fetch(queries.categoryBySlug, { slug })
  
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
      {/* ✅ Usar el componente Header */}
      <Header homePageData={homePageData} />

      {/* Botón de regreso */}
      <div className="container mx-auto px-4 pt-6">
        <Link 
          href={`/categorias/`}
          scroll={false}
          className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver a categorìas</span>
        </Link>
      </div>

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
                <Link href={`/categorias/${slug}/${post.slug.current}`} scroll={false}>
                  {/* Imagen de la receta */}
                  <div className="relative w-full h-64 bg-gradient-to-br from-orange-50 to-emerald-50 flex items-center justify-center">
                    {post.mainImage ? (
                      <Image
                        src={urlFor(post.mainImage).url()}
                        alt={post.title}
                        fill
                        className="object-contain hover:scale-105 transition-transform duration-300"
                        sizes="100vw"
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
            <Link href="/" scroll={false}>
              <button className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
                Volver al inicio
              </button>
            </Link>
          </div>
        )}
      </main>
      {/* ✅ Botón de scroll to top */}
            <ScrollToTop />
    </div>
  )
}

// ✅ CORREGIDO: generateStaticParams con tipo de retorno explícito
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const categories: Category[] = await client.fetch(queries.categories)
  
  return categories.map((category) => ({
    slug: category.slug.current,
  }))
}

// Configurar revalidación para ISR
export const revalidate = 60