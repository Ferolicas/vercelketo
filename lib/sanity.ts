import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Configuración del cliente Sanity
const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN, // ¡Importante para escribir!
}

export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false, // Para escritura debe ser false
  apiVersion: '2025-06-24'
})

// Cliente de Sanity
export const client = createClient(config)

// Builder para URLs de imágenes
const builder = imageUrlBuilder(client)

// ✅ CORREGIDO: Función urlFor con tipo correcto para TypeScript
export function urlFor(source: SanityImageSource) {
  if (!source) {
    console.error('❌ urlFor: source es null o undefined')
    return builder.image({} as SanityImageSource) // Fallback seguro
  }
  
  try {
    return builder.image(source)
  } catch (error) {
    console.error('❌ Error en urlFor:', error, 'Source:', source)
    return builder.image({} as SanityImageSource) // Fallback seguro
  }
}

// Consultas GROQ optimizadas
export const queries = {
  // Query principal para obtener un post por slug
  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    mainImage,
    publishedAt,
    author->{
      name,
      slug,
      image,
      bio
    },
    category->{
      title,
      slug,
      description
    },
    ingredients,
    body,
    excerpt,
    youtubeUrl,
    level,
    preparationTime,
    rating,
    servings,
    calories,
    macros,
    tags,
    chefNotes
  }`,

  // Query para la página de inicio
  homePage: `*[_type == "homePage"][0] {
    _id,
    siteTitle,
    heroTitle,
    heroDescription,
    heroImage {
      asset->{
        _id,
        url
      },
      alt
    },
  }`,

   

  // Query para obtener todos los posts con información básica
  allPosts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    mainImage,
    publishedAt,
    excerpt,
    author->{
      name,
      slug
    },
    category->{
      title,
      slug
    },
    preparationTime,
    level,
    rating,
    ingredients[0..2]
  }`,

  // Query para posts de una categoría específica
  postsByCategory: `*[_type == "post" && category->slug.current == $categorySlug] | order(publishedAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    mainImage,
    publishedAt,
    excerpt,
    author->{
      name,
      slug
    },
    category->{
      title,
      slug
    },
    preparationTime,
    level,
    rating,
    ingredients[0..2]
  }`,

  // Query para obtener todas las categorías
  allCategories: `*[_type == "category"] | order(title asc) {
  _id,
  title,
  slug,
  description,
  categoryImage {
    asset->{
      _id,
      url
    },
    alt
  },
  "postCount": count(*[_type == "post" && references(^._id)])
}`,

  // Query para obtener una categoría específica
  categoryBySlug: `*[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    image,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage,
      excerpt,
      preparationTime,
      level,
      rating,
      ingredients[0..2]
    }
  }`,

  // Query para posts relacionados (misma categoría)
  relatedPosts: `*[_type == "post" && category->slug.current == $categorySlug && slug.current != $currentSlug] | order(publishedAt desc)[0..3] {
    _id,
    title,
    slug,
    mainImage,
    excerpt,
    preparationTime,
    level,
    rating
  }`,

  // Query para búsqueda de posts
  searchPosts: `*[_type == "post" && (
    title match $searchTerm + "*" ||
    ingredients[] match $searchTerm + "*" ||
    tags[] match $searchTerm + "*"
  )] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    excerpt,
    category->{
      title,
      slug
    },
    preparationTime,
    level,
    rating
  }`,

  // Query para posts destacados
  featuredPosts: `*[_type == "post" && rating >= 4] | order(rating desc, publishedAt desc)[0..5] {
    _id,
    title,
    slug,
    mainImage,
    excerpt,
    category->{
      title,
      slug
    },
    preparationTime,
    level,
    rating
  }`,

  // Query para obtener estadísticas del sitio
  siteStats: `{
    "totalPosts": count(*[_type == "post"]),
    "totalCategories": count(*[_type == "category"]),
    "totalAuthors": count(*[_type == "author"]),
    "averageRating": math::avg(*[_type == "post" && defined(rating)].rating)
  }` ,

  commentsByPost: `*[_type == "comment" && post->slug.current == $postSlug && approved == true] | order(_createdAt desc) {
    _id,
    _createdAt,
    name,
    email,
    comment,
    rating,
    approved
  }` 
}