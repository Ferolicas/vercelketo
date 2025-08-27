import { notFound } from 'next/navigation'
import { client, queries, urlFor } from '@/lib/sanity'
import type { Recipe } from '@/types/sanity'
import { Metadata } from 'next'
import { Clock, Users, Star, ChefHat, Heart, BookOpen, Timer, ChefHatIcon } from 'lucide-react'
import Link from 'next/link'
import Comments from '@/components/Comments'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const recipe = await client.fetch<Recipe>(
      queries.recipeBySlug,
      { slug }
    )

    if (!recipe) {
      return {
        title: 'Receta no encontrada | Planeta Keto',
        description: 'La receta que buscas no existe.'
      }
    }

    return {
      title: `${recipe.name} | Receta Keto | Planeta Keto`,
      description: recipe.description || `Receta keto: ${recipe.name}`,
      keywords: `${recipe.name}, receta keto, cetogénica, ${recipe.category?.name}`,
      openGraph: {
        title: `${recipe.name} - Receta Keto`,
        description: recipe.description || `Deliciosa receta keto: ${recipe.name}`,
        type: 'article',
        images: recipe.thumbnail ? [
          {
            url: urlFor(recipe.thumbnail).width(1200).height(630).url(),
            width: 1200,
            height: 630,
            alt: recipe.name,
          }
        ] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Error | Planeta Keto',
      description: 'Error al cargar la receta'
    }
  }
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params
  
  let recipe: Recipe | null = null
  
  try {
    recipe = await client.fetch<Recipe>(
      queries.recipeBySlug,
      { slug }
    )
  } catch (error) {
    console.error('Error fetching recipe:', error)
  }

  if (!recipe) {
    notFound()
  }

  const thumbnailUrl = recipe.thumbnail 
    ? urlFor(recipe.thumbnail).width(800).height(600).url()
    : null

  // Extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const youtubeId = recipe.youtubeUrl ? getYouTubeVideoId(recipe.youtubeUrl) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      {/* Ultra-Modern Header with Green Theme */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-emerald-600">
        {/* Decorative background patterns */}
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-black/5"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl"></div>
        </div>
        
        <div className="relative pt-20 pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Link 
              href="/recetas" 
              className="inline-flex items-center text-white/90 hover:text-white mb-8 font-medium transition-all duration-300 hover:translate-x-1 group"
            >
              <span className="mr-2 transition-transform duration-300 group-hover:-translate-x-1">←</span>
              Volver a recetas
            </Link>
            
            <div className="text-center">
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-8 tracking-tight leading-tight">
                {recipe.name}
              </h1>
              
              {recipe.description && (
                <p className="text-xl sm:text-2xl text-green-50/90 max-w-4xl mx-auto mb-16 leading-relaxed font-light">
                  {recipe.description}
                </p>
              )}

              {/* Ultra-Modern Stats Grid */}
              <div className="flex flex-wrap justify-center gap-6 mb-16">
                <div className="bg-white/20 backdrop-blur-lg rounded-3xl px-8 py-6 text-white text-center border border-white/20 shadow-2xl hover:bg-white/25 transition-all duration-300">
                  <Timer className="w-8 h-8 text-yellow-300 mx-auto mb-3" />
                  <div className="text-3xl font-black mb-1">{recipe.preparationTime}</div>
                  <p className="text-sm opacity-80 font-medium">minutos</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-lg rounded-3xl px-8 py-6 text-white text-center border border-white/20 shadow-2xl hover:bg-white/25 transition-all duration-300">
                  <Users className="w-8 h-8 text-blue-300 mx-auto mb-3" />
                  <div className="text-3xl font-black mb-1">{recipe.servings}</div>
                  <p className="text-sm opacity-80 font-medium">porciones</p>
                </div>
                
                {recipe.averageRating > 0 && (
                  <div className="bg-white/20 backdrop-blur-lg rounded-3xl px-8 py-6 text-white text-center border border-white/20 shadow-2xl hover:bg-white/25 transition-all duration-300">
                    <Star className="w-8 h-8 text-yellow-300 mx-auto mb-3 fill-current" />
                    <div className="text-3xl font-black mb-1">{recipe.averageRating.toFixed(1)}</div>
                    <p className="text-sm opacity-80 font-medium">valoración</p>
                  </div>
                )}
                
                {recipe.category && (
                  <div className="bg-white/25 backdrop-blur-lg rounded-3xl px-8 py-6 text-white text-center border border-white/30 shadow-2xl hover:bg-white/30 transition-all duration-300">
                    <div className="text-3xl mb-3">{recipe.category.icon}</div>
                    <div className="text-lg font-bold mb-1">{recipe.category.name}</div>
                    <p className="text-sm opacity-80 font-medium">categoría</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Ultra-Modern Layout */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">

        {/* Hero Video Section - Ultra Modern Design */}
        <div className="mb-20">
          <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-12 shadow-[0_32px_64px_rgba(0,0,0,0.12)] border border-white/60 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-emerald-50/30 rounded-[3rem]"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl mb-6 shadow-xl">
                  <span className="text-3xl">▶️</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                  Tutorial Exclusivo
                </h2>
                <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
                  Aprende paso a paso con nuestro video tutorial profesional
                </p>
              </div>
              
              {/* YouTube Video - Ultra Modern Embed */}
              {youtubeId && (
                <div className="relative">
                  <div className="aspect-video rounded-3xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.2)] bg-black relative group cursor-pointer">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&showinfo=0&rel=0&fs=1`}
                      title={`Tutorial: ${recipe.name}`}
                      allowFullScreen
                      className="w-full h-full rounded-3xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    />
                    {/* Decorative corner elements */}
                    <div className="absolute top-6 left-6 w-4 h-4 border-l-4 border-t-4 border-white/30 rounded-tl-lg"></div>
                    <div className="absolute top-6 right-6 w-4 h-4 border-r-4 border-t-4 border-white/30 rounded-tr-lg"></div>
                    <div className="absolute bottom-6 left-6 w-4 h-4 border-l-4 border-b-4 border-white/30 rounded-bl-lg"></div>
                    <div className="absolute bottom-6 right-6 w-4 h-4 border-r-4 border-b-4 border-white/30 rounded-br-lg"></div>
                  </div>
                </div>
              )}

              {/* Fallback for invalid YouTube URLs */}
              {recipe.youtubeUrl && !youtubeId && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">🎥</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-6">Video Tutorial Disponible</h3>
                    <p className="text-green-100 text-lg mb-8 max-w-md mx-auto">
                      Mira el tutorial completo en YouTube
                    </p>
                    <a 
                      href={recipe.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white text-green-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-green-50 transition-all duration-300 inline-flex items-center shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      <span className="mr-3">▶️</span>
                      Ver Tutorial
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recipe Content - Ultra-Modern Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Ingredients - Green Theme */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-[0_24px_48px_rgba(0,0,0,0.1)] border border-white/60 relative overflow-hidden h-fit">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-transparent to-emerald-50/40 rounded-[2.5rem]"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mr-6 shadow-xl">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Ingredientes</h2>
                  <p className="text-gray-600 text-lg font-light">Todo lo que necesitas</p>
                </div>
              </div>
              <div className="prose prose-gray max-w-none">
                <div className="text-gray-700 whitespace-pre-line leading-loose font-light text-lg">
                  {recipe.ingredients}
                </div>
              </div>
            </div>
          </div>

          {/* Preparation - Green Theme */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-[0_24px_48px_rgba(0,0,0,0.1)] border border-white/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-transparent to-green-50/40 rounded-[2.5rem]"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-3xl flex items-center justify-center mr-6 shadow-xl">
                  <ChefHat className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Preparación</h2>
                  <p className="text-gray-600 text-lg font-light">Paso a paso</p>
                </div>
              </div>
              <div className="prose prose-gray max-w-none">
                <div className="text-gray-700 whitespace-pre-line leading-loose font-light text-lg">
                  {recipe.preparation}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments and Ratings */}
        <div className="mb-20">
          <Comments postSlug={recipe.slug.current} postTitle={recipe.name} />
        </div>

        {/* Back to Recipes CTA - Green Theme */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 rounded-[3rem] p-16 text-white shadow-[0_32px_64px_rgba(0,0,0,0.15)] relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/5 blur-3xl"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-emerald-300/10 blur-3xl"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/30">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">
                ¿Te encantó esta receta?
              </h3>
              <p className="text-green-50 text-xl md:text-2xl mb-12 leading-relaxed font-light max-w-2xl mx-auto">
                Descubre más delicias keto en nuestra colección especialmente curada para transformar tu estilo de vida.
              </p>
              <Link
                href="/recetas"
                className="bg-white/20 backdrop-blur-lg text-white font-bold py-6 px-12 rounded-3xl hover:bg-white/30 transition-all duration-300 inline-flex items-center border border-white/30 hover:shadow-2xl transform hover:scale-105 text-xl"
              >
                <ChefHat className="w-8 h-8 mr-4" />
                Explorar más recetas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}