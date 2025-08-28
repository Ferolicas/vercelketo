import { Suspense } from 'react';
import { productsServicesUtils } from '@/lib/products-services';
import type { UnifiedItem } from '@/lib/products-services';
import { Metadata } from 'next';
import ProductsServicesContent from '@/components/ProductsServicesContent';

export const metadata: Metadata = {
  title: "Productos y Servicios Keto | Tienda Cetogénica Premium 2024",
  description: "🛍️ Descubre todos nuestros productos keto y servicios expertos en un solo lugar. Guías digitales, planes personalizados, suplementos recomendados y asesoría profesional para tu éxito cetogénico.",
  keywords: "productos keto, servicios keto, tienda cetogénica, guías keto, planes personalizados, asesoría keto, productos cetogénicos, suplementos keto, coaching keto, recetas keto premium",
  openGraph: {
    title: "Productos y Servicios Keto | Planeta Keto",
    description: "Todo lo que necesitas para tu transformación cetogénica en un solo lugar. Productos premium, servicios expertos y guías profesionales.",
    type: "website",
    images: [
      {
        url: "/og-productos-servicios.jpg",
        width: 1200,
        height: 630,
        alt: "Productos y Servicios Keto - Planeta Keto",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Productos y Servicios Keto | Planeta Keto",
    description: "Descubre todos nuestros productos y servicios keto en un solo lugar. ¡Transforma tu vida hoy!",
    images: ["/og-productos-servicios.jpg"],
  },
  alternates: {
    canonical: "/productos-y-servicios",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

interface PageProps {
  searchParams: Promise<{ categoria?: string; tipo?: string; ordenar?: string; page?: string }>;
}

export default async function ProductosYServiciosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1');
  const selectedCategory = params.categoria;
  const selectedType = params.tipo;
  const sortBy = params.ordenar || 'recientes';

  try {
    const itemsPerPage = 12;
    
    // Get all items using utility function
    const allItems = await productsServicesUtils.getAllItems();

    // Apply filters
    let filteredItems = allItems;

    if (selectedType && selectedType !== 'todos') {
      filteredItems = filteredItems.filter(item => item.type === selectedType);
    }

    // Sort items
    let sortField = 'newest';
    if (sortBy === 'precio-asc') sortField = 'price-asc';
    if (sortBy === 'precio-desc') sortField = 'price-desc';
    if (sortBy === 'alfabetico') sortField = 'name';

    const sortedItems = productsServicesUtils.sortItems(filteredItems, sortField);

    // Paginate items
    const { items: paginatedItems, totalPages } = productsServicesUtils.paginateItems(
      sortedItems, 
      currentPage, 
      itemsPerPage
    );

    // Get featured items
    const featuredItems = allItems.filter(item => item.featured).slice(0, 6);

    // Get total items count
    const totalItems = filteredItems.length;

    // Categories for filtering
    const categories = [
      'Todos',
      'Guías Digitales',
      'Recetas',
      'Herramientas',
      'Servicios',
      'Suplementos',
      'Consultoría',
      'Nutrición'
    ];

    return (
      <div className="min-h-screen bg-white pt-20">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          </div>
        }>
          <ProductsServicesContent 
            items={paginatedItems}
            featuredItems={featuredItems}
            categories={categories}
            currentPage={currentPage}
            totalPages={totalPages}
            selectedCategory={selectedCategory}
            selectedType={selectedType}
            sortBy={sortBy}
            totalItems={totalItems}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading products and services:', error);
    
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl text-white text-4xl mb-6">
                🛍️
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Productos y Servicios Keto
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Todo lo que necesitas para tu transformación cetogénica en un solo lugar
              </p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto mb-8">
              <h3 className="font-semibold text-red-800 mb-2">
                ⚠️ Error al cargar contenido
              </h3>
              <p className="text-sm text-red-700 mb-4">
                No pudimos cargar los productos y servicios en este momento. Por favor, intenta más tarde.
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Reintentar
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-2">Productos disponibles</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Guías digitales keto premium</li>
                  <li>• Recetarios exclusivos</li>
                  <li>• Herramientas de cálculo</li>
                  <li>• Libros especializados</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-2">Servicios expertos</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Planes personalizados</li>
                  <li>• Asesoría nutricional</li>
                  <li>• Coaching 1:1 privado</li>
                  <li>• Consultas especializadas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}