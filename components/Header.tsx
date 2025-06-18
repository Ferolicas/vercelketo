import Image from 'next/image'
import Link from 'next/link'
import { Youtube, Mail, ExternalLink } from 'lucide-react'
import { urlFor } from '@/lib/sanity'
import { HomePage } from '@/types/sanity'

interface HeaderProps {
  homePageData: HomePage
}

export default function Header({ homePageData }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-emerald-600 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - 30% del ancho */}
          <div className="w-[30%] flex justify-center">
            <Link href="/" className="block">
              {homePageData.heroImage && (
                <div className="relative w-16 h-16 md:w-20 md:h-20">
                  <Image
                    src={urlFor(homePageData.heroImage).width(80).height(80).url()}
                    alt="Logo"
                    fill
                    className="object-cover rounded-full"
                    priority
                  />
                </div>
              )}
            </Link>
          </div>

          {/* Título y Enlaces - 70% del ancho */}
          <div className="w-[70%] flex flex-col items-start pl-4">
            {/* Título del sitio */}
            <Link href="/" className="block mb-3">
              <h1 className="text-white text-xl md:text-2xl font-bold hover:text-emerald-100 transition-colors">
                {homePageData.siteTitle}
              </h1>
            </Link>

            {/* Iconos de redes sociales */}
            <div className="flex items-center space-x-4">
              {/* YouTube */}
              {homePageData.youtubeUrl && (
                <a
                  href={homePageData.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-red-300 transition-colors"
                  title="YouTube"
                >
                  <Youtube size={20} />
                </a>
              )}

              {/* Email */}
              {homePageData.email && (
                <a
                  href={`mailto:${homePageData.email}`}
                  className="text-white hover:text-blue-300 transition-colors"
                  title="Email"
                >
                  <Mail size={20} />
                </a>
              )}

              {/* Hotmart */}
              {homePageData.hotmartUrl && (
                <a
                  href={homePageData.hotmartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-purple-300 transition-colors"
                  title="Hotmart"
                >
                  <ExternalLink size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}