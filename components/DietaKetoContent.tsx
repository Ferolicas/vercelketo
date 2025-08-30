'use client'

import Link from 'next/link';
import { Recipe, Category } from '@/types/sanity';

interface DietaKetoContentProps {
  ketoRecipes: Recipe[];
  categories: Category[];
  stats: any;
}

export default function DietaKetoContent({
  ketoRecipes,
  categories,
  stats
}: DietaKetoContentProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          🥑 Dieta Keto
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          La guía más completa para dominar la dieta cetogénica
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/recetas"
            className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-600 transition-all duration-200"
          >
            👨‍🍳 Ver Recetas Keto
          </Link>
          <Link
            href="/productos-y-servicios"
            className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all duration-200"
          >
            🛒 Productos Premium
          </Link>
        </div>
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
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm">Recetas disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">15K+</div>
              <div className="text-sm">Usuarios satisfechos</div>
            </div>
          </div>
        </div>

        <h2>¿Qué es la Dieta Keto?</h2>
        <p>
          La dieta keto o cetogénica es un plan alimentario muy bajo en carbohidratos, 
          moderado en proteínas y alto en grasas saludables que transforma tu cuerpo en 
          una máquina quema-grasa las 24 horas del día.
        </p>

        <div className="bg-blue-50 rounded-2xl p-6 my-8">
          <h3 className="text-blue-900 font-bold mb-4">🍽️ Empieza con Nuestras Recetas</h3>
          <p className="text-blue-800 mb-4">
            Más de 500 recetas keto deliciosas y fáciles de preparar:
          </p>
          <Link 
            href="/recetas"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Explorar Todas las Recetas →
          </Link>
        </div>


        <h2>Beneficios de la Dieta Keto</h2>
        <ul>
          <li><strong>Pérdida de peso rápida:</strong> Hasta 1-2 kg por semana</li>
          <li><strong>Mayor energía:</strong> Sin picos y caídas de azúcar</li>
          <li><strong>Claridad mental:</strong> Mejor concentración y memoria</li>
          <li><strong>Control del apetito:</strong> Menos hambre y antojos</li>
          <li><strong>Mejora metabólica:</strong> Mejor sensibilidad a la insulina</li>
        </ul>

        <div className="bg-green-50 rounded-2xl p-6 my-8">
          <h3 className="text-green-900 font-bold mb-4">🏆 Acelera Tu Éxito Keto</h3>
          <p className="text-green-800 mb-4">
            Maximiza tus resultados con productos y servicios especializados:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link 
              href="/productos-y-servicios"
              className="block bg-green-600 text-white p-4 rounded-lg font-semibold hover:bg-green-700 transition text-center"
            >
              🛒 Tienda Keto
            </Link>
            <Link 
              href="/productos-y-servicios"
              className="block bg-green-600 text-white p-4 rounded-lg font-semibold hover:bg-green-700 transition text-center"
            >
              👨‍⚕️ Productos y Servicios
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}