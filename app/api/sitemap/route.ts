import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

// Dynamic sitemap for recipes and blog posts
export async function GET() {
  try {
    const baseUrl = process.env.SITE_URL || 'https://planetaketo.es';
    
    // Fetch all recipes with their slugs and last modified dates
    const recipes = await client.fetch(`
      *[_type == "recipe" && defined(slug.current)] {
        "slug": slug.current,
        _updatedAt,
        _createdAt,
        category->{
          name,
          "slug": slug.current
        }
      } | order(_updatedAt desc)
    `);

    // Fetch all blog posts
    const blogPosts = await client.fetch(`
      *[_type == "blogPost" && defined(slug.current)] {
        "slug": slug.current,
        _updatedAt,
        _createdAt
      } | order(_updatedAt desc)
    `);

    // Fetch all forum posts
    const forumPosts = await client.fetch(`
      *[_type == "forumPost" && defined(slug.current)] {
        "slug": slug.current,
        _updatedAt,
        _createdAt
      } | order(_updatedAt desc)[0...200]
    `); // Limit forum posts to prevent huge sitemaps

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- Recipe Pages -->
  ${recipes.map((recipe: any) => `
  <url>
    <loc>${baseUrl}/recetas/${recipe.slug}</loc>
    <lastmod>${recipe._updatedAt || recipe._createdAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/recetas/${recipe.slug}" />
    <xhtml:link rel="alternate" hreflang="es-ES" href="${baseUrl}/recetas/${recipe.slug}" />
    <xhtml:link rel="alternate" hreflang="es-MX" href="${baseUrl}/recetas/${recipe.slug}" />
  </url>`).join('')}

  <!-- Blog Posts -->
  ${blogPosts.map((post: any) => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post._updatedAt || post._createdAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/blog/${post.slug}" />
  </url>`).join('')}

  <!-- Forum Posts (Limited) -->
  ${forumPosts.map((post: any) => `
  <url>
    <loc>${baseUrl}/foro/${post.slug}</loc>
    <lastmod>${post._updatedAt || post._createdAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}

  <!-- Category Pages -->
  ${Array.from(new Set(recipes
    .filter((recipe: any) => recipe.category?.slug)
    .map((recipe: any) => recipe.category.slug)
  )).map((categorySlug) => `
  <url>
    <loc>${baseUrl}/categoria/${categorySlug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/categoria/${categorySlug}" />
  </url>`).join('')}

  <!-- High-Value SEO Landing Pages -->
  <url>
    <loc>${baseUrl}/recetas-keto-faciles-principiantes</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/recetas-keto-faciles-principiantes" />
  </url>
  
  <url>
    <loc>${baseUrl}/menu-keto-semanal-completo</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/alimentos-keto-permitidos-lista</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400', // Cache for 1 hour, stale for 1 day
      },
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

// Add this route to your sitemap index
export const dynamic = 'force-dynamic';