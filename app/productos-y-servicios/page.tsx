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
    <div className="pt-16">
      <Suspense fallback={
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        </div>
      }>
        <ProductosYAfiliados />
      </Suspense>
    </div>
  );
}