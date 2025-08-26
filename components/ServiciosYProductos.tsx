'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import { motion } from 'framer-motion'; // Disabled for Next.js 15 compatibility
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
import { ContentAd, SidebarAd } from './AdSystem';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioOriginal?: number;
  imagen: string;
  categoria: string;
  rating: number;
  reviews: number;
  enlace: string;
  caracteristicas: string[];
  badge?: string;
}

interface ProductoAmazon {
  id: string;
  titulo: string;
  descripcion: string;
  precio: string;
  imagen: string;
  enlaceAfiliado: string;
  rating: number;
  categoria: string;
  beneficios: string[];
}

// Datos de ejemplo - estos vendrán de la administración
const productosEjemplo: Producto[] = [
  {
    id: '1',
    nombre: 'Guía Completa Keto 2024',
    descripcion: 'La guía más completa para dominar la dieta cetogénica. +200 páginas con recetas, menús y tips de expertos.',
    precio: 29.99,
    precioOriginal: 49.99,
    imagen: '/productos/guia-keto.jpg',
    categoria: 'Ebooks',
    rating: 4.9,
    reviews: 1247,
    enlace: '#',
    caracteristicas: [
      '+200 recetas exclusivas',
      'Menús semanales completos',
      'Calculadora de macros incluida',
      'Videos tutoriales',
      'Soporte por email'
    ],
    badge: 'Bestseller'
  },
  {
    id: '2',
    nombre: 'Plan Keto Personalizado',
    descripcion: 'Plan de alimentación keto 100% personalizado según tus objetivos, gustos y estilo de vida.',
    precio: 79.99,
    imagen: '/productos/plan-personalizado.jpg',
    categoria: 'Servicios',
    rating: 5.0,
    reviews: 329,
    enlace: '#',
    caracteristicas: [
      'Análisis nutricional completo',
      'Plan de 30 días personalizado',
      'Lista de compras semanal',
      'Seguimiento mensual',
      'Consultas ilimitadas'
    ],
    badge: 'Premium'
  },
  {
    id: '3',
    nombre: 'Calculadora Keto Pro',
    descripcion: 'La herramienta definitiva para calcular tus macros keto perfectos y hacer seguimiento de tu progreso.',
    precio: 19.99,
    imagen: '/productos/calculadora-keto.jpg',
    categoria: 'Herramientas',
    rating: 4.8,
    reviews: 892,
    enlace: '#',
    caracteristicas: [
      'Cálculo preciso de macros',
      'Tracking de peso y medidas',
      'Gráficos de progreso',
      'Base de datos de alimentos',
      'Sincronización multiplataforma'
    ]
  },
  {
    id: '4',
    nombre: 'Curso Keto Avanzado',
    descripcion: 'Curso completo para convertirte en un experto en la dieta cetogénica. Certificado incluido.',
    precio: 129.99,
    imagen: '/productos/curso-keto.jpg',
    categoria: 'Cursos',
    rating: 4.9,
    reviews: 567,
    enlace: '#',
    caracteristicas: [
      '12 módulos de contenido',
      '50+ videos HD',
      'Certificado oficial',
      'Comunidad exclusiva',
      'Actualizaciones de por vida'
    ],
    badge: 'Nuevo'
  }
];

const productosAmazon: ProductoAmazon[] = [
  {
    id: 'amz1',
    titulo: 'MCT Oil Premium - Aceite de Coco Fraccionado',
    descripcion: 'Aceite MCT de alta calidad para acelerar la cetosis y aumentar la energía mental.',
    precio: '$24.99',
    imagen: '/amazon/mct-oil.jpg',
    enlaceAfiliado: 'https://amazon.com/...',
    rating: 4.7,
    categoria: 'Suplementos',
    beneficios: [
      'Acelera la cetosis',
      'Aumenta energía mental',
      'Mejora el metabolismo',
      'Sabor neutro'
    ]
  },
  {
    id: 'amz2',
    titulo: 'Tiras Reactivas de Cetona - Pack 100 unidades',
    descripcion: 'Mide tus niveles de cetosis de forma precisa con estas tiras reactivas profesionales.',
    precio: '$12.99',
    imagen: '/amazon/tiras-cetona.jpg',
    enlaceAfiliado: 'https://amazon.com/...',
    rating: 4.6,
    categoria: 'Medición',
    beneficios: [
      'Medición precisa',
      'Fácil de usar',
      'Resultados en 15 segundos',
      'Pack económico'
    ]
  },
  {
    id: 'amz3',
    titulo: 'Electrolitos Keto - Suplemento Sin Azúcar',
    descripcion: 'Mantén el equilibrio electrolítico perfecto durante tu dieta keto sin azúcares añadidos.',
    precio: '$29.99',
    imagen: '/amazon/electrolitos.jpg',
    enlaceAfiliado: 'https://amazon.com/...',
    rating: 4.8,
    categoria: 'Suplementos',
    beneficios: [
      'Previene la keto flu',
      'Sin azúcar añadido',
      'Sabor delicioso',
      '30 porciones'
    ]
  },
  {
    id: 'amz4',
    titulo: 'Harina de Almendras Orgánica - 1kg',
    descripcion: 'Harina de almendras premium para tus recetas keto favoritas. 100% orgánica y sin gluten.',
    precio: '$18.99',
    imagen: '/amazon/harina-almendras.jpg',
    enlaceAfiliado: 'https://amazon.com/...',
    rating: 4.9,
    categoria: 'Ingredientes',
    beneficios: [
      '100% orgánica',
      'Sin gluten',
      'Rica en proteína',
      'Textura perfecta'
    ]
  }
];

export default function ServiciosYProductos() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todos');
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>(productosEjemplo);

  const categorias = ['Todos', 'Ebooks', 'Servicios', 'Herramientas', 'Cursos'];

  useEffect(() => {
    if (categoriaSeleccionada === 'Todos') {
      setProductosFiltrados(productosEjemplo);
    } else {
      setProductosFiltrados(productosEjemplo.filter(p => p.categoria === categoriaSeleccionada));
    }
  }, [categoriaSeleccionada]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {productosFiltrados.map((producto, index) => (
                  <div
                    key={producto.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Badge */}
                    {producto.badge && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          producto.badge === 'Bestseller' 
                            ? 'bg-yellow-400 text-yellow-900'
                            : producto.badge === 'Premium'
                            ? 'bg-purple-500 text-white'
                            : 'bg-green-500 text-white'
                        }`}>
                          {producto.badge}
                        </span>
                      </div>
                    )}

                    {/* Imagen */}
                    <div className="relative h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <div className="text-6xl">📚</div>
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    </div>

                    <div className="p-6">
                      {/* Header del producto */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-green-600 font-medium">
                            {producto.categoria}
                          </span>
                          <div className="flex items-center">
                            {renderStars(producto.rating)}
                            <span className="ml-1 text-sm text-gray-500">
                              ({producto.reviews})
                            </span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {producto.nombre}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {producto.descripcion}
                        </p>
                      </div>

                      {/* Características */}
                      <div className="mb-6">
                        <ul className="space-y-2">
                          {producto.caracteristicas.slice(0, 3).map((caracteristica, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-600">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                              {caracteristica}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Precio y CTA */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <span className="text-2xl font-bold text-gray-900">
                              ${producto.precio}
                            </span>
                            {producto.precioOriginal && (
                              <span className="ml-2 text-lg text-gray-500 line-through">
                                ${producto.precioOriginal}
                              </span>
                            )}
                          </div>
                          {producto.precioOriginal && (
                            <div className="text-sm text-green-600 font-medium">
                              Ahorra ${(producto.precioOriginal - producto.precio).toFixed(2)}
                            </div>
                          )}
                        </div>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center">
                          <ShoppingCartIcon className="h-4 w-4 mr-2" />
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Anuncio en el medio */}
            <ContentAd position="middle" />

            {/* Sección de Productos de Amazon */}
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
                {productosAmazon.map((producto, index) => (
                  <div
                    key={producto.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6"
                  >
                    <div className="flex space-x-4">
                      {/* Imagen del producto */}
                      <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                      </div>

                      {/* Información del producto */}
                      <div className="flex-1">
                        <div className="mb-2">
                          <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
                            {producto.categoria}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {producto.titulo}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {producto.descripcion}
                        </p>
                        
                        {/* Rating y precio */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            {renderStars(producto.rating)}
                            <span className="ml-1 text-sm text-gray-500">
                              {producto.rating}
                            </span>
                          </div>
                          <span className="text-lg font-bold text-gray-900">
                            {producto.precio}
                          </span>
                        </div>

                        {/* Beneficios */}
                        <ul className="text-xs text-gray-600 mb-4 space-y-1">
                          {producto.beneficios.slice(0, 2).map((beneficio, i) => (
                            <li key={i} className="flex items-center">
                              <CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" />
                              {beneficio}
                            </li>
                          ))}
                        </ul>

                        {/* CTA */}
                        <a
                          href={producto.enlaceAfiliado}
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
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SidebarAd />
            
            {/* Widget de testimonio */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
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