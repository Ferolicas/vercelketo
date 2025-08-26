import { Suspense } from 'react';
import { client } from '@/lib/sanity';
import type { Recipe } from '@/types/sanity';
import { Metadata } from 'next';
import BajarDePesoContent from '@/components/BajarDePesoContent';

export const metadata: Metadata = {
  title: "Cómo Bajar de Peso Rápido con Dieta Keto: Guía Completa 2024",
  description: "⚡ Descubre cómo bajar de peso rápido y seguro con la dieta keto. Planes, recetas, tips y resultados reales. Pierde hasta 10 kg en 30 días.",
  keywords: "bajar de peso, perder peso rapido, dieta para bajar de peso, como bajar de peso, adelgazar rapido, dieta keto peso, perder kilos, bajar peso keto, adelgazar keto, dieta cetogenica peso",
  openGraph: {
    title: "Bajar de Peso con Keto: Resultados en 30 Días",
    description: "⚡ El método más efectivo para bajar de peso. Planes keto personalizados, recetas deliciosas y resultados garantizados.",
    type: "website",
    url: "https://planetaketo.es/bajar-de-peso",
    images: [
      {
        url: "/og-bajar-peso.jpg",
        width: 1200,
        height: 630,
        alt: "Bajar de Peso con Dieta Keto - Planeta Keto",
      }
    ],
  },
  alternates: {
    canonical: "/bajar-de-peso",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function BajarDePesoPage() {
  try {
    const [weightLossRecipes, lowCalorieRecipes, fastRecipes] = await Promise.all([
      client.fetch<Recipe[]>(`
        *[_type == "recipe" && (
          name match "*peso*" ||
          name match "*adelga*" ||
          description match "*weight*" ||
          description match "*loss*"
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
            slug,
            icon
          }
        }
      `),
      client.fetch<Recipe[]>(`
        *[_type == "recipe" && preparationTime <= 30] | order(preparationTime asc)[0..8] {
          _id,
          name,
          slug,
          thumbnail,
          preparationTime,
          averageRating,
          servings,
          category->{
            name,
            slug,
            icon
          }
        }
      `),
      client.fetch<Recipe[]>(`
        *[_type == "recipe" && preparationTime <= 15] | order(averageRating desc)[0..6] {
          _id,
          name,
          slug,
          thumbnail,
          preparationTime,
          averageRating,
          servings
        }
      `)
    ]);

    return (
      <div className="min-h-screen bg-white pt-20">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          </div>
        }>
          <BajarDePesoContent 
            weightLossRecipes={weightLossRecipes}
            lowCalorieRecipes={lowCalorieRecipes}
            fastRecipes={fastRecipes}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading bajar de peso page:', error);
    
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              ⚡ Bajar de Peso con Keto
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              El método más efectivo y rápido para perder peso de forma saludable
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-8 mb-8">
              <h2 className="text-white text-2xl font-bold mb-4">🎯 Resultados Garantizados</h2>
              <div className="grid md:grid-cols-3 gap-4 text-green-100">
                <div className="text-center">
                  <div className="text-3xl font-bold">3-5 kg</div>
                  <div className="text-sm">Primera semana</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">8-12 kg</div>
                  <div className="text-sm">Primer mes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">15-25 kg</div>
                  <div className="text-sm">Primeros 3 meses</div>
                </div>
              </div>
            </div>

            <h2>¿Por Qué Keto es Tan Efectivo para Bajar de Peso?</h2>
            <p>
              La dieta keto transforma tu cuerpo en una máquina quema-grasa las 24 horas. 
              Al reducir carbohidratos a menos de 20g al día, fuerzas a tu organismo a 
              utilizar la grasa como combustible principal.
            </p>

            <h3>Beneficios Únicos del Keto para Perder Peso:</h3>
            <ul>
              <li><strong>Pérdida rápida de peso:</strong> 3-5 kg en la primera semana</li>
              <li><strong>Quema grasa corporal:</strong> Reduce específicamente grasa abdominal</li>
              <li><strong>Controla el hambre:</strong> Menos antojos y apetito</li>
              <li><strong>Mantiene masa muscular:</strong> Pierdes grasa, no músculo</li>
              <li><strong>Energía constante:</strong> Sin bajones de azúcar</li>
            </ul>

            <h2>Plan de Acción: Tu Primera Semana Keto</h2>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
              <h3 className="text-blue-800 font-semibold mb-3">Día 1-3: Preparación</h3>
              <ul className="text-blue-700">
                <li>Elimina todos los carbohidratos de tu cocina</li>
                <li>Compra alimentos keto esenciales</li>
                <li>Calcula tus macros personalizados</li>
                <li>Planifica tus primeras 3 comidas</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-6 mt-4">
              <h3 className="text-green-800 font-semibold mb-3">Día 4-7: Entrada en Cetosis</h3>
              <ul className="text-green-700">
                <li>Mantén carbohidratos bajo 20g diarios</li>
                <li>Aumenta ingesta de electrolitos</li>
                <li>Bebe 3-4 litros de agua al día</li>
                <li>Monitorea cetonas en orina</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}