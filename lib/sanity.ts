import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Configuración del cliente Sanity
const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: process.env.NODE_ENV === 'production',
  // Use read token for regular client
  token: process.env.SANITY_READ_TOKEN || process.env.SANITY_API_TOKEN,
}

// Cliente de lectura
export const client = createClient(config)

// Cliente de escritura para operaciones admin
export const writeClient = createClient({
  ...config,
  useCdn: false,
  // Use write token specifically for admin operations
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
})

// Debug logging for token configuration
if (process.env.NODE_ENV === 'development') {
  console.log('🔐 Sanity Configuration:');
  console.log('- Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
  console.log('- Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
  console.log('- API Version:', process.env.NEXT_PUBLIC_SANITY_API_VERSION);
  console.log('- Read Token Available:', !!process.env.SANITY_READ_TOKEN);
  console.log('- Write Token Available:', !!process.env.SANITY_WRITE_TOKEN);
  console.log('- Fallback Token Available:', !!process.env.SANITY_API_TOKEN);
}

// Builder para URLs de imágenes
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  if (!source) {
    return builder.image({} as SanityImageSource)
  }
  return builder.image(source)
}

// Queries GROQ limpias y optimizadas
export const queries = {
  // CATEGORÍAS
  allCategories: `*[_type == "category"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    icon
  }`,

  categoryById: `*[_type == "category" && _id == $id][0] {
    _id,
    name,
    slug,
    description,
    icon
  }`,

  // RECETAS
  allRecipes: `*[_type == "recipe"] | order(createdAt desc) {
    _id,
    name,
    slug,
    description,
    preparationTime,
    servings,
    thumbnail,
    category->{
      _id,
      name,
      slug,
      icon
    },
    averageRating,
    totalRatings,
    createdAt
  }`,

  recipesByCategory: `*[_type == "recipe" && category._ref == $categoryId] | order(createdAt desc) {
    _id,
    name,
    slug,
    description,
    preparationTime,
    servings,
    thumbnail,
    category->{
      _id,
      name,
      slug,
      icon
    },
    averageRating,
    totalRatings,
    createdAt
  }`,

  recipeBySlug: `*[_type == "recipe" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    ingredients,
    preparation,
    youtubeUrl,
    preparationTime,
    servings,
    thumbnail,
    category->{
      _id,
      name,
      slug,
      icon
    },
    averageRating,
    totalRatings,
    createdAt
  }`,

  // COMENTARIOS
  commentsByRecipe: `*[_type == "comment" && recipe._ref == $recipeId && approved == true] | order(createdAt desc) {
    _id,
    authorName,
    content,
    rating,
    createdAt
  }`,

  // PRODUCTOS
  allProducts: `*[_type == "product"] | order(featured desc, createdAt desc) {
    _id,
    name,
    slug,
    description,
    price,
    currency,
    image,
    affiliateUrl,
    featured,
    createdAt
  }`,

  productBySlug: `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    price,
    currency,
    image,
    affiliateUrl,
    featured,
    createdAt
  }`,

  // SERVICIOS
  allServices: `*[_type == "service"] | order(featured desc, createdAt desc) {
    _id,
    name,
    slug,
    description,
    price,
    currency,
    duration,
    image,
    features,
    contactUrl,
    whatsapp,
    featured,
    createdAt
  }`,

  serviceBySlug: `*[_type == "service" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    price,
    currency,
    duration,
    image,
    features,
    contactUrl,
    whatsapp,
    featured,
    createdAt
  }`,

  // BLOG
  allBlogPosts: `*[_type == "blogPost" && published == true] | order(createdAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    author,
    tags,
    createdAt
  }`,

  blogPostBySlug: `*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    author,
    tags,
    published,
    createdAt
  }`,

  // FORO
  allForumPosts: `*[_type == "forumPost" && approved == true] | order(pinned desc, createdAt desc) {
    _id,
    title,
    slug,
    content[0..100],
    authorName,
    category,
    pinned,
    locked,
    views,
    "replyCount": length(replies[approved == true]),
    createdAt
  }`,

  forumPostBySlug: `*[_type == "forumPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    content,
    authorName,
    authorEmail,
    category,
    pinned,
    locked,
    approved,
    views,
    replies[approved == true] | order(createdAt asc),
    createdAt
  }`,

  forumPostsByCategory: `*[_type == "forumPost" && category == $category && approved == true] | order(pinned desc, createdAt desc) {
    _id,
    title,
    slug,
    content[0..100],
    authorName,
    category,
    pinned,
    locked,
    views,
    "replyCount": length(replies[approved == true]),
    createdAt
  }`,
}

// Utilidades para admin
export const adminQueries = {
  // Obtener comentarios pendientes de aprobación
  pendingComments: `*[_type == "comment" && approved != true] | order(createdAt desc) {
    _id,
    authorName,
    authorEmail,
    content,
    rating,
    recipe->{
      _id,
      name,
      slug
    },
    createdAt
  }`,

  // Obtener posts del foro pendientes
  pendingForumPosts: `*[_type == "forumPost" && approved != true] | order(createdAt desc) {
    _id,
    title,
    slug,
    content,
    authorName,
    authorEmail,
    category,
    createdAt
  }`,
}