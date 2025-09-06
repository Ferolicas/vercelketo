// RUTA: app/components/HomePageClient.tsx

'use client'

import type { Category, Recipe } from '@/types/sanity'
import { Header } from '@/components/Header'
import { CategoryButtons } from '@/components/CategoryButtons'
import { RecipeCard } from '@/components/RecipeCard'
import { RecipePostView } from '@/components/RecipePostView'
import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import confetti from 'canvas-confetti'
import { ScrollToTop } from '@/components/ScrollToTop' // 👈 Componente importado

interface HomePageClientProps {
  homePageData: any;
  categories: Category[];
  initialRecipes: Recipe[];
  initialSelectedRecipe: Recipe | null;
}

export default function HomePageClient({ 
  homePageData, 
  categories, 
  initialRecipes, 
  initialSelectedRecipe
}: HomePageClientProps) {

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(() => searchParams.get('categoria'));
  
  const recipes = initialRecipes;
  const selectedRecipe = initialSelectedRecipe;
  
  const [error, setError] = useState<string | null>(null);

  const handleCategorySelect = (slug: string | null) => {
    startTransition(() => {
        const params = new URLSearchParams(window.location.search);
        if (slug) {
            params.set('categoria', slug);
            params.delete('receta');
        } else {
            params.delete('categoria');
            params.delete('receta');
        }
        router.push(`/?${params.toString()}`);
        setActiveCategorySlug(slug);
    });
  };

  const handleRecipeCardClick = (recipe: Recipe) => {
    startTransition(() => {
        if (recipe.category?.slug?.current && recipe.slug.current) {
            const params = new URLSearchParams(window.location.search);
            params.set('categoria', recipe.category.slug.current);
            params.set('receta', recipe.slug.current);
            router.push(`?${params.toString()}`);
        } else {
            setError("Datos de receta incompletos.");
        }
    });
  };

  const handleBackToRecipes = () => {
    startTransition(() => {
        const params = new URLSearchParams(window.location.search);
        params.delete('receta');
        router.push(`?${params.toString()}`);
    });
  };
  
  const handleShare = () => {
    if (selectedRecipe) {
      if (navigator.share) {
        navigator.share({
          title: `Receta Keto: ${selectedRecipe.name} en Planeta Keto`,
          text: `Descubre esta increíble receta keto: ${selectedRecipe.name}. ¡Perfecta para tu dieta cetogénica!`,
          url: window.location.href,
        }).then(() => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Receta compartida con éxito');
          }
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        }).catch((error) => console.error('Error al compartir la receta:', error));
      } else {
        alert('Tu navegador no soporta la función de compartir.');
      }
    } else if (homePageData) {
      if (navigator.share) {
        navigator.share({
          title: homePageData.siteTitle || 'Planeta Keto',
          text: homePageData.heroDescription || 'Descubre las mejores recetas keto.',
          url: window.location.href,
        }).then(() => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Página principal compartida con éxito');
          }
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }).catch((error) => console.error('Error al compartir la página:', error));
      } else {
        alert('Tu navegador no soporta la función de compartir.');
      }
    }
  };
  
  const isTransitioning = isPending;
  
  return (
    <>
      <div className="w-full min-h-[100dvh] bg-white flex flex-col relative">
        {isTransitioning && <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400 animate-pulse z-50"></div>}
        <Header
          homePageData={homePageData}
          onShareClick={handleShare}
          showShareButton={!!homePageData}
        />
        <main className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-white scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {!selectedRecipe && (
                  <div className="mb-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 px-4 -mx-4 pb-2">
                      <div className="inline-flex space-x-2">
                          <CategoryButtons 
                              categories={categories} 
                              activeCategorySlug={activeCategorySlug} 
                              onSelectCategory={handleCategorySelect} 
                          />
                      </div>
                  </div>
              )}

              {/* Error Message */}
              {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                  </div>
              )}

              {selectedRecipe ? (
                  <RecipePostView
                      recipe={selectedRecipe}
                      onBackClick={handleBackToRecipes}
                  />
              ) : (
                  <>
                      {recipes.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                              {recipes.map((recipe) => (
                                  <RecipeCard
                                      key={recipe._id}
                                      recipe={recipe}
                                      onClick={handleRecipeCardClick}
                                  />
                              ))}
                          </div>
                      ) : (
                          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                              <p className="text-gray-500 text-lg mb-4">
                                  {activeCategorySlug 
                                      ? "No se encontraron recetas para esta categoría." 
                                      : "No hay recetas disponibles."}
                              </p>
                              {activeCategorySlug && (
                                  <button
                                      onClick={() => handleCategorySelect(null)}
                                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                  >
                                      Ver todas las recetas
                                  </button>
                              )}
                          </div>
                      )}
                  </>
              )}
          </div>
        </main>
      </div>
      <ScrollToTop />
    </>
  )
}