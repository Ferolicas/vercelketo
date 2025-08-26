'use client';

import { useState, useEffect } from 'react';
import { urlFor } from '@/lib/sanity';
import type { Recipe, Category } from '@/types/sanity';
import ModernRecipeCard from '@/components/ModernRecipeCard';
import { ChefHat, Filter } from 'lucide-react';

export default function ModernRecipesPage() {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data only once
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [recipesRes, categoriesRes] = await Promise.all([
        fetch('/api/recipes'), // Always load ALL recipes
        fetch('/api/categories')
      ]);

      const recipesData = await recipesRes.json();
      const categoriesData = await categoriesRes.json();

      if (!recipesData.success) throw new Error(recipesData.error);
      if (!categoriesData.success) throw new Error(categoriesData.error);

      setAllRecipes(recipesData.data || []);
      setCategories(categoriesData.data || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter recipes on client side - INSTANT filtering!
  const filteredRecipes = selectedCategory 
    ? allRecipes.filter(recipe => recipe.category?._id === selectedCategory)
    : allRecipes;

  if (loading) {
    return (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-3xl mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <ChefHat size={48} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-xl font-bold text-red-800 mb-2">Error al cargar recetas</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={loadData}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <Filter size={24} className="text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-800">Filtrar por categoría</h2>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`group relative px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/30'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <span className="relative z-10">
                🍽️ Todas las Recetas ({allRecipes.length})
              </span>
              {selectedCategory === null && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              )}
            </button>

            {categories.map((category) => {
              const categoryRecipes = allRecipes.filter(r => r.category?._id === category._id);
              return (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category._id)}
                  className={`group relative px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category._id
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/30'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <span className="relative z-10">
                    {category.icon} {category.name} ({categoryRecipes.length})
                  </span>
                  {selectedCategory === category._id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredRecipes.map((recipe) => (
              <ModernRecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ChefHat size={80} className="mx-auto text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold text-gray-600 mb-4">
              No hay recetas en esta categoría
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Aún no tenemos recetas en esta categoría, pero pronto agregaremos deliciosas opciones.
            </p>
            <button
              onClick={() => setSelectedCategory(null)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-green-500/30"
            >
              Ver Todas las Recetas
            </button>
          </div>
        )}

        {/* CTA Section */}
        {filteredRecipes.length > 0 && (
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h3>
              <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
                Tenemos más recetas agregándose cada día. ¡Síguenos para no perderte las nuevas delicias keto!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-white text-green-600 font-bold py-3 px-8 rounded-xl hover:bg-green-50 transition-colors">
                  Suscribirse
                </button>
                <button className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                  Ver Blog
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}