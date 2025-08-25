'use client'

import { useState } from 'react';
import Link from 'next/link';
import { 
  HomeIcon,
  ChartBarIcon,
  DocumentPlusIcon,
  CogIcon,
  ShoppingCartIcon,
  ListBulletIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const sidebarItems = [
  { name: 'Dashboard', icon: ChartBarIcon, id: 'dashboard' },
  { name: 'Crear Post', icon: DocumentPlusIcon, id: 'create-post' },
  { name: 'Editar Web', icon: CogIcon, id: 'edit-web' },
  { name: 'Crear Producto', icon: ShoppingCartIcon, id: 'create-product' },
  { name: 'Lista Amazon', icon: ListBulletIcon, id: 'create-amazon' },
];

export default function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar móvil */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center">
                <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-2 rounded-lg mr-3">
                  <span className="text-xl font-bold">🥑</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-xs text-gray-500">Planeta Keto</p>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              ))}
              
              <button
                onClick={onLogout}
                className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                Cerrar Sesión
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <Link href="/" className="flex items-center">
              <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-2 rounded-lg mr-3">
                <span className="text-xl font-bold">🥑</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Planeta Keto</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-6 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            ))}
          </nav>

          <div className="px-6 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header móvil */}
        <div className="sticky top-0 z-40 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white border-b border-gray-200">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Contenido */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}