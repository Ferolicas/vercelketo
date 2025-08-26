'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import type { HomePage, Category, Post } from '@/types/sanity';
// import { Header } from '@/components/Header'; // Removed duplicate header
import { Clock, ChefHat, Users } from 'lucide-react';
import { RecipeCard } from '@/components/RecipeCard';

interface RecetasContentProps {
  homePageData: HomePage | null;
  categories: Category[];
  allPosts: Post[];
}

export default function RecetasContent({ homePageData, categories, allPosts }: RecetasContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Debug: Verificar props recibidas
  console.log('🔍 RecetasContent recibió:', {
    posts: allPosts.length,
    categories: categories.length,
    firstPost: allPosts[0]?.title
  });

  // Filter posts by selected category
  const filteredPosts = selectedCategory 
    ? allPosts.filter(post => post.category?.slug?.current === selectedCategory)
    : allPosts;

  // DEBUG TEMPORAL VISIBLE - Solo para diagnosticar el problema en producción
  const debugInfo = {
    totalPosts: allPosts.length,
    totalCategories: categories.length,
    filteredPosts: filteredPosts.length,
    selectedCategory,
    firstPostTitle: allPosts[0]?.title,
    firstPostSlug: allPosts[0]?.slug?.current,
    firstPostImage: !!allPosts[0]?.mainImage || !!allPosts[0]?.image
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* DEBUG INFO TEMPORAL - VISIBLE EN PRODUCCIÓN */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
            <h3 className="font-bold text-yellow-800 mb-2">🔍 DEBUG INFO:</h3>
            <pre className="text-xs text-yellow-700">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
        
        {/* DEBUG PERMANENTE PARA PRODUCCIÓN */}
        <div className="mb-4 p-2 bg-gray-100 text-xs text-gray-600">
          Debug: {allPosts.length} recetas, {categories.length} categorías, {filteredPosts.length} filtradas
        </div>

        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === null
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
              }`}
            >
              Todas las Recetas ({allPosts.length})
            </button>
            {categories.map((category) => {
              const categoryPosts = allPosts.filter(post => post.category?.slug?.current === category.slug.current);
              return (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category.slug.current)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.slug.current
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
                  }`}
                >
                  {category.title} ({categoryPosts.length})
                </button>
              );
            })}
          </div>
        </div>

        {/* Recipes Grid - Clean and Perfect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.map((post) => (
            <RecipeCard
              key={post._id}
              recipe={post}
              onClick={(recipe) => {
                // Navigate to recipe detail page when implemented
                console.log('Recipe clicked:', recipe.title);
              }}
            />
          ))}
        </div>

        {/* No results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <ChefHat size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No hay recetas en esta categoría
            </h3>
            <p className="text-gray-500 mb-6">
              Intenta seleccionar una categoría diferente o ver todas las recetas.
            </p>
            <button
              onClick={() => setSelectedCategory(null)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
            >
              Ver Todas las Recetas
            </button>
          </div>
        )}
      </div>
  );
}