// app/categorias/[slug]/[post]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link'; // Todavía útil para el enlace de "Volver al inicio"
import { client, queries } from '@/lib/sanity';
import type { Post, HomePage } from '@/types/sanity';
import { Clock, ChefHat } from 'lucide-react'; // ArrowLeft ya no se importa aquí directamente
import { Suspense } from 'react';
import PostContent from './PostContent';
import { Header } from '@/components/Header';
import { ScrollToTop } from '@/components/ScrollToTop';
import { BackButton } from '@/components/BackButton'; // ¡Importamos el componente general de cliente!

// NOTA: 'useRouter' ya NO se importa aquí porque este es un Server Component.
// El BackButton.tsx ahora maneja la lógica de navegación del cliente.

// Función para convertir Portable Text a texto plano
function portableTextToPlainText(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';

  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) {
        return '';
      }
      return block.children.map((child: any) => child.text).join('');
    })
    .join('\n\n');
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string; post: string }>;
}) {
  const { slug, post } = await params;

  console.log('📄 PÁGINA DE RECETA CARGANDO:', post);

  const [postData, homePageData, categoryData]: [Post, HomePage, any] =
    await Promise.all([
      client.fetch(queries.postBySlug, { slug: post }),
      client.fetch(queries.homePage),
      client.fetch(`*[_type == "category" && slug.current == $slug][0] { title, slug }`, { slug }),
    ]);

  if (!postData) {
    return (
      <div className="min-h-screen bg-orange-50">
        <Header homePageData={homePageData} />

        <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Receta no encontrada</h1>
            <Link href="/">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
                Volver al inicio
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Función mejorada para procesar el body
  const processPostBody = (body: any): string => {
    if (!body) return '';
    if (typeof body === 'string') return body;
    if (Array.isArray(body)) return portableTextToPlainText(body);
    if (typeof body === 'object') {
      if (body._type === 'block' || (body.children && Array.isArray(body.children))) {
        return portableTextToPlainText([body]);
      }
    }
    return String(body) || '';
  };

  // Preparar datos para el componente cliente
  const processedPostData = {
    title: postData.title,
    author: postData.author,
    preparationTime: postData.preparationTime || 'No especificado',
    level: postData.level || 'No especificado',
    youtubeUrl: postData.youtubeUrl,
    ingredients: postData.ingredients || [],
    body: processPostBody(postData.body),
    slug: postData.slug.current,
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <Header homePageData={homePageData} />

      {/* Botón de regreso */}
      <div className="container mx-auto px-4 pt-6">
        {/* ¡Usamos el componente BackButton genérico aquí! */}
        <BackButton text={`Volver a ${categoryData?.title || 'la categoría'}`} />
      </div>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Título de la receta */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            {processedPostData.title}
          </h1>

          {/* Información básica (Server-side) */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="mb-4 md:mb-0">
              {processedPostData.author && (
                <p className="text-lg text-gray-600">
                  Por: <span className="font-semibold text-gray-800">{processedPostData.author.name}</span>
                </p>
              )}
            </div>
          </div>

          {/* Duración y dificultad */}
          <div className="flex flex-wrap gap-6 mb-8 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-emerald-600" />
              <span className="font-medium text-gray-700">Duración:</span>
              <span className="text-gray-600">{processedPostData.preparationTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ChefHat size={20} className="text-emerald-600" />
              <span className="font-medium text-gray-700">Dificultad:</span>
              <span className="text-gray-600 capitalize">{processedPostData.level}</span>
            </div>
          </div>

          {/* Componente cliente con toda la interactividad */}
          <Suspense fallback={<div>Cargando contenido de la receta...</div>}>
            <PostContent postData={processedPostData} />
          </Suspense>
        </div>
      </main>
      {/* Botón de scroll to top */}
      <ScrollToTop />
    </div>
  );
}

export async function generateStaticParams(): Promise<{ slug: string; post: string }[]> {
  const posts: Post[] = await client.fetch(`
    *[_type == "post"] {
      slug,
      category->{
        slug
      }
    }
  `);

  return posts.map((post) => ({
    slug: post.category?.slug?.current || 'sin-categoria',
    post: post.slug.current,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; post: string }>;
}): Promise<Metadata> {
  const { post } = await params;

  const postData: Post = await client.fetch(queries.postBySlug, {
    slug: post,
  });

  if (!postData) {
    return {
      title: 'Receta no encontrada',
      description: 'La receta que buscas no existe.',
    };
  }

  const description =
    postData.body && Array.isArray(postData.body)
      ? portableTextToPlainText(postData.body).substring(0, 160) + '...'
      : 'Deliciosa receta keto para disfrutar';

  return {
    title: `${postData.title} | Planeta Keto`,
    description,
    openGraph: {
      title: postData.title,
      description,
      type: 'article',
      authors: postData.author?.name ? [postData.author.name] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: postData.title,
      description,
    },
  };
}

// Configurar revalidación para ISR
export const revalidate = 60;