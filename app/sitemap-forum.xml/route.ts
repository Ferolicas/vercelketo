import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

// Hardcoded URL to avoid any environment variable conflicts
const SITE_URL = 'https://www.planetaketo.es'

// Forum posts sitemap - limited to most important posts
export async function GET() {
  try {
    // Fetch forum posts with engagement metrics for priority calculation
    const forumPosts = await client.fetch(`
      *[_type == "forumPost" && defined(slug.current) && !(_id in path('drafts.**'))] {
        "slug": slug.current,
        title,
        _updatedAt,
        _createdAt,
        publishedAt,
        views,
        upvotes,
        downvotes,
        "commentCount": count(*[_type == "forumComment" && references(^._id)]),
        category->{
          name,
          "slug": slug.current
        },
        tags
      } | order(coalesce(views, 0) desc, coalesce(upvotes, 0) desc, _createdAt desc)[0...500]
    `) // Limit to top 500 forum posts to keep sitemap manageable

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${forumPosts.map((post: any) => {
  const lastmod = post._updatedAt || post._createdAt || new Date().toISOString()
  
  // Calculate priority based on engagement
  const engagement = (post.views || 0) + (post.upvotes || 0) * 5 + (post.commentCount || 0) * 3
  const priority = Math.min(0.7, Math.max(0.3, engagement / 1000))
  
  // Determine changefreq based on activity
  const daysSinceUpdate = (Date.now() - new Date(lastmod).getTime()) / (1000 * 60 * 60 * 24)
  const changefreq = daysSinceUpdate < 7 ? 'daily' : 
                    daysSinceUpdate < 30 ? 'weekly' : 'monthly'
  
  return `  <url>
    <loc>${SITE_URL}/foro/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
    <xhtml:link rel="alternate" hreflang="es-ES" href="${SITE_URL}/foro/${post.slug}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/foro/${post.slug}" />
  </url>`
}).join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600', // 30 min cache due to dynamic nature
      },
    })
  } catch (error) {
    console.error('Error generating forum sitemap:', error)
    return new NextResponse('Error generating forum sitemap', { status: 500 })
  }
}

export const dynamic = 'force-dynamic'