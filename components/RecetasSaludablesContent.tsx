'use client'

import Link from 'next/link';
import { Post, Category } from '@/types/sanity';
import { ContentAd } from './AdSystem';

interface RecetasSaludablesContentProps {
  healthyRecipes: Post[];
  categories: Category[];
  lowCarbRecipes: Post[];
  highProteinRecipes: Post[];
  currentPage: number;
  totalPages: number;
  tipo?: string;
  caloriaFilter?: string;
  totalRecipes: number;
}

export default function RecetasSaludablesContent(props: RecetasSaludablesContentProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          🌱 Recetas Saludables
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Alimentación nutritiva, deliciosa y equilibrada para una vida plena
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/recetas-keto"
            className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            🥑 Recetas Keto Saludables
          </Link>
          <Link
            href="/dieta-baja-carbohidratos"
            className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition"
          >
            🥬 Dieta Low-Carb
          </Link>
        </div>
      </div>

      <ContentAd position="top" />

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center text-2xl mb-4">
              🥗
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Nutritivas</h3>
            <p className="text-sm text-gray-600">Ricas en vitaminas, minerales y antioxidantes</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-4">
              ⚖️
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Equilibradas</h3>
            <p className="text-sm text-gray-600">Perfecta proporción de macronutrientes</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-2xl mb-4">
              😋
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Deliciosas</h3>
            <p className="text-sm text-gray-600">Sabores increíbles sin sacrificar la salud</p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link
            href="/recetas-keto"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Descubre Nuestras Recetas →
          </Link>
        </div>
      </div>

      <ContentAd position="middle" />
    </div>
  );
}