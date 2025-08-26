'use client'

import Link from 'next/link';
import { Post } from '@/types/sanity';
import { ContentAd, StickyAd } from './AdSystem';

interface QuemarGrasaContentProps {
  fatBurningRecipes: Post[];
  thermogenicRecipes: Post[];
  fastingRecipes: Post[];
}

export default function QuemarGrasaContent(props: QuemarGrasaContentProps) {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            🔥 Quemar Grasa con Keto
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Convierte tu cuerpo en una máquina quema-grasa las 24 horas
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/recetas-keto"
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-700 transition"
            >
              🔥 Recetas Quema-Grasa
            </Link>
            <Link
              href="/tienda-keto"
              className="border-2 border-red-500 text-red-600 px-8 py-4 rounded-xl font-semibold hover:bg-red-50 transition"
            >
              💊 Suplementos Premium
            </Link>
          </div>
        </div>

        <ContentAd position="top" />

        <div className="prose prose-lg max-w-none">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-8 mb-8">
            <h2 className="text-white text-2xl font-bold mb-4">🎯 Protocolo Quema-Grasa</h2>
            <div className="grid md:grid-cols-3 gap-4 text-orange-100">
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm">Quema grasa continua</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">70%</div>
                <div className="text-sm">Más eficiente</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">14 días</div>
                <div className="text-sm">Primeros resultados</div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-6 my-8">
            <h3 className="text-green-900 font-bold mb-4">🥑 Recetas Especializadas</h3>
            <p className="text-green-800 mb-4">
              Descubre recetas keto diseñadas específicamente para maximizar la quema de grasa:
            </p>
            <Link 
              href="/recetas-keto"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Ver Recetas Quema-Grasa →
            </Link>
          </div>

          <ContentAd position="middle" />

          <h2>La Ciencia de Quemar Grasa con Keto</h2>
          <p>
            En cetosis, tu cuerpo produce cetonas que actúan como un combustible 
            súper eficiente, aumentando la lipólisis hasta un 70% más que las dietas tradicionales.
          </p>

          <div className="bg-yellow-50 rounded-2xl p-6 my-8">
            <h3 className="text-yellow-900 font-bold mb-4">🏆 Acelera la Quema de Grasa</h3>
            <p className="text-yellow-800 mb-4">
              Potencia tus resultados con productos especializados:
            </p>
            <Link 
              href="/tienda-keto"
              className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition"
            >
              Ver Productos Premium →
            </Link>
          </div>
        </div>
      </div>
      <StickyAd position="bottom-right" />
    </>
  );
}