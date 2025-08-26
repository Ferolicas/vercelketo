/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://planetaketo.es',
  generateRobotsTxt: false, // Using custom robots.txt
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  
  // Additional paths for high-value SEO keywords
  additionalPaths: async (config) => [
    await config.transform(config, '/dieta-keto', {
      changefreq: 'weekly',
      priority: 0.9,
    }),
    await config.transform(config, '/recetas-keto', {
      changefreq: 'daily',
      priority: 0.9,
    }),
    await config.transform(config, '/recetas-saludables', {
      changefreq: 'daily', 
      priority: 0.9,
    }),
    await config.transform(config, '/dieta-cetogenica', {
      changefreq: 'weekly',
      priority: 0.9,
    }),
    await config.transform(config, '/bajar-de-peso', {
      changefreq: 'weekly',
      priority: 0.8,
    }),
    await config.transform(config, '/quemar-grasa', {
      changefreq: 'weekly',
      priority: 0.8,
    }),
    await config.transform(config, '/dieta-baja-carbohidratos', {
      changefreq: 'weekly',
      priority: 0.8,
    }),
    await config.transform(config, '/tienda-keto', {
      changefreq: 'weekly',
      priority: 0.8,
    }),
  ],

  exclude: ['/admin/*', '/api/*', '/test'],
  generateIndexSitemap: true,
  transform: async (config, path) => {
    // Optimize priority based on content type and SEO value
    let priority = 0.7
    let changefreq = 'weekly'
    
    if (path === '/') {
      priority = 1.0
      changefreq = 'daily'
    } else if (path.includes('/recetas') || path.includes('/categorias')) {
      priority = 0.9
      changefreq = 'daily'
    } else if (path.includes('/blog')) {
      priority = 0.8
      changefreq = 'weekly'  
    } else if (path.includes('/productos') || path.includes('/servicios') || path.includes('/foro')) {
      priority = 0.8
      changefreq = 'weekly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    }
  },
}