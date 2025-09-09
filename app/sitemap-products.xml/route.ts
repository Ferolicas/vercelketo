import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

const SITE_URL = process.env.SITE_URL || 'https://planetaketo.es'

// Products and affiliates sitemap
export async function GET() {
  try {
    // Fetch products and amazon lists
    const [products, amazonLists, affiliates] = await Promise.all([
      client.fetch(`
        *[_type == "product" && defined(slug.current)] {
          "slug": slug.current,
          title,
          description,
          _updatedAt,
          _createdAt,
          price,
          image{
            asset->{
              url
            },
            alt
          },
          "imageUrl": image.asset->url,
          "imageAlt": coalesce(image.alt, title),
          featured
        } | order(featured desc, _createdAt desc)
      `),
      client.fetch(`
        *[_type == "amazonList" && defined(slug.current)] {
          "slug": slug.current,
          title,
          description,
          _updatedAt,
          _createdAt,
          image{
            asset->{
              url
            },
            alt
          },
          "imageUrl": image.asset->url,
          "imageAlt": coalesce(image.alt, title),
          category,
          featured
        } | order(featured desc, _createdAt desc)
      `),
      client.fetch(`
        *[_type == "affiliateList" && defined(slug.current)] {
          "slug": slug.current,
          title,
          description,
          _updatedAt,
          _createdAt,
          image{
            asset->{
              url
            },
            alt
          },
          "imageUrl": image.asset->url,
          "imageAlt": coalesce(image.alt, title),
          featured
        } | order(featured desc, _createdAt desc)
      `)
    ])

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${products.map((product: any) => {
  const lastmod = product._updatedAt || product._createdAt || new Date().toISOString()
  const priority = product.featured ? '0.9' : '0.7'
  
  return `  <url>
    <loc>${SITE_URL}/productos-y-servicios/${product.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="es-ES" href="${SITE_URL}/productos-y-servicios/${product.slug}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/productos-y-servicios/${product.slug}" />
${product.imageUrl ? `    <image:image>
      <image:loc>${product.imageUrl}</image:loc>
      <image:title>${product.title}</image:title>
      <image:caption>${product.imageAlt || product.title}</image:caption>
    </image:image>` : ''}
  </url>`
}).join('\n')}
${amazonLists.map((list: any) => {
  const lastmod = list._updatedAt || list._createdAt || new Date().toISOString()
  const priority = list.featured ? '0.8' : '0.6'
  
  return `  <url>
    <loc>${SITE_URL}/productos-y-servicios/${list.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="es-ES" href="${SITE_URL}/productos-y-servicios/${list.slug}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/productos-y-servicios/${list.slug}" />
${list.imageUrl ? `    <image:image>
      <image:loc>${list.imageUrl}</image:loc>
      <image:title>${list.title}</image:title>
      <image:caption>${list.imageAlt || list.title}</image:caption>
    </image:image>` : ''}
  </url>`
}).join('\n')}
${affiliates.map((affiliate: any) => {
  const lastmod = affiliate._updatedAt || affiliate._createdAt || new Date().toISOString()
  const priority = affiliate.featured ? '0.7' : '0.5'
  
  return `  <url>
    <loc>${SITE_URL}/afiliados/${affiliate.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="es-ES" href="${SITE_URL}/afiliados/${affiliate.slug}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/afiliados/${affiliate.slug}" />
${affiliate.imageUrl ? `    <image:image>
      <image:loc>${affiliate.imageUrl}</image:loc>
      <image:title>${affiliate.title}</image:title>
      <image:caption>${affiliate.imageAlt || affiliate.title}</image:caption>
    </image:image>` : ''}
  </url>`
}).join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400', // 1 hour cache
      },
    })
  } catch (error) {
    console.error('Error generating products sitemap:', error)
    return new NextResponse('Error generating products sitemap', { status: 500 })
  }
}

export const dynamic = 'force-dynamic'