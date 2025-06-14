import React from 'react';

interface Receta {
  title: string;
  slug: string;
  mainImage: {
    asset: {
      _ref: string; // Aquí debe ir el nombre del archivo, ej: "foto.jpg" o "imagenes/foto.jpg"
      _type: string;
    };
    [key: string]: unknown;
  } | null;
  publishedAt: string;
  categoriaSlug: string;
}

interface Props {
  recetas: Receta[];
}

export default function Recetas({ recetas }: Props) {
  return (
    <div>
      {recetas.map((receta) => (
        <div key={receta.slug}>
          <h2>{receta.title}</h2>
          {receta.mainImage && receta.mainImage.asset && (
            <img
              src={`/${receta.mainImage.asset._ref}`}
              alt={receta.title}
            />
          )}
        </div>
      ))}
    </div>
  );
}