import { Suspense } from 'react';
import { client, queries } from '@/lib/sanity';
import type { BlogPost } from '@/types/sanity';
import { Metadata } from 'next';
import BlogContent from '@/components/BlogContent';

export const metadata: Metadata = {
  title: "Blog Keto | Guías, Tips y Consejos sobre Dieta Cetogénica 2024",
  description: "✨ Blog especializado en dieta keto con consejos de expertos, estudios científicos, tips para principiantes y guías avanzadas. Aprende todo sobre la vida cetogénica.",
  keywords: "blog keto, dieta cetogenica blog, consejos keto, tips dieta keto, guia keto principiantes, cetosis consejos, keto lifestyle, vida cetogenica, nutrición keto, estudios keto, keto ciencia, macros cetogenicos, keto beneficios, ayuno intermitente keto",
  openGraph: {
    title: "Blog Keto | Los Mejores Consejos y Guías Cetogénicas",
    description: "✨ Descubre consejos de expertos, estudios científicos y guías completas para dominar la dieta keto. Tu fuente #1 de información cetogénica.",
    type: "website",
    images: [
      {
        url: "/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Blog Planeta Keto - Consejos y Guías Cetogénicas",
      }
    ],
  },
  alternates: {
    canonical: "/blog",
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface PageProps {
  searchParams: Promise<{ categoria?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1');
  const selectedCategory = params.categoria;

  try {
    // Fetch blog posts con paginación
    const postsPerPage = 12;
    const offset = (currentPage - 1) * postsPerPage;
    
    const [blogPosts, categories, featuredPosts, totalPosts] = await Promise.all([
      client.fetch<BlogPost[]>(
        selectedCategory 
          ? `*[_type == "blogPost" && category->slug.current == $category] | order(publishedAt desc)[$offset...$limit] {
              _id,
              _createdAt,
              title,
              slug,
              excerpt,
              mainImage,
              author->{
                name,
                slug,
                image
              },
              category->{
                title,
                slug,
                color
              },
              tags,
              publishedAt,
              readTime,
              isFeatured
            }`
          : `*[_type == "blogPost"] | order(publishedAt desc)[$offset...$limit]`,
        { 
          category: selectedCategory,
          offset,
          limit: offset + postsPerPage - 1
        }
      ),
      client.fetch<any[]>(`*[_type == "blogCategory"]`),
      client.fetch<BlogPost[]>(`*[_type == "blogPost" && featured == true]`),
      client.fetch<number>(
        selectedCategory
          ? `count(*[_type == "blogPost" && category->slug.current == $category])`
          : `count(*[_type == "blogPost"])`
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
                📚
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                Blog Keto
              </h1>
              
              <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto leading-relaxed font-light">
                Guías, consejos y tips para dominar la dieta cetogénica. Tu fuente de información cetogénica de confianza.
              </p>
            </div>
          </div>

          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
            </div>
          }>
            <BlogContent 
              blogPosts={blogPosts}
              categories={categories}
              featuredPosts={featuredPosts}
              currentPage={currentPage}
              totalPages={totalPages}
              selectedCategory={selectedCategory}
              totalPosts={totalPosts}
            />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading blog:', error);
    
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
                📚
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                Blog Keto
              </h1>
              
              <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto leading-relaxed font-light">
                Guías, consejos y tips para dominar la dieta cetogénica. Tu fuente de información cetogénica de confianza.
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

// Función para generar paths estáticos de categorías populares
export async function generateStaticParams() {
  try {
    const categories = await client.fetch<any[]>(
      `*[_type == "blogCategory"] { slug }`
    );
    
    return categories.map((category) => ({
      categoria: category.slug.current,
    }));
  } catch (error) {
    return [];
  }
}