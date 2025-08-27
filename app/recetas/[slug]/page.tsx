import { notFound } from 'next/navigation'
import { client, queries, urlFor } from '@/lib/sanity'
import type { Recipe } from '@/types/sanity'
import { Metadata } from 'next'
import RecipePageClient from '@/components/RecipePage'

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

  return <RecipePageClient recipe={recipe} thumbnailUrl={thumbnailUrl} youtubeId={youtubeId} />
}