import { Suspense } from 'react';
import { client, queries } from '@/lib/sanity';
import type { Recipe, Category } from '@/types/sanity';
import { Metadata } from 'next';
import RecetasKetoContent from '@/components/RecetasKetoContent';

export const metadata: Metadata = {
  title: "Recetas Keto: +500 Recetas Cetogénicas Fáciles y Deliciosas 2024",
  description: "👨‍🍳 Descubre las mejores recetas keto: desayunos, comidas, cenas y postres cetogénicos. Paso a paso, con macros calculados. ¡Transforma tu cocina keto hoy!",
  keywords: "recetas keto, recetas cetogenicas, comida keto, desayuno keto, cena keto, postres keto, recetas bajas carbohidratos, cocina keto, menu keto, recetas keto faciles, platos keto, comidas cetogenicas",
  openGraph: {
    title: "Recetas Keto: Las Mejores 500+ Recetas Cetogénicas en Español",
    description: "👨‍🍳 Recetas keto probadas y deliciosas para cada momento del día. Con ingredientes fáciles de encontrar y paso a paso detallado.",
    type: "website",
    url: "https://planetaketo.es/recetas-keto",
    images: [
      {
        url: "/og-recetas-keto.jpg",
        width: 1200,
        height: 630,
        alt: "Recetas Keto Deliciosas - Planeta Keto",
      }
    ],
  },
  alternates: {
    canonical: "/recetas-keto",
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface PageProps {
  searchParams: Promise<{ categoria?: string; dificultad?: string; tiempo?: string; page?: string }>;
}

export default async function RecetasKetoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1');
  const selectedCategory = params.categoria;
  const difficulty = params.dificultad;
  const timeFilter = params.tiempo;

  try {
    const recipesPerPage = 12;
    const offset = (currentPage - 1) * recipesPerPage;
    
    let whereClause = `_type == "recipe"`;
    const queryParams: any = { offset, limit: offset + recipesPerPage - 1 };
    
    if (selectedCategory) {
      whereClause += ` && category->slug.current == $category`;
      queryParams.category = selectedCategory;
    }
    
    // Note: difficulty filtering removed as it's not part of Recipe schema
    // All recipes are keto by default
    
    if (timeFilter) {
      if (timeFilter === 'rapido') {
        whereClause += ` && preparationTime match "*min*" && (preparationTime match "*15*" || preparationTime match "*10*" || preparationTime match "*5*")`;
      } else if (timeFilter === 'medio') {
        whereClause += ` && preparationTime match "*min*" && (preparationTime match "*30*" || preparationTime match "*45*")`;
      }
    }

    const [recipes, categories, featuredRecipes, popularRecipes, totalRecipes] = await Promise.all([
      client.fetch<Recipe[]>(`
        *[${whereClause}] | order(createdAt desc)[$offset...$limit] {
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
          servings,
          ingredients,
          preparation,
          youtubeUrl
        }
      `, queryParams),
      client.fetch<Category[]>(queries.allCategories),
      client.fetch<Recipe[]>(`
        *[_type == "recipe" && averageRating >= 4.5] | order(averageRating desc)[0..6] {
          _id,
          name,
          slug,
          thumbnail,
          averageRating,
          preparationTime,
          category->{
            name,
            slug
          }
        }
      `),
      client.fetch<Recipe[]>(`
        *[_type == "recipe"] | order(createdAt desc)[0..8] {
          _id,
          name,
          slug,
          thumbnail,
          description,
          preparationTime,
          averageRating
        }
      `),
      client.fetch<number>(`count(*[${whereClause}])`, queryParams),
    ]);

    const totalPages = Math.ceil(totalRecipes / recipesPerPage);

    return (
      <div className="min-h-screen bg-white pt-20">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          </div>
        }>
          <RecetasKetoContent 
            recipes={recipes}
            categories={categories}
            featuredRecipes={featuredRecipes}
            popularRecipes={popularRecipes}
            currentPage={currentPage}
            totalPages={totalPages}
            selectedCategory={selectedCategory}
            difficulty={difficulty}
            timeFilter={timeFilter}
            totalRecipes={totalRecipes}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading recetas keto:', error);
    
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              👨‍🍳 Recetas Keto
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Más de 500 recetas cetogénicas deliciosas y fáciles de hacer
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-3xl mb-3">🍳</div>
                <h3 className="font-semibold text-green-800">Desayunos</h3>
                <p className="text-sm text-green-600">120+ recetas</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-3xl mb-3">🥘</div>
                <h3 className="font-semibold text-blue-800">Comidas</h3>
                <p className="text-sm text-blue-600">200+ recetas</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="text-3xl mb-3">🍽️</div>
                <h3 className="font-semibold text-purple-800">Cenas</h3>
                <p className="text-sm text-purple-600">150+ recetas</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-6">
                <div className="text-3xl mb-3">🧁</div>
                <h3 className="font-semibold text-pink-800">Postres</h3>
                <p className="text-sm text-pink-600">80+ recetas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}