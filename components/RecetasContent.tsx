'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import type { HomePage, Category, Post } from '@/types/sanity';
import { Header } from '@/components/Header';
import { Clock, ChefHat, Users } from 'lucide-react';

interface RecetasContentProps {
  homePageData: HomePage | null;
  categories: Category[];
  allPosts: Post[];
}

export default function RecetasContent({ homePageData, categories, allPosts }: RecetasContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter posts by selected category
  const filteredPosts = selectedCategory 
    ? allPosts.filter(post => post.category?.slug?.current === selectedCategory)
    : allPosts;

  return (
    <>
      <Header homePageData={homePageData} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === null
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
              }`}
            >
              Todas las Recetas ({allPosts.length})
            </button>
            {categories.map((category) => {
              const categoryPosts = allPosts.filter(post => post.category?.slug?.current === category.slug.current);
              return (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category.slug.current)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.slug.current
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
                  }`}
                >
                  {category.title} ({categoryPosts.length})
                </button>
              );
            })}
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.map((post) => (
            <div key={post._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Link href={`/recetas-keto`}>
                {/* Image */}
                <div className="relative w-full h-48 bg-gradient-to-br from-orange-50 to-emerald-50">
                  {post.mainImage ? (
                    <Image
                      src={urlFor(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ChefHat size={48} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock size={16} className="text-green-600" />
                      <span>{post.preparationTime || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ChefHat size={16} className="text-green-600" />
                      <span className="capitalize">{post.level || 'Fácil'}</span>
                    </div>
                    {post.servings && (
                      <div className="flex items-center space-x-1">
                        <Users size={16} className="text-green-600" />
                        <span>{post.servings}</span>
                      </div>
                    )}
                  </div>

                  {/* Author */}
                  {post.author && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Por: <span className="font-medium">{post.author.name}</span>
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <ChefHat size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No hay recetas en esta categoría
            </h3>
            <p className="text-gray-500 mb-6">
              Intenta seleccionar una categoría diferente o ver todas las recetas.
            </p>
            <button
              onClick={() => setSelectedCategory(null)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
            >
              Ver Todas las Recetas
            </button>
          </div>
        )}
      </div>
    </>
  );
}