// Tipos TypeScript para los nuevos schemas de Sanity

export interface Category {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description?: string;
  icon?: string;
}

export interface Recipe {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description: string;
  ingredients: string[];
  preparation: string;
  youtubeUrl?: string;
  preparationTime: number;
  servings: number;
  thumbnail: {
    asset: {
      _ref: string;
      url?: string;
    };
    hotspot?: {
      x: number;
      y: number;
    };
  };
  category: Category;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
}

export interface Comment {
  _id: string;
  recipe: {
    _ref: string;
  };
  authorName: string;
  authorEmail: string;
  content: string;
  rating: number;
  approved: boolean;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description: string;
  price: number;
  currency: string;
  image: {
    asset: {
      _ref: string;
      url?: string;
    };
    hotspot?: {
      x: number;
      y: number;
    };
  };
  affiliateUrl: string;
  featured: boolean;
  createdAt: string;
}

export interface Service {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description: string;
  price: number;
  currency: string;
  duration?: string;
  image: {
    asset: {
      _ref: string;
      url?: string;
    };
    hotspot?: {
      x: number;
      y: number;
    };
  };
  features?: string[];
  contactUrl?: string;
  whatsapp?: string;
  featured: boolean;
  createdAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  content: any[]; // Rich text content
  featuredImage: {
    asset: {
      _ref: string;
      url?: string;
    };
    hotspot?: {
      x: number;
      y: number;
    };
  };
  author: string;
  tags?: string[];
  published: boolean;
  createdAt: string;
}

export interface ForumReply {
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

export interface ForumPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  content: string;
  authorName: string;
  authorEmail: string;
  category: 'general' | 'recetas' | 'ejercicio' | 'progreso' | 'preguntas' | 'productos';
  pinned: boolean;
  locked: boolean;
  approved: boolean;
  views: number;
  replies: ForumReply[];
  createdAt: string;
}

// Tipos para formularios
export interface CreateRecipeForm {
  name: string;
  description: string;
  ingredients: string[];
  preparation: string;
  youtubeUrl?: string;
  preparationTime: number;
  servings: number;
  thumbnail: File | null;
  categoryId: string;
}

export interface CreateCommentForm {
  authorName: string;
  authorEmail: string;
  content: string;
  rating: number;
}

export interface CreateForumPostForm {
  title: string;
  content: string;
  authorName: string;
  authorEmail: string;
  category: string;
}

// Tipos de respuesta de la API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}