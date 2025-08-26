'use client'

import Link from 'next/link';
import { Recipe } from '@/types/sanity';
import { ContentAd } from './AdSystem';

interface DietaBajaCarbohidratosContentProps {
  lowCarbRecipes: Recipe[];
  moderateRecipes: Recipe[];
  ultraLowRecipes: Recipe[];
}

export default function DietaBajaCarbohidratosContent(props: DietaBajaCarbohidratosContentProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          🥬 Dieta Baja en Carbohidratos
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Tu guía completa para dominar las dietas low-carb
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/recetas-keto"
            className="bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-700 transition"
          >
            🥬 Recetas Low-Carb
          </Link>
          <Link
            href="/dieta-keto"
            className="border-2 border-teal-500 text-teal-600 px-8 py-4 rounded-xl font-semibold hover:bg-teal-50 transition"
          >
            🥑 Evoluciona a Keto
          </Link>
        </div>
      </div>

      <ContentAd position="top" />

      <div className="prose prose-lg max-w-none">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl p-8 mb-8">
          <h2 className="text-white text-2xl font-bold mb-4">📊 Niveles de Carbohidratos</h2>
          <div className="grid md:grid-cols-4 gap-4 text-green-100">
            <div className="text-center">
              <div className="text-2xl font-bold">150-100g</div>
              <div className="text-sm">Moderado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">100-50g</div>
              <div className="text-sm">Low-Carb</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">50-20g</div>
              <div className="text-sm">Muy Bajo</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">&lt;20g</div>
              <div className="text-sm">Cetogénico</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 my-8">
          <h3 className="text-blue-900 font-bold mb-4">🍽️ Recetas por Nivel</h3>
          <p className="text-blue-800 mb-4">
            Encuentra recetas adaptadas a tu nivel de restricción de carbohidratos:
          </p>
          <Link 
            href="/recetas-keto"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Explorar Recetas Low-Carb →
          </Link>
        </div>

        <ContentAd position="middle" />

        <h2>¿Qué Son las Dietas Bajas en Carbohidratos?</h2>
        <p>
          Las dietas bajas en carbohidratos limitan la ingesta de carbohidratos 
          favoreciendo proteínas, grasas saludables y vegetales de hoja verde.
        </p>

        <div className="bg-green-50 rounded-2xl p-6 my-8">
          <h3 className="text-green-900 font-bold mb-4">🎯 Siguiente Paso: Keto</h3>
          <p className="text-green-800 mb-4">
            ¿Listo para máximos resultados? Descubre la dieta cetogénica:
          </p>
          <Link 
            href="/dieta-keto"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Guía Completa Keto →
          </Link>
        </div>
      </div>
    </div>
  );
}