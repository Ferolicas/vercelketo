import { Suspense } from 'react';
import { client, queries } from '@/lib/sanity';
import type { Category, Post } from '@/types/sanity';
import HomePage from '@/components/HomePage';

// Remove force-dynamic to allow static generation when possible
// export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  // Durante el build, usar datos mock si no hay token de Sanity
  const hasToken = !!process.env.SANITY_API_TOKEN;
  
  if (!hasToken && process.env.NODE_ENV === 'production') {
    const stats = {
      totalRecipes: 500,
      happyUsers: 15000,
      avgRating: 4.8
    };
    
    return (
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        </div>
      }>
        <HomePage 
          featuredRecipes={[]}
          categories={[]}
          stats={stats}
        />
      </Suspense>
    );
  }

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
    const stats = {
      totalRecipes: 500,
      happyUsers: 15000,
      avgRating: 4.8
    };
    
    return (
      <HomePage 
        featuredRecipes={[]}
        categories={[]}
        stats={stats}
      />
    );
  }
}