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
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-purple-50">
      {/* Elegant Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-purple-500/10"></div>
        <div className="relative pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-6">
            <Link 
              href="/recetas" 
              className="inline-flex items-center text-rose-600 hover:text-rose-700 mb-8 font-medium transition-all duration-300 hover:translate-x-1"
            >
              ← Volver a mi cocina
            </Link>
            
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-light text-gray-800 mb-6 tracking-wide">
                {recipe.name}
              </h1>
              
              {recipe.description && (
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                  {recipe.description}
                </p>
              )}

              {/* Elegant Stats */}
              <div className="flex flex-wrap justify-center gap-8 mb-12">
                <div className="group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-8 py-4 shadow-sm border border-white/50 group-hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-center">
                      <Timer className="w-6 h-6 text-rose-500 mr-3" />
                      <span className="text-lg font-medium text-gray-700">{recipe.preparationTime} min</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">tiempo de preparación</p>
                  </div>
                </div>
                
                <div className="group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-8 py-4 shadow-sm border border-white/50 group-hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-500 mr-3" />
                      <span className="text-lg font-medium text-gray-700">{recipe.servings} porciones</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">para compartir</p>
                  </div>
                </div>
                
                {recipe.averageRating > 0 && (
                  <div className="group">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-8 py-4 shadow-sm border border-white/50 group-hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-center">
                        <Star className="w-6 h-6 text-amber-400 mr-3 fill-current" />
                        <span className="text-lg font-medium text-gray-700">{recipe.averageRating.toFixed(1)}</span>
                        <span className="text-gray-400 ml-2 text-sm">({recipe.totalRatings})</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">valoración</p>
                    </div>
                  </div>
                )}
                
                {recipe.category && (
                  <div className="group">
                    <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl px-8 py-4 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-center">
                        <span className="mr-3 text-xl">{recipe.category.icon}</span>
                        <span className="text-lg font-medium">{recipe.category.name}</span>
                      </div>
                      <p className="text-rose-100 text-sm mt-1">categoría</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 pb-20">

        {/* Video Section - Full Width */}
        <div className="mb-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-8 shadow-xl border border-white/50">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-light text-gray-800 mb-2">Tutorial paso a paso</h2>
              <p className="text-gray-600 font-light">Aprende a preparar esta deliciosa receta</p>
            </div>
            
            {/* YouTube Video - Clean Embed */}
            {youtubeId && (
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&showinfo=0&rel=0`}
                  title="Tutorial de cocina"
                  allowFullScreen
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            )}

            {recipe.youtubeUrl && !youtubeId && (
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-8 rounded-2xl shadow-xl text-center">
                <Heart className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-4">Video Tutorial Disponible</h3>
                <a 
                  href={recipe.youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-rose-600 px-8 py-3 rounded-xl font-medium hover:bg-rose-50 transition-colors inline-block shadow-lg"
                >
                  Ver Tutorial
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Recipe Content - Grid Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-8 shadow-xl border border-white/50 h-fit">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-400 rounded-2xl flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-light text-gray-800">Ingredientes</h2>
                <p className="text-gray-500 text-sm font-light">Todo lo que necesitas</p>
              </div>
            </div>
            <div className="prose prose-gray max-w-none">
              <div className="text-gray-700 whitespace-pre-line leading-loose font-light text-lg">
                {recipe.ingredients}
              </div>
            </div>
          </div>

          {/* Preparation */}
          <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-8 shadow-xl border border-white/50">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mr-4">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-light text-gray-800">Preparación</h2>
                <p className="text-gray-500 text-sm font-light">Paso a paso</p>
              </div>
            </div>
            <div className="prose prose-gray max-w-none">
              <div className="text-gray-700 whitespace-pre-line leading-loose font-light text-lg">
                {recipe.preparation}
              </div>
            </div>
          </div>
        </div>

        {/* Comments and Ratings */}
        <div className="mt-20">
          <Comments postSlug={recipe.slug.current} postTitle={recipe.name} />
        </div>

        {/* Back to Recipes CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 rounded-[2rem] p-12 text-white shadow-2xl">
            <div className="max-w-2xl mx-auto">
              <Heart className="w-16 h-16 mx-auto mb-6 text-white/90" />
              <h3 className="text-4xl font-light mb-6">¿Te encantó esta receta?</h3>
              <p className="text-white/90 text-xl mb-10 leading-relaxed font-light">
                Descubre más delicias keto en nuestra colección especialmente curada para ti.
              </p>
              <Link
                href="/recetas"
                className="bg-white/20 backdrop-blur-sm text-white font-medium py-4 px-10 rounded-2xl hover:bg-white/30 transition-all duration-300 inline-flex items-center border border-white/30 hover:shadow-xl"
              >
                <ChefHat className="w-6 h-6 mr-3" />
                Explorar más recetas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}