import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

const SITE_URL = process.env.SITE_URL || 'https://planetaketo.es'

// Recipes sitemap with image data for Google Images SEO
export async function GET() {
  try {
    // Fetch all published recipes with comprehensive data
    const recipes = await client.fetch(`
      *[_type == "recipe" && defined(slug.current) && !(_id in path('drafts.**'))] {
        "slug": slug.current,
        title,
        description,
        _updatedAt,
        _createdAt,
        publishedAt,
        image{
          asset->{
            _id,
            url,
            metadata{
              dimensions{
                width,
                height
              }
            }
          },
          alt
        },
        "imageUrl": image.asset->url,
        "imageAlt": coalesce(image.alt, title),
        prepTime,
        cookTime,
        servings,
        difficulty,
        tags,
        category->{
          name,
          "slug": slug.current
        }
      } | order(coalesce(publishedAt, _createdAt) desc)
    `)

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${recipes.map((recipe: any) => {
  const lastmod = recipe._updatedAt || recipe._createdAt || new Date().toISOString()
  
  return `  <url>
    <loc>${SITE_URL}/recetas/${recipe.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="es-ES" href="${SITE_URL}/recetas/${recipe.slug}" />
    <xhtml:link rel="alternate" hreflang="es-MX" href="${SITE_URL}/recetas/${recipe.slug}" />
    <xhtml:link rel="alternate" hreflang="es-AR" href="${SITE_URL}/recetas/${recipe.slug}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/recetas/${recipe.slug}" />
${recipe.imageUrl ? `    <image:image>
      <image:loc>${recipe.imageUrl}</image:loc>
      <image:title>${recipe.title}</image:title>
      <image:caption>${recipe.imageAlt || recipe.title}</image:caption>
      <image:geo_location>España</image:geo_location>
      <image:license>${SITE_URL}/recetas/${recipe.slug}</image:license>
    </image:image>` : ''}
  </url>`
}).join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400', // 1 hour cache, 1 day stale
      },
    })
  } catch (error) {
    console.error('Error generating recipes sitemap:', error)
    return new NextResponse('Error generating recipes sitemap', { status: 500 })
  }
}

export const dynamic = 'force-dynamic'