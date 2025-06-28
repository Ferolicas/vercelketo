// RUTA: app/page.tsx (VERSIÓN FINAL CORREGIDA PARA NEXT.JS 15)

import { Suspense } from 'react';
import { client, queries } from '@/lib/sanity';
import type { HomePage, Category, Post } from '@/types/sanity';
import HomePageClient from '../components/HomePageClient';

// ESTA ES LA LÍNEA NUEVA QUE SOLUCIONA EL ERROR
export const dynamic = 'force-dynamic';

// Tipos correctos para Next.js 15
interface PageProps {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const homePageDataPromise = client.fetch<HomePage>(queries.homePage);
  const categoriesPromise = client.fetch<Category[]>(queries.allCategories);

  // AWAIT searchParams ANTES de acceder a sus propiedades
  const resolvedSearchParams = await searchParams;
  
  const categoryParam = typeof resolvedSearchParams?.categoria === 'string' ? resolvedSearchParams.categoria : null;
  const postParam = typeof resolvedSearchParams?.receta === 'string' ? resolvedSearchParams.receta : null;

  const [homePageData, categories] = await Promise.all([homePageDataPromise, categoriesPromise]);

  let initialRecipes: Post[] = [];
  let initialSelectedRecipe: Post | null = null;

  if (postParam && categoryParam) {
    initialSelectedRecipe = await client.fetch<Post | null>(queries.postBySlug, { slug: postParam });
    if (initialSelectedRecipe) {
      initialRecipes = await client.fetch<Post[]>(queries.postsByCategory, { categorySlug: categoryParam });
    } else {
      initialRecipes = await client.fetch<Post[]>(queries.allPosts);
    }
  } else if (categoryParam) {
    initialRecipes = await client.fetch<Post[]>(queries.postsByCategory, { categorySlug: categoryParam });
  } else {
    initialRecipes = await client.fetch<Post[]>(queries.allPosts);
  }

  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen text-xl">Cargando Planeta Keto...</div>}>
      <HomePageClient
        homePageData={homePageData}
        categories={categories}
        initialRecipes={initialRecipes}
        initialSelectedRecipe={initialSelectedRecipe}
      />
    </Suspense>
  );
}