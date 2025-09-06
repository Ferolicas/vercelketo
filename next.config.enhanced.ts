import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Core performance optimizations
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  
  // Enhanced webpack configuration for performance
  webpack: (config: any, { dev, isServer }) => {
    // Exclude sanity-studio from build
    config.module.rules.push({
      test: /\.tsx?$/,
      exclude: /sanity-studio/,
    });

    // Bundle splitting optimizations
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Separate vendor chunks
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 20,
              chunks: 'all',
            },
            // Sanity specific chunk
            sanity: {
              test: /[\\/]node_modules[\\/](@sanity|sanity)[\\/]/,
              name: 'sanity',
              priority: 30,
              chunks: 'all',
            },
            // React and related
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              name: 'react',
              priority: 40,
              chunks: 'all',
            },
            // UI libraries
            ui: {
              test: /[\\/]node_modules[\\/](@heroicons|@headlessui|lucide-react)[\\/]/,
              name: 'ui-libs',
              priority: 25,
              chunks: 'all',
            },
            // Analytics chunk (can be deferred)
            analytics: {
              test: /[\\/]node_modules[\\/](@vercel\/analytics|@stripe)[\\/]/,
              name: 'analytics',
              priority: 10,
              chunks: 'all',
            }
          }
        }
      };
      
      // Tree shaking improvements
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    return config;
  },
  
  // Enhanced image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
    loader: 'default',
  },
  
  // Experimental features for maximum performance
  experimental: {
    // Package optimization for faster builds and smaller bundles
    optimizePackageImports: [
      'lucide-react', 
      '@sanity/client', 
      '@sanity/image-url', 
      '@heroicons/react',
      '@headlessui/react'
    ],
    optimizeCss: true,
    webpackBuildWorker: true,
    // swcMinify: true, // REMOVIDO - ya no es experimental y está habilitado por defecto
    // Optimize server components
    serverComponentsExternalPackages: ['canvas-confetti', '@sanity/client'],
    // Enable partial prerendering for better performance
    ppr: false, // Enable when stable
  },
  
  // External packages for server components
  serverExternalPackages: ['canvas-confetti'],
  
  // Enhanced Turbopack configuration
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Enhanced headers for performance and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // Performance headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ],
      },
      // Static assets caching
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Image assets caching
      {
        source: '/:path*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Font assets caching
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // API routes - no cache
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },

  // Bundle analyzer configuration
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: any, options: any) => {
      const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer')();
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: options.isServer
            ? '../analyze/server.html'
            : './analyze/client.html'
        })
      );
      return config;
    }
  })
}

export default nextConfig