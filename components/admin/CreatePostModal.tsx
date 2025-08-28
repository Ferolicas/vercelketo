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
  ClockIcon,
  FireIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const postSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres'),
  excerpt: z.string().min(20, 'El resumen debe tener al menos 20 caracteres'),
  content: z.string().min(100, 'El contenido debe tener al menos 100 caracteres'),
  category: z.string().min(1, 'Selecciona una categoría'),
  mainImage: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  prepTime: z.number().min(1, 'Tiempo mínimo 1 minuto'),
  cookTime: z.number().min(1, 'Tiempo mínimo 1 minuto'),
  servings: z.number().min(1, 'Mínimo 1 porción'),
  difficulty: z.enum(['Fácil', 'Intermedio', 'Difícil']),
  ingredients: z.array(z.string().min(1)).min(1, 'Agrega al menos 1 ingrediente'),
  instructions: z.array(z.string().min(1)).min(1, 'Agrega al menos 1 instrucción'),
  nutritionFacts: z.object({
    calories: z.number().optional(),
    carbs: z.number().optional(),
    protein: z.number().optional(),
    fat: z.number().optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  seoKeywords: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  'Desayunos',
  'Comidas',
  'Cenas',
  'Postres',
  'Bebidas',
  'Snacks',
  'Panes',
  'Dulces'
];

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [tags, setTags] = useState(['']);

  const { 
    register, 
    handleSubmit, 
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset 
  } = useForm<PostFormData>({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      difficulty: 'Fácil',
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      ingredients: [''],
      instructions: [''],
      tags: []
    }
  });

  const watchTitle = watch('title', '');

  // Auto-generar slug basado en el título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Actualizar slug cuando cambie el título
  useState(() => {
    if (watchTitle) {
      setValue('slug', generateSlug(watchTitle));
    }
  });

  const addItem = (type: 'ingredient' | 'instruction' | 'tag') => {
    if (type === 'ingredient') {
      setIngredients([...ingredients, '']);
    } else if (type === 'instruction') {
      setInstructions([...instructions, '']);
    } else {
      setTags([...tags, '']);
    }
  };

  const removeItem = (type: 'ingredient' | 'instruction' | 'tag', index: number) => {
    if (type === 'ingredient') {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
      setValue('ingredients', newIngredients);
    } else if (type === 'instruction') {
      const newInstructions = instructions.filter((_, i) => i !== index);
      setInstructions(newInstructions);
      setValue('instructions', newInstructions);
    } else {
      setTags(tags.filter((_, i) => i !== index));
    }
  };

  const updateItem = (type: 'ingredient' | 'instruction' | 'tag', index: number, value: string) => {
    if (type === 'ingredient') {
      const newIngredients = [...ingredients];
      newIngredients[index] = value;
      setIngredients(newIngredients);
      setValue('ingredients', newIngredients);
    } else if (type === 'instruction') {
      const newInstructions = [...instructions];
      newInstructions[index] = value;
      setInstructions(newInstructions);
      setValue('instructions', newInstructions);
    } else {
      const newTags = [...tags];
      newTags[index] = value;
      setTags(newTags);
      setValue('tags', newTags.filter(tag => tag.length > 0));
    }
  };

  const onSubmit = async (data: PostFormData) => {
    try {
      const formData = new FormData();
      
      // Basic fields
      formData.append('title', data.title);
      formData.append('excerpt', data.excerpt);
      formData.append('content', data.content);
      formData.append('author', 'Planeta Keto');
      formData.append('published', 'true');
      
      // Tags (combine ingredients, instructions, and tags)
      const allTags = [
        ...tags.filter(t => t.trim()),
        'keto',
        'cetogenica',
        data.category?.toLowerCase() || ''
      ];
      formData.append('tags', JSON.stringify(allTags));
      
      // Create a simple image for the blog post - FIXED APPROACH
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#10B981';
          ctx.fillRect(0, 0, 600, 400);
          ctx.fillStyle = 'white';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          
          // Handle text wrapping for longer titles
          const maxWidth = 580;
          const words = data.title.split(' ');
          let line = '';
          let y = 180;
          for(let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
              ctx.fillText(line, 300, y);
              line = words[n] + ' ';
              y += 30;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, 300, y);
        }
        
        // Convert canvas to blob with error handling
        canvas.toBlob(async (blob) => {
          if (blob) {
            formData.append('featuredImage', blob, `${data.slug || 'blog-post'}.png`);
            
            try {
              const response = await fetch('/api/blog', {
                method: 'POST',
                body: formData
              });
              
              const result = await response.json();
              
              if (response.ok) {
                alert('¡Artículo creado exitosamente!');
                reset();
                setIngredients(['']);
                setInstructions(['']);
                setTags(['']);
                onClose();
              } else {
                throw new Error(result.error || 'Error al crear artículo');
              }
            } catch (fetchError) {
              console.error('Error creating blog post:', fetchError);
              alert(`Error al crear el artículo: ${fetchError instanceof Error ? fetchError.message : 'Error desconocido'}`);
            }
          } else {
            throw new Error('Error al crear la imagen: blob is null');
          }
        }, 'image/png', 0.8);
        
      } catch (canvasError) {
        console.error('Canvas error:', canvasError);
        // Fallback: create a simple text-based image
        const fallbackBlob = new Blob([data.title], { type: 'text/plain' });
        formData.append('featuredImage', fallbackBlob, `${data.slug || 'blog-post'}.txt`);
        
        // Try to submit anyway
        const response = await fetch('/api/blog', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
          alert('¡Artículo creado exitosamente!');
          reset();
          setIngredients(['']);
          setInstructions(['']);
          setTags(['']);
          onClose();
        } else {
          throw new Error(result.error || 'Error al crear artículo');
        }
      }
      
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert(`Error al crear el artículo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const tabs = [
    { id: 'basic', name: 'Información Básica', icon: '📝' },
    { id: 'recipe', name: 'Receta', icon: '👨‍🍳' },
    { id: 'nutrition', name: 'Nutrición', icon: '🥗' },
    { id: 'seo', name: 'SEO', icon: '🔍' },
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
                  <h3 className="text-2xl font-bold text-gray-900">Crear Nuevo Post</h3>
                  <p className="text-gray-600">Añade una nueva receta a tu sitio</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
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
                          ? 'border-green-500 text-green-600'
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
                {/* Tab: Información Básica */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Título de la Receta *
                        </label>
                        <input
                          {...register('title')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Ej: Pan Keto Esponjoso Sin Harina"
                        />
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Slug (URL) *
                        </label>
                        <input
                          {...register('slug')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="pan-keto-esponjoso-sin-harina"
                        />
                        {errors.slug && (
                          <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría *
                      </label>
                      <select
                        {...register('category')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Selecciona una categoría</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL de la Imagen Principal
                      </label>
                      <input
                        {...register('mainImage')}
                        type="url"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resumen/Descripción *
                      </label>
                      <textarea
                        {...register('excerpt')}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Breve descripción de la receta..."
                      />
                      {errors.excerpt && (
                        <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenido Completo *
                      </label>
                      <textarea
                        {...register('content')}
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Contenido completo del post con introducción, preparación, consejos, etc..."
                      />
                      {errors.content && (
                        <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab: Receta */}
                {activeTab === 'recipe' && (
                  <div className="space-y-6">
                    {/* Tiempos y dificultad */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <ClockIcon className="h-4 w-4 inline mr-1" />
                          Prep. (min) *
                        </label>
                        <input
                          {...register('prepTime', { valueAsNumber: true })}
                          type="number"
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FireIcon className="h-4 w-4 inline mr-1" />
                          Cocción (min) *
                        </label>
                        <input
                          {...register('cookTime', { valueAsNumber: true })}
                          type="number"
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <UserIcon className="h-4 w-4 inline mr-1" />
                          Porciones *
                        </label>
                        <input
                          {...register('servings', { valueAsNumber: true })}
                          type="number"
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dificultad *
                        </label>
                        <select
                          {...register('difficulty')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="Fácil">Fácil</option>
                          <option value="Intermedio">Intermedio</option>
                          <option value="Difícil">Difícil</option>
                        </select>
                      </div>
                    </div>

                    {/* Ingredientes */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Ingredientes *
                        </label>
                        <button
                          type="button"
                          onClick={() => addItem('ingredient')}
                          className="text-green-600 hover:text-green-700 flex items-center text-sm"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Agregar
                        </button>
                      </div>
                      <div className="space-y-2">
                        {ingredients.map((ingredient, index) => (
                          <div key={index} className="flex space-x-2">
                            <input
                              value={ingredient}
                              onChange={(e) => updateItem('ingredient', index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder={`Ingrediente ${index + 1}`}
                            />
                            {ingredients.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItem('ingredient', index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <MinusIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Instrucciones */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Instrucciones *
                        </label>
                        <button
                          type="button"
                          onClick={() => addItem('instruction')}
                          className="text-green-600 hover:text-green-700 flex items-center text-sm"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Agregar
                        </button>
                      </div>
                      <div className="space-y-3">
                        {instructions.map((instruction, index) => (
                          <div key={index} className="flex space-x-2">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-semibold text-green-600 mt-1">
                              {index + 1}
                            </div>
                            <textarea
                              value={instruction}
                              onChange={(e) => updateItem('instruction', index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={2}
                              placeholder={`Paso ${index + 1}: Describe el paso detalladamente...`}
                            />
                            {instructions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItem('instruction', index)}
                                className="text-red-600 hover:text-red-700 flex-shrink-0"
                              >
                                <MinusIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Nutrición */}
                {activeTab === 'nutrition' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Calorías
                        </label>
                        <input
                          {...register('nutritionFacts.calories', { valueAsNumber: true })}
                          type="number"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="250"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Carbohidratos (g)
                        </label>
                        <input
                          {...register('nutritionFacts.carbs', { valueAsNumber: true })}
                          type="number"
                          min="0"
                          step="0.1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="5.2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Proteínas (g)
                        </label>
                        <input
                          {...register('nutritionFacts.protein', { valueAsNumber: true })}
                          type="number"
                          min="0"
                          step="0.1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="12.5"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Grasas (g)
                        </label>
                        <input
                          {...register('nutritionFacts.fat', { valueAsNumber: true })}
                          type="number"
                          min="0"
                          step="0.1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="18.3"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: SEO */}
                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Keywords SEO
                      </label>
                      <textarea
                        {...register('seoKeywords')}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="receta keto, pan sin harina, desayuno cetogénico, receta fácil..."
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Separa las keywords con comas. Estas se añadirán a las keywords por defecto del sitio.
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Tags/Etiquetas
                        </label>
                        <button
                          type="button"
                          onClick={() => addItem('tag')}
                          className="text-green-600 hover:text-green-700 flex items-center text-sm"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Agregar Tag
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {tags.map((tag, index) => (
                          <div key={index} className="flex space-x-2">
                            <input
                              value={tag}
                              onChange={(e) => updateItem('tag', index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder={`Tag ${index + 1}`}
                            />
                            {tags.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItem('tag', index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <MinusIcon className="h-5 w-5" />
                              </button>
                            )}
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
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creando...
                      </>
                    ) : (
                      'Crear Post'
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