import { Suspense } from 'react';
import { client, queries } from '@/lib/sanity';
import type { Post, Category } from '@/types/sanity';
import { Metadata } from 'next';
import DietaKetoContent from '@/components/DietaKetoContent';

export const metadata: Metadata = {
  title: "Dieta Keto: Guía Completa para Principiantes 2024 | Planeta Keto",
  description: "🥑 Aprende TODO sobre la dieta keto: qué es, cómo empezar, alimentos permitidos, menús, beneficios y resultados reales. Guía #1 en español para principiantes.",
  keywords: "dieta keto, dieta cetogenica, que es keto, como empezar keto, dieta keto principiantes, cetosis, macros keto, alimentos keto, menu keto, keto para principiantes, dieta ketogenica beneficios, keto que comer, dieta cetogenica alimentos",
  openGraph: {
    title: "Dieta Keto: La Guía Definitiva 2024 | Todo lo que Necesitas Saber",
    description: "🥑 Guía completa paso a paso para dominar la dieta keto. Desde principiantes hasta avanzado. +500 recetas y planes de comida incluidos.",
    type: "website",
    url: "https://planetaketo.es/dieta-keto",
    images: [
      {
        url: "/og-dieta-keto.jpg",
        width: 1200,
        height: 630,
        alt: "Guía Completa de Dieta Keto - Planeta Keto",
      }
    ],
  },
  alternates: {
    canonical: "/dieta-keto",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'article:section': 'Dieta Keto',
    'article:tag': 'dieta keto, cetogenica, principiantes, guia',
  },
};

export default async function DietaKetoPage() {
  try {
    const [ketoRecipes, categories, stats] = await Promise.all([
      client.fetch<Post[]>(`
        *[_type == "post" && (
          title match "*keto*" ||
          title match "*cetogén*" ||
          tags[]._ref in *[_type == "tag" && title match "*keto*"]._id
        )] | order(rating desc)[0..12] {
          _id,
          title,
          slug,
          mainImage,
          excerpt,
          preparationTime,
          level,
          rating,
          servings,
          calories,
          category->{
            title,
            slug
          }
        }
      `),
      client.fetch<Category[]>(queries.allCategories),
      client.fetch(`{
        "totalRecipes": count(*[_type == "post"]),
        "ketoRecipes": count(*[_type == "post" && (title match "*keto*" || title match "*cetogén*")]),
        "categories": count(*[_type == "category"])
      }`)
    ]);

    return (
      <div className="min-h-screen bg-white pt-20">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          </div>
        }>
          <DietaKetoContent 
            ketoRecipes={ketoRecipes}
            categories={categories}
            stats={stats}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading dieta keto page:', error);
    
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              🥑 Dieta Keto
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              La guía más completa para dominar la dieta cetogénica
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>¿Qué es la Dieta Keto?</h2>
            <p>
              La dieta keto o cetogénica es un plan alimentario muy bajo en carbohidratos, 
              moderado en proteínas y alto en grasas saludables que transforma tu cuerpo en 
              una máquina quema-grasa las 24 horas del día.
            </p>

            <h2>¿Cómo Funciona la Cetosis?</h2>
            <p>
              Cuando reduces drásticamente los carbohidratos (menos de 20-50g al día), 
              tu cuerpo entra en un estado metabólico llamado cetosis, donde quema grasa 
              en lugar de glucosa como combustible principal.
            </p>

            <h2>Beneficios de la Dieta Keto</h2>
            <ul>
              <li><strong>Pérdida de peso rápida:</strong> Hasta 1-2 kg por semana</li>
              <li><strong>Mayor energía:</strong> Sin picos y caídas de azúcar</li>
              <li><strong>Claridad mental:</strong> Mejor concentración y memoria</li>
              <li><strong>Control del apetito:</strong> Menos hambre y antojos</li>
              <li><strong>Mejora metabólica:</strong> Mejor sensibilidad a la insulina</li>
            </ul>

            <h2>Macros de la Dieta Keto</h2>
            <div className="bg-green-50 p-6 rounded-lg">
              <ul className="text-green-800">
                <li><strong>Grasas:</strong> 70-75% de las calorías totales</li>
                <li><strong>Proteínas:</strong> 20-25% de las calorías totales</li>
                <li><strong>Carbohidratos:</strong> 5-10% de las calorías totales (máximo 20-50g)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}