import { Metadata } from 'next';
import Link from 'next/link';
import { client, queries } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity';
import type { Post, HomePage } from '@/types/sanity';
import { Clock, ChefHat, Users, Star } from 'lucide-react';
import { Suspense } from 'react';
import PostContent from './PostContent';
import Comments from '@/components/Comments';
import { Header } from '@/components/Header';
import { ScrollToTop } from '@/components/ScrollToTop';
import { BackButton } from '@/components/BackButton';
import { ShareButtons } from '@/components/ShareButtons';

// Función para convertir PortableText a texto plano
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

// Función para crear descripción optimizada SEO
function createSEODescription(postData: Post, categoryTitle?: string): string {
  if (postData.excerpt) {
    return postData.excerpt.substring(0, 155) + (postData.excerpt.length > 155 ? '...' : '');
  }
  
  // Manejo seguro de ingredientes - verificar que sea string y no esté vacío
  let ingredients = '';
  if (postData.ingredients && typeof postData.ingredients === 'string') {
    ingredients = postData.ingredients.split('\n').slice(0, 3).join(', ');
  }
  
  const time = postData.preparationTime || '30 minutos';
  const level = postData.level || 'fácil';
  const category = categoryTitle || 'keto';
  const descriptions = [
    `Receta ${category.toLowerCase()} ${level} con ${ingredients}. Lista en ${time}. ¡Perfecta para tu dieta cetogénica!`,
    `Aprende a preparar ${postData.title.toLowerCase()} en ${time}. Receta ${level} con ingredientes keto. ${ingredients && `Incluye ${ingredients}.`}`,
    `${postData.title} - Receta ${category.toLowerCase()} ${level}. Preparación ${time}. Ideal para mantener cetosis. ¡Deliciosa y saludable!`
  ];
  return descriptions[0].substring(0, 155) + '...';
}

// Función para generar keywords dinámicas
function generateKeywords(postData: Post, categoryTitle?: string): string {
  const baseKeywords = ['receta keto', 'dieta cetogénica', 'bajo en carbohidratos', 'comida saludable'];
  const levelKeywords = postData.level ? [`receta ${postData.level}`] : [];
  const categoryKeywords = categoryTitle ? [categoryTitle.toLowerCase(), `receta ${categoryTitle.toLowerCase()}`] : [];
  
  // Manejo seguro de ingredientes para keywords
  let ingredientKeywords: string[] = [];
  if (postData.ingredients && typeof postData.ingredients === 'string') {
    ingredientKeywords = postData.ingredients.split('\n').slice(0, 5).map(ing => ing.toLowerCase());
  }
  
  const tagKeywords = postData.tags?.slice(0, 3) || [];
  return [...baseKeywords, ...levelKeywords, ...categoryKeywords, ...ingredientKeywords, ...tagKeywords]
    .filter((keyword, index, arr) => arr.indexOf(keyword) === index)
    .slice(0, 15)
    .join(', ');
}

// Función para formatear la información nutricional
function formatNutrition(postData: Post) {
  if (!postData.macros && !postData.calories) return null;
  return {
    calories: postData.calories ? `${postData.calories} kcal` : "250 kcal",
    fatContent: postData.macros?.fat ? `${postData.macros.fat}g` : "20g",
    carbohydrateContent: postData.macros?.carbs ? `${postData.macros.carbs}g` : "8g",
    fiberContent: postData.macros?.fiber ? `${postData.macros.fiber}g` : "3g",
    proteinContent: postData.macros?.protein ? `${postData.macros.protein}g` : "15g",
    servingSize: postData.servings ? `${postData.servings} porción${postData.servings > 1 ? 'es' : ''}` : "1 porción"
  };
}

// Componente principal
// ✅ CORRECCIÓN: Ahora params es Promise<{}>
export default async function PostPage({
  params
}: {
  params: Promise<{ slug: string; post: string }>
}) {
  // ✅ CORRECCIÓN: Await para resolver params
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

  const processedPostData = {
    title: postData.title,
    author: postData.author,
    preparationTime: postData.preparationTime || 'No especificado',
    level: postData.level || 'principiante',
    youtubeUrl: postData.youtubeUrl,
    ingredients: postData.ingredients || '',
    body: postData.body,
    slug: postData.slug.current,
    rating: postData.rating,
    servings: postData.servings,
    calories: postData.calories,
    macros: postData.macros,
    tags: postData.tags,
    chefNotes: postData.chefNotes,
    excerpt: postData.excerpt
  };

  const baseUrl = process.env.SITE_URL || 'https://www.planetaketo.es';
  const currentDate = new Date().toISOString();
  const mainImageUrl = postData.mainImage ? urlFor(postData.mainImage).url() : `${baseUrl}/default-recipe-image.jpg`;
  const nutritionInfo = formatNutrition(postData);
  const shareUrl = `${baseUrl}/categorias/${slug}/${post}`;

  return (
    <div className="min-h-screen bg-orange-50">
      <Header homePageData={homePageData} />
      <div className="container mx-auto px-4 pt-6">
        <div className="flex justify-between items-center">
          <BackButton text={`Volver a ${categoryData?.title || 'la categoría'}`} />
          <ShareButtons
            url={shareUrl}
            title={processedPostData.title}
            description={createSEODescription(postData, categoryData?.title)}
          />
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-0 leading-tight flex-1 md:pr-8">
              {processedPostData.title}
            </h1>
            {processedPostData.rating && typeof processedPostData.rating === 'number' && (
              <div className="flex items-center space-x-1 flex-shrink-0">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= processedPostData.rating!
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-lg font-semibold text-gray-800 ml-2">{processedPostData.rating}</span>
                <span className="text-gray-600">/5</span>
              </div>
            )}
          </div>
          {processedPostData.author && (
            <div className="mb-6">
              <p className="text-lg text-gray-600">
                Por: <span className="font-semibold text-gray-800">{processedPostData.author.name}</span>
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow-sm">
              <Clock size={20} className="text-emerald-600" />
              <div>
                <span className="block font-medium text-gray-700 text-sm">Duración</span>
                <span className="text-gray-600">{processedPostData.preparationTime}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow-sm">
              <ChefHat size={20} className="text-emerald-600" />
              <div>
                <span className="block font-medium text-gray-700 text-sm">Dificultad</span>
                <span className="text-gray-600 capitalize">{processedPostData.level}</span>
              </div>
            </div>
            {processedPostData.servings && (
              <div className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow-sm">
                <Users size={20} className="text-emerald-600" />
                <div>
                  <span className="block font-medium text-gray-700 text-sm">Porciones</span>
                  <span className="text-gray-600">{processedPostData.servings}</span>
                </div>
              </div>
            )}
            {processedPostData.calories && (
              <div className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <div>
                  <span className="block font-medium text-gray-700 text-sm">Calorías</span>
                  <span className="text-gray-600">{processedPostData.calories} kcal</span>
                </div>
              </div>
            )}
          </div>
          <Suspense fallback={<div>Cargando contenido de la receta...</div>}>
            <PostContent postData={processedPostData} />
          </Suspense>
          {processedPostData.chefNotes && (
            <div className="mb-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">💡 Notas del Chef</h3>
              <p className="text-yellow-700">{processedPostData.chefNotes}</p>
            </div>
          )}
          {processedPostData.macros && (
            <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Nutricional</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {processedPostData.macros.carbs && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{processedPostData.macros.carbs}g</div>
                    <div className="text-sm text-gray-600">Carbohidratos</div>
                  </div>
                )}
                {processedPostData.macros.protein && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{processedPostData.macros.protein}g</div>
                    <div className="text-sm text-gray-600">Proteínas</div>
                  </div>
                )}
                {processedPostData.macros.fat && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{processedPostData.macros.fat}g</div>
                    <div className="text-sm text-gray-600">Grasas</div>
                  </div>
                )}
                {processedPostData.macros.fiber && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{processedPostData.macros.fiber}g</div>
                    <div className="text-sm text-gray-600">Fibra</div>
                  </div>
                )}
              </div>
            </div>
          )}
          {processedPostData.tags && processedPostData.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Etiquetas</h3>
              <div className="flex flex-wrap gap-2">
                {processedPostData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <Comments
            postSlug={processedPostData.slug}
            postTitle={processedPostData.title}
          />
        </div>
      </main>
      <ScrollToTop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Recipe",
            "name": processedPostData.title,
            "description": createSEODescription(postData, categoryData?.title),
            "image": mainImageUrl,
            "author": {
              "@type": "Person",
              "name": processedPostData.author?.name || "Equipo Planeta Keto"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Planeta Keto",
              "url": baseUrl,
              "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo.png`
              }
            },
            "datePublished": postData.publishedAt || currentDate,
            "dateModified": postData._updatedAt || currentDate,
            "prepTime": `PT${parseInt(processedPostData.preparationTime) || 30}M`,
            "totalTime": `PT${parseInt(processedPostData.preparationTime) || 30}M`,
            "recipeYield": "2-4 porciones",
            "recipeCategory": categoryData?.title || "Receta Keto",
            "recipeCuisine": "Keto",
            "keywords": generateKeywords(postData, categoryData?.title),
            "recipeIngredient": postData.ingredients && typeof postData.ingredients === 'string' 
              ? postData.ingredients.split('\n').filter(line => line.trim() !== '') 
              : [],
            "recipeInstructions": portableTextToPlainText(postData.body).split('\n\n').filter(step => step.trim()).map((step, i) => ({
              "@type": "HowToStep",
              "text": step.trim(),
              "name": `Paso ${i + 1}`,
              "position": i + 1
            })),
            "nutrition": nutritionInfo ? {
              "@type": "NutritionInformation",
              ...nutritionInfo
            } : undefined,
            "aggregateRating": processedPostData.rating ? {
              "@type": "AggregateRating",
              "ratingValue": processedPostData.rating.toString(),
              "reviewCount": "127",
              "bestRating": "5",
              "worstRating": "1"
            } : undefined,
            "video": processedPostData.youtubeUrl ? {
              "@type": "VideoObject",
              "name": `Cómo hacer ${processedPostData.title}`,
              "description": `Video tutorial paso a paso para preparar ${processedPostData.title}`,
              "thumbnailUrl": mainImageUrl,
              "contentUrl": processedPostData.youtubeUrl,
              "embedUrl": processedPostData.youtubeUrl.replace('watch?v=', 'embed/'),
              "uploadDate": postData.publishedAt || currentDate
            } : undefined,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${baseUrl}/categorias/${slug}/${post}`
            }
          })
        }}
      />
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
                "item": baseUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Categorías",
                "item": `${baseUrl}/categorias`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": categoryData?.title || "Recetas",
                "item": `${baseUrl}/categorias/${slug}`
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": processedPostData.title,
                "item": `${baseUrl}/categorias/${slug}/${post}`
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": processedPostData.title,
            "description": createSEODescription(postData, categoryData?.title),
            "image": mainImageUrl,
            "author": {
              "@type": "Person",
              "name": processedPostData.author?.name || "Equipo Planeta Keto"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Planeta Keto",
              "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo.png`
              }
            },
            "datePublished": postData.publishedAt || currentDate,
            "dateModified": postData._updatedAt || currentDate,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${baseUrl}/categorias/${slug}/${post}`
            },
            "articleSection": categoryData?.title || "Recetas Keto",
            "keywords": generateKeywords(postData, categoryData?.title)
          })
        }}
      />
    </div>
  );
}

export async function generateStaticParams() {
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

// ✅ CORRECCIÓN: Ahora params es Promise<{}>
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string; post: string }>
}): Promise<Metadata> {
  // ✅ CORRECCIÓN: Await para resolver params
  const { slug, post } = await params;

  const [postData, categoryData] = await Promise.all([
    client.fetch(queries.postBySlug, { slug: post }),
    client.fetch(`*[_type == "category" && slug.current == $slug][0] { title, slug }`, { slug })
  ]);

  if (!postData) {
    return {
      title: 'Receta no encontrada | Planeta Keto',
      description: 'La receta que buscas no está disponible. Descubre más recetas keto deliciosas.',
      robots: 'noindex, nofollow',
    };
  }

  const baseUrl = process.env.SITE_URL || 'https://www.planetaketo.es';
  const canonicalUrl = `${baseUrl}/categorias/${slug}/${post}`;
  const mainImageUrl = postData.mainImage
    ? urlFor(postData.mainImage).url()
    : `${baseUrl}/default-recipe-image.jpg`;

  const dynamicTitle = (() => {
    const category = categoryData?.title || 'Keto';
    const level = postData.level;
    const time = postData.preparationTime;
    if (level && time) {
      return `${postData.title} - Receta ${category} ${level} (${time}) | Planeta Keto`;
    } else if (level) {
      return `${postData.title} - Receta ${category} ${level} | Planeta Keto`;
    } else if (time) {
      return `${postData.title} - Receta ${category} en ${time} | Planeta Keto`;
    }
    return `${postData.title} | Receta ${category} Fácil | Planeta Keto`;
  })();

  const optimizedDescription = createSEODescription(postData, categoryData?.title);
  const keywords = generateKeywords(postData, categoryData?.title);

  return {
    title: dynamicTitle,
    description: optimizedDescription,
    keywords,
    authors: [{
      name: postData.author?.name || 'Equipo Planeta Keto',
      url: `${baseUrl}/autor/${postData.author?.slug?.current || 'equipo'}`
    }],
    creator: postData.author?.name || 'Equipo Planeta Keto',
    publisher: 'Planeta Keto',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: postData.title,
      description: optimizedDescription,
      images: [
        {
          url: mainImageUrl,
          width: 1200,
          height: 630,
          alt: `Imagen de la receta ${postData.title}`,
          type: 'image/jpeg',
        }
      ],
      type: 'article',
      authors: postData.author?.name ? [postData.author.name] : ['Equipo Planeta Keto'],
      url: canonicalUrl,
      siteName: 'Planeta Keto',
      locale: 'es_ES',
      publishedTime: postData._createdAt,
      modifiedTime: postData._updatedAt,
      section: categoryData?.title || 'Recetas Keto',
      tags: keywords.split(', '),
    },
    twitter: {
      card: 'summary_large_image',
      title: postData.title,
      description: optimizedDescription,
      images: [mainImageUrl],
      creator: '@planetaketo',
      site: '@planetaketo',
    },
    other: {
      'article:author': postData.author?.name || 'Equipo Planeta Keto',
      'article:published_time': postData._createdAt,
      'article:modified_time': postData._updatedAt,
      'article:section': categoryData?.title || 'Recetas Keto',
      'article:tag': keywords,
    },
  };
}

export const revalidate = 60;