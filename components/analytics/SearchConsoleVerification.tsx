'use client'

interface SearchConsoleVerificationProps {
  verificationCode?: string
}

export default function SearchConsoleVerification({ verificationCode }: SearchConsoleVerificationProps) {
  if (!verificationCode) return null

  return (
    <meta name="google-site-verification" content={verificationCode} />
  )
}

// Helper function to generate sitemap submission
export const submitSitemapToSearchConsole = async (siteUrl: string) => {
  // This would typically be done through Google Search Console API
  // For now, we'll provide the manual instructions
  if (process.env.NODE_ENV === 'development') {
    console.log(`
      Para enviar tu sitemap a Google Search Console:
      1. Ve a https://search.google.com/search-console
      2. Selecciona tu propiedad: ${siteUrl}
      3. Ve a Sitemaps en el menú lateral
      4. Añade estas URLs:
         - ${siteUrl}/sitemap.xml
         - ${siteUrl}/server-sitemap-index.xml
    `)
  }
}

// Schema markup for website verification
export const generateWebsiteSchema = (siteUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Planeta Keto",
    "alternateName": "Recetas Keto Gratis",
    "url": siteUrl,
    "description": "La mejor colección de recetas cetogénicas en español. +500 recetas keto gratis, menús semanales y guías completas para la dieta cetogénica.",
    "publisher": {
      "@type": "Organization",
      "name": "Planeta Keto",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.webp`
      },
      "sameAs": [
        "https://facebook.com/planetaketo",
        "https://instagram.com/planetaketo",
        "https://youtube.com/@planetaketo"
      ]
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/buscar?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }
}