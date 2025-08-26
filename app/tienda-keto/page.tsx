import { Suspense } from 'react';
import { client } from '@/lib/sanity';
import type { Product } from '@/types/sanity';
import { Metadata } from 'next';
import TiendaKetoContent from '@/components/TiendaKetoContent';

export const metadata: Metadata = {
  title: "Tienda Keto: Los Mejores Productos Cetogénicos y Suplementos 2024",
  description: "🛒 Tienda keto oficial con productos cetogénicos de calidad premium: suplementos, aceite MCT, proteínas, libros y más. Envío gratis +$50. Dr. Bayter recomendado.",
  keywords: "tienda keto, productos cetogenicos, suplementos keto, aceite mct, proteina keto, electrolitos keto, libros keto, dr bayter, tienda cetogenica, keto shop, productos keto premium, suplementos cetogenicos",
  openGraph: {
    title: "Tienda Keto Oficial: Productos Cetogénicos Premium",
    description: "🛒 Los productos keto más recomendados por expertos. Suplementos, alimentos y herramientas para acelerar tu éxito cetogénico.",
    type: "website",
    url: "https://planetaketo.es/tienda-keto",
    images: [
      {
        url: "/og-tienda-keto.jpg",
        width: 1200,
        height: 630,
        alt: "Tienda Keto Premium - Productos Cetogénicos",
      }
    ],
  },
  alternates: {
    canonical: "/tienda-keto",
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface PageProps {
  searchParams: Promise<{ categoria?: string; precio?: string; marca?: string }>;
}

export default async function TiendaKetoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categoria = params.categoria;
  const precioFilter = params.precio;
  const marca = params.marca;

  try {
    let whereClause = `_type == "product"`;
    const queryParams: any = {};
    
    if (categoria) {
      whereClause += ` && category->slug.current == $categoria`;
      queryParams.categoria = categoria;
    }
    
    if (precioFilter) {
      if (precioFilter === 'bajo') {
        whereClause += ` && price <= 50`;
      } else if (precioFilter === 'medio') {
        whereClause += ` && price > 50 && price <= 150`;
      } else if (precioFilter === 'alto') {
        whereClause += ` && price > 150`;
      }
    }

    const [featuredProducts, supplements, books, tools, categories] = await Promise.all([
      client.fetch<Product[]>(`
        *[_type == "product" && rating >= 4.5] | order(rating desc)[0..8] {
          _id,
          title,
          slug,
          shortDescription,
          price,
          discountPrice,
          currency,
          images,
          category->{
            title,
            slug
          },
          rating,
          isDigital,
          affiliateUrl,
          amazonUrl
        }
      `),
      client.fetch<Product[]>(`
        *[_type == "product" && category->title match "*Suplemento*"] | order(rating desc)[0..6] {
          _id,
          title,
          slug,
          shortDescription,
          price,
          discountPrice,
          currency,
          images[0],
          rating,
          affiliateUrl,
          amazonUrl
        }
      `),
      client.fetch<Product[]>(`
        *[_type == "product" && (category->title match "*Libro*" || isDigital == true)] | order(rating desc)[0..4] {
          _id,
          title,
          slug,
          shortDescription,
          price,
          discountPrice,
          currency,
          images[0],
          rating,
          downloadUrl
        }
      `),
      client.fetch<Product[]>(`
        *[_type == "product" && category->title match "*Herramienta*"] | order(rating desc)[0..4] {
          _id,
          title,
          slug,
          shortDescription,
          price,
          discountPrice,
          currency,
          images[0],
          rating,
          affiliateUrl
        }
      `),
      client.fetch(`
        *[_type == "productCategory"] | order(title asc) {
          _id,
          title,
          slug,
          description,
          "productCount": count(*[_type == "product" && references(^._id)])
        }
      `),
    ]);

    return (
      <div className="min-h-screen bg-white pt-20">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          </div>
        }>
          <TiendaKetoContent 
            featuredProducts={featuredProducts}
            supplements={supplements}
            books={books}
            tools={tools}
            categories={categories}
            selectedCategory={categoria}
            priceFilter={precioFilter}
            selectedBrand={marca}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading tienda keto:', error);
    
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              🛒 Tienda Keto Premium
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Los productos cetogénicos más recomendados por expertos
            </p>
            
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

            <div className="mt-12 p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-2">🎉 Oferta Especial</h3>
              <p className="text-green-100">Envío GRATIS en compras superiores a $50</p>
              <p className="text-sm text-green-200 mt-1">Productos respaldados por el Dr. Bayter</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}