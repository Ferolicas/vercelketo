'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ShoppingCartIcon, 
  StarIcon as StarSolid,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  FireIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'

interface AffiliateProduct {
  id: string
  name: string
  description: string
  price: string
  originalPrice?: string
  rating: number
  reviewCount: number
  amazonUrl: string
  image: string
  badge?: 'bestseller' | 'choice' | 'deal'
  category: string
  features: string[]
}

interface AffiliateLinksWidgetProps {
  recipeCategory?: string
  recipeIngredients?: string[]
  position: 'inline' | 'sidebar' | 'floating'
  maxProducts?: number
}

// Productos afiliados organizados por categoría
const affiliateProducts: AffiliateProduct[] = [
  {
    id: 'mct-oil',
    name: 'Aceite MCT Premium',
    description: 'Aceite de triglicéridos de cadena media para cetosis rápida',
    price: '€24.99',
    originalPrice: '€34.99',
    rating: 4.8,
    reviewCount: 2847,
    amazonUrl: 'https://amzn.to/3keto-mct-oil',
    image: '/affiliate/mct-oil.jpg',
    badge: 'bestseller',
    category: 'supplements',
    features: ['Cetosis rápida', '100% puro', 'Sin sabor']
  },
  {
    id: 'keto-strips',
    name: 'Tiras Cetosis Keto',
    description: 'Mide tu nivel de cetonas en orina - Pack de 100 tiras',
    price: '€12.99',
    rating: 4.6,
    reviewCount: 1593,
    amazonUrl: 'https://amzn.to/3keto-strips',
    image: '/affiliate/keto-strips.jpg',
    badge: 'choice',
    category: 'testing',
    features: ['Resultados precisos', 'Fácil de usar', 'Pack de 100']
  },
  {
    id: 'electrolytes',
    name: 'Electrolitos Keto',
    description: 'Suplemento de sodio, potasio y magnesio para evitar keto flu',
    price: '€19.99',
    originalPrice: '€29.99',
    rating: 4.9,
    reviewCount: 3021,
    amazonUrl: 'https://amzn.to/3keto-electrolytes',
    image: '/affiliate/electrolytes.jpg',
    badge: 'deal',
    category: 'supplements',
    features: ['Sin keto flu', 'Energía instantánea', 'Sin azúcar']
  },
  {
    id: 'coconut-flour',
    name: 'Harina de Coco Orgánica',
    description: 'Harina de coco premium para repostería keto',
    price: '€8.99',
    rating: 4.7,
    reviewCount: 892,
    amazonUrl: 'https://amzn.to/3coconut-flour',
    image: '/affiliate/coconut-flour.jpg',
    category: 'ingredients',
    features: ['Orgánica', 'Baja en carbos', 'Rica en fibra']
  },
  {
    id: 'almond-flour',
    name: 'Harina de Almendra',
    description: 'Harina de almendra blanqueada perfecta para pan keto',
    price: '€11.99',
    rating: 4.8,
    reviewCount: 1247,
    amazonUrl: 'https://amzn.to/3almond-flour',
    image: '/affiliate/almond-flour.jpg',
    badge: 'bestseller',
    category: 'ingredients',
    features: ['Blanqueada', 'Textura suave', 'Sin gluten']
  },
  {
    id: 'keto-cookbook',
    name: 'Libro Recetas Keto',
    description: 'Más de 150 recetas keto fáciles y deliciosas',
    price: '€15.99',
    originalPrice: '€24.99',
    rating: 4.5,
    reviewCount: 678,
    amazonUrl: 'https://amzn.to/3keto-cookbook',
    image: '/affiliate/keto-cookbook.jpg',
    category: 'books',
    features: ['150+ recetas', 'Fotos a color', 'Macros incluidos']
  }
]

export default function AffiliateLinksWidget({ 
  recipeCategory = 'general',
  recipeIngredients = [],
  position = 'inline',
  maxProducts = 3
}: AffiliateLinksWidgetProps) {
  const [selectedProducts, setSelectedProducts] = useState<AffiliateProduct[]>([])

  useEffect(() => {
    // Lógica para seleccionar productos relevantes
    let relevantProducts = [...affiliateProducts]

    // Filtrar por ingredientes mencionados en la receta
    const ingredientKeywords = recipeIngredients.join(' ').toLowerCase()
    
    if (ingredientKeywords.includes('harina') || ingredientKeywords.includes('flour')) {
      relevantProducts = relevantProducts.filter(p => 
        p.category === 'ingredients' || p.name.toLowerCase().includes('harina')
      )
    } else if (recipeCategory === 'postres' || recipeCategory === 'desayunos') {
      // Para postres y desayunos, mostrar harinas e ingredientes de repostería
      relevantProducts = affiliateProducts.filter(p => 
        p.category === 'ingredients' || p.category === 'supplements'
      )
    } else {
      // Para otros platos, mostrar suplementos y herramientas
      relevantProducts = affiliateProducts.filter(p => 
        p.category === 'supplements' || p.category === 'testing'
      )
    }

    // Si no hay productos específicos, mostrar los más populares
    if (relevantProducts.length === 0) {
      relevantProducts = affiliateProducts.filter(p => p.badge === 'bestseller')
    }

    // Ordenar por rating y limitar
    const sortedProducts = relevantProducts
      .sort((a, b) => b.rating - a.rating)
      .slice(0, maxProducts)

    setSelectedProducts(sortedProducts)
  }, [recipeCategory, recipeIngredients, maxProducts])

  const handleProductClick = (product: AffiliateProduct) => {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        event_category: 'affiliate',
        event_label: product.id,
        product_name: product.name,
        position: position,
        value: parseFloat(product.price.replace('€', ''))
      })
    }
  }

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'bestseller': return 'bg-yellow-100 text-yellow-800'
      case 'choice': return 'bg-blue-100 text-blue-800'
      case 'deal': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getBadgeText = (badge?: string) => {
    switch (badge) {
      case 'bestseller': return '🏆 Más vendido'
      case 'choice': return '⭐ Recomendado'
      case 'deal': return '🔥 Oferta'
      default: return ''
    }
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
            <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              {/* Badge */}
              {product.badge && (
                <div className="relative">
                  <div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(product.badge)}`}>
                    {getBadgeText(product.badge)}
                  </div>
                </div>
              )}

              {/* Product image */}
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-6xl">📦</div>
              </div>

              <div className="p-6">
                <h4 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Features */}
                <ul className="text-xs text-gray-600 mb-4 space-y-1">
                  {product.features.slice(0, 2).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircleIcon className="h-3 w-3 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[1,2,3,4,5].map(i => (
                      <StarIcon key={i} className={`h-4 w-4 ${i <= product.rating ? '' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviewCount.toLocaleString()})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-gray-900">{product.price}</span>
                    {product.originalPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href={product.amazonUrl}
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
            <div key={product.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
              {/* Badge */}
              {product.badge && (
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold mb-2 ${getBadgeColor(product.badge)}`}>
                  {getBadgeText(product.badge)}
                </div>
              )}

              <h4 className="font-semibold text-gray-900 mb-2 text-sm">{product.name}</h4>
              
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 mr-2">
                  {[1,2,3,4,5].map(i => (
                    <StarIcon key={i} className={`h-3 w-3 ${i <= product.rating ? '' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-600">{product.rating}</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-lg text-gray-900">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                )}
              </div>

              <Link
                href={product.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleProductClick(product)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center"
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
          {topProduct.badge && (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getBadgeColor(topProduct.badge)}`}>
              {getBadgeText(topProduct.badge)}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <div className="flex-1">
            <h5 className="font-semibold text-sm text-gray-900">{topProduct.name}</h5>
            <div className="flex items-center">
              <div className="flex text-yellow-400 mr-1">
                {[1,2,3,4,5].map(i => (
                  <StarIcon key={i} className={`h-3 w-3 ${i <= topProduct.rating ? '' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-xs text-gray-600">{topProduct.rating}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-orange-600">{topProduct.price}</span>
              {topProduct.originalPrice && (
                <span className="text-xs text-gray-500 line-through">{topProduct.originalPrice}</span>
              )}
            </div>
          </div>
        </div>

        <Link
          href={topProduct.amazonUrl}
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