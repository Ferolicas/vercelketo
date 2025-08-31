'use client';

interface SchemaMarkupProps {
  type: 'website' | 'recipe' | 'article' | 'breadcrumbs' | 'organization';
  data: any;
}

export default function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  let schema = {};

  switch (type) {
    case 'organization':
      schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Planeta Keto",
        "url": "https://planetaketo.es",
        "logo": "https://planetaketo.es/logo.webp",
        "description": "La guía más completa de dieta cetogénica en español. Recetas keto, consejos y comunidad para transformar tu vida.",
        "sameAs": [
          "https://www.instagram.com/planetaketo",
          "https://www.facebook.com/planetaketo",
          "https://www.youtube.com/planetaketo"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": "Spanish"
        }
      };
      break;

    case 'website':
      schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Planeta Keto",
        "url": "https://planetaketo.es",
        "description": "Recetas keto, guías de dieta cetogénica y comunidad en español #1",
        "inLanguage": "es",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://planetaketo.es/buscar?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      };
      break;

    case 'recipe':
      schema = {
        "@context": "https://schema.org",
        "@type": "Recipe",
        "name": data.name,
        "description": data.description,
        "image": data.image,
        "author": {
          "@type": "Organization",
          "name": "Planeta Keto"
        },
        "datePublished": data.datePublished,
        "prepTime": `PT${data.preparationTime}M`,
        "cookTime": `PT${data.cookTime || 15}M`,
        "totalTime": `PT${(data.preparationTime || 0) + (data.cookTime || 15)}M`,
        "recipeYield": data.servings,
        "recipeCategory": data.category,
        "recipeCuisine": "Cetogénica",
        "keywords": ["keto", "cetogénica", "bajo carbohidratos", "receta keto", data.category?.toLowerCase()],
        "nutrition": {
          "@type": "NutritionInformation",
          "calories": "Menos de 10g carbohidratos",
          "carbohydrateContent": "< 10g",
          "fatContent": "Alto en grasas saludables"
        },
        "recipeIngredient": data.ingredients,
        "recipeInstructions": data.instructions?.map((instruction: string, index: number) => ({
          "@type": "HowToStep",
          "text": instruction,
          "position": index + 1
        })),
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": data.averageRating || 4.8,
          "reviewCount": data.totalRatings || 25,
          "bestRating": 5,
          "worstRating": 1
        },
        "video": data.youtubeUrl ? {
          "@type": "VideoObject",
          "name": `Cómo hacer: ${data.name}`,
          "description": `Tutorial paso a paso para preparar ${data.name}. Receta keto fácil y deliciosa.`,
          "thumbnailUrl": data.image,
          "contentUrl": data.youtubeUrl,
          "embedUrl": data.youtubeUrl?.replace('watch?v=', 'embed/'),
          "uploadDate": data.datePublished
        } : undefined
      };
      break;

    case 'article':
      schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": data.title,
        "description": data.description,
        "image": data.image,
        "author": {
          "@type": "Organization",
          "name": "Planeta Keto"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Planeta Keto",
          "logo": {
            "@type": "ImageObject",
            "url": "https://planetaketo.es/logo.webp"
          }
        },
        "datePublished": data.datePublished,
        "dateModified": data.dateModified || data.datePublished,
        "mainEntityOfPage": data.url,
        "articleSection": data.category || "Dieta Keto",
        "keywords": data.keywords || ["dieta keto", "cetogénica", "recetas keto", "bajar de peso"],
        "inLanguage": "es"
      };
      break;

    case 'breadcrumbs':
      schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": data.breadcrumbs?.map((crumb: any, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url
        }))
      };
      break;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

// FAQ Schema Component
export function FAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}