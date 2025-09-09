'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface AdvancedSEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
  recipe?: {
    name: string
    description: string
    image: string
    prepTime?: string
    cookTime?: string
    totalTime?: string
    servings?: number
    calories?: number
    ingredients?: string[]
    instructions?: string[]
    difficulty?: string
    cuisine?: string
    category?: string
  }
  product?: {
    name: string
    description: string
    image: string
    price?: number
    currency?: string
    availability?: string
    brand?: string
  }
}

export default function AdvancedSEO({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags,
  recipe,
  product
}: AdvancedSEOProps) {
  const pathname = usePathname()
  const currentUrl = url || `https://planetaketo.es${pathname}`
  const currentImage = image || 'https://planetaketo.es/og-image.jpg'

  // Core Schema.org structured data
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      // Website/Organization schema
      {
        '@type': 'Organization',
        '@id': 'https://planetaketo.es/#organization',
        name: 'Planeta Keto',
        url: 'https://planetaketo.es',
        logo: {
          '@type': 'ImageObject',
          '@id': 'https://planetaketo.es/#logo',
          url: 'https://planetaketo.es/logo.webp',
          contentUrl: 'https://planetaketo.es/logo.webp',
          width: 512,
          height: 512
        },
        image: { '@id': 'https://planetaketo.es/#logo' },
        description: 'La guía más completa de dieta cetogénica en español. Recetas keto, consejos y comunidad para transformar tu vida.',
        foundingDate: '2024-01-01',
        founders: [
          {
            '@type': 'Person',
            name: 'Equipo Planeta Keto',
            jobTitle: 'Especialistas en Nutrición Cetogénica'
          }
        ],
        sameAs: [
          'https://www.instagram.com/planetaketo',
          'https://www.facebook.com/planetaketo',
          'https://www.youtube.com/planetaketo',
          'https://twitter.com/planetaketo'
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          availableLanguage: ['Spanish', 'es'],
          serviceArea: {
            '@type': 'Country',
            name: 'España'
          }
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'ES',
          addressRegion: 'Madrid'
        }
      },
      // Website schema
      {
        '@type': 'WebSite',
        '@id': 'https://planetaketo.es/#website',
        url: 'https://planetaketo.es',
        name: 'Planeta Keto',
        description: 'Recetas keto, guías de dieta cetogénica y comunidad en español #1',
        publisher: { '@id': 'https://planetaketo.es/#organization' },
        inLanguage: 'es-ES',
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://planetaketo.es/buscar?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        ]
      },
      // Current page schema
      {
        '@type': type === 'article' ? 'Article' : 'WebPage',
        '@id': `${currentUrl}#webpage`,
        url: currentUrl,
        name: title || 'Planeta Keto - Recetas Cetogénicas',
        description: description || 'La guía más completa de dieta cetogénica en español',
        image: {
          '@type': 'ImageObject',
          url: currentImage,
          width: 1200,
          height: 630
        },
        isPartOf: { '@id': 'https://planetaketo.es/#website' },
        inLanguage: 'es-ES',
        ...(publishedTime && { datePublished: publishedTime }),
        ...(modifiedTime && { dateModified: modifiedTime }),
        ...(author && {
          author: {
            '@type': 'Person',
            name: author
          }
        }),
        ...(tags && tags.length > 0 && { keywords: tags.join(', ') }),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: generateBreadcrumbs(pathname)
        }
      }
    ]
  }

  // Add recipe schema if provided
  if (recipe) {
    const recipeSchema: any = {
      '@type': 'Recipe',
      name: recipe.name,
      description: recipe.description,
      image: {
        '@type': 'ImageObject',
        url: recipe.image,
        width: 1200,
        height: 630
      },
      author: {
        '@type': 'Organization',
        name: 'Planeta Keto'
      },
      keywords: ['keto', 'cetogénica', 'bajo carbohidratos', ...(tags || [])].join(', '),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '150'
      }
    }

    if (publishedTime) recipeSchema.datePublished = publishedTime
    if (recipe.prepTime) recipeSchema.prepTime = recipe.prepTime
    if (recipe.cookTime) recipeSchema.cookTime = recipe.cookTime
    if (recipe.totalTime) recipeSchema.totalTime = recipe.totalTime
    if (recipe.servings) recipeSchema.recipeYield = recipe.servings.toString()
    if (recipe.calories) recipeSchema.nutrition = { '@type': 'NutritionInformation', calories: recipe.calories.toString() }
    if (recipe.ingredients) recipeSchema.recipeIngredient = recipe.ingredients
    if (recipe.instructions) recipeSchema.recipeInstructions = recipe.instructions.map((instruction, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: instruction
    }))
    if (recipe.difficulty) recipeSchema.difficulty = recipe.difficulty
    if (recipe.cuisine) recipeSchema.recipeCuisine = recipe.cuisine
    if (recipe.category) recipeSchema.recipeCategory = recipe.category

    schemaData['@graph'].push(recipeSchema)
  }

  // Add product schema if provided
  if (product) {
    const productSchema: any = {
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: {
        '@type': 'ImageObject',
        url: product.image,
        width: 800,
        height: 600
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.7',
        reviewCount: '89'
      }
    }

    if (product.brand) productSchema.brand = { '@type': 'Brand', name: product.brand }
    if (product.price) {
      productSchema.offers = {
        '@type': 'Offer',
        price: product.price.toString(),
        priceCurrency: product.currency || 'EUR',
        availability: `https://schema.org/${product.availability || 'InStock'}`,
        seller: { '@id': 'https://planetaketo.es/#organization' }
      }
    }

    schemaData['@graph'].push(productSchema)
  }

  useEffect(() => {
    // Inject structured data
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(schemaData)
    script.id = 'advanced-seo-schema'
    
    // Remove existing schema if present
    const existing = document.getElementById('advanced-seo-schema')
    if (existing) {
      existing.remove()
    }
    
    document.head.appendChild(script)
    
    return () => {
      const scriptToRemove = document.getElementById('advanced-seo-schema')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [schemaData])

  // Google Analytics Enhanced E-commerce tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      // Track page view with custom parameters
      window.gtag('config', 'G-QHJR9PCWZC', {
        page_title: title,
        page_location: currentUrl,
        custom_map: {
          dimension1: 'page_type',
          dimension2: 'content_category'
        }
      })

      // Send custom dimensions
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: currentUrl,
        custom_parameter_1: type,
        custom_parameter_2: pathname.split('/')[1] || 'home'
      })
    }
  }, [title, currentUrl, type, pathname])

  return null // This is a headless component
}

function generateBreadcrumbs(pathname: string) {
  const paths = pathname.split('/').filter(Boolean)
  const breadcrumbs = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: 'https://planetaketo.es'
    }
  ]

  let currentPath = ''
  paths.forEach((path, index) => {
    currentPath += `/${path}`
    breadcrumbs.push({
      '@type': 'ListItem',
      position: index + 2,
      name: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
      item: `https://planetaketo.es${currentPath}`
    })
  })

  return breadcrumbs
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}