import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'
import { Clock, ChefHat, Users, Star } from 'lucide-react'

interface RecipeCardProps {
  recipe: Post
  onClick?: (recipe: Post) => void
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const imageUrl = recipe.mainImage 
    ? urlFor(recipe.mainImage).url() 
    : '/placeholder-recipe.jpg';

  const publishedDate = recipe.publishedAt ? new Date(recipe.publishedAt) : null;
  const formattedDate = publishedDate 
    ? publishedDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) 
    : 'Fecha desconocida';

  const handleClick = () => {
    if (onClick) {
      onClick(recipe);
    }
  };

  const cardContent = (
    <>
      {/* Contenedor de la Imagen */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden group">
        <Image
          src={imageUrl}
          alt={recipe.title || 'Imagen de receta'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay con categoría */}
        {recipe.category && (
          <div className="absolute top-3 left-3">
            <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              {recipe.category.name || recipe.category.title}
            </span>
          </div>
        )}
        
        {/* Rating overlay */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1">
          <div className="flex items-center text-yellow-500">
            <Star size={14} fill="currentColor" />
            <span className="ml-1 text-xs font-medium text-gray-700">4.8</span>
          </div>
        </div>
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-green-600 transition-colors">
          {recipe.title}
        </h3>
        
        {recipe.excerpt && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {recipe.excerpt}
          </p>
        )}

        {/* Recipe metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            {recipe.cookingTime && (
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{recipe.cookingTime}min</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center">
                <Users size={14} className="mr-1" />
                <span>{recipe.servings}</span>
              </div>
            )}
            {recipe.difficulty && (
              <div className="flex items-center">
                <ChefHat size={14} className="mr-1" />
                <span className="capitalize">{recipe.difficulty}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full border border-gray-100 hover:border-green-200"
      onClick={handleClick}
    >
      {cardContent}
    </div>
  );
}