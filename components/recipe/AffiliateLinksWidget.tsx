'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ShoppingCartIcon, 
  StarIcon as StarSolid,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  FireIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import { urlFor } from '@/lib/sanity'

interface AmazonList {
  _id: string
  title: string
  slug: { current: string }
  description: string
  amazonUrl: string
  image: any
  category: string
  rating?: number
  reviewsCount?: number
  benefits?: string[]
  keyFeatures?: string[]
  featured: boolean
  isKeto: boolean
  createdAt: string
}

interface AffiliateLinksWidgetProps {
  recipeCategory?: string
  recipeIngredients?: string[]
  position: 'inline' | 'sidebar' | 'floating'
  maxProducts?: number
}


export default function AffiliateLinksWidget({ 
  recipeCategory = 'general',
  recipeIngredients = [],
  position = 'inline',
  maxProducts = 3
}: AffiliateLinksWidgetProps) {
  const [selectedProducts, setSelectedProducts] = useState<AmazonList[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAmazonLists = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/amazon-lists')
        
        if (!response.ok) {
          throw new Error('Failed to fetch Amazon lists')
        }
        
        const amazonLists: AmazonList[] = await response.json()
        
        // Filter and select relevant products based on recipe context
        let relevantProducts = amazonLists.filter(list => list.amazonUrl && list.isKeto !== false)
        
        // Filter by category if available
        const ingredientKeywords = recipeIngredients.join(' ').toLowerCase()
        
        if (ingredientKeywords.includes('harina') || ingredientKeywords.includes('flour')) {
          relevantProducts = relevantProducts.filter(p => 
            p.category === 'ingredients' || p.title.toLowerCase().includes('harina')
          )
        } else if (recipeCategory === 'postres' || recipeCategory === 'desayunos') {
          relevantProducts = relevantProducts.filter(p => 
            p.category === 'ingredients' || p.category === 'supplements'
          )
        } else {
          relevantProducts = relevantProducts.filter(p => 
            p.category === 'supplements' || p.category === 'ingredients'
          )
        }
        
        // If no specific products, show featured ones
        if (relevantProducts.length === 0) {
          relevantProducts = amazonLists.filter(p => p.featured)
        }
        
        // If still no products, show the first available ones
        if (relevantProducts.length === 0) {
          relevantProducts = amazonLists.slice(0, maxProducts)
        }
        
        // Sort by featured first, then by rating if available
        const sortedProducts = relevantProducts
          .sort((a, b) => {
            if (a.featured && !b.featured) return -1
            if (!a.featured && b.featured) return 1
            return (b.rating || 0) - (a.rating || 0)
          })
          .slice(0, maxProducts)
        
        setSelectedProducts(sortedProducts)
      } catch (error) {
        console.error('Error loading Amazon lists:', error)
        setSelectedProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    loadAmazonLists()
  }, [recipeCategory, recipeIngredients, maxProducts])

  const handleProductClick = (product: AmazonList) => {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        event_category: 'affiliate',
        event_label: product._id,
        product_name: product.title,
        position: position
      })
    }
  }

  const getBadgeColor = (featured: boolean) => {
    return featured ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
  }

  const getBadgeText = (featured: boolean) => {
    return featured ? '⭐ Destacado' : '💡 Recomendado'
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-3xl p-8 border-2 border-blue-200 shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando recomendaciones...</p>
        </div>
      </div>
    )
  }
  
  if (selectedProducts.length === 0) return null

  // Version inline (dentro del contenido)
  if (position === 'inline') {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-3xl p-8 border-2 border-blue-200 shadow-lg">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🛒</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Ingredientes y Herramientas Recomendados
          </h3>
          <p className="text-gray-600">
            Los productos que uso para mis recetas keto - Enlaces de afiliado que me ayudan a seguir creando contenido gratis
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {selectedProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              {/* Badge */}
              {(product.featured || product.rating) && (
                <div className="relative">
                  <div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(product.featured)}`}>
                    {getBadgeText(product.featured)}
                  </div>
                </div>
              )}

              {/* Product image */}
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                {product.image && product.image.asset ? (
                  <Image
                    src={urlFor(product.image).width(300).height(300).url()}
                    alt={product.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="text-6xl">📦</div>
                )}
              </div>

              <div className="p-6">
                <h4 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {product.title}
                </h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product.description || 'Producto recomendado para tu dieta keto'}
                </p>

                {/* Features */}
                {(product.keyFeatures || product.benefits) && (
                  <ul className="text-xs text-gray-600 mb-4 space-y-1">
                    {(product.keyFeatures || product.benefits)?.slice(0, 2).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircleIcon className="h-3 w-3 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400 mr-2">
                      {[1,2,3,4,5].map(i => (
                        <StarIcon key={i} className={`h-4 w-4 ${i <= (product.rating || 0) ? '' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} {product.reviewsCount && `(${product.reviewsCount.toLocaleString()})`}
                    </span>
                  </div>
                )}

                {/* CTA Button */}
                <Link
                  href={product.amazonUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleProductClick(product)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center text-sm"
                >
                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                  Ver en Amazon
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            ℹ️ Como afiliado de Amazon, gano comisiones por compras realizadas. Esto no afecta el precio para ti y me ayuda a mantener este contenido gratuito.
          </p>
        </div>
      </div>
    )
  }

  // Version sidebar (lateral)
  if (position === 'sidebar') {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
          <h3 className="font-bold text-lg flex items-center">
            <ShoppingCartIcon className="h-5 w-5 mr-2" />
            Productos Recomendados
          </h3>
          <p className="text-orange-100 text-sm">Para esta receta</p>
        </div>

        <div className="p-4 space-y-4">
          {selectedProducts.slice(0, 2).map((product) => (
            <div key={product._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
              {/* Badge */}
              {(product.featured || product.rating) && (
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold mb-2 ${getBadgeColor(product.featured)}`}>
                  {getBadgeText(product.featured)}
                </div>
              )}

              <h4 className="font-semibold text-gray-900 mb-2 text-sm">{product.title}</h4>
              
              {product.rating && (
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-2">
                    {[1,2,3,4,5].map(i => (
                      <StarIcon key={i} className={`h-3 w-3 ${i <= (product.rating || 0) ? '' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">{product.rating}</span>
                </div>
              )}

              <Link
                href={product.amazonUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleProductClick(product)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center mt-3"
              >
                Ver en Amazon
                <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-2" />
              </Link>
            </div>
          ))}

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Enlaces de afiliado - Me ayudas a mantener el contenido gratis
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Version floating (flotante)
  if (position === 'floating') {
    const topProduct = selectedProducts[0]
    if (!topProduct) return null

    return (
      <div className="fixed bottom-4 right-4 z-40 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-sm animate-bounce-slow">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-sm text-gray-900">💡 Recomendado para ti</h4>
          {(topProduct.featured || topProduct.rating) && (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getBadgeColor(topProduct.featured)}`}>
              {getBadgeText(topProduct.featured)}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center relative">
            {topProduct.image && topProduct.image.asset ? (
              <Image
                src={urlFor(topProduct.image).width(48).height(48).url()}
                alt={topProduct.title}
                fill
                className="object-contain rounded-lg"
                sizes="48px"
              />
            ) : (
              <span className="text-2xl">📦</span>
            )}
          </div>
          <div className="flex-1">
            <h5 className="font-semibold text-sm text-gray-900">{topProduct.title}</h5>
            {topProduct.rating && (
              <div className="flex items-center">
                <div className="flex text-yellow-400 mr-1">
                  {[1,2,3,4,5].map(i => (
                    <StarIcon key={i} className={`h-3 w-3 ${i <= (topProduct.rating || 0) ? '' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-600">{topProduct.rating}</span>
              </div>
            )}
          </div>
        </div>

        <Link
          href={topProduct.amazonUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleProductClick(topProduct)}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 text-sm flex items-center justify-center"
        >
          Ver en Amazon
          <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-2" />
        </Link>
      </div>
    )
  }

  return null
}