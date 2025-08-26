// lib/sanity.ts

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

// Función urlFor con tipo correcto para TypeScript
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
    _updatedAt,
    title,
    slug,
    "mainImage": coalesce(mainImage, image),
    image,
    publishedAt,
    excerpt,
    author,
    category->{
      _id,
      title,
      slug
    },
    preparationTime,
    cookingTime,
    level,
    difficulty,
    rating,
    servings,
    calories,
    ingredients,
    macros,
    tags,
    chefNotes,
    youtubeUrl
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
    // Asegúrate de que los campos necesarios para RecipeCard estén aquí
    // y los campos adicionales para la vista de receta individual si se van a precargar.
  }`,

  // Query para obtener todas las categorías
  // ¡CORREGIDO: Ordenar por 'order asc' para categorías!
  allCategories: `*[_type == "category"] | order(order asc) { //
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

  // Query para comentarios por post (usado en la API)
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
  }`,

  // PRODUCTS QUERIES
  allProducts: `*[_type == "product"] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    shortDescription,
    price,
    discountPrice,
    currency,
    images,
    category->{
      title,
      slug
    },
    rating,
    isDigital,
    stock
  }`,

  productBySlug: `*[_type == "product" && slug.current == $slug][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    description,
    shortDescription,
    price,
    discountPrice,
    currency,
    images,
    category->{
      title,
      slug
    },
    tags,
    features,
    specifications,
    affiliateUrl,
    amazonUrl,
    isDigital,
    downloadUrl,
    stock,
    rating,
    reviews,
    seo
  }`,

  productsByCategory: `*[_type == "product" && category->slug.current == $categorySlug] | order(_createdAt desc) {
    _id,
    title,
    slug,
    shortDescription,
    price,
    discountPrice,
    currency,
    images,
    rating,
    isDigital
  }`,

  // SERVICES QUERIES
  allServices: `*[_type == "service"] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    shortDescription,
    price,
    currency,
    duration,
    image,
    category->{
      title,
      slug
    },
    features[0..3]
  }`,

  serviceBySlug: `*[_type == "service" && slug.current == $slug][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    description,
    shortDescription,
    price,
    currency,
    duration,
    image,
    features,
    includes,
    category->{
      title,
      slug
    },
    testimonials,
    contactEmail,
    whatsappNumber,
    bookingUrl,
    seo
  }`,

  // BLOG QUERIES
  allBlogPosts: `*[_type == "blogPost"] | order(publishedAt desc) {
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
      slug
    },
    tags,
    publishedAt,
    readTime,
    isFeatured
  }`,

  blogPostBySlug: `*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    excerpt,
    body,
    mainImage,
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
    tags,
    publishedAt,
    readTime,
    isFeatured,
    seo
  }`,

  featuredBlogPosts: `*[_type == "blogPost" && isFeatured == true] | order(publishedAt desc)[0..5] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    readTime,
    category->{
      title,
      slug
    }
  }`,

  // FORUM QUERIES
  allForumPosts: `*[_type == "forumPost"] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    content[0..150],
    author,
    category->{
      title,
      slug,
      color
    },
    tags,
    isPinned,
    isLocked,
    views,
    likes,
    "replyCount": count(replies)
  }`,

  forumPostBySlug: `*[_type == "forumPost" && slug.current == $slug][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    content,
    author,
    category->{
      title,
      slug,
      description,
      color
    },
    tags,
    isPinned,
    isLocked,
    views,
    likes,
    replies
  }`,

  // CATEGORY QUERIES FOR NEW CONTENT TYPES
  allProductCategories: `*[_type == "productCategory"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    image,
    "productCount": count(*[_type == "product" && references(^._id)])
  }`,

  allServiceCategories: `*[_type == "serviceCategory"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    image,
    "serviceCount": count(*[_type == "service" && references(^._id)])
  }`,

  allBlogCategories: `*[_type == "blogCategory"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    color,
    "postCount": count(*[_type == "blogPost" && references(^._id)])
  }`,

  allForumCategories: `*[_type == "forumCategory"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    color,
    icon,
    "postCount": count(*[_type == "forumPost" && references(^._id)])
  }`
}