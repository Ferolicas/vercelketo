import { notFound } from 'next/navigation'
import { client, queries, urlFor } from '@/lib/sanity'
import type { Recipe } from '@/types/sanity'
import { Metadata } from 'next'
import { Clock, Users, Star, ChefHat, Heart, BookOpen, Timer, ArrowLeft, Share, Phone, MessageCircle, ChevronDown, Play } from 'lucide-react'
import Link from 'next/link'
import Comments from '@/components/Comments'
import Image from 'next/image'

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
    <div className="min-h-screen bg-white">
      {/* Hero Video with Navigation Buttons */}
      <div className="relative h-96 bg-gradient-to-br from-orange-100 to-red-100">
        {/* YouTube Video */}
        {youtubeId ? (
          <div className="w-full h-full">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&showinfo=0&rel=0&fs=1`}
              title={`Tutorial: ${recipe.name}`}
              allowFullScreen
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </div>
        ) : (
          /* Fallback image if no video */
          thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt={recipe.name}
              fill
              className="object-cover"
              priority
            />
          )
        )}
        
        {/* Navigation Buttons */}
        <div className="absolute top-12 left-4 right-4 flex justify-between items-center z-10">
          <Link href="/recetas">
            <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          </Link>
          
          <div className="flex gap-3">
            <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-gray-700" />
            </button>
            <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <Share className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        
        {/* Category and Rating */}
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm font-medium">
            {recipe.category?.name || 'Pasta'}
          </span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-medium text-gray-700">
              {recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : '4.9'}
            </span>
          </div>
        </div>

        {/* Recipe Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {recipe.name}
          </h1>
          <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
        </div>

        {/* Recipe by Chef */}
        <div className="space-y-3">
          <p className="text-gray-600 text-sm font-medium">Recipe by</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 overflow-hidden">
                <Image
                  src="/logo.webp"
                  alt="Chef"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Chef Planeta Keto</p>
                <p className="text-gray-500 text-sm">Chef</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Description</h3>
          <p className="text-gray-600 leading-relaxed">
            {recipe.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'} 
            <button className="text-orange-500 font-medium ml-1">Read more</button>
          </p>
        </div>

        {/* Cooking Time and Cuisine */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-gray-500 text-xs">Cooking Time</p>
              <p className="font-semibold text-gray-900">{recipe.preparationTime} min</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
              <ChefHat className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-gray-500 text-xs">Cuisine</p>
              <p className="font-semibold text-gray-900">Keto</p>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="w-4 h-4 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900">Ingredients</h3>
            </div>
            <button className="flex items-center text-gray-600 text-sm">
              1 Serving
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="space-y-3">
            {recipe.ingredients.split('\n').slice(0, 3).map((ingredient, index) => (
              <p key={index} className="text-gray-700 text-sm">
                {ingredient.trim() || `${index === 0 ? '1 cup Lorem Ipsum' : index === 1 ? '200g dolor sit amet' : '2 teaspoons Lorem'}`}
              </p>
            ))}
          </div>
        </div>


        {/* Recipe Preparation (hidden by default, mobile-style) */}
        <div className="hidden">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Preparation</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {recipe.preparation}
            </p>
          </div>
        </div>

        {/* Comments */}
        <div className="pt-8">
          <Comments postSlug={recipe.slug.current} postTitle={recipe.name} />
        </div>
      </div>
    </div>
  )
}