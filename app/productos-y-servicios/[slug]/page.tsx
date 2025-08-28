import { notFound } from 'next/navigation';
import { client, urlFor } from '@/lib/sanity';
import type { Product, Service } from '@/types/sanity';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowTopRightOnSquareIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getItem(slug: string) {
  try {
    // Try to fetch as product first
    const product = await client.fetch<Product>(`
      *[_type == "product" && slug.current == $slug][0] {
        _id,
        name,
        slug,
        description,
        price,
        currency,
        image,
        affiliateUrl,
        featured,
        createdAt
      }
    `, { slug });

    if (product) {
      return { ...product, type: 'product' as const };
    }

    // If not found as product, try service
    const service = await client.fetch<Service>(`
      *[_type == "service" && slug.current == $slug][0] {
        _id,
        name,
        slug,
        description,
        price,
        currency,
        duration,
        image,
        features,
        contactUrl,
        whatsapp,
        featured,
        createdAt
      }
    `, { slug });

    if (service) {
      return { ...service, type: 'service' as const };
    }

    return null;
  } catch (error) {
    console.error('Error fetching item:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const item = await getItem(resolvedParams.slug);
  
  if (!item) {
    return {
      title: 'Página no encontrada',
    };
  }

  const title = `${item.name} | ${item.type === 'product' ? 'Producto' : 'Servicio'} Keto`;
  const description = item.description.substring(0, 160);
  const imageUrl = item.image ? urlFor(item.image).width(1200).height(630).url() : '/og-default.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: item.name,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ItemDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const item = await getItem(resolvedParams.slug);

  if (!item) {
    notFound();
  }

  const imageUrl = item.image ? urlFor(item.image).width(800).height(600).url() : null;

  const handleWhatsAppClick = () => {
    if (item.type === 'service' && item.whatsapp) {
      const message = `Hola, estoy interesado en el servicio: ${item.name}`;
      return `https://wa.me/${item.whatsapp}?text=${encodeURIComponent(message)}`;
    }
    return '#';
  };

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${price}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Inicio
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/productos-y-servicios" className="text-gray-500 hover:text-gray-700">
                Productos y Servicios
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{item.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={item.name}
                  width={800}
                  height={600}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-6xl">
                    {item.type === 'service' ? '🎯' : '📦'}
                  </div>
                </div>
              )}
            </div>

            {item.featured && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-yellow-800">
                    Producto destacado por nuestros expertos
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  item.type === 'product' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {item.type === 'product' ? 'Producto' : 'Servicio'}
                </span>
                {item.featured && (
                  <span className="px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                    ⭐ Destacado
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.name}</h1>
              <p className="text-lg text-gray-600">{item.description}</p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  <span className="font-semibold">Precio:</span>
                </div>
                <span className="text-3xl font-bold text-gray-900">{formatPrice(item.price, item.currency)}</span>
              </div>

              {item.duration && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Duración:</span>
                  </div>
                  <span className="text-gray-900">{item.duration}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span className="font-semibold">Disponibilidad:</span>
                </div>
                <span className="text-green-600 font-medium">
                  {item.type === 'product' ? 'Inmediata' : 'Agendar'}
                </span>
              </div>
            </div>

            {/* Features */}
            {item.features && item.features.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ¿Qué incluye?
                </h3>
                <ul className="space-y-3">
                  {item.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  {item.type === 'product' 
                    ? 'Compra ahora y recibe acceso inmediato' 
                    : 'Agenda tu servicio con nuestros expertos'
                  }
                </p>
                
                {item.type === 'product' ? (
                  <a
                    href={item.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
                  >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-2" />
                    Comprar ahora
                  </a>
                ) : (
                  <div className="space-y-3">
                    {item.whatsapp && (
                      <a
                        href={handleWhatsAppClick()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
                      >
                        Contactar por WhatsApp
                      </a>
                    )}
                    {item.contactUrl && (
                      <a
                        href={item.contactUrl}
                        className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center"
                      >
                        Agendar servicio
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Back Button */}
            <div className="pt-4">
              <Link
                href="/productos-y-servicios"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Volver a todos los productos y servicios
              </Link>
            </div>
          </div>
        </div>

        {/* Related Items */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            También te puede interesar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder for related items - can be implemented with similar items */}
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-gray-400 mb-4">📦</div>
              <h3 className="font-semibold text-gray-900 mb-2">Más productos pronto</h3>
              <p className="text-sm text-gray-600">Estamos añadiendo más contenido para ti.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-gray-400 mb-4">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">Servicios personalizados</h3>
              <p className="text-sm text-gray-600">Consulta nuestros servicios expertos.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-gray-400 mb-4">📚</div>
              <h3 className="font-semibold text-gray-900 mb-2">Guías y recursos</h3>
              <p className="text-sm text-gray-600">Explora nuestros recursos educativos.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}