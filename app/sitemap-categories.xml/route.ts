import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

// Hardcoded URL to avoid any environment variable conflicts
const SITE_URL = 'https://www.planetaketo.es'

// Categories and taxonomies sitemap
export async function GET() {
  try {
    // Fetch all categories
    const categories = await client.fetch(`
      *[_type == "category" && defined(slug.current)] {
        "slug": slug.current,
        name,
        description,
        _updatedAt,
        _createdAt,
        "recipeCount": count(*[_type == "recipe" && references(^._id)]),
        color,
        icon
      } | order(recipeCount desc)
    `)

    // Generate category-based URLs
    const categoryUrls: Array<{
      url: string
      lastmod: string
      changefreq: string
      priority: string
    }> = []
    
    // Main category pages
    categories.forEach((category: any) => {
      if (category.recipeCount > 0) {
        categoryUrls.push({
          url: `/categoria/${category.slug}`,
          lastmod: category._updatedAt || category._createdAt,
          changefreq: 'weekly',
          priority: category.recipeCount > 10 ? '0.8' : '0.6'
        })
      }
    })

    // Recipe type variations for high-value SEO
    const recipeTypes = [
      'faciles',
      'rapidas', 
      'para-principiantes',
      'sin-horno',
      'con-pocos-ingredientes',
      'economicas',
      'vegetarianas',
      'postres',
      'desayunos',
      'cenas',
      'snacks'
    ]

    categories.forEach((category: any) => {
      if (category.recipeCount > 5) {
        recipeTypes.forEach(type => {
          categoryUrls.push({
            url: `/recetas-${category.slug}-${type}`,
            lastmod: new Date().toISOString(),
            changefreq: 'monthly',
            priority: '0.7'
          })
        })
      }
    })

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${categoryUrls.map(item => `  <url>
    <loc>${SITE_URL}${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
    <xhtml:link rel="alternate" hreflang="es-ES" href="${SITE_URL}${item.url}" />
    <xhtml:link rel="alternate" hreflang="es-MX" href="${SITE_URL}${item.url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${item.url}" />
  </url>`).join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate=604800', // 1 day cache
      },
    })
  } catch (error) {
    console.error('Error generating categories sitemap:', error)
    return new NextResponse('Error generating categories sitemap', { status: 500 })
  }
}

export const dynamic = 'force-dynamic'