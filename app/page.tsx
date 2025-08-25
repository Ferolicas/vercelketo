import { Suspense } from 'react';
import { client, queries } from '@/lib/sanity';
import type { Category, Post } from '@/types/sanity';
import HomePage from '@/components/HomePage';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  try {
    // Fetch datos básicos para la home
    const [categories, featuredRecipes] = await Promise.all([
      client.fetch<Category[]>(queries.allCategories),
      client.fetch<Post[]>(`
        *[_type == "post"] | order(publishedAt desc)[0...6] {
          _id,
          title,
          slug,
          mainImage,
          excerpt,
          publishedAt,
          category->{
            title,
            slug
          }
        }
      `)
    ]);

    // Calcular estadísticas
    const totalRecipes = await client.fetch<number>('count(*[_type == "post"])')
    const stats = {
      totalRecipes: totalRecipes || 500,
      happyUsers: 15000,
      avgRating: 4.8
    }

    return (
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        </div>
      }>
        <HomePage 
          featuredRecipes={featuredRecipes}
          categories={categories}
          stats={stats}
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading homepage:', error);
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Bienvenido a Planeta Keto!</h2>
          <p className="text-gray-600">Estamos preparando las mejores recetas para ti...</p>
        </div>
      </div>
    );
  }
}