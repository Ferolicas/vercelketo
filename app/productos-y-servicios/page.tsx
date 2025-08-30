import { Suspense } from 'react';
import { generateSEOMetadata } from '@/components/SEOHead';
import ServiciosYProductos from '@/components/ServiciosYProductos';

export async function generateMetadata() {
  return generateSEOMetadata({
    title: 'Productos y Servicios Keto | Tienda Cetogénica Premium',
    description: '🛍️ Descubre los mejores productos keto, servicios especializados y listas curadas de Amazon para tu éxito cetogénico. Guías digitales, planes personalizados y productos recomendados por expertos.',
    keywords: 'productos keto, servicios keto, tienda keto, guías keto, planes keto, coaching keto, productos cetogénicos, amazon keto, afiliados keto, calculadora keto, suplementos keto',
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
        <ServiciosYProductos />
      </Suspense>
    </div>
  );
}