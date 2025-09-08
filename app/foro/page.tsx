import { Suspense } from 'react';
import { client, queries } from '@/lib/sanity';
import type { ForumPost } from '@/types/sanity';
import { Metadata } from 'next';
import ForoContent from '@/components/ForoContent';
import CreatePostButton from '@/components/CreatePostButton';

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
                🗣️
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                Foro Keto
              </h1>
              
              <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto leading-relaxed font-light mb-8">
                La comunidad cetogénica más grande en español. Conecta, comparte y aprende con otros en tu viaje keto.
              </p>
              
              {/* Create Post Button */}
              <div className="text-center">
                <CreatePostButton className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 inline-flex items-center gap-2" />
              </div>
            </div>
          </div>

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
      </div>
    );
  } catch (error) {
    console.error('Error loading forum:', error);
    
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
                🗣️
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                Foro Keto
              </h1>
              
              <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto leading-relaxed font-light">
                La comunidad cetogénica más grande en español. Conecta, comparte y aprende con otros en tu viaje keto.
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <p className="text-gray-500">
                Estamos cargando el contenido. Por favor, inténtalo de nuevo más tarde.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}