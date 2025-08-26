import { notFound } from 'next/navigation'
import { client, queries, urlFor } from '@/lib/sanity'
import type { Recipe } from '@/types/sanity'
import { Metadata } from 'next'
import Image from 'next/image'
import { Clock, Users, Star, ChefHat, Play } from 'lucide-react'
import Link from 'next/link'

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
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Link 
              href="/recetas" 
              className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 transition-colors"
            >
              ← Volver a Recetas
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {recipe.name}
            </h1>
            
            {recipe.description && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                {recipe.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center bg-white rounded-2xl px-6 py-3 shadow-lg">
                <Clock className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-semibold">{recipe.preparationTime} min</span>
              </div>
              <div className="flex items-center bg-white rounded-2xl px-6 py-3 shadow-lg">
                <Users className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-semibold">{recipe.servings} porciones</span>
              </div>
              {recipe.averageRating > 0 && (
                <div className="flex items-center bg-white rounded-2xl px-6 py-3 shadow-lg">
                  <Star className="w-5 h-5 text-yellow-500 mr-2 fill-current" />
                  <span className="font-semibold">{recipe.averageRating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-1">({recipe.totalRatings})</span>
                </div>
              )}
              {recipe.category && (
                <div className="flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl px-6 py-3 shadow-lg">
                  <span className="mr-2">{recipe.category.icon}</span>
                  <span className="font-semibold">{recipe.category.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image and Video */}
            <div className="space-y-6">
              {/* Thumbnail */}
              {thumbnailUrl && (
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl">
                  <Image
                    src={thumbnailUrl}
                    alt={recipe.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}

              {/* YouTube Video */}
              {youtubeId && (
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={`Video de ${recipe.name}`}
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}

              {recipe.youtubeUrl && !youtubeId && (
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-3xl shadow-xl">
                  <div className="flex items-center mb-3">
                    <Play className="w-6 h-6 mr-3" />
                    <h3 className="text-xl font-bold">Video Tutorial</h3>
                  </div>
                  <a 
                    href={recipe.youtubeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors inline-block"
                  >
                    Ver en YouTube
                  </a>
                </div>
              )}
            </div>

            {/* Recipe Content */}
            <div className="space-y-8">
              {/* Ingredients */}
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <div className="flex items-center mb-6">
                  <ChefHat className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Ingredientes</h2>
                </div>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {recipe.ingredients}
                </div>
              </div>

              {/* Preparation */}
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="w-6 h-6 text-green-600 mr-3 font-bold text-xl">📝</div>
                  <h2 className="text-2xl font-bold text-gray-900">Preparación</h2>
                </div>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {recipe.preparation}
                </div>
              </div>
            </div>
          </div>

          {/* Back to Recipes CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-4">¿Te gustó esta receta?</h3>
              <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
                Descubre más recetas keto deliciosas en nuestra colección completa.
              </p>
              <Link
                href="/recetas"
                className="bg-white text-green-600 font-bold py-4 px-8 rounded-2xl hover:bg-green-50 transition-colors inline-flex items-center"
              >
                <ChefHat className="w-5 h-5 mr-2" />
                Ver Más Recetas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}