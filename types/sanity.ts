// Existing types...

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