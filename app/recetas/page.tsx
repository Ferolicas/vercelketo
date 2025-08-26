import { Suspense } from 'react';
import { client, queries } from '@/lib/sanity';
import type { Category, Post, HomePage } from '@/types/sanity';
import RecetasContent from '@/components/RecetasContent';
import { generateSEOMetadata } from '@/components/SEOHead';

// Force dynamic to ensure recipes load fresh from Sanity
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// SEO optimizado para la página de recetas
export async function generateMetadata() {
  return generateSEOMetadata({
    title: 'Recetas Keto | +500 Recetas Cetogénicas Gratis en Español',
    description: 'Descubre la colección más completa de recetas keto en español. Desayunos, comidas, cenas, postres y snacks cetogénicos para perder peso deliciosamente.',
    keywords: 'recetas keto, recetas cetogénicas, desayuno keto, comida keto, cena keto, postres keto, recetas bajas en carbohidratos, dieta keto recetas, keto en español, recetas sin azúcar, recetas keto fáciles, recetas keto rápidas',
    url: '/recetas',
    type: 'website'
  });
}

interface RecetasPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RecetasPage({ searchParams }: RecetasPageProps) {
  let homePageData: HomePage | null = null;
  let categories: Category[] = [];
  let allPosts: Post[] = [];

  try {
    // Fetch data with error handling for Next.js 15
    [homePageData, categories, allPosts] = await Promise.all([
      client.fetch<HomePage>(queries.homePage).catch(() => null),
      client.fetch<Category[]>(queries.allCategories).catch(() => []),
      client.fetch<Post[]>(queries.allPosts).catch(() => [])
    ]);

    // Logging for production debugging
    console.log(`✅ Loaded ${allPosts.length} recipes and ${categories.length} categories`);
    
    // Ensure we always have arrays even if null/undefined
    const safeAllPosts = allPosts || [];
    const safeCategories = categories || [];

    return (
      <div className="pt-16">
        {/* Header de la sección de recetas */}
        <div className="bg-gradient-to-br from-green-50 via-white to-green-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl text-white text-3xl mb-4">
                🍽️
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Recetas <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">Keto</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explora nuestra colección completa de recetas cetogénicas organizadas por categorías. 
                ¡Encuentra tu próxima comida favorita!
              </p>
            </div>
          </div>
        </div>

        {/* Contenido principal simplificado para Next.js 15 */}
        <Suspense fallback={
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          </div>
        }>
          <RecetasContent
            homePageData={homePageData}
            categories={safeCategories}
            allPosts={safeAllPosts}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading recipes page:', error);
    return (
      <div className="pt-16 flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar las recetas</h2>
          <p className="text-gray-600">Por favor, intenta recargar la página.</p>
        </div>
      </div>
    );
  }
}