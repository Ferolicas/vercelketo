import { Suspense } from 'react';
import { generateSEOMetadata } from '@/components/SEOHead';
import ModernRecipesPage from '@/components/ModernRecipesPage';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// SEO metadata
export async function generateMetadata() {
  return generateSEOMetadata({
    title: 'Recetas Keto | Deliciosas Recetas Cetogénicas',
    description: 'Descubre recetas keto organizadas por categorías: desayunos, almuerzos, cenas, aperitivos y postres. Cada receta incluye video, ingredientes y valoraciones.',
    keywords: 'recetas keto, recetas cetogénicas, desayuno keto, almuerzo keto, cena keto, aperitivos keto, postres keto',
    url: '/recetas',
    type: 'website'
  });
}

export default function RecetasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <div className="pt-16">
        {/* Header moderno */}
        <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 py-20 overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          
          {/* Floating elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 right-10 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl text-white text-4xl mb-8 shadow-2xl">
              🍽️
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Recetas
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mt-2">
                Keto
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-green-50 max-w-3xl mx-auto leading-relaxed font-light">
              Explora nuestra colección de recetas cetogénicas organizadas por categorías.
              <span className="block mt-2 font-medium">
                ¡Con videos, ingredientes y valoraciones reales!
              </span>
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-white">
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm opacity-90">Categorías</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-white">
                <div className="text-2xl font-bold">∞</div>
                <div className="text-sm opacity-90">Recetas</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-white">
                <div className="text-2xl font-bold">⭐</div>
                <div className="text-sm opacity-90">Con Videos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <Suspense 
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mb-4 mx-auto"></div>
                <p className="text-gray-600 text-lg">Cargando deliciosas recetas...</p>
              </div>
            </div>
          }
        >
          <ModernRecipesPage />
        </Suspense>
      </div>
    </div>
  );
}