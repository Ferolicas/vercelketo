'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  XMarkIcon,
  PhotoIcon,
  GlobeAltIcon,
  PencilSquareIcon,
  EyeIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

const webDetailsSchema = z.object({
  siteName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  siteDescription: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
  heroTitle: z.string().min(5, 'El título hero debe tener al menos 5 caracteres'),
  heroSubtitle: z.string().min(10, 'El subtítulo debe tener al menos 10 caracteres'),
  heroImage: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  ogImage: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  favicon: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Debe ser un color hexadecimal válido'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Debe ser un color hexadecimal válido'),
  contactEmail: z.string().email('Debe ser un email válido'),
  socialMedia: z.object({
    facebook: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
    tiktok: z.string().url().optional().or(z.literal('')),
  }),
  seoKeywords: z.string().min(10, 'Añade al menos 10 caracteres de keywords'),
  googleAnalyticsId: z.string().optional(),
  facebookPixelId: z.string().optional(),
  adsensePublisherId: z.string().optional(),
  adsterraId: z.string().optional(),
});

type WebDetailsFormData = z.infer<typeof webDetailsSchema>;

interface EditWebDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultValues: WebDetailsFormData = {
  siteName: 'Planeta Keto',
  siteDescription: 'Las mejores recetas keto en español. Desayunos, comidas, cenas y postres cetogénicos para perder peso sin sacrificar sabor.',
  heroTitle: 'Las Mejores Recetas Keto en Español',
  heroSubtitle: 'Transforma tu cuerpo con +500 recetas cetogénicas deliciosas. Desayunos, comidas, cenas y postres para perder peso sin sacrificar sabor.',
  heroImage: '',
  ogImage: '/og-image.jpg',
  favicon: '/favicon.ico',
  primaryColor: '#059669',
  secondaryColor: '#10b981',
  contactEmail: 'contacto@planetaketo.es',
  socialMedia: {
    facebook: 'https://facebook.com/planetaketo',
    instagram: 'https://instagram.com/planetaketo',
    twitter: 'https://twitter.com/planetaketo',
    youtube: 'https://youtube.com/@planetaketo',
    tiktok: 'https://tiktok.com/@planetaketo',
  },
  seoKeywords: 'recetas keto, dieta keto, dieta cetogénica, keto en español, recetas cetogénicas, comida keto, desayuno keto, almuerzo keto, cena keto, postres keto, pan keto, pizza keto, galletas keto, recetas bajas en carbohidratos, perder peso keto',
  googleAnalyticsId: 'G-XXXXXXXXXX',
  facebookPixelId: '',
  adsensePublisherId: 'ca-pub-XXXXXXXXX',
  adsterraId: '',
};

export default function EditWebDetailsModal({ isOpen, onClose }: EditWebDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [previewMode, setPreviewMode] = useState(false);

  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors, isSubmitting, isDirty },
    reset 
  } = useForm<WebDetailsFormData>({
    defaultValues
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isOpen) {
      // Cargar valores actuales desde localStorage o API
      const savedValues = localStorage.getItem('webDetails');
      if (savedValues) {
        reset(JSON.parse(savedValues));
      } else {
        reset(defaultValues);
      }
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: WebDetailsFormData) => {
    try {
      // Guardar en localStorage (en producción sería una API call)
      localStorage.setItem('webDetails', JSON.stringify(data));
      
      // Simular actualización de variables de entorno
      const envVars = {
        SITE_URL: 'https://planetaketo.es',
        NEXT_PUBLIC_GA_ID: data.googleAnalyticsId,
        NEXT_PUBLIC_ADSENSE_CLIENT: data.adsensePublisherId,
        FACEBOOK_PIXEL_ID: data.facebookPixelId,
        ADSTERRA_ID: data.adsterraId,
      };

      console.log('Actualizando configuración web:', data);
      console.log('Variables de entorno:', envVars);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('¡Configuración actualizada exitosamente! Los cambios se aplicarán en la próxima carga.');
      onClose();
    } catch (error) {
      console.error('Error updating web details:', error);
      alert('Error al actualizar la configuración');
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '🏠' },
    { id: 'design', name: 'Diseño', icon: '🎨' },
    { id: 'social', name: 'Redes Sociales', icon: '📱' },
    { id: 'seo', name: 'SEO & Analytics', icon: '📊' },
    { id: 'ads', name: 'Publicidad', icon: '💰' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Modificar Detalles de la Web</h3>
                  <p className="text-gray-600">Personaliza la apariencia y configuración de tu sitio</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      previewMode 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Vista Previa
                  </button>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar con tabs */}
                <div className="lg:col-span-1">
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="mr-3 text-lg">{tab.icon}</span>
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Contenido principal */}
                <div className="lg:col-span-3">
                  {previewMode ? (
                    // Vista previa
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="text-center mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Vista Previa</h4>
                        <p className="text-sm text-gray-600">Así se vería tu sitio web</p>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Header preview */}
                        <div 
                          className="px-6 py-4 text-white"
                          style={{ backgroundColor: watchedValues.primaryColor }}
                        >
                          <h1 className="text-xl font-bold">{watchedValues.siteName}</h1>
                        </div>
                        
                        {/* Hero section preview */}
                        <div className="p-6 text-center">
                          <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {watchedValues.heroTitle}
                          </h2>
                          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            {watchedValues.heroSubtitle}
                          </p>
                          <button 
                            className="px-6 py-3 text-white rounded-lg font-semibold"
                            style={{ backgroundColor: watchedValues.primaryColor }}
                          >
                            Ver Recetas
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Formulario
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      {/* Tab: General */}
                      {activeTab === 'general' && (
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nombre del Sitio *
                            </label>
                            <input
                              {...register('siteName')}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Planeta Keto"
                            />
                            {errors.siteName && (
                              <p className="mt-1 text-sm text-red-600">{errors.siteName.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Descripción del Sitio *
                            </label>
                            <textarea
                              {...register('siteDescription')}
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Las mejores recetas keto en español..."
                            />
                            {errors.siteDescription && (
                              <p className="mt-1 text-sm text-red-600">{errors.siteDescription.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Título Principal (Hero) *
                            </label>
                            <input
                              {...register('heroTitle')}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Las Mejores Recetas Keto en Español"
                            />
                            {errors.heroTitle && (
                              <p className="mt-1 text-sm text-red-600">{errors.heroTitle.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Subtítulo Principal *
                            </label>
                            <textarea
                              {...register('heroSubtitle')}
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Transforma tu cuerpo con +500 recetas cetogénicas..."
                            />
                            {errors.heroSubtitle && (
                              <p className="mt-1 text-sm text-red-600">{errors.heroSubtitle.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email de Contacto *
                            </label>
                            <input
                              {...register('contactEmail')}
                              type="email"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="contacto@planetaketo.es"
                            />
                            {errors.contactEmail && (
                              <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tab: Diseño */}
                      {activeTab === 'design' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color Primario *
                              </label>
                              <div className="flex space-x-3">
                                <input
                                  {...register('primaryColor')}
                                  type="color"
                                  className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
                                />
                                <input
                                  {...register('primaryColor')}
                                  type="text"
                                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                                  placeholder="#059669"
                                />
                              </div>
                              {errors.primaryColor && (
                                <p className="mt-1 text-sm text-red-600">{errors.primaryColor.message}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color Secundario *
                              </label>
                              <div className="flex space-x-3">
                                <input
                                  {...register('secondaryColor')}
                                  type="color"
                                  className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
                                />
                                <input
                                  {...register('secondaryColor')}
                                  type="text"
                                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                                  placeholder="#10b981"
                                />
                              </div>
                              {errors.secondaryColor && (
                                <p className="mt-1 text-sm text-red-600">{errors.secondaryColor.message}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Imagen Hero (Opcional)
                            </label>
                            <input
                              {...register('heroImage')}
                              type="url"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="https://ejemplo.com/hero-image.jpg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Imagen Open Graph
                            </label>
                            <input
                              {...register('ogImage')}
                              type="url"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="/og-image.jpg"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              Imagen que aparece cuando compartes el sitio en redes sociales (1200x630px)
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Favicon
                            </label>
                            <input
                              {...register('favicon')}
                              type="url"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="/favicon.ico"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              Icono que aparece en la pestaña del navegador
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Tab: Redes Sociales */}
                      {activeTab === 'social' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 gap-6">
                            {Object.entries(watchedValues.socialMedia).map(([platform, url]) => (
                              <div key={platform}>
                                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                                  {platform}
                                </label>
                                <input
                                  {...register(`socialMedia.${platform as keyof typeof watchedValues.socialMedia}`)}
                                  type="url"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  placeholder={`https://${platform}.com/planetaketo`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tab: SEO & Analytics */}
                      {activeTab === 'seo' && (
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Keywords SEO *
                            </label>
                            <textarea
                              {...register('seoKeywords')}
                              rows={4}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="recetas keto, dieta keto, dieta cetogénica..."
                            />
                            {errors.seoKeywords && (
                              <p className="mt-1 text-sm text-red-600">{errors.seoKeywords.message}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                              Separa las keywords principales con comas
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Google Analytics ID
                            </label>
                            <input
                              {...register('googleAnalyticsId')}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                              placeholder="G-XXXXXXXXXX"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Facebook Pixel ID
                            </label>
                            <input
                              {...register('facebookPixelId')}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                              placeholder="1234567890123456"
                            />
                          </div>
                        </div>
                      )}

                      {/* Tab: Publicidad */}
                      {activeTab === 'ads' && (
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Google AdSense Publisher ID
                            </label>
                            <input
                              {...register('adsensePublisherId')}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                              placeholder="ca-pub-XXXXXXXXXXXXXXXXX"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Adsterra ID
                            </label>
                            <input
                              {...register('adsterraId')}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                              placeholder="123456"
                            />
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <PhotoIcon className="h-5 w-5 text-yellow-400" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                  Configuración de Anuncios
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                  <p>
                                    Recuerda configurar los IDs específicos de cada banner en las variables de entorno 
                                    después de guardar estos cambios.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Footer con botones */}
                      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={onClose}
                          className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting || !isDirty}
                          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Guardando...
                            </>
                          ) : (
                            <>
                              <PencilSquareIcon className="h-4 w-4 mr-2" />
                              Guardar Cambios
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}