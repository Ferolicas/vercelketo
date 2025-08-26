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
  image?: {
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
    name?: string;
    slug: {
      current: string;
    };
    description?: string;
  };
  // 👇 ESTA ES LA LÍNEA CORREGIDA
  ingredients?: string;
  body: any; // PortableText content
  excerpt?: string;
  youtubeUrl?: string;
  level?: 'principiante' | 'intermedio' | 'avanzado';
  difficulty?: 'facil' | 'intermedio' | 'avanzado';
  preparationTime?: string;
  cookingTime?: number;
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
  categoryImage?: {
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
  siteTitle: string
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

// New schemas for expanded site functionality
export interface Product {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: {
    current: string;
  };
  description: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  currency: string;
  images: {
    asset: {
      _ref: string;
      url?: string;
    };
    alt?: string;
  }[];
  category: {
    title: string;
    slug: {
      current: string;
    };
  };
  tags?: string[];
  features?: string[];
  specifications?: {
    name: string;
    value: string;
  }[];
  affiliateUrl?: string;
  amazonUrl?: string;
  isDigital: boolean;
  downloadUrl?: string;
  stock?: number;
  rating?: number;
  reviews?: {
    author: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface Service {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: {
    current: string;
  };
  description: string;
  shortDescription?: string;
  price: number;
  currency: string;
  duration?: string;
  image?: {
    asset: {
      _ref: string;
      url?: string;
    };
    alt?: string;
  };
  features: string[];
  includes?: string[];
  category: {
    title: string;
    slug: {
      current: string;
    };
  };
  testimonials?: {
    author: string;
    content: string;
    rating: number;
    date: string;
  }[];
  contactEmail?: string;
  whatsappNumber?: string;
  bookingUrl?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface BlogPost {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  body: any; // PortableText content
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
    alt?: string;
  };
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
    name?: string;
    slug: {
      current: string;
    };
    description?: string;
  };
  tags?: string[];
  publishedAt?: string;
  readTime?: number;
  isFeatured?: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    focusKeyword?: string;
  };
}

export interface ForumPost {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: {
    current: string;
  };
  content: string;
  author: {
    name: string;
    email: string;
    avatar?: {
      asset: {
        _ref: string;
      };
    };
  };
  category: {
    title: string;
    slug: {
      current: string;
    };
  };
  tags?: string[];
  isPinned?: boolean;
  isLocked?: boolean;
  views: number;
  likes: number;
  replies?: ForumReply[];
}

export interface ForumReply {
  _id: string;
  _createdAt: string;
  content: string;
  author: {
    name: string;
    email: string;
    avatar?: {
      asset: {
        _ref: string;
      };
    };
  };
  parentReply?: string;
  likes: number;
  isAcceptedAnswer?: boolean;
}

export interface ProductCategory {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  image?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
}

export interface ServiceCategory {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  image?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
}

export interface BlogCategory {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  color?: string;
}

export interface ForumCategory {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  color?: string;
  icon?: string;
}