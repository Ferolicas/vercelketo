// components/RecipeCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/types/sanity' // Asegúrate de que tu tipo Post sea correcto
import { urlFor } from '@/lib/sanity' // Importa urlFor

interface RecipeCardProps {
  recipe: Post // Asegúrate de que Post tenga los campos correctos
  onClick: (recipe: Post) => void // Para cargar la receta individualmente en el contenedor
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  // Generar la URL de la imagen usando urlFor
  const imageUrl = recipe.mainImage ? urlFor(recipe.mainImage).url() : '/placeholder-recipe.jpg'; // Añade un fallback

  // Asegurar que publishedAt sea una cadena para new Date()
  const publishedDate = recipe.publishedAt ? new Date(recipe.publishedAt) : null;
  const formattedDate = publishedDate ? publishedDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Fecha desconocida';

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
      onClick={() => onClick(recipe)}
    >
      {/* Usar la URL generada */}
      {imageUrl && (
        <div className="relative w-full h-48 md:h-56 lg:h-64 overflow-hidden">
          <Image
            src={imageUrl} // Usa la variable imageUrl aquí
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
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
          <span>{formattedDate}</span> {/* Usa la fecha formateada */}
        </div>
      </div>
    </div>
  )
}