import { Suspense } from 'react';
import { client, queries } from '@/lib/sanity';
import type { ForumPost } from '@/types/sanity';
import { Metadata } from 'next';
import ForoContent from '@/components/ForoContent';

export const metadata: Metadata = {
  title: "Foro Keto | Comunidad de Dieta Cetogénica #1 en Español 2024",
  description: "🗣️ Únete a la comunidad keto más grande en español. Comparte experiencias, haz preguntas, encuentra apoyo y conecta con otros en su viaje cetogénico.",
  keywords: "foro keto, comunidad keto, preguntas keto, experiencias dieta cetogenica, apoyo keto, grupo keto español, consultas keto, dudas cetosis, comunidad cetogenica, keto principiantes, keto avanzados, recetas compartidas keto, testimonios keto",
  openGraph: {
    title: "Foro Keto | La Comunidad Cetogénica #1 en Español",
    description: "🗣️ Conecta con miles de personas en su viaje keto. Comparte experiencias, resuelve dudas y encuentra el apoyo que necesitas.",
    type: "website",
    images: [
      {
        url: "/og-foro.jpg",
        width: 1200,
        height: 630,
        alt: "Foro Planeta Keto - Comunidad Cetogénica",
      }
    ],
  },
  alternates: {
    canonical: "/foro",
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface PageProps {
  searchParams: Promise<{ categoria?: string; page?: string; orden?: string }>;
}

export default async function ForoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1');
  const selectedCategory = params.categoria;
  const sortOrder = params.orden || 'recientes';

  try {
    const postsPerPage = 15;
    const offset = (currentPage - 1) * postsPerPage;
    
    let orderBy = '_createdAt desc';
    if (sortOrder === 'populares') orderBy = 'views desc';
    if (sortOrder === 'likes') orderBy = 'likes desc';
    if (sortOrder === 'replies') orderBy = 'count(replies) desc';

    const [forumPosts, categories, pinnedPosts, totalPosts] = await Promise.all([
      client.fetch<ForumPost[]>(
        selectedCategory 
          ? `*[_type == "forumPost" && category->slug.current == $category && isPinned != true] | order(${orderBy})[$offset...$limit] {
              _id,
              _createdAt,
              title,
              slug,
              content[0..200],
              author,
              category->{
                title,
                slug,
                color,
                icon
              },
              tags,
              views,
              likes,
              "replyCount": count(replies),
              "lastReply": replies[-1]{
                _createdAt,
                author
              }
            }`
          : `*[_type == "forumPost" && isPinned != true] | order(${orderBy})[$offset...$limit] {
              _id,
              _createdAt,
              title,
              slug,
              content[0..200],
              author,
              category->{
                title,
                slug,
                color,
                icon
              },
              tags,
              views,
              likes,
              "replyCount": count(replies),
              "lastReply": replies[-1]{
                _createdAt,
                author
              }
            }`,
        { 
          category: selectedCategory,
          offset,
          limit: offset + postsPerPage - 1
        }
      ),
      client.fetch<any[]>(`*[_type == "forumCategory"]`),
      client.fetch<ForumPost[]>(
        `*[_type == "forumPost" && isPinned == true] | order(_createdAt desc)[0..5] {
          _id,
          _createdAt,
          title,
          slug,
          content[0..150],
          author,
          category->{
            title,
            slug,
            color
          },
          views,
          likes,
          "replyCount": count(replies)
        }`
      ),
      client.fetch<number>(
        selectedCategory
          ? `count(*[_type == "forumPost" && category->slug.current == $category && isPinned != true])`
          : `count(*[_type == "forumPost" && isPinned != true])`
      ),
    ]);

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          </div>
        }>
          <ForoContent 
            forumPosts={forumPosts}
            categories={categories}
            pinnedPosts={pinnedPosts}
            currentPage={currentPage}
            totalPages={totalPages}
            selectedCategory={selectedCategory}
            sortOrder={sortOrder}
            totalPosts={totalPosts}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading forum:', error);
    
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              🗣️ Foro Keto
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              La comunidad cetogénica más grande en español
            </p>
            <p className="text-gray-500">
              Estamos cargando el contenido. Por favor, inténtalo de nuevo más tarde.
            </p>
          </div>
        </div>
      </div>
    );
  }
}