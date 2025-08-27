'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  XMarkIcon,
  PhotoIcon,
  PlusIcon,
  MinusIcon,
  CurrencyDollarIcon,
  StarIcon,
  TagIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const productSchema = z.object({
  nombre: z.string().min(5, 'El nombre debe tener al menos 5 caracteres'),
  descripcion: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
  categoria: z.string().min(1, 'Selecciona una categoría'),
  precio: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  precioOriginal: z.number().optional(),
  imagen: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  enlace: z.string().url('Debe ser una URL válida'),
  caracteristicas: z.array(z.string().min(1)).min(1, 'Agrega al menos 1 característica'),
  badge: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  reviews: z.number().min(0).default(0),
  activo: z.boolean().default(true),
  orden: z.number().default(0),
});

type ProductFormData = z.infer<typeof productSchema>;

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categorias = [
  'Ebooks',
  'Servicios', 
  'Herramientas',
  'Cursos',
  'Consultorías',
  'Planes',
  'Membresías',
  'Software'
];

const badges = [
  'Bestseller',
  'Premium', 
  'Nuevo',
  'Oferta',
  'Gratis',
  'Popular',
  'Recomendado'
];

export default function CreateProductModal({ isOpen, onClose }: CreateProductModalProps) {
  const [caracteristicas, setCaracteristicas] = useState(['']);

  const { 
    register, 
    handleSubmit, 
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset 
  } = useForm<ProductFormData>({
    defaultValues: {
      nombre: '',
      descripcion: '',
      categoria: '',
      precio: 0,
      enlace: '',
      rating: 5,
      reviews: 0,
      activo: true,
      orden: 0,
      caracteristicas: ['']
    }
  });

  const watchPrecio = watch('precio', 0);
  const watchPrecioOriginal = watch('precioOriginal', 0);

  const addCaracteristica = () => {
    setCaracteristicas([...caracteristicas, '']);
  };

  const removeCaracteristica = (index: number) => {
    if (caracteristicas.length > 1) {
      const newCaracteristicas = caracteristicas.filter((_, i) => i !== index);
      setCaracteristicas(newCaracteristicas);
      setValue('caracteristicas', newCaracteristicas);
    }
  };

  const updateCaracteristica = (index: number, value: string) => {
    const newCaracteristicas = [...caracteristicas];
    newCaracteristicas[index] = value;
    setCaracteristicas(newCaracteristicas);
    setValue('caracteristicas', newCaracteristicas.filter(c => c.trim()));
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData();
      
      // Basic fields matching Sanity schema
      formData.append('name', data.nombre);
      formData.append('description', data.descripcion);
      formData.append('price', data.precio.toString());
      formData.append('currency', 'EUR');
      formData.append('affiliateUrl', data.enlace);
      formData.append('featured', 'false');
      
      // Create a simple placeholder image if no image URL provided
      if (data.imagen) {
        // For now, we'll just store the URL in description
        formData.append('description', `${data.descripcion}\n\nImagen: ${data.imagen}`);
      }
      
      // Create a simple image file for Sanity (placeholder)
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#8B5CF6';
        ctx.fillRect(0, 0, 400, 300);
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(data.nombre, 200, 150);
      }
      
      canvas.toBlob(async (blob) => {
        try {
          if (blob) {
            formData.append('image', blob, `${data.nombre.replace(/\s+/g, '-').toLowerCase()}.png`);
            
            // Create product in Sanity
            const response = await fetch('/api/products', {
              method: 'POST',
              body: formData
            });
        
            const result = await response.json();
            
            if (response.ok) {
              alert('¡Producto creado exitosamente!');
              reset();
              setCaracteristicas(['']);
              onClose();
            } else {
              throw new Error(result.error || 'Error al crear producto');
            }
          } else {
            throw new Error('Error al crear la imagen del producto');
          }
        } catch (error) {
          console.error('Error creating product:', error);
          alert(`Error al crear el producto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
      }, 'image/png');

    } catch (error) {
      console.error('Error in product creation setup:', error);
      alert(`Error al preparar el producto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

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
              className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                    <TagIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Crear Producto</h3>
                    <p className="text-gray-600">Añade un nuevo producto a tu tienda</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Producto *
                    </label>
                    <input
                      {...register('nombre')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ej: Guía Completa Keto 2024"
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      {...register('categoria')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Selecciona una categoría</option>
                      {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.categoria && (
                      <p className="mt-1 text-sm text-red-600">{errors.categoria.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    {...register('descripcion')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Descripción atractiva del producto que resalte sus beneficios..."
                  />
                  {errors.descripcion && (
                    <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
                  )}
                </div>

                {/* Precios */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
                      Precio Actual *
                    </label>
                    <input
                      {...register('precio', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      min="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="29.99"
                    />
                    {errors.precio && (
                      <p className="mt-1 text-sm text-red-600">{errors.precio.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio Original
                    </label>
                    <input
                      {...register('precioOriginal', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="49.99"
                    />
                    <p className="mt-1 text-xs text-gray-500">Para mostrar descuento</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <StarIcon className="h-4 w-4 inline mr-1" />
                      Rating (1-5)
                    </label>
                    <input
                      {...register('rating', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      # Reviews
                    </label>
                    <input
                      {...register('reviews', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="127"
                    />
                  </div>
                </div>

                {/* Vista previa de descuento */}
                {watchPrecioOriginal && watchPrecioOriginal > watchPrecio && watchPrecio > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="text-green-600 font-semibold">
                        💰 Descuento: {Math.round(((watchPrecioOriginal - watchPrecio) / watchPrecioOriginal) * 100)}%
                      </div>
                      <div className="ml-4 text-sm text-green-700">
                        Ahorro: ${(watchPrecioOriginal - watchPrecio).toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de la Imagen
                    </label>
                    <input
                      {...register('imagen')}
                      type="url"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://ejemplo.com/producto.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Badge (Opcional)
                    </label>
                    <select
                      {...register('badge')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Sin badge</option>
                      {badges.map(badge => (
                        <option key={badge} value={badge}>{badge}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enlace de Compra/Más Info *
                  </label>
                  <input
                    {...register('enlace')}
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://tu-tienda.com/producto"
                  />
                  {errors.enlace && (
                    <p className="mt-1 text-sm text-red-600">{errors.enlace.message}</p>
                  )}
                </div>

                {/* Características */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Características Principales *
                    </label>
                    <button
                      type="button"
                      onClick={addCaracteristica}
                      className="text-purple-600 hover:text-purple-700 flex items-center text-sm"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Agregar
                    </button>
                  </div>
                  <div className="space-y-2">
                    {caracteristicas.map((caracteristica, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          value={caracteristica}
                          onChange={(e) => updateCaracteristica(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder={`Característica ${index + 1}`}
                        />
                        {caracteristicas.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCaracteristica(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <MinusIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.caracteristicas && (
                    <p className="mt-1 text-sm text-red-600">{errors.caracteristicas.message}</p>
                  )}
                </div>

                {/* Configuraciones adicionales */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orden de Visualización
                    </label>
                    <input
                      {...register('orden', { valueAsNumber: true })}
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0"
                    />
                    <p className="mt-1 text-xs text-gray-500">Menor número = aparece primero</p>
                  </div>

                  <div className="flex items-center mt-8">
                    <input
                      {...register('activo')}
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Producto activo/visible
                    </label>
                  </div>
                </div>

                {/* Vista previa del producto */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h4>
                  <div className="bg-white rounded-lg shadow-md p-4 max-w-sm">
                    <div className="h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mb-4 flex items-center justify-center text-white text-2xl">
                      📦
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-purple-600 font-medium">{watch('categoria')}</span>
                      {watch('badge') && (
                        <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full font-semibold">
                          {watch('badge')}
                        </span>
                      )}
                    </div>
                    <h5 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {watch('nombre') || 'Nombre del producto'}
                    </h5>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {watch('descripcion') || 'Descripción del producto...'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-gray-900">
                          ${watch('precio') || '0'}
                        </span>
                        {watchPrecioOriginal && watchPrecioOriginal > watchPrecio && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${watchPrecioOriginal}
                          </span>
                        )}
                      </div>
                      <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>

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
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creando...
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Crear Producto
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}