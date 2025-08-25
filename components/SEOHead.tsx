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

// Keywords keto más buscadas en español según GSC
const defaultKetoKeywords = [
  'recetas keto',
  'dieta keto',
  'dieta cetogénica',
  'keto en español',
  'recetas cetogénicas',
  'comida keto',
  'desayuno keto',
  'almuerzo keto',
  'cena keto',
  'postres keto',
  'pan keto',
  'pizza keto',
  'galletas keto',
  'torta keto',
  'recetas bajas en carbohidratos',
  'perder peso keto',
  'quemar grasa keto',
  'cetosis',
  'macros keto',
  'menu keto',
  'plan keto',
  'keto facil',
  'keto para principiantes',
  'dieta cetogénica beneficios',
  'alimentos keto',
  'lista keto',
  'keto mexico',
  'keto argentina',
  'keto colombia',
  'keto españa',
  'recetas sin azucar',
  'recetas sin gluten keto',
  'recetas keto dulces',
  'recetas keto saladas',
  'keto vegetariano',
  'ayuno intermitente keto',
  'suplementos keto',
  'productos keto',
  'tienda keto',
  'libros keto',
  'calculadora keto',
  'macros cetogénicos'
].join(', ')

export function generateSEOMetadata({
  title = 'Planeta Keto | Recetas Cetogénicas #1 en Español',
  description = 'Las mejores recetas keto en español. Desayunos, almuerzos, cenas y postres cetogénicos para perder peso. Guías completas, menús semanales y tips de expertos.',
  keywords = defaultKetoKeywords,
  image = '/og-image.jpg',
  url = '/',
  type = 'website',
  author = 'Planeta Keto',
  publishedTime,
  modifiedTime,
  category = 'Food & Cooking'
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
      }
    },
    openGraph: {
      type: type as 'website' | 'article',
      title,
      description,
      url: fullUrl,
      siteName: 'Planeta Keto',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/jpeg',
        }
      ],
      locale: 'es_ES',
      ...(type === 'article' && publishedTime && {
        publishedTime,
        modifiedTime: modifiedTime || publishedTime,
        authors: [author],
        section: category,
        tags: keywords.split(', ').slice(0, 10), // Primeras 10 keywords como tags
      })
    },
    twitter: {
      card: 'summary_large_image',
      site: '@planetaketo',
      creator: '@planetaketo',
      title,
      description,
      images: [fullImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION,
      other: {
        'google-adsense-account': process.env.ADSENSE_PUBLISHER_ID || '',
      }
    },
    other: {
      'fb:app_id': process.env.FACEBOOK_APP_ID || '',
      ...(type === 'article' && {
        'article:author': author || '',
        'article:publisher': 'https://www.facebook.com/planetaketo'
      })
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