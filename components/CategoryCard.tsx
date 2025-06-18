import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { Category } from '@/types/sanity'

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categorias/${category.slug.current}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer">
        {/* Imagen de la categoría */}
        <div className="relative w-full h-48 bg-gray-200">
          {category.categoryImage && (
            <Image
              src={urlFor(category.categoryImage).width(400).height(300).url()}
              alt={category.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>

        {/* Nombre de la categoría */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 text-center">
            {category.title}
          </h3>
          {category.description && (
            <p className="text-gray-600 text-sm mt-2 text-center line-clamp-2">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}