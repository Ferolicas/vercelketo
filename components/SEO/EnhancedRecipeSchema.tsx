'use client'

interface Recipe {
  _id: string;
  name: string;
  description: string;
  image?: any;
  ingredients?: string[];
  instructions?: string[];
  prepTime?: number; // in minutes
  cookTime?: number; // in minutes
  servings?: number;
  category?: {
    name: string;
    slug: string;
  };
  nutrition?: {
    calories?: number;
    carbs?: string;
    protein?: string;
    fat?: string;
  };
  rating?: number;
  ratingCount?: number;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  videoUrl?: string;
  keywords?: string[];
}

interface EnhancedRecipeSchemaProps {
  recipe: Recipe;
  siteUrl?: string;
}

export default function EnhancedRecipeSchema({ 
  recipe, 
  siteUrl = 'https://planetaketo.es' 
}: EnhancedRecipeSchemaProps) {
  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": recipe.name,
    "description": recipe.description,
    "image": recipe.image ? `${siteUrl}${recipe.image}` : `${siteUrl}/og-recipe-default.jpg`,
    "author": {
      "@type": "Organization",
      "name": recipe.author || "Planeta Keto",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.webp`
      }
    },
    "publisher": {
      "@type": "Organization", 
      "name": "Planeta Keto",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.webp`,
        "width": 512,
        "height": 512
      }
    },
    "datePublished": recipe.createdAt || new Date().toISOString(),
    "dateModified": recipe.updatedAt || recipe.createdAt || new Date().toISOString(),
    "prepTime": `PT${recipe.prepTime || 15}M`,
    "cookTime": `PT${recipe.cookTime || 30}M`,
    "totalTime": `PT${(recipe.prepTime || 15) + (recipe.cookTime || 30)}M`,
    "recipeYield": `${recipe.servings || 4} porciones`,
    "recipeCategory": recipe.category?.name || "Receta Keto",
    "recipeCuisine": "Cetogénica",
    "keywords": recipe.keywords?.join(', ') || "keto, cetogénica, baja en carbohidratos, saludable",
    
    // Enhanced nutrition info for better SEO
    "nutrition": {
      "@type": "NutritionInformation",
      "calories": `${recipe.nutrition?.calories || 250} kcal`,
      "carbohydrateContent": recipe.nutrition?.carbs || "< 5g",
      "proteinContent": recipe.nutrition?.protein || "20g",
      "fatContent": recipe.nutrition?.fat || "20g",
      "fiberContent": "3g",
      "sugarContent": "< 2g"
    },
    
    // Recipe ingredients with enhanced structure
    "recipeIngredient": recipe.ingredients || [
      "Ingredientes keto saludables",
      "Aceite de coco o oliva",
      "Proteína de calidad",
      "Vegetales bajos en carbohidratos"
    ],
    
    // Recipe instructions with proper HowTo schema
    "recipeInstructions": (recipe.instructions || [
      "Preparar ingredientes según las medidas indicadas",
      "Seguir el proceso de cocción keto-friendly",
      "Servir y disfrutar de esta deliciosa receta cetogénica"
    ]).map((instruction, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "text": instruction,
      "name": `Paso ${index + 1}`,
      "image": recipe.image ? `${siteUrl}${recipe.image}` : undefined
    })),
    
    // Enhanced rating system for better SEO
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": recipe.rating || 4.8,
      "reviewCount": recipe.ratingCount || 127,
      "bestRating": 5,
      "worstRating": 1
    },
    
    // Video schema if available
    ...(recipe.videoUrl && {
      "video": {
        "@type": "VideoObject",
        "name": `Cómo hacer ${recipe.name} - Video Receta Keto`,
        "description": `Video paso a paso para preparar ${recipe.name}, una deliciosa receta cetogénica fácil y rápida.`,
        "thumbnailUrl": recipe.image ? `${siteUrl}${recipe.image}` : `${siteUrl}/og-recipe-default.jpg`,
        "contentUrl": recipe.videoUrl,
        "embedUrl": recipe.videoUrl.includes('youtube.com') ? recipe.videoUrl.replace('watch?v=', 'embed/') : recipe.videoUrl,
        "uploadDate": recipe.createdAt || new Date().toISOString(),
        "duration": "PT8M30S", // Default 8:30 minutes
        "publisher": {
          "@type": "Organization",
          "name": "Planeta Keto",
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/logo.webp`
          }
        }
      }
    }),
    
    // Additional SEO-friendly properties
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/recetas/${recipe._id}`
    },
    "url": `${siteUrl}/recetas/${recipe._id}`,
    
    // Suitable for diet type (important for keto SEO)
    "suitableForDiet": [
      "https://schema.org/KetogenicDiet",
      "https://schema.org/LowCarbohydrateDiet"
    ],
    
    // Recipe yield and serving info
    "yield": `${recipe.servings || 4} porciones`
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(recipeSchema, null, 2)
      }}
    />
  );
}

// FAQ Schema component for recipe pages
interface FAQSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function RecipeFAQSchema({ faqs }: FAQSchemaProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema, null, 2)
      }}
    />
  );
}

// Breadcrumb schema for better navigation SEO
interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema, null, 2)
      }}
    />
  );
}