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
    // Añadir configuración adicional para permitir parámetros de Sanity
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
  },
}

export default nextConfig