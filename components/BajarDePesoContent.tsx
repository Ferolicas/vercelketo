'use client'

import Link from 'next/link';
import { Recipe } from '@/types/sanity';
import InternalLinks from './InternalLinks';

interface BajarDePesoContentProps {
  weightLossRecipes: Recipe[];
  lowCalorieRecipes: Recipe[];
  fastRecipes: Recipe[];
}

export default function BajarDePesoContent({
  weightLossRecipes,
  lowCalorieRecipes,
  fastRecipes
}: BajarDePesoContentProps) {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero optimizado para conversión */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            ⚡ Bajar de Peso con Keto
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            El método más efectivo y rápido para perder peso de forma saludable
          </p>
          
          {/* CTA principal hacia tus páginas */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/recetas"
              className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-600 transition-all duration-200"
            >
              🥑 Ver Recetas para Bajar de Peso
            </Link>
            <Link
              href="/productos-y-servicios"
              className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all duration-200"
            >
              🛒 Productos y Servicios
            </Link>
          </div>
        </div>


        {/* Contenido SEO optimizado */}
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

          {/* Enlaces hacia recetas */}
          <div className="bg-blue-50 rounded-2xl p-6 my-8">
            <h3 className="text-blue-900 font-bold mb-4">🍽️ Recetas Keto para Bajar de Peso</h3>
            <p className="text-blue-800 mb-4">
              Descubre nuestras recetas cetogénicas especialmente seleccionadas para maximizar la pérdida de peso:
            </p>
            <Link 
              href="/recetas"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Ver Todas las Recetas →
            </Link>
          </div>


          <h3>Plan de Acción: Tu Primera Semana Keto</h3>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
            <h4 className="text-yellow-800 font-semibold mb-3">Día 1-3: Preparación</h4>
            <ul className="text-yellow-700">
              <li>Elimina todos los carbohidratos de tu cocina</li>
              <li>Compra alimentos keto esenciales</li>
              <li>Calcula tus macros personalizados</li>
              <li>Planifica tus primeras 3 comidas</li>
            </ul>
          </div>

          {/* Enlaces hacia servicios */}
          <div className="bg-green-50 rounded-2xl p-6 my-8">
            <h3 className="text-green-900 font-bold mb-4">🏆 Acelera Tus Resultados</h3>
            <p className="text-green-800 mb-4">
              Maximiza tu pérdida de peso con nuestros productos y servicios especializados:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link 
                href="/productos-y-servicios"
                className="block bg-green-600 text-white p-4 rounded-lg font-semibold hover:bg-green-700 transition text-center col-span-2"
              >
                🛒 Productos y Servicios Premium
              </Link>
            </div>
          </div>

        </div>

        <InternalLinks className="mt-12" />
      </div>

    </>
  );
}