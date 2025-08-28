import { client, urlFor } from './sanity';
import type { Product, Service } from '@/types/sanity';

export interface UnifiedItem {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description: string;
  price: number;
  currency: string;
  duration?: string;
  features?: string[];
  contactUrl?: string;
  whatsapp?: string;
  affiliateUrl?: string;
  featured: boolean;
  createdAt: string;
  type: 'product' | 'service';
  imageUrl?: string | null;
}

export const productsServicesUtils = {
  async getAllItems(): Promise<UnifiedItem[]> {
    try {
      const [products, services] = await Promise.all([
        client.fetch<Product[]>(`
          *[_type == "product"] | order(featured desc, createdAt desc) {
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
          }
        `),
        client.fetch<Service[]>(`
          *[_type == "service"] | order(featured desc, createdAt desc) {
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
          }
        `)
      ]);

      return [
        ...products.map(product => ({
          ...product,
          type: 'product' as const,
          imageUrl: product.image ? urlFor(product.image).width(400).height(300).url() : null,
        })),
        ...services.map(service => ({
          ...service,
          type: 'service' as const,
          imageUrl: service.image ? urlFor(service.image).width(400).height(300).url() : null,
        })),
      ];
    } catch (error) {
      console.error('Error fetching items:', error);
      return [];
    }
  },

  async getItemBySlug(slug: string): Promise<UnifiedItem | null> {
    try {
      // Try product first
      const product = await client.fetch<Product>(`
        *[_type == "product" && slug.current == $slug][0] {
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
        }
      `, { slug });

      if (product) {
        return {
          ...product,
          type: 'product' as const,
          imageUrl: product.image ? urlFor(product.image).width(800).height(600).url() : null,
        };
      }

      // Try service
      const service = await client.fetch<Service>(`
        *[_type == "service" && slug.current == $slug][0] {
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
        }
      `, { slug });

      if (service) {
        return {
          ...service,
          type: 'service' as const,
          imageUrl: service.image ? urlFor(service.image).width(800).height(600).url() : null,
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching item by slug:', error);
      return null;
    }
  },

  formatPrice(price: number, currency: string): string {
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${price}`;
  },

  formatCurrency(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  },

  getWhatsAppLink(whatsapp: string, serviceName: string): string {
    const cleanWhatsApp = whatsapp.replace(/\D/g, '');
    const message = `Hola, estoy interesado en el servicio: ${serviceName}`;
    return `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(message)}`;
  },

  filterItems(items: UnifiedItem[], filters: {
    type?: string;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
  }): UnifiedItem[] {
    let filtered = [...items];

    if (filters.type && filters.type !== 'todos') {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(item => item.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(item => item.price <= filters.maxPrice!);
    }

    if (filters.featured) {
      filtered = filtered.filter(item => item.featured);
    }

    return filtered;
  },

  sortItems(items: UnifiedItem[], sortBy: string): UnifiedItem[] {
    const sorted = [...items];
    
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  paginateItems(items: UnifiedItem[], page: number, itemsPerPage: number = 12): {
    items: UnifiedItem[];
    totalPages: number;
    currentPage: number;
  } {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalPages = Math.ceil(items.length / itemsPerPage);
    
    return {
      items: items.slice(startIndex, endIndex),
      totalPages,
      currentPage: page,
    };
  }
};

// Export individual functions for convenience
export const {
  getAllItems,
  getItemBySlug,
  formatPrice,
  formatCurrency,
  getWhatsAppLink,
  filterItems,
  sortItems,
  paginateItems,
} = productsServicesUtils;