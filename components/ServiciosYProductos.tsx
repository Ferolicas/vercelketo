'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { client, queries, urlFor } from '@/lib/sanity';

interface SanityProduct {
  _id: string;
  name: string;
  slug: { current: string };
  description: string;
  price: number;
  currency: string;
  image: any;
  affiliateUrl: string;
  featured: boolean;
  createdAt: string;
}

interface SanityService {
  _id: string;
  name: string;
  slug: { current: string };
  description: string;
  price: number;
  currency: string;
  duration?: string;
  image: any;
  features?: string[];
  contactUrl?: string;
  whatsapp?: string;
  featured: boolean;
  createdAt: string;
}

interface SanityAmazonList {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  amazonUrl: string;
  image: any;
  price: string;
  category: string;
  rating: number;
  reviewsCount?: number;
  benefits?: string[];
  keyFeatures?: string[];
  featured: boolean;
  isKeto: boolean;
  createdAt: string;
}

interface ProductoUnificado {
  _id: string;
  tipo: 'producto' | 'servicio';
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: any;
  categoria: string;
  destacado: boolean;
  urlCompra?: string;
  urlContacto?: string;
  incluye?: string[];
  beneficios?: string[];
  rating?: number;
  reviews?: number;
}

export default function ServiciosYProductos() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState<SanityProduct[]>([]);
  const [servicios, setServicios] = useState<SanityService[]>([]);
  const [amazonLists, setAmazonLists] = useState<SanityAmazonList[]>([]);
  const [error, setError] = useState<string | null>(null);

  const categorias = ['Todos', 'Productos', 'Servicios', 'Amazon'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching products and services from Sanity...');
      
      const [productosData, serviciosData, amazonData] = await Promise.all([
        client.fetch<SanityProduct[]>(queries.allProducts),
        client.fetch<SanityService[]>(queries.allServices),
        client.fetch<SanityAmazonList[]>(queries.allAmazonLists)
      ]);

      console.log('📦 Products:', productosData?.length || 0);
      console.log('🎯 Services:', serviciosData?.length || 0);
      console.log('📱 Amazon Lists:', amazonData?.length || 0);

      setProductos(productosData || []);
      setServicios(serviciosData || []);
      setAmazonLists(amazonData || []);
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const getAllItems = (): ProductoUnificado[] => {
    const items: ProductoUnificado[] = [];

    if (categoriaSeleccionada === 'Todos' || categoriaSeleccionada === 'Productos') {
      productos.forEach(producto => {
        items.push({
          ...producto,
          tipo: 'producto',
          nombre: producto.name,
          descripcion: producto.description,
          precio: producto.price,
          imagen: producto.image,
          categoria: 'Productos',
          urlCompra: producto.affiliateUrl,
          destacado: producto.featured
        });
      });
    }

    if (categoriaSeleccionada === 'Todos' || categoriaSeleccionada === 'Servicios') {
      servicios.forEach(servicio => {
        items.push({
          ...servicio,
          tipo: 'servicio',
          nombre: servicio.name,
          descripcion: servicio.description,
          precio: servicio.price,
          imagen: servicio.image,
          categoria: 'Servicios',
          urlContacto: servicio.contactUrl || `https://wa.me/${servicio.whatsapp}`,
          destacado: servicio.featured,
          incluye: servicio.features || []
        });
      });
    }

    return items;
  };

  const productosFiltrados = getAllItems();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarSolid
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl text-white text-3xl mb-6">
              🛍️
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Servicios y{' '}
              <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                Productos
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Acelera tu éxito keto con nuestros productos premium, guías exclusivas y 
              herramientas profesionales seleccionadas especialmente para ti.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenido Principal */}
          <div className="lg:col-span-3">
            {/* Sección de Productos Propios */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Productos Premium
                  </h2>
                  <p className="text-gray-600">
                    Herramientas y recursos creados por expertos para acelerar tus resultados
                  </p>
                </div>
              </div>

              {/* Filtros por categoría */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categorias.map((categoria) => (
                  <button
                    key={categoria}
                    onClick={() => setCategoriaSeleccionada(categoria)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      categoriaSeleccionada === categoria
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
                    }`}
                  >
                    {categoria}
                  </button>
                ))}
              </div>

              {/* Grid de productos */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                      <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                      <div className="h-8 bg-gray-300 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-red-400 mb-4 text-6xl">❌</div>
                  <h3 className="text-xl font-semibold text-red-700 mb-2">
                    Error al cargar los datos
                  </h3>
                  <p className="text-red-500 mb-4">{error}</p>
                  <button
                    onClick={loadData}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              ) : productosFiltrados.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4 text-6xl">🛒</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No hay {categoriaSeleccionada === 'Todos' ? 'productos o servicios' : categoriaSeleccionada.toLowerCase()} disponibles
                  </h3>
                  <p className="text-gray-500">Pronto añadiremos más contenido para ti.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Debug: Products: {productos.length}, Services: {servicios.length}, Amazon: {amazonLists.length}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {productosFiltrados.map((item, index) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      {/* Badge para destacados */}
                      {(item as any).destacado && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                            ⭐ Destacado
                          </span>
                        </div>
                      )}

                      {/* Imagen */}
                      <div className="relative h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden">
                        {item.imagen ? (
                          <Image 
                            src={urlFor(item.imagen).width(400).height(300).url()}
                            alt={item.nombre}
                            fill
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="text-6xl">
                            {item.tipo === 'servicio' ? '🎯' : '📦'}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                      </div>

                      <div className="p-6">
                        {/* Header del item */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-green-600 font-medium">
                              {item.categoria}
                            </span>
                            <div className="flex items-center">
                              {renderStars(item.rating || 4.5)}
                              <span className="ml-1 text-sm text-gray-500">({item.reviews || 0})</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{item.nombre}</h3>
                          <p className="text-gray-600 text-sm mb-4">{item.descripcion}</p>
                        </div>

                        {/* Características o beneficios */}
                        <div className="mb-6">
                          <ul className="space-y-2">
                            {((item.tipo === 'servicio' ? (item as any).incluye : (item as any).beneficios) || []).slice(0, 3).map((feature: string, i: number) => (
                              <li key={i} className="flex items-center text-sm text-gray-600">
                                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Precio y CTA */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center">
                              <span className="text-2xl font-bold text-gray-900">
                                ${item.precio}
                              </span>
                              {(item as any).precioOriginal && (
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                  ${(item as any).precioOriginal}
                                </span>
                              )}
                            </div>
                            {(item as any).duracion && (
                              <div className="text-sm text-green-600 font-medium">
                                {(item as any).duracion}
                              </div>
                            )}
                          </div>
                          <a
                            href={item.tipo === 'servicio' ? (item as any).urlContacto : (item as any).urlCompra}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center ${
                              item.tipo === 'servicio' 
                                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                          >
                            <ExternalLinkIcon className="h-4 w-4 mr-2" />
                            {item.tipo === 'servicio' ? 'Contactar' : 'Comprar'}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>


            {/* Sección de Productos de Amazon */}
            {(categoriaSeleccionada === 'Todos' || categoriaSeleccionada === 'Amazon') && (
              <section>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Productos Recomendados de Amazon
                  </h2>
                  <p className="text-gray-600">
                    Los mejores productos keto seleccionados por nuestros expertos
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {amazonLists.map((producto) => (
                    <div
                      key={producto._id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6"
                    >
                      <div className="flex space-x-4">
                        {/* Imagen del producto */}
                        <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center overflow-hidden">
                          {producto.image ? (
                            <Image 
                              src={urlFor(producto.image).url()}
                              alt={producto.title}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">📦</span>
                          )}
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1">
                          <div className="mb-2">
                            <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
                              {producto.category}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{producto.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{producto.description}</p>
                          
                          {/* Rating y precio */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              {renderStars(producto.rating)}
                              <span className="ml-1 text-sm text-gray-500">{producto.rating}</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{producto.price}</span>
                          </div>

                          {/* Beneficios */}
                          <ul className="text-xs text-gray-600 mb-4 space-y-1">
                            {(producto.benefits || []).slice(0, 2).map((beneficio, i) => (
                              <li key={i} className="flex items-center">
                                <CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" />
                                {beneficio}
                              </li>
                            ))}
                          </ul>

                          {/* CTA */}
                          <a
                            href={producto.amazonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                          >
                            Ver en Amazon
                            <ExternalLinkIcon className="ml-1 h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {amazonLists.length === 0 && !loading && (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-gray-500">No hay productos de Amazon disponibles en este momento.</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            
            {/* Widget de testimonio */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">{[...Array(5)].map((_, i) => (
                    <StarSolid key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-700 italic mb-4">
                  "Los productos de Planeta Keto cambiaron mi vida. Perdí 15kg en 3 meses siguiendo sus guías."
                </blockquote>
                <cite className="text-sm font-semibold text-gray-900">
                  - María González
                </cite>
              </div>
            </div>

            {/* Widget de garantía */}
            <div className="bg-green-50 rounded-2xl p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Garantía de 30 días
                </h3>
                <p className="text-sm text-gray-600">
                  Si no estás 100% satisfecho, te devolvemos tu dinero sin preguntas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}