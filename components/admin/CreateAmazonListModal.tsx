'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  StarIcon,
  ShoppingBagIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const amazonProductSchema = z.object({
  titulo: z.string().min(10, 'El título debe tener al menos 10 caracteres'),
  descripcion: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
  precio: z.string().min(1, 'Ingresa el precio'),
  imagen: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  enlaceAfiliado: z.string().url('Debe ser una URL válida de Amazon'),
  rating: z.number().min(1).max(5),
  categoria: z.string().min(1, 'Selecciona una categoría'),
  beneficios: z.array(z.string().min(1)).min(1, 'Agrega al menos 1 beneficio'),
  asin: z.string().optional(),
  marca: z.string().optional(),
  disponible: z.boolean(),
});

const amazonListSchema = z.object({
  nombre: z.string().min(5, 'El nombre debe tener al menos 5 caracteres'),
  descripcion: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
  productos: z.array(amazonProductSchema).min(1, 'Agrega al menos 1 producto'),
  activo: z.boolean().default(true),
  orden: z.number().default(0),
  fechaCreacion: z.string().optional(),
});

type AmazonListFormData = z.infer<typeof amazonListSchema>;
type AmazonProductFormData = z.infer<typeof amazonProductSchema>;

interface CreateAmazonListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categorias = [
  'Suplementos',
  'Medición',
  'Ingredientes',
  'Cocina',
  'Libros',
  'Fitness',
  'Cuidado Personal',
  'Hogar'
];

const productosEjemplo: AmazonProductFormData[] = [
  {
    titulo: 'MCT Oil Premium - Aceite de Coco Fraccionado 500ml',
    descripcion: 'Aceite MCT de alta calidad para acelerar la cetosis y aumentar la energía mental y física.',
    precio: '$24.99',
    imagen: '',
    enlaceAfiliado: 'https://amazon.com/...',
    rating: 4.7,
    categoria: 'Suplementos',
    beneficios: ['Acelera la cetosis', 'Aumenta energía mental', 'Mejora el metabolismo'],
    asin: 'B07XXXXX',
    marca: 'Sports Research',
    disponible: true,
  }
];

export default function CreateAmazonListModal({ isOpen, onClose }: CreateAmazonListModalProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [productos, setProductos] = useState<AmazonProductFormData[]>([
    {
      titulo: '',
      descripcion: '',
      precio: '',
      imagen: '',
      enlaceAfiliado: '',
      rating: 4.5,
      categoria: '',
      beneficios: [''],
      asin: '',
      marca: '',
      disponible: true,
    }
  ]);

  const { 
    register, 
    handleSubmit, 
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset 
  } = useForm<AmazonListFormData>({
    defaultValues: {
      nombre: '',
      descripcion: '',
      productos: productos,
      activo: true,
      orden: 0
    }
  });

  const addProducto = () => {
    const nuevoProducto: AmazonProductFormData = {
      titulo: '',
      descripcion: '',
      precio: '',
      imagen: '',
      enlaceAfiliado: '',
      rating: 4.5,
      categoria: '',
      beneficios: [''],
      asin: '',
      marca: '',
      disponible: true,
    };
    setProductos([...productos, nuevoProducto]);
  };

  const removeProducto = (index: number) => {
    if (productos.length > 1) {
      const newProductos = productos.filter((_, i) => i !== index);
      setProductos(newProductos);
      setValue('productos', newProductos);
    }
  };

  const updateProducto = (index: number, field: keyof AmazonProductFormData, value: any) => {
    const newProductos = [...productos];
    (newProductos[index] as any)[field] = value;
    setProductos(newProductos);
    setValue('productos', newProductos);
  };

  const addBeneficio = (productIndex: number) => {
    const newProductos = [...productos];
    newProductos[productIndex].beneficios.push('');
    setProductos(newProductos);
  };

  const removeBeneficio = (productIndex: number, beneficioIndex: number) => {
    if (productos[productIndex].beneficios.length > 1) {
      const newProductos = [...productos];
      newProductos[productIndex].beneficios = newProductos[productIndex].beneficios.filter((_, i) => i !== beneficioIndex);
      setProductos(newProductos);
    }
  };

  const updateBeneficio = (productIndex: number, beneficioIndex: number, value: string) => {
    const newProductos = [...productos];
    newProductos[productIndex].beneficios[beneficioIndex] = value;
    setProductos(newProductos);
    setValue('productos', newProductos);
  };

  const loadExampleProducts = () => {
    setProductos(productosEjemplo);
    setValue('productos', productosEjemplo);
  };

  const extractASINFromURL = (url: string) => {
    const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})|ASIN=([A-Z0-9]{10})/);
    return asinMatch ? (asinMatch[1] || asinMatch[2] || asinMatch[3]) : '';
  };

  const onSubmit = async (data: AmazonListFormData) => {
    try {
      const listData = {
        ...data,
        id: Date.now().toString(),
        productos: productos.filter(p => p.titulo.trim() && p.enlaceAfiliado.trim()),
        fechaCreacion: new Date().toISOString(),
      };

      // Extraer ASINs automáticamente
      listData.productos = listData.productos.map(producto => ({
        ...producto,
        asin: producto.asin || extractASINFromURL(producto.enlaceAfiliado),
        beneficios: producto.beneficios.filter(b => b.trim())
      }));

      // Guardar en localStorage (en producción sería una API call)
      const existingLists = JSON.parse(localStorage.getItem('amazonLists') || '[]');
      existingLists.push(listData);
      localStorage.setItem('amazonLists', JSON.stringify(existingLists));

      console.log('Lista de Amazon creada:', listData);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('¡Lista de Amazon creada exitosamente!');
      reset();
      setProductos([{
        titulo: '', descripcion: '', precio: '', imagen: '', enlaceAfiliado: '', 
        rating: 4.5, categoria: '', beneficios: [''], asin: '', marca: '', disponible: true
      }]);
      onClose();
    } catch (error) {
      console.error('Error creating Amazon list:', error);
      alert('Error al crear la lista de Amazon');
    }
  };

  const tabs = [
    { id: 'info', name: 'Información General', icon: '📋' },
    { id: 'productos', name: 'Productos', icon: '📦' },
    { id: 'preview', name: 'Vista Previa', icon: '👁️' },
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
              className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full sm:p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                    <ShoppingBagIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Crear Lista de Amazon</h3>
                    <p className="text-gray-600">Añade productos afiliados de Amazon</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={loadExampleProducts}
                    className="text-sm bg-orange-100 text-orange-700 px-3 py-2 rounded-lg hover:bg-orange-200 transition-colors"
                  >
                    Cargar Ejemplos
                  </button>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Tab: Información General */}
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la Lista *
                      </label>
                      <input
                        {...register('nombre')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Ej: Suplementos Keto Esenciales 2024"
                      />
                      {errors.nombre && (
                        <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción de la Lista *
                      </label>
                      <textarea
                        {...register('descripcion')}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Los mejores productos de Amazon cuidadosamente seleccionados para potenciar tu dieta keto..."
                      />
                      {errors.descripcion && (
                        <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Orden de Visualización
                        </label>
                        <input
                          {...register('orden', { valueAsNumber: true })}
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="0"
                        />
                        <p className="mt-1 text-xs text-gray-500">Menor número = aparece primero</p>
                      </div>

                      <div className="flex items-center mt-8">
                        <input
                          {...register('activo')}
                          type="checkbox"
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                          Lista activa/visible
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Productos */}
                {activeTab === 'productos' && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Productos ({productos.length})
                      </h4>
                      <button
                        type="button"
                        onClick={addProducto}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Agregar Producto
                      </button>
                    </div>

                    <div className="space-y-6">
                      {productos.map((producto, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-gray-200 rounded-xl p-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-medium text-gray-900">
                              Producto {index + 1}
                            </h5>
                            {productos.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeProducto(index)}
                                className="text-red-600 hover:text-red-700 flex items-center text-sm"
                              >
                                <MinusIcon className="h-4 w-4 mr-1" />
                                Eliminar
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título del Producto *
                              </label>
                              <input
                                value={producto.titulo}
                                onChange={(e) => updateProducto(index, 'titulo', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Ej: MCT Oil Premium - Aceite de Coco 500ml"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categoría *
                              </label>
                              <select
                                value={producto.categoria}
                                onChange={(e) => updateProducto(index, 'categoria', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              >
                                <option value="">Selecciona categoría</option>
                                {categorias.map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Descripción *
                            </label>
                            <textarea
                              value={producto.descripcion}
                              onChange={(e) => updateProducto(index, 'descripcion', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Descripción breve que resalte los beneficios del producto..."
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Precio *
                              </label>
                              <input
                                value={producto.precio}
                                onChange={(e) => updateProducto(index, 'precio', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="$24.99"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating (1-5)
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="5"
                                step="0.1"
                                value={producto.rating}
                                onChange={(e) => updateProducto(index, 'rating', parseFloat(e.target.value) || 4.5)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Marca
                              </label>
                              <input
                                value={producto.marca || ''}
                                onChange={(e) => updateProducto(index, 'marca', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Sports Research"
                              />
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Enlace de Afiliado de Amazon *
                            </label>
                            <input
                              type="url"
                              value={producto.enlaceAfiliado}
                              onChange={(e) => {
                                updateProducto(index, 'enlaceAfiliado', e.target.value);
                                // Auto-extraer ASIN
                                const asin = extractASINFromURL(e.target.value);
                                if (asin) {
                                  updateProducto(index, 'asin', asin);
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="https://amazon.com/dp/XXXXXXXXXX?tag=tu-id-afiliado"
                            />
                            {producto.asin && (
                              <p className="mt-1 text-xs text-green-600">
                                ✓ ASIN detectado: {producto.asin}
                              </p>
                            )}
                          </div>

                          {/* Beneficios */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <label className="block text-sm font-medium text-gray-700">
                                Beneficios/Características
                              </label>
                              <button
                                type="button"
                                onClick={() => addBeneficio(index)}
                                className="text-orange-600 hover:text-orange-700 flex items-center text-sm"
                              >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Agregar
                              </button>
                            </div>
                            <div className="space-y-2">
                              {producto.beneficios.map((beneficio, beneficioIndex) => (
                                <div key={beneficioIndex} className="flex space-x-2">
                                  <input
                                    value={beneficio}
                                    onChange={(e) => updateBeneficio(index, beneficioIndex, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                    placeholder={`Beneficio ${beneficioIndex + 1}`}
                                  />
                                  {producto.beneficios.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeBeneficio(index, beneficioIndex)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <MinusIcon className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Vista Previa */}
                {activeTab === 'preview' && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Vista Previa de la Lista
                    </h4>
                    
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h5 className="text-xl font-bold text-gray-900 mb-2">
                        {watch('nombre') || 'Nombre de la lista'}
                      </h5>
                      <p className="text-gray-600 mb-6">
                        {watch('descripcion') || 'Descripción de la lista...'}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {productos.filter(p => p.titulo.trim()).map((producto, index) => (
                          <div key={index} className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex space-x-4">
                              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white text-xl">
                                📦
                              </div>
                              
                              <div className="flex-1">
                                <div className="mb-2">
                                  <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
                                    {producto.categoria}
                                  </span>
                                </div>
                                <h6 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2">
                                  {producto.titulo}
                                </h6>
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                  {producto.descripcion}
                                </p>
                                
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <StarIcon
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < Math.floor(producto.rating) ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                        fill="currentColor"
                                      />
                                    ))}
                                    <span className="ml-1 text-xs text-gray-500">
                                      {producto.rating}
                                    </span>
                                  </div>
                                  <span className="text-sm font-bold text-gray-900">
                                    {producto.precio}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex flex-wrap gap-1">
                                    {producto.beneficios.slice(0, 2).filter(b => b.trim()).map((beneficio, i) => (
                                      <div key={i} className="flex items-center text-xs text-gray-600">
                                        <CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" />
                                        {beneficio.slice(0, 15)}...
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs font-medium flex items-center">
                                    Amazon
                                    <ExternalLinkIcon className="ml-1 h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
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
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creando...
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Crear Lista
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