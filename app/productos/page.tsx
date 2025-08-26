import { Suspense } from 'react';
import { client, queries } from '@/lib/sanity';
import type { Product, ProductCategory } from '@/types/sanity';
import { Metadata } from 'next';
import ProductsContent from '@/components/ProductsContent';

export const metadata: Metadata = {
  title: "Tienda Keto | Los Mejores Productos Cetogénicos Online 2024",
  description: "🛒 Descubre los productos keto más recomendados: suplementos, alimentos, libros y herramientas para tu éxito cetogénico. Envío gratis +$50.",
  keywords: "tienda keto, productos keto, suplementos keto, alimentos cetogenicos, aceite mct, proteina keto, electrolitos keto, libros keto, productos cetogenicos online, tienda cetogenica, comprar keto, keto shop, dr bayter productos",
  openGraph: {
    title: "Tienda Keto | Los Mejores Productos Cetogénicos",
    description: "🛒 Productos keto de calidad premium para acelerar tu transformación. Suplementos, alimentos y herramientas recomendadas por expertos.",
    type: "website",
    images: [
      {
        url: "/og-productos.jpg",
        width: 1200,
        height: 630,
        alt: "Tienda Keto Planeta Keto - Productos Cetogénicos",
      }
    ],
  },
  alternates: {
    canonical: "/productos",
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface PageProps {
  searchParams: Promise<{ categoria?: string; ordenar?: string; page?: string }>;
}

export default async function ProductosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1');
  const selectedCategory = params.categoria;
  const sortBy = params.ordenar || 'recientes';

  try {
    const productsPerPage = 12;
    const offset = (currentPage - 1) * productsPerPage;
    
    let orderBy = '_createdAt desc';
    if (sortBy === 'precio-asc') orderBy = 'price asc';
    if (sortBy === 'precio-desc') orderBy = 'price desc';
    if (sortBy === 'populares') orderBy = 'rating desc';
    if (sortBy === 'alfabetico') orderBy = 'title asc';

    const [products, categories, featuredProducts, totalProducts] = await Promise.all([
      client.fetch<Product[]>(
        selectedCategory 
          ? `*[_type == "product" && category->slug.current == $category] | order(${orderBy})[$offset...$limit] {
              _id,
              _createdAt,
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
              stock,
              affiliateUrl,
              amazonUrl
            }`
          : `*[_type == "product"] | order(${orderBy})[$offset...$limit] {
              _id,
              _createdAt,
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
              stock,
              affiliateUrl,
              amazonUrl
            }`,
        { 
          category: selectedCategory,
          offset,
          limit: offset + productsPerPage - 1
        }
      ),
      client.fetch<ProductCategory[]>(queries.allProductCategories),
      client.fetch<Product[]>(
        `*[_type == "product" && rating >= 4.5] | order(rating desc)[0..6] {
          _id,
          title,
          slug,
          shortDescription,
          price,
          discountPrice,
          currency,
          images[0],
          rating,
          isDigital
        }`
      ),
      client.fetch<number>(
        selectedCategory
          ? `count(*[_type == "product" && category->slug.current == $category])`
          : `count(*[_type == "product"])`
      ),
    ]);

    const totalPages = Math.ceil(totalProducts / productsPerPage);

    return (
      <div className="min-h-screen bg-white pt-20">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          </div>
        }>
          <ProductsContent 
            products={products}
            categories={categories}
            featuredProducts={featuredProducts}
            currentPage={currentPage}
            totalPages={totalPages}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            totalProducts={totalProducts}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading products:', error);
    
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              🛒 Tienda Keto
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Los mejores productos cetogénicos para tu transformación
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold text-green-800 mb-2">¿Buscas algo específico?</h3>
              <div className="text-sm text-green-700 space-y-1">
                <p>• Suplementos keto premium</p>
                <p>• Aceites MCT de alta calidad</p>
                <p>• Proteínas cetogénicas</p>
                <p>• Libros y guías keto</p>
                <p>• Herramientas para cetosis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}