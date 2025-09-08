'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  StarIcon,
  ShoppingCartIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import PurchaseModal from './PurchaseModal'

interface SanityProduct {
  _id: string
  title: string
  slug: { current: string }
  description: string
  price: number
  originalPrice?: number
  currency: string
  image: any
  featured: boolean
  includes?: string[]
  createdAt: string
}

interface SanityAmazonList {
  _id: string
  title: string
  slug: { current: string }
  description: string
  amazonUrl: string
  image: any
  price: string
  category: string
  rating: number
  reviewsCount?: number
  benefits?: string[]
  keyFeatures?: string[]
  featured: boolean
  isKeto: boolean
  createdAt: string
}

// Expandable description component
function ExpandableDescription({ description, maxLines = 4 }: { description: string, maxLines?: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showToggle, setShowToggle] = useState(false)

  useEffect(() => {
    // Check if description is long enough to need expansion
    const lines = description.split('\n').length
    setShowToggle(lines > maxLines)
  }, [description, maxLines])

  const formatDescription = (text: string) => {
    return text.split('\n').map((line, index) => (
      <div key={index} className="mb-2 last:mb-0">
        {line}
      </div>
    ))
  }

  const truncatedDescription = description
    .split('\n')
    .slice(0, maxLines)
    .join('\n')

  return (
    <div className="text-gray-600">
      {formatDescription(isExpanded ? description : truncatedDescription)}
      
      {showToggle && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-green-600 hover:text-green-700 font-medium mt-2 flex items-center gap-1 text-sm"
        >
          {isExpanded ? (
            <>
              Mostrar menos <ChevronUpIcon className="w-4 h-4" />
            </>
          ) : (
            <>
              Mostrar más <ChevronDownIcon className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default function ProductosYAfiliados() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const [productos, setProductos] = useState<SanityProduct[]>([])
  const [amazonLists, setAmazonLists] = useState<SanityAmazonList[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const categorias = ['Todos', 'Productos', 'Afiliados']

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load products and amazon lists via API routes
      const [productosResponse, amazonResponse] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/amazon-lists')
      ])

      if (!productosResponse.ok) {
        throw new Error('Error al cargar productos')
      }
      
      if (!amazonResponse.ok) {
        throw new Error('Error al cargar listas de Amazon')
      }

      const productosData = await productosResponse.json()
      const amazonData = await amazonResponse.json()

      setProductos(productosData || [])
      setAmazonLists(amazonData || [])
      
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchaseProduct = (product: any) => {
    // Convert to consistent format for modal
    const productForModal = {
      _id: product._id,
      title: product.title,
      name: product.title,
      price: product.price || 14.75, // Ensure consistent pricing
      originalPrice: product.originalPrice || 29.99,
      image: product.image ? `/guia.png` : '/guia.png', // Use consistent image
      description: product.description,
      includes: product.includes || []
    }
    
    setSelectedProduct(productForModal)
    setShowPurchaseModal(true)
  }

  const filtrarItems = () => {
    let items: any[] = []
    
    if (categoriaSeleccionada === 'Todos' || categoriaSeleccionada === 'Productos') {
      const productosConTipo = productos.map(p => ({ ...p, tipo: 'producto' }))
      items = [...items, ...productosConTipo]
    }
    
    if (categoriaSeleccionada === 'Todos' || categoriaSeleccionada === 'Afiliados') {
      const amazonConTipo = amazonLists.map(a => ({ ...a, tipo: 'afiliado' }))
      items = [...items, ...amazonConTipo]
    }
    
    return items.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }

  const items = filtrarItems()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Cargando productos...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">❌ Error</div>
            <div className="text-gray-600">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Productos y Afiliados
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre nuestra selección de productos digitales y recomendaciones de afiliados 
              cuidadosamente elegidos para tu éxito en la dieta keto.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaSeleccionada(categoria)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  categoriaSeleccionada === categoria
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
          <div className="text-center mt-4 text-gray-600">
            Mostrando {items.length} {items.length === 1 ? 'elemento' : 'elementos'}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No hay productos disponibles
              </h3>
              <p className="text-gray-500">
                Por favor, revisa más tarde o contacta con soporte.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100">
                    {item.image && (
                      <Image
                        src={item.tipo === 'producto' ? '/guia.png' : (item.image.asset?.url || '/placeholder.jpg')}
                        alt={item.title}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    {item.featured && (
                      <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        ⭐ Destacado
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Title */}
                    <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Description - Expandable */}
                    <div className="mb-6">
                      <ExpandableDescription description={item.description || 'Sin descripción disponible.'} />
                    </div>

                    {/* Features/Benefits */}
                    {(item.includes || item.keyFeatures || item.benefits) && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Qué incluye:</h4>
                        <div className="space-y-1">
                          {(item.includes || item.keyFeatures || item.benefits)?.slice(0, 3).map((feature: string, index: number) => (
                            <div key={index} className="flex items-start space-x-2">
                              <CheckCircleIcon className="text-green-500 mt-0.5 flex-shrink-0 w-4 h-4" />
                              <span className="text-sm text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rating for affiliates */}
                    {item.rating && (
                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarSolid 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {item.rating} {item.reviewsCount && `(${item.reviewsCount} reseñas)`}
                        </span>
                      </div>
                    )}

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div>
                        {item.tipo === 'producto' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">€14.75</span>
                            {item.originalPrice && (
                              <span className="text-lg text-gray-500 line-through">€{item.originalPrice}</span>
                            )}
                          </div>
                        ) : (
                          <div className="text-green-600 font-semibold">
                            {item.price || 'Ver precio'}
                          </div>
                        )}
                      </div>

                      {item.tipo === 'producto' ? (
                        <button
                          onClick={() => handlePurchaseProduct(item)}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                        >
                          <ShoppingCartIcon className="w-5 h-5" />
                          Comprar
                        </button>
                      ) : (
                        <a
                          href={item.amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                        >
                          <ExternalLinkIcon className="w-5 h-5" />
                          Ver en Amazon
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedProduct && (
        <PurchaseModal
          product={selectedProduct}
          onClose={() => {
            setShowPurchaseModal(false)
            setSelectedProduct(null)
          }}
        />
      )}
    </div>
  )
}