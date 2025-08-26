'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface InternalLink {
  href: string;
  text: string;
  emoji: string;
}

const allLinks: InternalLink[] = [
  { href: '/dieta-keto', text: 'Guía Completa de Dieta Keto', emoji: '🥑' },
  { href: '/recetas-keto', text: 'Recetas Keto Deliciosas', emoji: '👨‍🍳' },
  { href: '/bajar-de-peso', text: 'Cómo Bajar de Peso Rápido', emoji: '⚖️' },
  { href: '/quemar-grasa', text: 'Quemar Grasa Abdominal', emoji: '🔥' },
  { href: '/recetas-saludables', text: 'Recetas Saludables', emoji: '🌱' },
  { href: '/dieta-cetogenica', text: 'Dieta Cetogénica Científica', emoji: '🧬' },
  { href: '/dieta-baja-carbohidratos', text: 'Dieta Baja en Carbohidratos', emoji: '🥬' },
  { href: '/tienda-keto', text: 'Productos Keto Premium', emoji: '🛒' },
  { href: '/blog', text: 'Blog Keto con Consejos', emoji: '📝' },
  { href: '/foro', text: 'Comunidad Keto', emoji: '💬' },
];

interface InternalLinksProps {
  maxLinks?: number;
  excludeCurrentPage?: boolean;
  className?: string;
}

export default function InternalLinks({ 
  maxLinks = 6, 
  excludeCurrentPage = true,
  className = ''
}: InternalLinksProps) {
  const pathname = usePathname();
  
  let filteredLinks = allLinks;
  
  if (excludeCurrentPage) {
    filteredLinks = allLinks.filter(link => link.href !== pathname);
  }
  
  // Randomizar para mostrar diferentes enlaces cada vez
  const shuffled = [...filteredLinks].sort(() => 0.5 - Math.random());
  const selectedLinks = shuffled.slice(0, maxLinks);

  return (
    <div className={`bg-gray-50 rounded-2xl p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        🔗 Explora Más Contenido Keto
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {selectedLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center p-3 bg-white rounded-lg hover:bg-green-50 hover:border-green-200 border border-gray-200 transition-all duration-200 group"
          >
            <span className="text-xl mr-3 group-hover:scale-110 transition-transform">
              {link.emoji}
            </span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
              {link.text}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Componente específico para footer con todas las categorías principales
export function FooterLinks() {
  const mainCategories = allLinks.slice(0, 8);
  
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">🥑 Planeta Keto</h3>
            <p className="text-gray-400 text-sm">
              Tu guía completa para dominar la dieta cetogénica. Recetas, consejos 
              y productos para transformar tu salud.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Guías Principales</h4>
            <div className="space-y-2">
              {mainCategories.slice(0, 4).map(link => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.emoji} {link.text}
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <div className="space-y-2">
              {mainCategories.slice(4, 8).map(link => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.emoji} {link.text}
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Keywords Principales</h4>
            <div className="text-sm text-gray-400 space-y-1">
              <div>• Dieta Keto</div>
              <div>• Recetas Keto</div>
              <div>• Bajar de Peso</div>
              <div>• Quemar Grasa</div>
              <div>• Dieta Cetogénica</div>
              <div>• Recetas Saludables</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Planeta Keto. La guía más completa de dieta cetogénica en español.</p>
        </div>
      </div>
    </footer>
  );
}