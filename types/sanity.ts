// types/sanity.ts - Tipos actualizados
export interface Post {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: {
    current: string;
  };
  mainImage?: {
    asset: {
      _ref: string;
    };
    hotspot?: {
      x: number;
      y: number;
    };
    crop?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  };
  publishedAt?: string;
  author?: {
    name: string;
    slug: {
      current: string;
    };
    image?: {
      asset: {
        _ref: string;
      };
    };
    bio?: string;
  };
  category?: {
    title: string;
    slug: {
      current: string;
    };
    description?: string;
  };
  ingredients: string[];
  body: any; // PortableText content
  excerpt?: string;
  youtubeUrl?: string;
  level?: 'principiante' | 'intermedio' | 'avanzado';
  preparationTime?: string;
  rating?: number;
  servings?: number;
  calories?: number;
  macros?: {
    carbs?: number;
    protein?: number;
    fat?: number;
    fiber?: number;
  };
  tags?: string[];
  chefNotes?: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  categoryImage?: {  // Agregar esta línea
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
  postCount?: number;
  posts?: Post[];
}

export interface Author {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  image?: {
    asset: {
      _ref: string;
    };
  };
  bio?: string;
}

export interface HomePage {
  _id: string
  siteTitle: string        // Cambiado de 'title' a 'siteTitle'
  heroTitle: string
  heroDescription: string
  heroImage: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
}

export interface SiteStats {
  totalPosts: number;
  totalCategories: number;
  totalAuthors: number;
  averageRating: number;
}