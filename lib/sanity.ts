import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Cliente de Sanity
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: true, // Para mejor performance en producción
})

// Builder para URLs de imágenes
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Consultas GROQ optimizadas
export const queries = {
  // Obtener configuración de la página principal
  homePage: `*[_type == "homePage"][0]{
    siteTitle,
    youtubeUrl,
    email,
    phone,
    heroTitle,
    heroDescription,
    heroImage,
    picksTitle,
    youtubeDisplayText,
    picksSubtitle,
    amazonUrl,
    hotmartUrl
  }`,

  // Obtener todas las categorías ordenadas
  categories: `*[_type == "category"] | order(order asc){
    _id,
    title,
    slug,
    categoryImage,
    description,
    order
  }`,

  // Obtener posts por categoría
  postsByCategory: `*[_type == "post" && category._ref == $categoryId] | order(publishedAt desc){
    _id,
    title,
    slug,
    mainImage,
    preparationTime,
    level,
    author->{name},
    publishedAt
  }`,

  // Obtener post individual
  postBySlug: `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    author->{name},
    mainImage,
    youtubeUrl,
    level,
    preparationTime,
    ingredients,
    body,
    publishedAt
  }`,

  // Obtener categoría por slug
  categoryBySlug: `*[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    categoryImage,
    description
  }`
}