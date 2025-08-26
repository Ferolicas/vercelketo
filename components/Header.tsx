// components/Header.tsx
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { Youtube, Mail, ShoppingCart, Share2 } from 'lucide-react'

interface HeaderProps {
  homePageData?: any | null;
  onShareClick?: () => void;
  showShareButton?: boolean;
}

export function Header({ homePageData, onShareClick, showShareButton = false }: HeaderProps) {
  const logoUrl = homePageData?.heroImage ? urlFor(homePageData.heroImage).url() : '/default-logo.png';
  
  return (
    <header className="sticky top-0 z-50 w-full bg-emerald-600 shadow-md shadow-black px-2 rounded-4xl">
      <div className="flex items-center justify-between" style={{ minHeight: '80px', maxHeight: '100px' }}>
        {/* Izquierda: Logo */}
        <div className="flex-shrink-0 h-full flex items-center">
          {logoUrl && (
            <Link href="/">
              <div className="relative cursor-pointer w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full overflow-hidden">
                <Image
                  src={logoUrl}
                  alt="Logo Planeta Keto"
                  fill
                  sizes="(max-width: 768px) 56px, 64px"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </Link>
          )}
        </div>

        {/* Centro: Texto "Planeta KETO" */}
        <div className="flex-grow text-center mx-4 overflow-hidden">
          <Link href="/">
            <h1 className="font-bold text-white leading-tight cursor-pointer hover:text-emerald-100 transition-colors truncate"
                style={{ fontSize: 'clamp(2em, 3.5vw, 1.8rem)' }}>
              {homePageData?.siteTitle || 'Planeta Keto'}
            </h1>
          </Link>
        </div>

        {/* === SECCIÓN MODIFICADA === */}
        {/* Derecha: Iconos y botón de compartir con el nuevo estilo */}
        <div className="flex-shrink-0 flex items-center space-x-2 sm:space-x-3">
          {/* Botón de compartir en el Header, solo si showShareButton es true */}
          {showShareButton && onShareClick && (
            <button
              onClick={onShareClick}
              // --- CAMBIO AQUÍ ---
              // Cambiamos duration-300 por duration-500 para una transición de 0.5s
              className="text-white font-bold px-2 rounded-full flex items-center space-x-2 transition-all duration-700 transform hover:scale-105 hover:text-blue-800"
              aria-label="Compartir esta receta"
            >
              <Share2 className="w-5 h-5" />
            </button>
          )}
          {/* Aquí irían los otros iconos si los tienes, como Mail, YouTube, etc. */}
        </div>
        {/* === FIN DE LA SECCIÓN MODIFICADA === */}

      </div>
    </header>
  )
}