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

// Consultas GROQ optimizadas y corregidas
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
  }`,

  // ✅ CORREGIDO: Query para comentarios por post (usado en la API)
  commentsByPost: `*[_type == "comment" && post->slug.current == $postSlug && approved == true && isDeleted != true && !(_id in path("drafts.**"))] | order(_createdAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    content,
    author {
      name,
      email
    },
    authorId,
    rating,
    approved,
    isEdited,
    isDeleted,
    parentComment,
    adminReply,
    adminReplyPublished,
    adminReplyDate
  }`,

  // Query para obtener estadísticas de comentarios de un post
  postCommentsStats: `{
    "totalComments": count(*[_type == "comment" && post->slug.current == $postSlug && approved == true && isDeleted != true]),
    "averageRating": math::avg(*[_type == "comment" && post->slug.current == $postSlug && approved == true && isDeleted != true && defined(rating)].rating),
    "ratingDistribution": {
      "5": count(*[_type == "comment" && post->slug.current == $postSlug && approved == true && isDeleted != true && rating == 5]),
      "4": count(*[_type == "comment" && post->slug.current == $postSlug && approved == true && isDeleted != true && rating == 4]),
      "3": count(*[_type == "comment" && post->slug.current == $postSlug && approved == true && isDeleted != true && rating == 3]),
      "2": count(*[_type == "comment" && post->slug.current == $postSlug && approved == true && isDeleted != true && rating == 2]),
      "1": count(*[_type == "comment" && post->slug.current == $postSlug && approved == true && isDeleted != true && rating == 1])
    }
  }`,

  // Query para comentarios recientes del sitio (para admin)
  recentComments: `*[_type == "comment"] | order(_createdAt desc)[0..20] {
    _id,
    _createdAt,
    content[0..100],
    author {
      name
    },
    approved,
    isDeleted,
    post->{
      title,
      slug
    }
  }`,

  // Query para comentarios pendientes de moderación
  pendingComments: `*[_type == "comment" && approved != true && isDeleted != true] | order(_createdAt desc) {
    _id,
    _createdAt,
    content,
    author {
      name,
      email
    },
    post->{
      title,
      slug
    }
  }`,

  // Query para buscar comentarios por contenido
  searchComments: `*[_type == "comment" && content match $searchTerm + "*" && approved == true && isDeleted != true] | order(_createdAt desc) {
    _id,
    _createdAt,
    content,
    author {
      name
    },
    post->{
      title,
      slug
    }
  }`,

  // Query para obtener comentarios de un usuario específico (por authorId)
  commentsByAuthor: `*[_type == "comment" && authorId == $authorId && isDeleted != true] | order(_createdAt desc) {
    _id,
    _createdAt,
    content,
    author {
      name
    },
    rating,
    approved,
    isEdited,
    post->{
      title,
      slug
    }
  }`
}