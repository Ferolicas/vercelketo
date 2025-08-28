'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, ChefHat, BarChart3, Users, MessageCircle, DollarSign } from 'lucide-react';
import CreateRecipeModal from '@/components/admin/CreateRecipeModal';
import StatsModal from '@/components/admin/StatsModal';
import ModerationModal from '@/components/admin/ModerationModal';
import CreateProductModal from '@/components/admin/CreateProductModal';
import CreatePostModal from '@/components/admin/CreatePostModal';
import CreateServiceModal from '@/components/admin/CreateServiceModal';
import CreateAffiliateListModal from '@/components/admin/CreateAffiliateListModal';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showCreateServiceModal, setShowCreateServiceModal] = useState(false);
  const [showCreateAffiliateListModal, setShowCreateAffiliateListModal] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar si ya está autenticado
    const adminAccess = localStorage.getItem('admin_access');
    if (adminAccess === 'granted') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, recipesRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/recipes')
      ]);

      const categoriesData = await categoriesRes.json();
      const recipesData = await recipesRes.json();

      if (categoriesData.success) setCategories(categoriesData.data);
      if (recipesData.success) setRecipes(recipesData.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Contraseña simple para demo - en producción usar autenticación real
    if (password === 'planetaketo2024') {
      localStorage.setItem('admin_access', 'granted');
      setIsAuthenticated(true);
      setError('');
      loadData();
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_access');
    setIsAuthenticated(false);
  };

  const handleRecipeCreated = () => {
    loadData(); // Reload data after creating recipe
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Panel de Administración
            </h2>
            <p className="text-gray-600">
              Ingresa la contraseña para acceder
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Ingresa tu contraseña"
                required
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200"
            >
              Iniciar Sesión
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Panel de Administración
                </h1>
                <p className="text-green-100 text-lg">
                  Gestiona el contenido de Planeta Keto
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Recetas</p>
                      <p className="text-3xl font-bold text-gray-900">{recipes.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <ChefHat className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Categorías</p>
                      <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Usuarios</p>
                      <p className="text-3xl font-bold text-gray-900">---</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Comentarios</p>
                      <p className="text-3xl font-bold text-gray-900">---</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-6 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Crear Receta</h3>
                      <p className="text-green-100 text-sm text-center">
                        Agrega una nueva receta keto con video e ingredientes
                      </p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setShowStatsModal(true)}
                    className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-6 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                        <BarChart3 className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Ver Estadísticas</h3>
                      <p className="text-blue-100 text-sm text-center">
                        Análisis completo del sitio
                      </p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setShowModerationModal(true)}
                    className="group relative bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-6 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                        <MessageCircle className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Moderar</h3>
                      <p className="text-purple-100 text-sm text-center">
                        Gestionar comentarios pendientes
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowCreateProductModal(true)}
                    className="group relative bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-6 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Crear Producto</h3>
                      <p className="text-orange-100 text-sm text-center">
                        Agregar producto a la tienda
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowCreateServiceModal(true)}
                    className="group relative bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-6 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Users className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Crear Servicio</h3>
                      <p className="text-teal-100 text-sm text-center">
                        Agregar servicio profesional
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowCreatePostModal(true)}
                    className="group relative bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold py-6 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Crear Blog Post</h3>
                      <p className="text-pink-100 text-sm text-center">
                        Publicar artículo en el blog
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowCreateAffiliateListModal(true)}
                    className="group relative bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-6 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <DollarSign className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Crear Lista Afiliados</h3>
                      <p className="text-amber-100 text-sm text-center">
                        Crear lista de productos afiliados
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Recipes */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recetas Recientes</h2>
                
                {recipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.slice(0, 6).map((recipe) => (
                      <div key={recipe._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            {recipe.category?.icon || '🍽️'}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 line-clamp-1">{recipe.name}</h3>
                            <p className="text-gray-500 text-sm">{recipe.category?.name}</p>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{recipe.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{recipe.preparationTime}min</span>
                          <span>{recipe.servings} porciones</span>
                          <span>⭐ {recipe.averageRating?.toFixed(1) || '0.0'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ChefHat size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No hay recetas aún
                    </h3>
                    <p className="text-gray-500 mb-6">
                      ¡Crea tu primera receta para comenzar!
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                      Crear Primera Receta
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Recipe Modal */}
      <CreateRecipeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        categories={categories}
        onSuccess={handleRecipeCreated}
      />
      
      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
      />
      
      <ModerationModal
        isOpen={showModerationModal}
        onClose={() => setShowModerationModal(false)}
      />
      
      <CreateProductModal
        isOpen={showCreateProductModal}
        onClose={() => setShowCreateProductModal(false)}
      />
      
      <CreatePostModal
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
      />
      
      <CreateServiceModal
        isOpen={showCreateServiceModal}
        onClose={() => setShowCreateServiceModal(false)}
        onSuccess={loadData}
      />

      <CreateAffiliateListModal
        isOpen={showCreateAffiliateListModal}
        onClose={() => setShowCreateAffiliateListModal(false)}
        onSuccess={() => {
          console.log('Lista de afiliados creada exitosamente');
        }}
      />
    </div>
  );
}