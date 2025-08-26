'use client'

import Link from 'next/link';
import { Product } from '@/types/sanity';
import { ContentAd } from './AdSystem';

interface TiendaKetoContentProps {
  featuredProducts: Product[];
  supplements: Product[];
  books: Product[];
  tools: Product[];
  categories: any[];
  selectedCategory?: string;
  priceFilter?: string;
  selectedBrand?: string;
}

export default function TiendaKetoContent({
  featuredProducts,
  supplements,
  books,
  tools,
  categories
}: TiendaKetoContentProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          🛒 Tienda Keto Premium
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Los productos cetogénicos más recomendados por expertos
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/recetas-keto"
            className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            🥑 Recetas Gratis
          </Link>
          <Link
            href="/servicios"
            className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition"
          >
            👨‍⚕️ Servicios Premium
          </Link>
        </div>
      </div>

      <ContentAd position="top" />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
          <div className="text-4xl mb-4">💊</div>
          <h3 className="font-bold text-green-800 mb-2">Suplementos</h3>
          <p className="text-sm text-green-600">MCT, electrolitos, cetonas exógenas</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="font-bold text-blue-800 mb-2">Libros & Guías</h3>
          <p className="text-sm text-blue-600">Conocimiento experto para tu éxito</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="text-4xl mb-4">🧪</div>
          <h3 className="font-bold text-purple-800 mb-2">Test Cetosis</h3>
          <p className="text-sm text-purple-600">Monitorea tu progreso keto</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
          <div className="text-4xl mb-4">🍽️</div>
          <h3 className="font-bold text-orange-800 mb-2">Herramientas</h3>
          <p className="text-sm text-orange-600">Utensilios para cocina keto</p>
        </div>
      </div>

      <div className="mt-12 p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl text-white max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-2">🎉 Oferta Especial</h3>
        <p className="text-green-100">Envío GRATIS en compras superiores a $50</p>
        <p className="text-sm text-green-200 mt-1">Productos respaldados por el Dr. Bayter</p>
        
        <div className="mt-4 space-x-4">
          <Link
            href="/recetas-keto"
            className="inline-block bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Ver Recetas Gratis
          </Link>
        </div>
      </div>

      <ContentAd position="bottom" />
    </div>
  );
}