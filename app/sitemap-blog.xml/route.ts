import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

const SITE_URL = process.env.SITE_URL || 'https://planetaketo.es'

// Blog posts sitemap
export async function GET() {
  try {
    // Fetch all published blog posts
    const blogPosts = await client.fetch(`
      *[_type == "blogPost" && defined(slug.current) && !(_id in path('drafts.**'))] {
        "slug": slug.current,
        title,
        description,
        _updatedAt,
        _createdAt,
        publishedAt,
        image{
          asset->{
            url
          },
          alt
        },
        "imageUrl": image.asset->url,
        "imageAlt": coalesce(image.alt, title),
        author->{
          name
        },
        categories[]->{
          title,
          "slug": slug.current
        }
      } | order(coalesce(publishedAt, _createdAt) desc)
    `)

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${blogPosts.map((post: any) => {
  const lastmod = post._updatedAt || post._createdAt || new Date().toISOString()
  const publishDate = post.publishedAt || post._createdAt
  const isRecent = new Date(publishDate) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days old
  
  return `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="es-ES" href="${SITE_URL}/blog/${post.slug}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/blog/${post.slug}" />
${post.imageUrl ? `    <image:image>
      <image:loc>${post.imageUrl}</image:loc>
      <image:title>${post.title}</image:title>
      <image:caption>${post.imageAlt || post.title}</image:caption>
    </image:image>` : ''}
${isRecent ? `    <news:news>
      <news:publication>
        <news:name>Planeta Keto</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${publishDate}</news:publication_date>
      <news:title>${post.title}</news:title>
      <news:keywords>dieta keto, recetas cetogénicas, pérdida peso, salud</news:keywords>
    </news:news>` : ''}
  </url>`
}).join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600', // 30 min cache, 1 hour stale
      },
    })
  } catch (error) {
    console.error('Error generating blog sitemap:', error)
    return new NextResponse('Error generating blog sitemap', { status: 500 })
  }
}

export const dynamic = 'force-dynamic'