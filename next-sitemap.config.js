/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://planetaketo.es',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/_next'],
      },
      {
        userAgent: '*',
        allow: '/api/comments',
      }
    ],
    additionalSitemaps: [
      'https://planetaketo.es/sitemap.xml',
      'https://planetaketo.es/server-sitemap.xml',
    ],
  },
  exclude: ['/admin/*', '/api/*'],
  generateIndexSitemap: false,
  transform: async (config, path) => {
    // Personalizar URLs por tipo de contenido
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      }
    }
    
    if (path.includes('/categorias/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      }
    }
    
    if (path.includes('/recetas')) {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      }
    }
    
    if (path.includes('/servicios') || path.includes('/productos')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }

    return {
      loc: path,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }
  },
}