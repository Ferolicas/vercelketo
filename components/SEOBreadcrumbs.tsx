'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href: string;
}

const pathLabels: Record<string, string> = {
  'dieta-keto': 'Dieta Keto',
  'recetas-keto': 'Recetas Keto', 
  'recetas-saludables': 'Recetas Saludables',
  'bajar-de-peso': 'Bajar de Peso',
  'quemar-grasa': 'Quemar Grasa',
  'dieta-cetogenica': 'Dieta Cetogénica',
  'dieta-baja-carbohidratos': 'Dieta Baja en Carbohidratos',
  'tienda-keto': 'Tienda Keto',
  'blog': 'Blog Keto',
  'foro': 'Foro Keto',
  'productos': 'Productos',
  'servicios': 'Servicios',
  'admin': 'Panel Admin'
};

export default function SEOBreadcrumbs() {
  const pathname = usePathname();
  
  // No mostrar breadcrumbs en la home
  if (pathname === '/') return null;
  
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', href: '/' }
  ];
  
  let currentPath = '';
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`;
    const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({ label, href: currentPath });
  });

  return (
    <nav className="bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 py-3 text-sm">
          {breadcrumbs.map((item, index) => (
            <div key={item.href} className="flex items-center space-x-2">
              {index > 0 && (
                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
              )}
              {index === 0 ? (
                <Link
                  href={item.href as any}
                  className="text-gray-600 hover:text-green-600 flex items-center"
                >
                  <HomeIcon className="h-4 w-4 mr-1" />
                  {item.label}
                </Link>
              ) : index === breadcrumbs.length - 1 ? (
                <span className="text-green-600 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href as any}
                  className="text-gray-600 hover:text-green-600"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}