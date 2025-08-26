'use client'

import Link from 'next/link';
import { ForumPost, ForumCategory } from '@/types/sanity';
import { ContentAd } from './AdSystem';

interface ForoContentProps {
  forumPosts: ForumPost[];
  categories: ForumCategory[];
  pinnedPosts: ForumPost[];
  currentPage: number;
  totalPages: number;
  selectedCategory?: string;
  sortOrder: string;
  totalPosts: number;
}

export default function ForoContent({
  forumPosts,
  categories,
  pinnedPosts
}: ForoContentProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          💬 Foro Keto
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          La comunidad cetogénica más grande en español
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/recetas-keto"
            className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            🥑 Ver Recetas
          </Link>
          <Link
            href="/blog"
            className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition"
          >
            📝 Leer Blog
          </Link>
        </div>
      </div>

      <ContentAd position="top" />

      <div className="bg-gray-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🚀 Comunidad en Desarrollo
        </h2>
        <p className="text-gray-600 mb-6">
          Estamos construyendo una comunidad increíble. Mientras tanto, 
          conecta con otros en nuestros recursos:
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/bajar-de-peso" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-4xl mb-3">⚖️</div>
            <h3 className="font-bold text-lg mb-2">Bajar de Peso</h3>
            <p className="text-sm text-gray-600">Estrategias efectivas</p>
          </Link>
          <Link href="/quemar-grasa" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-4xl mb-3">🔥</div>
            <h3 className="font-bold text-lg mb-2">Quemar Grasa</h3>
            <p className="text-sm text-gray-600">Técnicas avanzadas</p>
          </Link>
          <Link href="/dieta-cetogenica" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-4xl mb-3">🧬</div>
            <h3 className="font-bold text-lg mb-2">Ciencia Keto</h3>
            <p className="text-sm text-gray-600">Fundamentos científicos</p>
          </Link>
        </div>
      </div>
    </div>
  );
}