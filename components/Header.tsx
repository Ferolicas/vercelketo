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
      <div className="container mx-auto" style={{ padding: 'clamp(0.75rem, 2vw, 1.5rem) clamp(1rem, 3vw, 2rem)' }}>
        <div className="flex items-center" style={{ height: 'clamp(4rem, 12vh, 8rem)' }}>
          <div className="flex-shrink-0" style={{ marginRight: 'clamp(1rem, 3vw, 2rem)' }}>
            {homePageData.heroImage && (
              <Link href="/">
                <div className="relative cursor-pointer" style={{
                  width: 'clamp(5rem, 25vw, 8rem)',
                  height: 'clamp(5rem, 25vw, 8rem)'
                }}>
                  <Image
                    src={urlFor(homePageData.heroImage).width(150).height(150).url()}
                    alt="Logo Planeta Keto - Recetas Cetogénicas"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <Link href="/">
              <h1 className="font-bold text-white leading-tight cursor-pointer hover:text-emerald-100 transition-colors text-center" style={{
                fontSize: 'clamp(1.8rem, 8vw, 3.5rem)',
                marginBottom: 'clamp(0.5rem, 1.5vh, 1rem)'
              }}>
                {homePageData.siteTitle || 'Planeta Keto'}
              </h1>
            </Link>

            <div className="flex justify-center" style={{ gap: 'clamp(0.75rem, 2.5vw, 1.5rem)' }}>
              {homePageData.youtubeUrl && (
                <Link 
                  href={homePageData.youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-red-300 transition-colors"
                >
                  <Youtube style={{ width: 'clamp(2rem, 4vw, 3.2rem)', height: 'clamp(2rem, 4vw, 2.6rem)' }} />
                </Link>
              )}

              {homePageData.email && (
                <Link 
                  href={`mailto:${homePageData.email}`}
                  className="text-white hover:text-blue-300 transition-colors"
                >
                  <Mail style={{ width: 'clamp(2rem, 4vw, 3.2rem)', height: 'clamp(2rem, 4vw, 2.6rem)' }} />
                </Link>
              )}

              <Link 
                href="#" 
                className="text-white hover:text-yellow-300 transition-colors"
              >
                <ShoppingCart style={{ width: 'clamp(2rem, 4vw, 3.2rem)', height: 'clamp(2rem, 4vw, 2.6rem)' }} />
              </Link>

              {homePageData.hotmartUrl && (
                <Link 
                  href={homePageData.hotmartUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-orange-300 transition-colors"
                >
                  <ExternalLink style={{ width: 'clamp(2rem, 4vw, 3.2rem)', height: 'clamp(2rem, 4vw, 2.6rem)' }} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}