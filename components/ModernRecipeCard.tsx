'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';
import type { Recipe } from '@/types/sanity';
import { Clock, Users, Star, Play, Heart } from 'lucide-react';

interface ModernRecipeCardProps {
  recipe: Recipe;
}

export default function ModernRecipeCard({ recipe }: ModernRecipeCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = recipe.thumbnail && !imageError
    ? urlFor(recipe.thumbnail).width(400).height(300).url()
    : '/placeholder-recipe.jpg';

  const rating = recipe.averageRating || 0;
  const totalRatings = recipe.totalRatings || 0;

  return (
    <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={recipe.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
        
        {/* Category Badge */}
        {recipe.category && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
              {recipe.category.icon}
              {recipe.category.name}
            </span>
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group/like"
        >
          <Heart 
            size={18} 
            className={`transition-all duration-300 ${
              isLiked 
                ? 'text-red-500 fill-red-500 scale-110' 
                : 'text-gray-600 group-hover/like:text-red-500'
            }`}
          />
        </button>

        {/* Play Button Overlay */}
        {recipe.youtubeUrl && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play size={24} className="text-white ml-1" fill="white" />
            </div>
          </div>
        )}

        {/* Rating Badge */}
        {rating > 0 && (
          <div className="absolute bottom-4 left-4 z-10">
            <div className="inline-flex items-center gap-1 bg-yellow-400/95 backdrop-blur-sm text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              <Star size={12} fill="currentColor" />
              {rating.toFixed(1)}
              <span className="text-yellow-700">({totalRatings})</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors duration-300">
          {recipe.name}
        </h3>

        {/* Description */}
        {recipe.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            {recipe.preparationTime && (
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-green-500" />
                <span className="font-medium">{recipe.preparationTime}min</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users size={14} className="text-blue-500" />
                <span className="font-medium">{recipe.servings}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/recetas/${recipe.slug.current}` as any}
          className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Ver Receta Completa
        </Link>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
}