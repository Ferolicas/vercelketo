import { Metadata } from 'next';
import { client } from '@/lib/sanity';
import { AffiliateList } from '@/types/sanity';
import ProductRecommendations from '@/components/ProductRecommendations';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Productos Afiliados Keto | Planeta Keto',
  description: 'Los mejores productos keto recomendados por expertos. Suplementos, libros y herramientas para tu transformación cetogénica.',
  keywords: 'productos keto, afiliados amazon, suplementos keto, libros keto, herramientas cetogénicas',
};

async function getAffiliateLists() {
  try {
    const affiliateLists = await client.fetch(
      `*[_type == "affiliateList"] | order(createdAt desc) {
        _id,
        title,
        description,
        "imageUrl": image.asset->url,
        "slug": slug.current,
        items[]{
          title,
          description,
          "imageUrl": image.asset->url,
          link,
          price,
          currency,
          rating,
          category
        },
        featured,
        createdAt
      }`
    );
    return affiliateLists;
  } catch (error) {
    console.error('Error fetching affiliate lists:', error);
    return [];
  }
}

export default async function AfiliadosPage() {
  const affiliateLists = await getAffiliateLists();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl text-white text-4xl mb-6">
              🛒
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Productos 
              <span className="text-yellow-300">Afiliados Keto</span>
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Los mejores productos keto seleccionados por nuestros expertos. 
              Todos los enlaces son de afiliados, lo que nos ayuda a mantener este contenido gratuito.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {affiliateLists.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4 text-6xl">🛍️</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No hay productos disponibles
            </h2>
            <p className="text-gray-500 mb-6">
              Pronto agregaremos productos keto recomendados.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {affiliateLists.map((list: AffiliateList) => (
              <section key={list._id} className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {list.title}
                      </h2>
                      <p className="text-gray-600">
                        {list.description}
                      </p>
                    </div>
                    {list.featured && (
                      <div className="flex items-center text-yellow-500">
                        <span className="text-xl mr-1">⭐</span>
                        <span className="text-sm font-medium">Destacado</span>
                      </div>
                    )}
                  </div>
                </div>

                <ProductRecommendations 
                  title={list.title}
                  description={list.description}
                  featured={list.featured}
                  limit={list.items.length}
                />
              </section>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            ¿Buscas algo específico?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Explora nuestras recetas keto y descubre productos que complementan tu dieta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/recetas"
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Ver Recetas
            </Link>
            <Link
              href="/productos-y-servicios"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Ver Servicios
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}