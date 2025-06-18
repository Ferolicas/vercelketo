import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Configuración del cliente Sanity
const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN, // Para operaciones autenticadas
}

// Cliente de Sanity
export const client = createClient(config)

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
    heroImage{
      asset->{
        _id,
        url,
        metadata{
          dimensions,
          lqip
        }
      },
      alt
    },
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
    categoryImage{
      asset->{
        _id,
        url,
        metadata{
          dimensions,
          lqip
        }
      },
      alt
    },
    description,
    order,
    "postCount": count(*[_type == "post" && category._ref == ^._id])
  }`,

  // Obtener posts por categoría con paginación
  postsByCategory: `*[_type == "post" && category._ref == $categoryId] | order(publishedAt desc) [$start...$end]{
    _id,
    title,
    slug,
    mainImage{
      asset->{
        _id,
        url,
        metadata{
          dimensions,
          lqip
        }
      },
      alt
    },
    preparationTime,
    level,
    author->{
      _id,
      name,
      slug
    },
    publishedAt,
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
  }`,

  // Obtener posts recientes para la página principal
  recentPosts: `*[_type == "post"] | order(publishedAt desc) [0...6]{
    _id,
    title,
    slug,
    mainImage{
      asset->{
        _id,
        url,
        metadata{
          dimensions,
          lqip
        }
      },
      alt
    },
    preparationTime,
    level,
    author->{
      _id,
      name
    },
    publishedAt,
    category->{
      _id,
      title,
      slug
    }
  }`,

  // Obtener post individual completo
  postBySlug: `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    author->{
      _id,
      name,
      slug,
      bio,
      image{
        asset->{
          _id,
          url
        }
      }
    },
    mainImage{
      asset->{
        _id,
        url,
        metadata{
          dimensions,
          lqip
        }
      },
      alt
    },
    youtubeUrl,
    level,
    preparationTime,
    ingredients,
    body,
    publishedAt,
    category->{
      _id,
      title,
      slug
    },
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
    "relatedPosts": *[_type == "post" && category._ref == ^.category._ref && _id != ^._id] | order(publishedAt desc) [0...3]{
      _id,
      title,
      slug,
      mainImage{
        asset->{
          _id,
          url,
          metadata{
            dimensions,
            lqip
          }
        }
      },
      preparationTime,
      level
    }
  }`,

  // Obtener categoría por slug
  categoryBySlug: `*[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    categoryImage{
      asset->{
        _id,
        url,
        metadata{
          dimensions,
          lqip
        }
      },
      alt
    },
    description,
    "postCount": count(*[_type == "post" && category._ref == ^._id])
  }`,
  
  // Para generateStaticParams
  allPosts: `*[_type == "post"]{
    "slug": slug.current,
    _updatedAt
  }`,

  // Para generateStaticParams de categorías
  allCategories: `*[_type == "category"]{
    "slug": slug.current,
    _updatedAt
  }`,

  // Búsqueda de posts
  searchPosts: `*[_type == "post" && (
    title match $searchTerm + "*" ||
    ingredients[] match $searchTerm + "*" ||
    pt::text(body) match $searchTerm + "*"
  )] | order(publishedAt desc) [0...20]{
    _id,
    title,
    slug,
    mainImage{
      asset->{
        _id,
        url,
        metadata{
          dimensions,
          lqip
        }
      }
    },
    preparationTime,
    level,
    author->{name},
    publishedAt,
    category->{
      title,
      slug
    }
  }`,

  // Obtener sitemap data
  sitemapData: `{
    "posts": *[_type == "post"]{
      "slug": slug.current,
      _updatedAt,
      publishedAt
    },
    "categories": *[_type == "category"]{
      "slug": slug.current,
      _updatedAt
    }
  }`
}

// Función helper para obtener posts con paginación
export const getPostsByCategory = async (
  categoryId: string, 
  page: number = 1, 
  pageSize: number = 12
) => {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  return client.fetch(queries.postsByCategory, {
    categoryId,
    start,
    end
  })
}

// Función helper para búsqueda
export const searchPosts = async (searchTerm: string) => {
  return client.fetch(queries.searchPosts, { searchTerm })
}

// Función helper para obtener datos del sitemap
export const getSitemapData = async () => {
  return client.fetch(queries.sitemapData)
}

// Función para limpiar caché en desarrollo
export const clearCache = () => {
  if (process.env.NODE_ENV === 'development') {
    // Limpiar caché de Sanity en desarrollo
    client.config().useCdn = false
  }
}