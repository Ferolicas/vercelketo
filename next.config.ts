import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
}

export default nextConfig