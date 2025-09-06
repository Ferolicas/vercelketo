/** @type {import('next-sitemap').IConfig} */

const siteUrl = process.env.SITE_URL || 'https://planetaketo.es';

module.exports = {
  siteUrl,
  generateRobotsTxt: true, // Generate robots.txt
  generateIndexSitemap: false, // Don't generate separate index sitemap
  
  // Sitemap configuration for better SEO
  changefreq: 'daily',
  priority: 0.7,
  
  // Custom robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/test/', '/preview/', '/_next/']
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/test/', '/preview/']
      }
    ],
    additionalSitemaps: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/server-sitemap-index.xml`, // For dynamic content
    ]
  },

  // Static pages configuration
  transform: async (config, path) => {
    // Custom priority and changefreq for different page types
    const customConfig = {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: [
        {
          href: `${siteUrl}${path}`,
          hreflang: 'es',
        },
        {
          href: `${siteUrl}${path}`,
          hreflang: 'es-ES',
        },
        {
          href: `${siteUrl}${path}`,
          hreflang: 'es-MX',
        },
        {
          href: `${siteUrl}${path}`,
          hreflang: 'es-AR',
        },
        {
          href: `${siteUrl}${path}`,
          hreflang: 'es-CO',
        }
      ]
    };

    // High priority pages
    if (
      path === '/' ||
      path === '/recetas' ||
      path === '/dieta-keto' ||
      path === '/bajar-de-peso'
    ) {
      customConfig.priority = 1.0;
      customConfig.changefreq = 'daily';
    }
    
    // Recipe category pages
    else if (
      path.includes('/recetas-keto') ||
      path.includes('/recetas-saludables') ||
      path.includes('/dieta-cetogenica')
    ) {
      customConfig.priority = 0.9;
      customConfig.changefreq = 'weekly';
    }
    
    // Blog and forum pages
    else if (path.includes('/blog') || path.includes('/foro')) {
      customConfig.priority = 0.8;
      customConfig.changefreq = 'daily';
    }
    
    // Product and service pages
    else if (
      path.includes('/productos-y-servicios') || 
      path.includes('/tienda-keto') ||
      path.includes('/afiliados')
    ) {
      customConfig.priority = 0.7;
      customConfig.changefreq = 'weekly';
    }
    
    // Individual recipe pages (dynamic content)
    else if (path.includes('/recetas/')) {
      customConfig.priority = 0.8;
      customConfig.changefreq = 'weekly';
    }
    
    // Forum individual posts
    else if (path.includes('/foro/')) {
      customConfig.priority = 0.6;
      customConfig.changefreq = 'monthly';
    }

    return customConfig;
  },

  // Additional paths that should be included
  additionalPaths: async (config) => {
    const additionalPaths = [];

    // High-value SEO landing pages
    const seoPages = [
      {
        loc: '/recetas-keto-faciles-principiantes',
        priority: 0.9,
        changefreq: 'weekly'
      },
      {
        loc: '/menu-keto-semanal-completo',
        priority: 0.9,
        changefreq: 'weekly'
      },
      {
        loc: '/alimentos-keto-permitidos-lista',
        priority: 0.9,
        changefreq: 'monthly'
      },
      {
        loc: '/dieta-keto-resultados-antes-despues',
        priority: 0.8,
        changefreq: 'monthly'
      },
      {
        loc: '/calculadora-macros-keto-gratis',
        priority: 0.8,
        changefreq: 'monthly'
      },
      {
        loc: '/plan-keto-30-dias-gratis',
        priority: 0.9,
        changefreq: 'weekly'
      }
    ];

    // Add SEO landing pages
    for (const page of seoPages) {
      additionalPaths.push({
        loc: page.loc,
        changefreq: page.changefreq,
        priority: page.priority,
        lastmod: new Date().toISOString(),
        alternateRefs: [
          {
            href: `${siteUrl}${page.loc}`,
            hreflang: 'es',
          },
          {
            href: `${siteUrl}${page.loc}`,
            hreflang: 'es-ES',
          }
        ]
      });
    }

    // Dynamic content would be handled by server-sitemap-index.xml
    // This includes recipes, forum posts, blog articles from Sanity CMS

    return additionalPaths;
  },

  // Exclude certain paths
  exclude: [
    '/admin/*',
    '/api/*',
    '/test/*',
    '/preview/*',
    '/404',
    '/500',
    '/_*',
    '/complete-order',
    '/test-*'
  ]
};