import { Suspense } from 'react';
import { client, queries } from '@/lib/sanity';
import type { Post, Category } from '@/types/sanity';
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
    
    let whereClause = `_type == "post"`;
    const queryParams: any = { offset, limit: offset + recipesPerPage - 1 };
    
    if (tipo) {
      if (tipo === 'bajas-calorias') {
        whereClause += ` && calories <= 300`;
      } else if (tipo === 'altas-proteinas') {
        whereClause += ` && macros.protein >= 20`;
      } else if (tipo === 'vegetarianas') {
        whereClause += ` && (tags[] match "*vegetarian*" || tags[] match "*veggie*")`;
      }
    }
    
    if (caloriaFilter === 'bajo') {
      whereClause += ` && calories <= 400`;
    } else if (caloriaFilter === 'medio') {
      whereClause += ` && calories >= 400 && calories <= 600`;
    }

    const [healthyRecipes, categories, lowCarbRecipes, highProteinRecipes, totalRecipes] = await Promise.all([
      client.fetch<Post[]>(`
        *[${whereClause}] | order(rating desc, publishedAt desc)[$offset...$limit] {
          _id,
          _createdAt,
          title,
          slug,
          mainImage,
          excerpt,
          publishedAt,
          category->{
            title,
            slug
          },
          preparationTime,
          level,
          rating,
          servings,
          calories,
          macros,
          tags
        }
      `, queryParams),
      client.fetch<Category[]>(queries.allCategories),
      client.fetch<Post[]>(`
        *[_type == "post" && macros.carbs <= 10] | order(rating desc)[0..6] {
          _id,
          title,
          slug,
          mainImage,
          calories,
          macros,
          rating,
          category->{
            title,
            slug
          }
        }
      `),
      client.fetch<Post[]>(`
        *[_type == "post" && macros.protein >= 25] | order(macros.protein desc)[0..6] {
          _id,
          title,
          slug,
          mainImage,
          calories,
          macros,
          rating,
          category->{
            title,
            slug
          }
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
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              🌱 Recetas Saludables
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Alimentación nutritiva, deliciosa y equilibrada para una vida plena
            </p>
            
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