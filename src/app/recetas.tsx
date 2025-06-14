import React from 'react';

interface Receta {
  title: string;
  slug: string;
  mainImage: {
    asset: {
      _ref: string;
      _type: string;
    };
    [key: string]: unknown;
  } | null;
  publishedAt: string;
  categoriaSlug: string;
}

interface RecetasProps {
  recetas: Receta[];
}

export default function Recetas({ recetas }: RecetasProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {recetas.map((receta) => (
        <div
          key={receta.slug}
          className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center"
        >
          <h2 className="text-xl font-bold mb-4 text-center">{receta.title}</h2>
          {receta.mainImage && receta.mainImage.asset && (
            <img
              src={`/${receta.mainImage.asset._ref}`}
              alt={receta.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          <span className="text-gray-500 text-sm">
            Publicado: {new Date(receta.publishedAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
}