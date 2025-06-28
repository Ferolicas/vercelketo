// components/CategoryButtons.tsx
'use client'

import React, { useRef } from 'react'
import type { Category } from '@/types/sanity'

interface CategoryButtonsProps {
  categories: Category[]
  onSelectCategory: (slug: string | null) => void // slug.current o null para todas las recetas
  activeCategorySlug: string | null
}

export function CategoryButtons({ categories, onSelectCategory, activeCategorySlug }: CategoryButtonsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={scrollContainerRef}
      className="w-full py-4 overflow-x-auto scrollbar-hide border-b border-gray-200"
      style={{ WebkitOverflowScrolling: 'touch' }} // Para scroll suave en iOS
    >
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
      <div className="flex flex-nowrap space-x-3 md:space-x-4 pl-0 sm:pl-1 pr-4 sm:pr-6">
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex-shrink-0 px-5 py-2 rounded-full font-medium text-sm md:text-base transition-all duration-200 ease-in-out whitespace-nowrap ${
            activeCategorySlug === null
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas las Recetas
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onSelectCategory(category.slug.current)}
            className={`flex-shrink-0 px-5 py-2 rounded-full font-medium text-sm md:text-base transition-all duration-200 ease-in-out whitespace-nowrap ${
              activeCategorySlug === category.slug.current
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.title}
          </button>
        ))}
        {/* Spacer invisible para padding final */}
        <div className="flex-shrink-0 w-4 sm:w-6"></div>
      </div>
    </div>
  )
}