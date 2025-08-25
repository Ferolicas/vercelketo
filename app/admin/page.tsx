'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/components/admin/Dashboard';
import CreatePostModal from '@/components/admin/CreatePostModal';
import EditWebDetailsModal from '@/components/admin/EditWebDetailsModal';
import CreateProductModal from '@/components/admin/CreateProductModal';
import CreateAmazonListModal from '@/components/admin/CreateAmazonListModal';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar si ya está autenticado
    const adminAccess = localStorage.getItem('admin_access');
    if (adminAccess === 'granted') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Contraseña simple para demo - en producción usar autenticación real
    if (password === 'planetaketo2024') {
      localStorage.setItem('admin_access', 'granted');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_access');
    setIsAuthenticated(false);
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
    <AdminLayout onLogout={handleLogout}>
      <Dashboard onOpenModal={setActiveModal} />
      
      {/* Modales */}
      <CreatePostModal 
        isOpen={activeModal === 'create-post'} 
        onClose={() => setActiveModal(null)} 
      />
      
      <EditWebDetailsModal 
        isOpen={activeModal === 'edit-web'} 
        onClose={() => setActiveModal(null)} 
      />
      
      <CreateProductModal 
        isOpen={activeModal === 'create-product'} 
        onClose={() => setActiveModal(null)} 
      />
      
      <CreateAmazonListModal 
        isOpen={activeModal === 'create-amazon'} 
        onClose={() => setActiveModal(null)} 
      />
    </AdminLayout>
  );
}