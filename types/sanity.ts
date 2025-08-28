// Recipe type from Sanity
export interface Recipe {
  _id: string
  _type: 'recipe'
  name: string
  slug: {
    current: string
  }
  description?: string
  thumbnail?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
  createdAt: string
  updatedAt: string
  preparationTime?: number
  servings?: number
  averageRating?: number
  totalRatings?: number
  ingredients?: string
  preparation?: string
  category?: {
    _id: string
    name?: string
    title?: string
    slug?: { current: string }
    icon?: string
  }
  tags?: string[]
  chefNotes?: string
  excerpt?: string
  youtubeUrl?: string
}

// Product type from Sanity
export interface Product {
  _id: string
  _type: 'product'
  name: string
  slug: {
    current: string
  }
  description: string
  price: number
  currency: string
  affiliateUrl: string
  featured: boolean
  image?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
  category: string
  createdAt: string
  updatedAt: string
  duration?: string
  features?: string[]
}

// Service type from Sanity
export interface Service {
  _id: string
  _type: 'service'
  name: string
  slug: {
    current: string
  }
  description: string
  price: number
  currency: string
  duration: string
  features: string[]
  contactUrl?: string
  whatsapp?: string
  featured: boolean
  image?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
  category: string
  createdAt: string
  updatedAt: string
}

// Category type from Sanity
export interface Category {
  _id: string
  _type: 'category'
  name: string
  slug: {
    current: string
  }
  icon?: string
  description?: string
  createdAt: string
  updatedAt: string
}

// Blog post type from Sanity
export interface BlogPost {
  _id: string
  _type: 'blogPost'
  title: string
  slug: {
    current: string
  }
  description?: string
  content?: any[]
  excerpt?: string
  publishedAt: string
  category?: {
    name: string
    slug: {
      current: string
    }
  }
  tags?: string[]
  featuredImage?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
  author?: {
    name: string
    image?: {
      asset: {
        _ref: string
        _type: 'reference'
      }
    }
  }
  readingTime?: number
  seoTitle?: string
  seoDescription?: string
  createdAt: string
  updatedAt: string
}

// Forum post type from Sanity
export interface ForumPost {
  _id: string
  _type: 'forumPost'
  title: string
  slug: {
    current: string
  }
  content: any[]
  excerpt: string
  authorName: string
  authorEmail: string
  category: {
    name: string
    slug: {
      current: string
    }
  }
  tags: string[]
  createdAt: string
  updatedAt: string
  featuredImage?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
  likes: number
  comments: number
  views: number
  isPublished: boolean
  pinned?: boolean
  seoTitle?: string
  seoDescription?: string
}

// Form types for admin interfaces
export interface CreateRecipeForm {
  name: string
  description: string
  ingredients: string
  preparation: string
  youtubeUrl: string
  preparationTime: string
  servings: string
  categoryId: string
  thumbnail: File | null
}

// Unified item type for products and services
export interface UnifiedItem {
  _id: string
  name: string
  slug: {
    current: string
  }
  description: string
  price: number
  currency: string
  duration?: string
  features?: string[]
  contactUrl?: string
  whatsapp?: string
  affiliateUrl?: string
  featured: boolean
  type: 'product' | 'service'
  imageUrl?: string
  category: string
  createdAt: string
  updatedAt: string
}

// Affiliate list types
export interface AffiliateItem {
  title: string
  description: string
  imageUrl?: string
  link: string
  price?: number
  currency?: string
  rating?: number
  category?: string
}

export interface AffiliateList {
  _id: string
  _type: 'affiliateList'
  title: string
  description?: string
  slug: {
    current: string
  }
  imageUrl?: string
  items: AffiliateItem[]
  featured: boolean
  createdAt: string
  updatedAt: string
}