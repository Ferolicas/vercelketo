'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  StarIcon,
  ShoppingCartIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
  HeartIcon,
  TrophyIcon,
  SparklesIcon,
  TagIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { urlFor } from '@/lib/sanity';

interface UnifiedItem {
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

interface ProductsServicesContentProps {
  items: UnifiedItem[];
  featuredItems: UnifiedItem[];
  categories: string[];
  currentPage: number;
  totalPages: number;
  selectedCategory?: string;
  selectedType?: string;
  sortBy: string;
  totalItems: number;
}

export default function ProductsServicesContent({
  items,
  featuredItems,
  categories,
  currentPage,
  totalPages,
  selectedCategory,
  selectedType,
  sortBy,
  totalItems,
}: ProductsServicesContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Update URL parameters
  const updateParams = (params: Record<string, string | undefined>) => {
    setLoading(true);
    const newParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === 'todos') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    
    newParams.set('page', '1'); // Reset to first page when filtering
    router.push(`/productos-y-servicios?${newParams.toString()}`);
  };

  // Filter items based on search
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${price}`;
  };

  const handleWhatsAppClick = (whatsapp: string, serviceName: string) => {
    const message = `Hola, estoy interesado en el servicio: ${serviceName}`;
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl text-white text-4xl mb-6">
              🛍️
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Productos y{' '}
              <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                Servicios
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Todo lo que necesitas para tu transformación cetogénica en un solo lugar. 
              Productos premium, servicios expertos y herramientas profesionales.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-green-600">{items.length}+</div>
                <div className="text-sm text-gray-600">Productos</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">Expertos</div>
                <div className="text-sm text-gray-600">Servicios</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-purple-600">100%</div>
                <div className="text-sm text-gray-600">Garantía</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-orange-600">24/7</div>
                <div className="text-sm text-gray-600">Soporte</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos o servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                Filtros
              </button>

              <select
                value={selectedType || 'todos'}
                onChange={(e) => updateParams({ tipo: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="todos">Todos los tipos</option>
                <option value="product">Productos</option>
                <option value="service">Servicios</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => updateParams({ ordenar: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="recientes">Más recientes</option>
                <option value="precio-asc">Precio: Menor a mayor</option>
                <option value="precio-desc">Precio: Mayor a menor</option>
                <option value="alfabetico">Alfabético</option>
              </select>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.filter(cat => cat !== 'Todos').map((category) => (
                  <button
                    key={category}
                    onClick={() => updateParams({ categoria: category })}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-green-500 text-white'
                        : 'bg-white hover:bg-green-50 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Items */}
            {featuredItems.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <SparklesIcon className="h-6 w-6 text-yellow-500 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">Destacados</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredItems.slice(0, 4).map((item) => (
                    <div key={item._id} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="text-xs font-semibold text-yellow-800 bg-yellow-200 px-2 py-1 rounded-full">
                            ⭐ Destacado
                          </span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.type === 'product' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.type === 'product' ? 'Producto' : 'Servicio'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(item.price, item.currency)}
                        </span>
                        <Link 
                          href={`/productos-y-servicios/${item.slug.current}`}
                          className="text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          Ver detalles →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* All Items */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Todos los productos y servicios
                  </h2>
                  <p className="text-gray-600">
                    {filteredItems.length} {filteredItems.length === 1 ? 'resultado' : 'resultados'}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4 text-6xl">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No se encontraron resultados
                  </h3>
                  <p className="text-gray-500">
                    Intenta ajustar tus filtros o buscar con otros términos.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                    >
                      {/* Image */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-4xl">
                              {item.type === 'service' ? '🎯' : '📦'}
                            </div>
                          </div>
                        )}
                        
                        {/* Type Badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            item.type === 'product' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-blue-500 text-white'
                          }`}>
                            {item.type === 'product' ? 'Producto' : 'Servicio'}
                          </span>
                        </div>

                        {item.featured && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                              ⭐
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        {/* Title and Description */}
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                        </div>

                        {/* Features */}
                        {item.features && item.features.length > 0 && (
                          <div className="mb-4">
                            <ul className="space-y-1">
                              {item.features.slice(0, 3).map((feature, i) => (
                                <li key={i} className="flex items-center text-xs text-gray-600">
                                  <CheckCircleIcon className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                                  <span className="truncate">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Price and CTA */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xl font-bold text-gray-900">
                              {formatPrice(item.price, item.currency)}
                            </span>
                            {item.duration && (
                              <div className="text-xs text-gray-500">{item.duration}</div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            {item.type === 'product' ? (
                              <a
                                href={item.affiliateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center"
                              >
                                <ShoppingCartIcon className="h-4 w-4 mr-1" />
                                Comprar
                              </a>
                            ) : (
                              <>
                                {item.whatsapp && (
                                  <button
                                    onClick={() => handleWhatsAppClick(item.whatsapp!, item.name)}
                                    className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center"
                                  >
                                    WhatsApp
                                  </button>
                                )}
                                {item.contactUrl && (
                                  <a
                                    href={item.contactUrl}
                                    className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                                  >
                                    Contactar
                                  </a>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => updateParams({ page: page.toString() })}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-green-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Productos</span>
                  <span className="text-sm font-medium text-gray-900">
                    {items.filter(item => item.type === 'product').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Servicios</span>
                  <span className="text-sm font-medium text-gray-900">
                    {items.filter(item => item.type === 'service').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Destacados</span>
                  <span className="text-sm font-medium text-gray-900">
                    {items.filter(item => item.featured).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Help Widget */}
            <div className="bg-green-50 rounded-xl p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">¿Necesitas ayuda?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Nuestro equipo está aquí para ayudarte a elegir los productos y servicios adecuados.
                </p>
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                  Contactar soporte
                </button>
              </div>
            </div>

            {/* Guarantee */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Garantía 100%</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Todos nuestros productos y servicios incluyen garantía de satisfacción.
                </p>
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                  Ver políticas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}