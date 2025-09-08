import { Suspense } from 'react';
import { client, queries } from '@/lib/sanity';
import type { Recipe, Category } from '@/types/sanity';
import { Metadata } from 'next';
import RecetasSaludablesContent from '@/components/RecetasSaludablesContent';

export const metadata: Metadata = {
  title: "Recetas Saludables: Las Mejores Opciones Nutritivas y Deliciosas 2024",
  description: "🌱 Descubre recetas saludables, nutritivas y fáciles de preparar. Opciones bajas en carbohidratos, ricas en nutrientes y perfectas para una vida sana.",
  keywords: "recetas saludables, comida saludable, recetas nutritivas, alimentacion sana, recetas bajas carbohidratos, comida fit, recetas light, alimentacion saludable, cocina saludable, platos saludables, menu saludable",
  openGraph: {
    title: "Recetas Saludables: Alimentación Nutritiva y Deliciosa",
    description: "🌱 Las mejores recetas saludables para nutrir tu cuerpo. Opciones equilibradas, deliciosas y fáciles de preparar para toda la familia.",
    type: "website",
    url: "https://planetaketo.es/recetas-saludables",
    images: [
      {
        url: "/og-recetas-saludables.jpg",
        width: 1200,
        height: 630,
        alt: "Recetas Saludables Nutritivas - Planeta Keto",
      }
    ],
  },
  alternates: {
    canonical: "/recetas-saludables",
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface PageProps {
  searchParams: Promise<{ tipo?: string; calorias?: string; page?: string }>;
}

export default async function RecetasSaludablesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1');
  const tipo = params.tipo;
  const caloriaFilter = params.calorias;

  try {
    const recipesPerPage = 12;
    const offset = (currentPage - 1) * recipesPerPage;
    
    let whereClause = `_type == "recipe"`;
    const queryParams: any = { offset, limit: offset + recipesPerPage - 1 };
    
    // Note: Filtering simplified since Recipe schema doesn't have calories or tags
    // All recipes are healthy by default in this context
    
    // Note: Calorie filtering removed as it's not part of Recipe schema

    const [healthyRecipes, categories, lowCarbRecipes, highProteinRecipes, totalRecipes] = await Promise.all([
      client.fetch<Recipe[]>(`
        *[${whereClause}] | order(averageRating desc, createdAt desc)[$offset...$limit] {
          _id,
          _createdAt,
          name,
          slug,
          thumbnail,
          description,
          createdAt,
          category->{
            name,
            slug
          },
          preparationTime,
          averageRating,
          servings
        }
      `, queryParams),
      client.fetch<Category[]>(queries.allCategories),
      client.fetch<Recipe[]>(`
        *[_type == "recipe"] | order(averageRating desc)[0..6] {
          _id,
          name,
          slug,
          thumbnail,
          averageRating,
          category->{
            name,
            slug
          }
        }
      `),
      client.fetch<Recipe[]>(`
        *[_type == "recipe"] | order(averageRating desc)[0..6] {
          _id,
          name,
          slug,
          thumbnail,
          averageRating,
          category->{
            name,
            slug
          }
        }
      `),
      client.fetch<number>(`count(*[${whereClause}])`, queryParams),
    ]);

    const totalPages = Math.ceil(totalRecipes / recipesPerPage);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 py-12 overflow-hidden">
          {/* Background decorative layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 via-transparent to-emerald-700/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)] opacity-50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent)] opacity-30"></div>
          
          {/* Floating elements */}
          <div className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-6 h-6 bg-white/15 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-10 left-1/4 w-3 h-3 bg-white/25 rounded-full animate-ping delay-700"></div>
          <div className="absolute top-20 right-1/3 w-5 h-5 bg-white/10 rounded-full animate-pulse delay-500"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <span className="text-4xl">🌱</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Recetas Saludables
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Alimentación nutritiva, deliciosa y equilibrada para una vida plena
            </p>
          </div>
        </div>

        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          </div>
        }>
          <RecetasSaludablesContent 
            healthyRecipes={healthyRecipes}
            categories={categories}
            lowCarbRecipes={lowCarbRecipes}
            highProteinRecipes={highProteinRecipes}
            currentPage={currentPage}
            totalPages={totalPages}
            tipo={tipo}
            caloriaFilter={caloriaFilter}
            totalRecipes={totalRecipes}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading recetas saludables:', error);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 py-12 overflow-hidden">
          {/* Background decorative layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 via-transparent to-emerald-700/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)] opacity-50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent)] opacity-30"></div>
          
          {/* Floating elements */}
          <div className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-6 h-6 bg-white/15 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-10 left-1/4 w-3 h-3 bg-white/25 rounded-full animate-ping delay-700"></div>
          <div className="absolute top-20 right-1/3 w-5 h-5 bg-white/10 rounded-full animate-pulse delay-500"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <span className="text-4xl">🌱</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Recetas Saludables
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Alimentación nutritiva, deliciosa y equilibrada para una vida plena
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center text-2xl mb-4">
                    🥗
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Nutritivas</h3>
                  <p className="text-sm text-gray-600">Ricas en vitaminas, minerales y antioxidantes</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-4">
                    ⚖️
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Equilibradas</h3>
                  <p className="text-sm text-gray-600">Perfecta proporción de macronutrientes</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-2xl mb-4">
                    😋
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Deliciosas</h3>
                  <p className="text-sm text-gray-600">Sabores increíbles sin sacrificar la salud</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}