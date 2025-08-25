import { Suspense } from 'react';
import { generateSEOMetadata } from '@/components/SEOHead';
import ServiciosYProductos from '@/components/ServiciosYProductos';

// SEO optimizado para servicios y productos
export async function generateMetadata() {
  return generateSEOMetadata({
    title: 'Productos Keto y Servicios | Tienda Cetogénica Premium',
    description: 'Descubre los mejores productos keto, suplementos cetogénicos y servicios premium. Libros, guías, planes personalizados y productos afiliados de Amazon para tu éxito keto.',
    keywords: 'productos keto, suplementos keto, tienda keto, libros keto, guías keto, planes keto, servicios keto, productos cetogénicos, amazon keto, afiliados keto, calculadora keto, coaching keto',
    url: '/servicios',
    type: 'website'
  });
}

export default function ServiciosPage() {
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