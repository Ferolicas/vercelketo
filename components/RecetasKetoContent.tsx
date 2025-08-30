'use client'

import Link from 'next/link';
import { Recipe, Category } from '@/types/sanity';

interface RecetasKetoContentProps {
  recipes: Recipe[];
  categories: Category[];
  featuredRecipes: Recipe[];
  popularRecipes: Recipe[];
  currentPage: number;
  totalPages: number;
  selectedCategory?: string;
  difficulty?: string;
  timeFilter?: string;
  totalRecipes: number;
}

export default function RecetasKetoContent({
  recipes,
  categories,
  featuredRecipes,
  popularRecipes
}: RecetasKetoContentProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          👨‍🍳 Recetas Keto
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Más de 500 recetas cetogénicas deliciosas y fáciles de hacer
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dieta-keto"
            className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            🥑 Guía Keto Completa
          </Link>
          <Link
            href="/tienda-keto"
            className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition"
          >
            🛒 Productos Keto
          </Link>
        </div>
      </div>


      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
        <div className="bg-green-50 rounded-lg p-6">
          <div className="text-3xl mb-3">🍳</div>
          <h3 className="font-semibold text-green-800">Desayunos</h3>
          <p className="text-sm text-green-600">120+ recetas</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="text-3xl mb-3">🥘</div>
          <h3 className="font-semibold text-blue-800">Comidas</h3>
          <p className="text-sm text-blue-600">200+ recetas</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="text-3xl mb-3">🍽️</div>
          <h3 className="font-semibold text-purple-800">Cenas</h3>
          <p className="text-sm text-purple-600">150+ recetas</p>
        </div>
        <div className="bg-pink-50 rounded-lg p-6">
          <div className="text-3xl mb-3">🧁</div>
          <h3 className="font-semibold text-pink-800">Postres</h3>
          <p className="text-sm text-pink-600">80+ recetas</p>
        </div>
      </div>


      <div className="text-center mt-16">
        <div className="bg-green-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-green-900 mb-4">
            🚀 ¿Nuevo en Keto?
          </h2>
          <p className="text-green-800 mb-6">
            Comienza tu viaje cetogénico con nuestra guía completa
          </p>
          <Link
            href="/dieta-keto"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Aprende los Fundamentos Keto
          </Link>
        </div>
      </div>
    </div>
  );
}