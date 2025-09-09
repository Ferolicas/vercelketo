import { NextResponse } from 'next/server'

const SITE_URL = process.env.SITE_URL || 'https://planetaketo.es'

// Static pages sitemap
export async function GET() {
  try {
    const staticPages = [
      {
        url: '/',
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '1.0'
      },
      {
        url: '/recetas',
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '0.9'
      },
      {
        url: '/productos-y-servicios',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.9'
      },
      {
        url: '/blog',
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '0.8'
      },
      {
        url: '/foro',
        lastmod: new Date().toISOString(),
        changefreq: 'hourly',
        priority: '0.8'
      },
      {
        url: '/recetas-keto',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        url: '/recetas-saludables',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        url: '/dieta-keto',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        url: '/dieta-cetogenica',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        url: '/dieta-baja-carbohidratos',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.7'
      },
      {
        url: '/bajar-de-peso',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        url: '/quemar-grasa',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        url: '/tienda-keto',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.7'
      },
      {
        url: '/afiliados',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.6'
      },
      // High-value SEO landing pages
      {
        url: '/guia-completa-dieta-keto-2025',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.9'
      },
      {
        url: '/libro-keto-2025',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.9'
      },
      {
        url: '/menu-keto-semanal-gratis-2025',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.9'
      },
      {
        url: '/recetas-keto-faciles-rapidas-2025',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.9'
      }
    ]

    // Multi-language support for better international SEO
    const languages = [
      { code: 'es', country: 'ES' },
      { code: 'es', country: 'MX' },
      { code: 'es', country: 'AR' },
      { code: 'es', country: 'CO' },
      { code: 'es', country: 'CL' },
      { code: 'es', country: 'PE' }
    ]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${staticPages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${languages.map(lang => 
    `    <xhtml:link rel="alternate" hreflang="${lang.code}-${lang.country}" href="${SITE_URL}${page.url}" />`
).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${page.url}" />
  </url>`).join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate=604800', // 1 day cache, 1 week stale
      },
    })
  } catch (error) {
    console.error('Error generating static sitemap:', error)
    return new NextResponse('Error generating static sitemap', { status: 500 })
  }
}

export const dynamic = 'force-dynamic'