'use client'

import Link from 'next/link';
import { BlogPost, BlogCategory } from '@/types/sanity';
import { ContentAd } from './AdSystem';

interface BlogContentProps {
  blogPosts: BlogPost[];
  categories: BlogCategory[];
  featuredPosts: BlogPost[];
  currentPage: number;
  totalPages: number;
  selectedCategory?: string;
  totalPosts: number;
}

export default function BlogContent({
  blogPosts,
  categories,
  featuredPosts
}: BlogContentProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          📝 Blog Keto
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Consejos, guías y tips para dominar la dieta cetogénica
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/recetas-keto"
            className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            🥑 Ver Recetas Keto
          </Link>
          <Link
            href="/foro"
            className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition"
          >
            💬 Únete al Foro
          </Link>
        </div>
      </div>

      <ContentAd position="top" />

      <div className="bg-gray-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📚 Contenido Educativo Keto
        </h2>
        <p className="text-gray-600 mb-6">
          Estamos preparando artículos increíbles sobre dieta cetogénica. 
          Mientras tanto, explora nuestros recursos principales:
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dieta-keto" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-3xl mb-2">🥑</div>
            <h3 className="font-semibold">Guía Keto</h3>
          </Link>
          <Link href="/recetas-keto" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-3xl mb-2">👨‍🍳</div>
            <h3 className="font-semibold">Recetas</h3>
          </Link>
          <Link href="/tienda-keto" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-3xl mb-2">🛒</div>
            <h3 className="font-semibold">Tienda</h3>
          </Link>
          <Link href="/foro" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-semibold">Comunidad</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}