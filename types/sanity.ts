// types/sanity.ts - Tipos actualizados
export interface Post {
  _id: string
  title: string
  slug: { current: string }
  author?: { 
    name: string
    image?: any 
  }
  mainImage?: any
  youtubeUrl?: string
  level?: string
  preparationTime?: string
  servings?: number
  ingredients?: string[]
  instructions?: string[]
  body?: string
  excerpt?: string
  notes?: string
  calories?: number
  carbs?: number
  protein?: number
  fat?: number
  publishedAt?: string
  category?: {
    title: string
    slug: { current: string }
  }
}

export interface Category {
  _id: string
  title: string
  slug: { current: string }
  categoryImage?: any
  description?: string
  order?: number
}

export interface Author {
  _id: string
  name: string
  image?: any
  bio?: string
}

export interface HomePage {
  siteTitle?: string
  youtubeUrl?: string
  email?: string
  phone?: string
  heroTitle?: string
  heroDescription?: string
  heroImage?: any
  picksTitle?: string
  youtubeDisplayText?: string
  picksSubtitle?: string
  amazonUrl?: string
  hotmartUrl?: string
}