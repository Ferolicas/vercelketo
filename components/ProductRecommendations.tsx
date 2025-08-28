'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';
import { AffiliateList } from '@/types/sanity';
import { 
  ShoppingCartIcon, 
  StarIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface ProductRecommendationsProps {
  title?: string;
  description?: string;
  listSlug?: string;
  featured?: boolean;
  limit?: number;
  className?: string;
}

interface LoadingState {
  loading: boolean;
  error: string | null;
}

export default function ProductRecommendations({
  title = "Productos Recomendados",
  description = "Los mejores productos keto seleccionados por nuestros expertos",
  listSlug,
  featured = false,
  limit = 6,
  className = "",
}: ProductRecommendationsProps) {
  const [affiliateList, setAffiliateList] = useState<AffiliateList | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchAffiliateList();
  }, [listSlug, featured]);

  const fetchAffiliateList = async () => {
    try {
      setLoadingState({ loading: true, error: null });
      
      let query = '';
      if (listSlug) {
        query = `slug=${listSlug}`;
      } else if (featured) {
        query = 'featured=true';
      }

      const response = await fetch(`/api/affiliates${query ? `?${query}` : ''}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar productos');
      }

      const lists = data.affiliateLists || [];
      
      if (lists.length > 0) {
        setAffiliateList(lists[0]);
      } else {
        // Fallback to featured products
        const featuredResponse = await fetch('/api/affiliates?featured=true');
        const featuredData = await featuredResponse.json();
        
        if (featuredData.affiliateLists && featuredData.affiliateLists.length > 0) {
          setAffiliateList(featuredData.affiliateLists[0]);
        } else {
          setLoadingState({ loading: false, error: 'No hay productos recomendados disponibles' });
        }
      }
    } catch (error) {
      console.error('Error fetching affiliate list:', error);
      setLoadingState({
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoadingState(prev => ({ ...prev, loading: false }));
    }
  };

  const renderStars = (rating: number = 4.5) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <StarSolid
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return null;
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'COP' ? '$' : '$';
    return `${symbol}${price}`;
  };

  if (loadingState.loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(Math.min(limit, 3))].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loadingState.error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-2xl p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-400 mb-2 text-2xl">⚠️</div>
          <h3 className="text-red-800 font-semibold mb-1">Error al cargar productos</h3>
          <p className="text-red-600 text-sm">{loadingState.error}</p>
        </div>
      </div>
    );
  }

  if (!affiliateList || !affiliateList.items || affiliateList.items.length === 0) {
    return null; // Don't render if no products
  }

  const itemsToShow = affiliateList.items.slice(0, limit);

  return (
    <section className={`bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 ${className}`}>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {affiliateList.title || title}
            </h2>
            <p className="text-gray-600">
              {affiliateList.description || description}
            </p>
          </div>
          {affiliateList.featured && (
            <div className="flex items-center text-yellow-500">
              <SparklesIcon className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Destacados</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {itemsToShow.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
          >
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-4xl">🛍️</div>
                </div>
              )}
              
              {/* Rating Badge */}
              {item.rating && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold">
                  <div className="flex items-center">
                    <StarSolid className="h-3 w-3 text-yellow-400 mr-1" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5">
              {/* Category */}
              {item.category && (
                <div className="mb-2">
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
              )}

              {/* Title and Description */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-4">
                {item.price && (
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(item.price, item.currency)}
                    </span>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div className="space-y-2">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center font-medium text-sm group-hover:scale-105 transform transition-transform"
                >
                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                  Comprar en Amazon
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                
                {/* Trust indicators */}
                <div className="text-xs text-gray-500 text-center">
                  Enlace de afiliado • Precio puede variar
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {affiliateList.items.length > limit && (
        <div className="mt-8 text-center">
          <button
            onClick={() => fetchAffiliateList()} // Refresh data
            className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Ver más productos
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </button>
        </div>
      )}
    </section>
  );
}