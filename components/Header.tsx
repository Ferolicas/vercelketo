// components/Header.tsx
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import type { HomePage } from '@/types/sanity'
import { Youtube, Mail, ShoppingCart, ExternalLink } from 'lucide-react'

interface HeaderProps {
  homePageData: HomePage
}

export function Header({ homePageData }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-emerald-600 shadow-md shadow-black rounded-4xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 mr-6">
            {homePageData.heroImage && (
              <Link href="/">
                <div className="relative w-24 h-24 cursor-pointer">
                <Image
                  src={urlFor(homePageData.heroImage).width(150).height(150).url()}
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            )}
          </div>

          {/* Contenido del sitio */}
          <div className="flex-1 flex flex-col justify-center">
            <Link href="/">
              <h1 className="text-3xl md:text-xl font-bold text-white mb-2 leading-tight cursor-pointer hover:text-emerald-100 transition-colors text-center">
                {homePageData.siteTitle || 'Mi Sitio'}
              </h1>
            </Link>

            {/* Iconos en fila */}
            <div className="flex space-x-3 justify-center">
              {homePageData.youtubeUrl && (
                <Link 
                  href={homePageData.youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-red-300 transition-colors"
                >
                  <Youtube size={40} />
                </Link>
              )}

              {homePageData.email && (
                <Link 
                  href={`mailto:${homePageData.email}`}
                  className="text-white hover:text-blue-300 transition-colors"
                >
                  <Mail size={40} />
                </Link>
              )}

              <Link 
                href="#" 
                className="text-white hover:text-yellow-300 transition-colors"
              >
                <ShoppingCart size={40} />
              </Link>

              {homePageData.hotmartUrl && (
                <Link 
                  href={homePageData.hotmartUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-orange-300 transition-colors"
                >
                  <ExternalLink size={40} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}