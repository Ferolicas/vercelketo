import { Metadata } from 'next'
import { client, queries } from '@/lib/sanity'
import { Category } from '@/types/sanity'
import CategoryCard from '@/components/CategoryCard'

export const metadata: Metadata = {
  title: 'Categorías - Recetas Keto',
  description: 'Explora todas nuestras categorías de recetas keto',
}

export default async function CategoriasPage() {
  // Obtener todas las categorías desde Sanity
  console.log('📂 PÁGINA CATEGORÍAS CARGANDO')
  const categories: Category[] = await client.fetch(queries.categories)

  return (
    <div className="min-h-screen bg-amber-50">
      <main className="container mx-auto px-4 py-8">
        {/* Título de la página */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Todas las Categorías
          </h1>
          <p className="text-lg text-gray-600">
            Descubre nuestras deliciosas recetas organizadas por categorías
          </p>
        </div>

        {/* Grid de categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>

        {/* Mensaje si no hay categorías */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No hay categorías disponibles en este momento.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

// Configurar revalidación para ISR
export const revalidate = 60