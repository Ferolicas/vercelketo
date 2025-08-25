import { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { client, queries } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity';
import type { Post, Category, HomePage } from '@/types/sanity';
import { Clock, ChefHat } from 'lucide-react';
import { Header } from '@/components/Header';
import { ScrollToTop } from '@/components/ScrollToTop';
import { BackButton } from '@/components/BackButton';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const { slug } = await params;
    const category: Category = await client.fetch(queries.categoryBySlug, { slug });
    
    return {
      title: `${category?.title || 'Categoría'} Keto - Recetas Fáciles y Rápidas | Planeta Keto`,
      description: `Recetas de ${category?.title || 'esta categoría'} keto para tu estilo de vida cetogénico. Bajas en carbohidratos y deliciosas`,
      alternates: {
        canonical: `/categorias/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating category metadata:', error);
    return {
      title: 'Categorías Keto - Planeta Keto',
      description: 'Descubre recetas keto organizadas por categorías para tu dieta cetogénica.',
      robots: 'index, follow',
    };
  }
}

export default async function CategoryPage({
  params,
}: {
  // Aquí params sigue siendo una Promise, como se espera para el componente de página
  params: Promise<{ slug: string }>;
}) {
  // Aquí SÍ necesitas 'await params' para obtener los valores
  const { slug } = await params;

  console.log('📂 PÁGINA DE CATEGORÍA CARGANDO:', slug);

  let category: Category | null = null;
  let homePageData: HomePage | null = null;

  try {
    // Intentar obtener la categoría y los datos de la página principal en paralelo
    [category, homePageData] = await Promise.all([
      client.fetch(queries.categoryBySlug, { slug }),
      client.fetch(queries.homePage),
    ]);
  } catch (error) {
    console.error('Error fetching category data:', error);
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-orange-50">
        <Header homePageData={homePageData} />
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Categoría no encontrada</h1>
            <Link href="/" passHref>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
                Volver al inicio
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Los posts ya vienen incluidos en la consulta categoryBySlug
  const posts: Post[] = category.posts || [];

  return (
    <div className="min-h-screen bg-orange-50">
      <Header homePageData={homePageData} />

      {/* Botón de regreso usando el componente BackButton general */}
      <div className="container mx-auto px-4 pt-6">
        <BackButton text="Volver a categorías" />
      </div>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Título de la categoría */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {category.title}
          </h1>
          {category.description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {category.description}
            </p>
          )}
        </div>

        {/* Grid de recetas */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <Link href={`/categorias/${slug}/${post.slug.current}`}>
                  {/* Imagen de la receta */}
                  <div className="relative w-full h-64 bg-gradient-to-br from-orange-50 to-emerald-50 flex items-center justify-center">
                    {post.mainImage ? (
                      <Image
                        src={urlFor(post.mainImage).url()}
                        alt={post.title}
                        fill
                        className="object-contain hover:scale-105 transition-transform duration-300"
                        sizes="100vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ChefHat size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Contenido de la tarjeta */}
                  <div className="p-4">
                    {/* Título de la receta */}
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 hover:text-emerald-600 transition-colors">
                      {post.title}
                    </h3>

                    {/* Duración y Dificultad */}
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Clock size={16} className="text-emerald-600" />
                        <span>{post.preparationTime || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ChefHat size={16} className="text-emerald-600" />
                        <span className="capitalize">{post.level || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Autor */}
                    {post.author && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Por: <span className="font-medium">{post.author.name}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ChefHat size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No hay recetas disponibles
            </h3>
            <p className="text-gray-500">
              Aún no se han publicado recetas en esta categoría.
            </p>
            <Link href="/" scroll={false}>
              <button className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
                Volver al inicio
              </button>
            </Link>
          </div>
        )}
      </main>
       <ScrollToTop />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://www.planetaketo.es/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Categorías",
                "item": "https://www.planetaketo.es//categorias"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": category.title,
                "item": `https://www.planetaketo.es//categorias/${slug}`
              }
            ]
          })
        }}
      />
    </div>
  );
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const categories: Category[] = await client.fetch(queries.allCategories);
    return categories.map((category) => ({
      slug: category.slug.current,
    }));
  } catch (error) {
    console.error('Error generating static params for categories:', error);
    return [];
  }
}

export const revalidate = 60;