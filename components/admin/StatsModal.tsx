'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, TrendingUp, Users, Star, MessageCircle, Eye, Calendar, ChefHat, ShoppingCart } from 'lucide-react';

interface ToastProps {
  message: string
  type: 'error' | 'success'
  onClose: () => void
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      type === 'error' ? 'bg-red-500' : 'bg-green-500'
    } text-white max-w-md`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StatsData {
  totalRecipes: number;
  totalCategories: number;
  totalComments: number;
  totalProducts: number;
  totalServices: number;
  totalBlogPosts: number;
  avgRating: number;
  totalRatings: number;
  recentActivity: {
    newRecipes: number;
    newComments: number;
    newRatings: number;
  };
  topCategories: Array<{
    name: string;
    count: number;
    icon: string;
  }>;
  topRatedRecipes: Array<{
    name: string;
    rating: number;
    totalRatings: number;
  }>;
}

export default function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  // Focus management and keyboard handling
  useEffect(() => {
    if (!isOpen) return

    const timer = setTimeout(() => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus()
      }
    }, 100)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Fetch real stats from API
      const response = await fetch('/api/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const statsData = await response.json();
      
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
      setToast({ message: 'Error al cargar las estadísticas', type: 'error' })
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            ref={modalRef}
            className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="modal-title" className="text-2xl font-bold">Estadísticas del Sitio</h2>
                <p className="text-blue-100 mt-1">Análisis completo de Planeta Keto</p>
              </div>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                aria-label="Cerrar modal"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : stats ? (
              <div className="space-y-8">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Total Recetas</p>
                        <p className="text-3xl font-bold">{stats.totalRecipes}</p>
                      </div>
                      <ChefHat size={32} className="text-green-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-2xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Comentarios</p>
                        <p className="text-3xl font-bold">{stats.totalComments}</p>
                      </div>
                      <MessageCircle size={32} className="text-blue-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 rounded-2xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100 text-sm">Rating Promedio</p>
                        <p className="text-3xl font-bold">{stats.avgRating.toFixed(1)}</p>
                      </div>
                      <Star size={32} className="text-yellow-200 fill-current" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-2xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Productos</p>
                        <p className="text-3xl font-bold">{stats.totalProducts}</p>
                      </div>
                      <ShoppingCart size={32} className="text-purple-200" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                    Actividad Reciente (últimos 7 días)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <p className="text-2xl font-bold text-green-600">{stats.recentActivity.newRecipes}</p>
                      <p className="text-green-700 text-sm">Nuevas Recetas</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <p className="text-2xl font-bold text-blue-600">{stats.recentActivity.newComments}</p>
                      <p className="text-blue-700 text-sm">Nuevos Comentarios</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-xl">
                      <p className="text-2xl font-bold text-yellow-600">{stats.recentActivity.newRatings}</p>
                      <p className="text-yellow-700 text-sm">Nuevas Valoraciones</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Top Categories */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Categorías Más Populares</h3>
                    <div className="space-y-3">
                      {stats.topCategories.map((category, index) => (
                        <div key={category.name} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-lg mr-3">
                              {category.icon}
                            </div>
                            <span className="font-medium text-gray-800">{category.name}</span>
                          </div>
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {category.count} recetas
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Rated Recipes */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recetas Mejor Valoradas</h3>
                    <div className="space-y-3">
                      {stats.topRatedRecipes.map((recipe, index) => (
                        <div key={recipe.name} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm">{recipe.name}</p>
                            <p className="text-gray-500 text-xs">{recipe.totalRatings} valoraciones</p>
                          </div>
                          <div className="flex items-center">
                            <Star size={16} className="text-yellow-400 fill-current mr-1" />
                            <span className="font-bold text-gray-800">{recipe.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                    <Calendar className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBlogPosts}</p>
                    <p className="text-gray-600">Posts del Blog</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                    <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
                    <p className="text-gray-600">Servicios</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                    <Eye className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-gray-900">{stats.totalRatings}</p>
                    <p className="text-gray-600">Total Valoraciones</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                <p>No se pudieron cargar las estadísticas</p>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </>
  );
}