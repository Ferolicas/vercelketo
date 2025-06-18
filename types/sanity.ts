// Tipos base de Sanity
export interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
}

export interface Slug {
  _type: 'slug'
  current: string
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

// Tipos específicos de tu esquema
export interface Author extends SanityDocument {
  _type: 'author'
  name: string
  slug: Slug
  image?: SanityImage
  bio?: any[]
}

export interface Category extends SanityDocument {
  _type: 'category'
  title: string
  slug: Slug
  categoryImage?: SanityImage
  description?: string
  order: number
}

export interface Ingredient {
  _type: 'ingredient'
  name: string
  quantity: string
  unit?: string
}

export interface IngredientSection {
  _type: 'ingredientSection'
  sectionTitle?: string
  ingredients: Ingredient[]
}

export interface Post extends SanityDocument {
  _type: 'post'
  title: string
  slug: Slug
  author: Author
  mainImage?: SanityImage
  category: Category
  publishedAt: string
  body?: any[]
  youtubeUrl?: string
  level: 'Principiante' | 'Intermedio' | 'Avanzado'
  preparationTime: string
  ingredients: IngredientSection[]
}

export interface HomePage extends SanityDocument {
  _type: 'homePage'
  siteTitle: string
  youtubeUrl?: string
  email?: string
  heroTitle: string
  heroDescription?: string
  heroImage?: SanityImage
  hotmartUrl?: string
}

// Tipos para las respuestas de las consultas
export interface PostPreview {
  _id: string
  title: string
  slug: Slug
  mainImage?: SanityImage
  preparationTime: string
  level: 'Principiante' | 'Intermedio' | 'Avanzado'
  author: {
    name: string
  }
  publishedAt: string
}