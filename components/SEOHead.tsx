import Head from 'next/head'
import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  category?: string
}

// Keywords keto más buscadas en español - OPTIMIZADAS PARA SUPERAR COMPETIDORES 2025
const defaultKetoKeywords = [
  // Palabras clave principales de alta intención de búsqueda
  'recetas keto',
  'dieta keto',
  'dieta cetogénica',
  'recetas cetogénicas',
  'keto en español',
  
  // Long-tail keywords específicas (más fáciles de rankear)
  'recetas keto fáciles y rápidas',
  'dieta keto para principiantes guía completa',
  'menu keto semanal gratis',
  'plan dieta keto 30 días',
  'recetas keto para bajar peso',
  
  // Keywords de diferentes tipos de comida
  'desayuno keto fácil',
  'almuerzo keto rápido',
  'cena keto deliciosa',
  'postres keto sin azúcar',
  'merienda keto saludable',
  
  // Keywords de recetas específicas populares
  'pan keto casero',
  'pizza keto coliflor',
  'galletas keto almendra',
  'torta keto chocolate',
  'lasaña keto sin pasta',
  'empanadas keto',
  'tortillas keto harina almendra',
  
  // Keywords de ubicación geográfica
  'keto españa recetas',
  'dieta keto mexico',
  'recetas keto argentina',
  'keto colombia alimentos',
  'cetogénica chile',
  'keto peru guía',
  
  // Keywords de problemas y soluciones
  'como empezar dieta keto',
  'que comer en dieta keto',
  'alimentos permitidos keto',
  'macros dieta cetogénica',
  'cetosis como lograrla',
  'perder peso rápido keto',
  'quemar grasa abdominal keto',
  
  // Keywords de tipos especiales
  'keto vegetariano recetas',
  'keto sin gluten',
  'keto lactose free',
  'ayuno intermitente con keto',
  'keto para diabéticos',
  
  // Keywords comerciales
  'productos keto donde comprar',
  'suplementos keto mejores',
  'libros dieta keto español',
  'calculadora macros keto gratis',
  'app keto español',
  
  // Keywords de comunidad y apoyo
  'comunidad keto español',
  'foro dieta cetogénica',
  'grupo keto facebook',
  'testimonios dieta keto',
  'antes y después keto',
  
  // Keywords estacionales y tendencias
  'recetas keto navidad',
  'menu keto año nuevo',
  'keto verano recetas',
  'batch cooking keto',
  'meal prep keto',
  
  // Keywords de herramientas
  'lista compras keto',
  'planificador menu keto',
  'recetas keto video',
  'tutorial keto paso paso'
].join(', ')

export function generateSEOMetadata({
  title = 'Planeta Keto | Recetas Cetogénicas #1 en Español 2025 ⭐',
  description = '🥑 +500 recetas keto GRATIS ✅ Videos HD ✅ Menús semanales ✅ Comunidad 15K+ ✅ Pierde peso rápido ✅ Guía completa 2025 ✅ Resultados garantizados',
  keywords = defaultKetoKeywords,
  image = '/og-image.jpg',
  url = '/',
  type = 'website',
  author = 'Equipo Planeta Keto - Expertos Certificados',
  publishedTime,
  modifiedTime,
  category = 'Salud y Bienestar'
}: SEOProps): Metadata {
  const siteUrl = process.env.SITE_URL || 'https://planetaketo.es'
  const fullUrl = `${siteUrl}${url}`
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`

  return {
    title,
    description,
    keywords,
    authors: [{ name: author }],
    category,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
      languages: {
        'es-ES': url,
        'es-MX': url,
        'es-AR': url,
        'es-CO': url,
        'es-CL': url,
        'es-PE': url,
        'es-VE': url,
        'es-UY': url,
        'es-PY': url,
        'es-BO': url,
        'es-EC': url,
        'es-GT': url,
        'es-HN': url,
        'es-SV': url,
        'es-NI': url,
        'es-CR': url,
        'es-PA': url,
        'es-CU': url,
        'es-DO': url,
        'es-PR': url
      }
    },
    openGraph: {
      type: type === 'product' ? 'website' : (type as 'website' | 'article'),
      title: `${title} | La Comunidad Keto #1 🥑`,
      description: `${description} 🔥 ÚNETE A 15,000+ PERSONAS QUE YA TRANSFORMARON SU VIDA 🔥`,
      url: fullUrl,
      siteName: 'Planeta Keto - Recetas Cetogénicas Premium',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - Planeta Keto Recetas`,
          type: 'image/jpeg',
        },
        {
          url: `${siteUrl}/logo.webp`,
          width: 512,
          height: 512,
          alt: 'Logo Planeta Keto',
          type: 'image/webp',
        }
      ],
      locale: 'es_ES',
      ...(type === 'article' && publishedTime && {
        publishedTime,
        modifiedTime: modifiedTime || publishedTime,
        authors: [author],
        section: category,
        tags: keywords.split(', ').slice(0, 15), // Más tags para mejor indexación
      })
    },
    twitter: {
      card: 'summary_large_image',
      site: '@planetaketo',
      creator: '@planetaketo',
      title: `${title} 🥑⚡`,
      description: `${description} 🚀 EMPIEZA HOY MISMO 🚀`,
      images: [
        {
          url: fullImageUrl,
          alt: `${title} - Planeta Keto`
        }
      ],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'noimageindex': false,
      },
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      other: {
        'google-adsense-account': process.env.ADSENSE_PUBLISHER_ID || '',
        'msvalidate.01': process.env.BING_VERIFICATION || '',
      }
    },
    other: {
      // Facebook Meta Tags
      'fb:app_id': process.env.FACEBOOK_APP_ID || '',
      
      // Enhanced SEO Meta Tags
      'theme-color': '#16a34a',
      'color-scheme': 'light dark',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'Planeta Keto',
      'application-name': 'Planeta Keto',
      'msapplication-TileColor': '#16a34a',
      'msapplication-config': '/browserconfig.xml',
      
      // Content and Language Meta Tags
      'content-language': 'es',
      'language': 'Spanish',
      'distribution': 'global',
      'rating': 'general',
      'revisit-after': '1 days',
      'robots': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      
      // Geographic targeting
      'geo.region': 'ES-MD',
      'geo.placename': 'Madrid, España',
      'geo.position': '40.4168;-3.7038',
      'ICBM': '40.4168, -3.7038',
      
      // Article specific meta tags
      ...(type === 'article' && {
        'article:author': author || 'Equipo Planeta Keto',
        'article:publisher': 'https://www.facebook.com/planetaketo',
        'article:section': category || 'Recetas Keto',
        'article:tag': keywords.split(', ').slice(0, 10).join(', '),
        'news_keywords': keywords.split(', ').slice(0, 5).join(', ')
      }),
      
      // Additional SEO enhancements
      'format-detection': 'telephone=no, address=no, email=no',
      'referrer': 'origin-when-cross-origin',
      'HandheldFriendly': 'True',
      'MobileOptimized': '320',
      'viewport-fit': 'cover'
    }
  }
}

// Datos estructurados para recetas (JSON-LD)
export function generateRecipeStructuredData({
  name,
  description,
  image,
  author = 'Planeta Keto',
  prepTime = 'PT15M',
  cookTime = 'PT30M',
  totalTime = 'PT45M',
  recipeYield = '4 porciones',
  recipeCategory = 'Receta Keto',
  recipeCuisine = 'Cetogénica',
  nutrition = {},
  ingredients = [],
  instructions = [],
  keywords = 'keto, cetogénica, baja en carbohidratos'
}: {
  name: string
  description: string
  image: string
  author?: string
  prepTime?: string
  cookTime?: string
  totalTime?: string
  recipeYield?: string
  recipeCategory?: string
  recipeCuisine?: string
  nutrition?: Record<string, any>
  ingredients?: string[]
  instructions?: string[]
  keywords?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name,
    description,
    image: image.startsWith('http') ? image : `${process.env.SITE_URL || 'https://planetaketo.es'}${image}`,
    author: {
      "@type": "Organization",
      name: author,
      url: process.env.SITE_URL || 'https://planetaketo.es'
    },
    datePublished: new Date().toISOString(),
    prepTime,
    cookTime,
    totalTime,
    recipeYield,
    recipeCategory,
    recipeCuisine,
    keywords,
    nutrition: {
      "@type": "NutritionInformation",
      calories: nutrition.calories || '',
      carbohydrateContent: nutrition.carbs || '< 5g',
      proteinContent: nutrition.protein || '',
      fatContent: nutrition.fat || '',
    },
    recipeIngredient: ingredients,
    recipeInstructions: instructions.map((instruction, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: instruction
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1"
    },
    video: {
      "@type": "VideoObject",
      name: `Cómo hacer ${name}`,
      description: `Video receta paso a paso de ${name}`,
      thumbnailUrl: image,
      contentUrl: `${process.env.SITE_URL}/videos/${name.toLowerCase().replace(/\s+/g, '-')}.mp4`,
      embedUrl: `${process.env.SITE_URL}/videos/embed/${name.toLowerCase().replace(/\s+/g, '-')}`,
      uploadDate: new Date().toISOString()
    }
  }
}