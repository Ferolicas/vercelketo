'use client';

import { useState, useEffect } from 'react';
import { client, queries } from '@/lib/sanity';
import type { Category, Post } from '@/types/sanity';
import { RecipeCard } from '@/components/RecipeCard';
import { ChefHat } from 'lucide-react';

export default function RecetasContentClient() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Cargando datos desde cliente...');
        
        const [categoriesData, postsData] = await Promise.all([
          client.fetch<Category[]>(queries.allCategories),
          client.fetch<Post[]>(queries.allPosts)
        ]);
        
        console.log('✅ Datos cargados:', {
          posts: postsData.length,
          categories: categoriesData.length
        });
        
        setCategories(categoriesData || []);
        setAllPosts(postsData || []);
        
      } catch (err) {
        console.error('❌ Error cargando datos:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter posts by selected category
  const filteredPosts = selectedCategory 
    ? allPosts.filter(post => post.category?.slug?.current === selectedCategory)
    : allPosts;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="text-red-600 mb-4">❌ Error: {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* DEBUG INFO */}
      <div className="mb-4 p-2 bg-gray-100 text-xs text-gray-600">
        🔍 CLIENT-SIDE: {allPosts.length} recetas, {categories.length} categorías, {filteredPosts.length} filtradas
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

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPosts.map((post) => (
          <RecipeCard
            key={post._id}
            recipe={post}
            onClick={(recipe) => {
              console.log('Recipe clicked:', recipe.title);
            }}
          />
        ))}
      </div>

      {/* No results */}
      {filteredPosts.length === 0 && !loading && (
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