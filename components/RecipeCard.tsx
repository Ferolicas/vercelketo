import Image from 'next/image'
import type { Post } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'

interface RecipeCardProps {
  recipe: Post
  onClick: (recipe: Post) => void
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const imageUrl = recipe.mainImage 
    ? urlFor(recipe.mainImage).url() 
    : '/placeholder-recipe.jpg'; // Imagen de respaldo

  const publishedDate = recipe.publishedAt ? new Date(recipe.publishedAt) : null;
  const formattedDate = publishedDate 
    ? publishedDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) 
    : 'Fecha desconocida';

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
      onClick={() => onClick(recipe)}
    >
      {/* Contenedor de la Imagen */}
      {imageUrl && (
        <div className="relative w-full h-48 bg-gray-100 md:h-56 lg:h-64">
          <Image
            src={imageUrl}
            alt={recipe.title || 'Imagen de receta'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            // 👇 ESTA ES LA LÍNEA CORREGIDA
            style={{ objectFit: 'contain' }} 
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Contenido de la Tarjeta */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
            {recipe.title}
          </h3>
          {recipe.excerpt && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
              {recipe.excerpt}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <span>{recipe.category?.title || 'Sin Categoría'}</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  )
}