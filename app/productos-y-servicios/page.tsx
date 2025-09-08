import { Suspense } from 'react';
import { generateSEOMetadata } from '@/components/SEOHead';
import ProductosYAfiliados from '@/components/ServiciosYProductos';

export async function generateMetadata() {
  return generateSEOMetadata({
    title: 'Productos y Afiliados Keto | Tienda Cetogénica Premium',
    description: '🛍️ Descubre los mejores productos keto digitales y listas curadas de Amazon para tu éxito cetogénico. Guías exclusivas y productos recomendados por expertos.',
    keywords: 'productos keto, tienda keto, guías keto, productos cetogénicos, amazon keto, afiliados keto, calculadora keto, planeta keto, libro keto',
    url: '/productos-y-servicios',
    type: 'website'
  });
}

export default function ProductosYServiciosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <div className="pt-16">
        {/* Header moderno */}
        <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 py-12 overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          
          {/* Floating elements */}
          <div className="absolute top-6 left-10 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-6 right-20 w-12 h-12 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 right-10 w-10 h-10 bg-white/10 rounded-full animate-ping"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl text-white text-3xl mb-6 shadow-2xl">
              🛍️
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Productos y Afiliados
            </h1>
            
            <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto leading-relaxed font-light">
              Descubre nuestra selección de productos digitales y recomendaciones de afiliados 
              cuidadosamente elegidos para tu éxito en la dieta keto.
            </p>
          </div>
        </div>

        <Suspense fallback={
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          </div>
        }>
          <ProductosYAfiliados />
        </Suspense>
      </div>
    </div>
  );
}