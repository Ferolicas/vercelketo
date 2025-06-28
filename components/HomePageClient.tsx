// RUTA: app/components/HomePageClient.tsx

'use client'

import type { HomePage, Category, Post } from '@/types/sanity'
import { Header } from '@/components/Header'
import { CategoryButtons } from '@/components/CategoryButtons'
import { RecipeCard } from '@/components/RecipeCard'
import { RecipePostView } from '@/components/RecipePostView'
import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import confetti from 'canvas-confetti'

interface HomePageClientProps {
  homePageData: HomePage;
  categories: Category[];
  initialRecipes: Post[];
  initialSelectedRecipe: Post | null;
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

  // El estado de la categoría activa se sigue manejando en el cliente para la UI
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(() => searchParams.get('categoria'));
  
  // Los estados para recetas y receta seleccionada ahora se derivan directamente de las props.
  // Esto asegura que la UI siempre refleje los datos que el servidor envía.
  const recipes = initialRecipes;
  const selectedRecipe = initialSelectedRecipe;
  
  const [error, setError] = useState<string | null>(null);

  // La función loadRecipes() ha sido eliminada.

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
        // Solo navegamos. Next.js se encarga de re-renderizar la página con nuevas props.
        router.push(`/?${params.toString()}`);
        setActiveCategorySlug(slug); // Actualiza la UI del botón activo inmediatamente
    });
  };

  const handleRecipeCardClick = (recipe: Post) => {
    startTransition(() => {
        if (recipe.category?.slug?.current && recipe.slug.current) {
            const params = new URLSearchParams(window.location.search);
            params.set('categoria', recipe.category.slug.current);
            params.set('receta', recipe.slug.current);
            // Al cambiar la URL, Next.js proveerá la 'initialSelectedRecipe' correcta en el próximo render.
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
          title: `Receta Keto: ${selectedRecipe.title} en Planeta Keto`,
          text: `Descubre esta increíble receta keto: ${selectedRecipe.title}. ¡Perfecta para tu dieta cetogénica!`,
          url: window.location.href,
        }).then(() => {
          console.log('Receta compartida con éxito');
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
          console.log('Página principal compartida con éxito');
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }).catch((error) => console.error('Error al compartir la página:', error));
      } else {
        alert('Tu navegador no soporta la función de compartir.');
      }
    }
  };
  
  // El estado de carga ahora solo depende de la transición de la navegación.
  const isTransitioning = isPending;
  
  return (
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
                    <CategoryButtons
                        categories={categories}
                        onSelectCategory={handleCategorySelect}
                        activeCategorySlug={activeCategorySlug}
                    />
                </div>
            )}
            {selectedRecipe ? (
                <RecipePostView
                    recipe={selectedRecipe}
                    onBackClick={handleBackToRecipes}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {recipes.length > 0 ? (
                        recipes.map((recipe) => (
                            <RecipeCard key={recipe._id} recipe={recipe} onClick={handleRecipeCardClick} />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-600 text-lg py-10">
                            No hay recetas disponibles {activeCategorySlug ? `en la categoría "${categories.find(cat => cat.slug.current === activeCategorySlug)?.title}"` : 'todavía'}.
                        </p>
                    )}
                </div>
            )}
        </div>
      </main>
    </div>
  )
}