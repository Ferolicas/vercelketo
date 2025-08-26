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
  // Fetch data server-side to avoid CORS issues
  let categories: Category[] = [];
  let allPosts: Post[] = [];
  let homePageData: HomePage | null = null;
  let error = null;

  try {
    console.log('🔄 SERVER: Fetching data from Sanity...');
    
    [homePageData, categories, allPosts] = await Promise.all([
      client.fetch<HomePage>(queries.homePage).catch(() => null),
      client.fetch<Category[]>(queries.allCategories).catch(() => []),
      client.fetch<Post[]>(queries.allPosts).catch(() => [])
    ]);

    console.log(`✅ SERVER: Loaded ${allPosts.length} recipes and ${categories.length} categories`);
    
  } catch (err) {
    console.error('❌ SERVER ERROR:', err);
    error = err instanceof Error ? err.message : 'Error desconocido';
  }

  if (error) {
    return (
      <div className="pt-16 flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error del servidor</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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

      {/* Server-rendered content - no hydration mismatch */}
      <RecetasContent
        homePageData={homePageData}
        categories={categories || []}
        allPosts={allPosts || []}
      />
    </div>
  );
}