'use client'

import Link from 'next/link';
import { Product, ProductCategory } from '@/types/sanity';
import { ContentAd } from './AdSystem';

interface ProductsContentProps {
  products: Product[];
  categories: ProductCategory[];
  featuredProducts: Product[];
  currentPage: number;
  totalPages: number;
  selectedCategory?: string;
  sortBy: string;
  totalProducts: number;
}

export default function ProductsContent({
  products,
  categories,
  featuredProducts
}: ProductsContentProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          🛒 Productos Keto
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Los mejores productos cetogénicos para tu transformación
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tienda-keto"
            className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            🛒 Tienda Premium
          </Link>
          <Link
            href="/servicios"
            className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition"
          >
            👨‍⚕️ Servicios
          </Link>
        </div>
      </div>

      <ContentAd position="top" />

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="font-semibold text-green-800 mb-2">¿Buscas algo específico?</h3>
        <div className="text-sm text-green-700 space-y-1">
          <p>• Suplementos keto premium</p>
          <p>• Aceites MCT de alta calidad</p>
          <p>• Proteínas cetogénicas</p>
          <p>• Libros y guías keto</p>
          <p>• Herramientas para cetosis</p>
        </div>
        
        <div className="mt-4">
          <Link
            href="/tienda-keto"
            className="block bg-green-600 text-white text-center py-2 px-4 rounded font-medium hover:bg-green-700 transition"
          >
            Explorar Tienda Premium
          </Link>
        </div>
      </div>
    </div>
  );
}