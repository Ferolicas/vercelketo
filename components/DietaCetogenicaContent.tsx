'use client'

import Link from 'next/link';
import { Recipe, Category } from '@/types/sanity';
import { ContentAd } from './AdSystem';

interface DietaCetogenicaContentProps {
  scientificRecipes: Recipe[];
  categories: Category[];
  advancedRecipes: Recipe[];
  therapeuticRecipes: Recipe[];
}

export default function DietaCetogenicaContent(props: DietaCetogenicaContentProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          🧬 Dieta Cetogénica
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          La guía científica más completa sobre la alimentación cetogénica
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/recetas-keto"
            className="bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            🧬 Recetas Científicas
          </Link>
          <Link
            href="/servicios"
            className="border-2 border-purple-500 text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition"
          >
            👨‍⚕️ Consulta Profesional
          </Link>
        </div>
      </div>

      <ContentAd position="top" />

      <div className="prose prose-lg max-w-none">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-8">
          <h2 className="text-white text-2xl font-bold mb-4">📊 Respaldado por Ciencia</h2>
          <div className="grid md:grid-cols-3 gap-4 text-blue-100">
            <div className="text-center">
              <div className="text-3xl font-bold">200+</div>
              <div className="text-sm">Estudios científicos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">90 años</div>
              <div className="text-sm">De investigación</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">70%</div>
              <div className="text-sm">Más efectivo</div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-2xl p-6 my-8">
          <h3 className="text-green-900 font-bold mb-4">🥑 Implementación Práctica</h3>
          <p className="text-green-800 mb-4">
            Aplica la ciencia con nuestras recetas cetogénicas validadas:
          </p>
          <Link 
            href="/recetas-keto"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Ver Recetas Científicas →
          </Link>
        </div>

        <ContentAd position="middle" />

        <h2>Fundamentos Bioquímicos de la Cetosis</h2>
        <p>
          La dieta cetogénica induce cetosis nutricional mediante la restricción de carbohidratos, 
          convirtiendo ácidos grasos en cuerpos cetónicos para alimentar cerebro y músculos.
        </p>
      </div>
    </div>
  );
}