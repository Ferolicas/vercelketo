import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/lib/sanity';
import { AffiliateList } from '@/types/sanity';
import ProductRecommendations from '@/components/ProductRecommendations';
import Link from 'next/link';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  
  try {
    const affiliateList = await client.fetch(
      `*[_type == "affiliateList" && slug.current == $slug][0] {
        title,
        description
      }`,
      { slug }
    );

    if (!affiliateList) {
      return {
        title: 'Lista no encontrada',
        description: 'La lista de productos afiliados no existe.',
      };
    }

    return {
      title: `${affiliateList.title} | Planeta Keto`,
      description: affiliateList.description || `Descubre ${affiliateList.title} - Los mejores productos keto recomendados.`,
      openGraph: {
        title: affiliateList.title,
        description: affiliateList.description || `Descubre ${affiliateList.title} - Los mejores productos keto recomendados.`,
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'Lista de Afiliados',
      description: 'Productos keto recomendados por expertos.',
    };
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(
      `*[_type == "affiliateList"]{ slug { current } }`
    );
    return slugs.map((item: any) => ({ slug: item.slug.current }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

async function getAffiliateList(slug: string) {
  try {
    const affiliateList = await client.fetch(
      `*[_type == "affiliateList" && slug.current == $slug][0] {
        _id,
        title,
        description,
        "imageUrl": image.asset->url,
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
      }`,
      { slug }
    );

    return affiliateList;
  } catch (error) {
    console.error('Error fetching affiliate list:', error);
    return null;
  }
}

export default async function AffiliateListPage({ params }: Props) {
  const { slug } = params;
  const affiliateList = await getAffiliateList(slug);

  if (!affiliateList) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl text-white text-4xl mb-6">
              🛒
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {affiliateList.title}
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              {affiliateList.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-green-200">
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                Productos verificados
              </div>
              <div className="flex items-center">
                <span className="mr-2">⭐</span>
                Recomendados por expertos
              </div>
              <div className="flex items-center">
                <span className="mr-2">🛍️</span>
                Enlaces de afiliado
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ProductRecommendations 
          title={affiliateList.title}
          description={affiliateList.description}
          featured={affiliateList.featured}
          limit={affiliateList.items.length}
        />

        {/* Navigation */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/afiliados"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Ver todas las listas
          </Link>
        </div>
      </div>
    </div>
  );
}