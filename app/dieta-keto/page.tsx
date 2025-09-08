import { Suspense } from 'react';
import { client, queries } from '@/lib/sanity';
import type { Recipe, Category } from '@/types/sanity';
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
      client.fetch<Recipe[]>(`
        *[_type == "recipe" && (
          name match "*keto*" ||
          name match "*cetogén*" ||
          description match "*keto*"
        )] | order(averageRating desc)[0..12] {
          _id,
          name,
          slug,
          thumbnail,
          description,
          preparationTime,
          averageRating,
          servings,
          category->{
            name,
            slug
          }
        }
      `),
      client.fetch<Category[]>(queries.allCategories),
      client.fetch(`{
        "totalRecipes": count(*[_type == "recipe"]),
        "ketoRecipes": count(*[_type == "recipe" && (name match "*keto*" || name match "*cetogén*")]),
        "categories": count(*[_type == "category"])
      }`)
    ]);

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
              <span className="text-4xl">🥑</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Dieta Keto
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              La guía más completa para dominar la dieta cetogénica
            </p>
          </div>
        </div>

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
              <span className="text-4xl">🥑</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Dieta Keto
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              La guía más completa para dominar la dieta cetogénica
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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