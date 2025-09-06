'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import type { Category, CreateRecipeForm } from '@/types/sanity';
import { z } from 'zod'

const recipeSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  ingredients: z.string().min(10, 'Los ingredientes deben tener al menos 10 caracteres'),
  preparation: z.string().min(20, 'La preparación debe tener al menos 20 caracteres'),
  preparationTime: z.string().regex(/^\d+$/, 'El tiempo debe ser un número'),
  servings: z.string().regex(/^\d+$/, 'Las porciones deben ser un número'),
  categoryId: z.string().min(1, 'Debe seleccionar una categoría'),
  youtubeUrl: z.string().optional().refine((val) => !val || val.includes('youtube.'), 'Debe ser una URL válida de YouTube')
})

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

interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSuccess: () => void;
}

export default function CreateRecipeModal({ isOpen, onClose, categories, onSuccess }: CreateRecipeModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    ingredients: '',
    preparation: '',
    youtubeUrl: '',
    preparationTime: '',
    servings: '',
    categoryId: '',
    thumbnail: null as File | null
  });
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Basic fields
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('preparation', form.preparation);
      formData.append('preparationTime', form.preparationTime);
      formData.append('servings', form.servings);
      formData.append('categoryId', form.categoryId);
      
      // Optional YouTube URL
      if (form.youtubeUrl) {
        formData.append('youtubeUrl', form.youtubeUrl);
      }
      
      // Ingredients as free text
      formData.append('ingredients', form.ingredients);
      
      // Thumbnail
      if (form.thumbnail) {
        formData.append('thumbnail', form.thumbnail);
      }

      const response = await fetch('/api/recipes', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      // Success!
      setToast({ message: '¡Receta creada exitosamente!', type: 'success' });
      
      setTimeout(() => {
        onSuccess();
        onClose();
        resetForm();
      }, 1500)

    } catch (error) {
      console.error('Error creating recipe:', error);
      setToast({ message: 'Error al crear la receta: ' + (error instanceof Error ? error.message : 'Error desconocido'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    setForm({
      name: '',
      description: '',
      ingredients: '',
      preparation: '',
      youtubeUrl: '',
      preparationTime: '',
      servings: '',
      categoryId: '',
      thumbnail: null
    });
    setErrors({})
    setIsDirty(false)
  }, []);

  // Focus management and keyboard handling
  useEffect(() => {
    if (!isOpen) return

    const timer = setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus()
      }
    }, 100)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
      
      // Focus trap
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
          
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleInputChange = useCallback((field: string, value: string | File | null) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }, [errors])

  const handleClose = useCallback(() => {
    if (isDirty) {
      const confirmClose = window.confirm('¿Estás seguro de que quieres cerrar? Se perderán los cambios no guardados.')
      if (!confirmClose) return
    }
    onClose()
  }, [isDirty, onClose])

  const isFormValid = useMemo(() => {
    return Object.keys(errors).length === 0 && 
           form.name.trim() !== '' && 
           form.description.trim() !== '' && 
           form.ingredients.trim() !== '' && 
           form.preparation.trim() !== '' && 
           form.preparationTime.trim() !== '' && 
           form.servings.trim() !== '' && 
           form.categoryId.trim() !== '' && 
           form.thumbnail !== null
  }, [errors, form])

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            ref={modalRef}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="modal-title" className="text-2xl font-bold">Crear Nueva Receta</h2>
                <p className="text-green-100 mt-1">Agrega una deliciosa receta keto</p>
              </div>
              <button
                ref={closeButtonRef}
                onClick={handleClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                disabled={loading}
                aria-label="Cerrar modal"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de la receta *
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Pizza Keto Deliciosa"
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe tu receta de manera atractiva..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    required
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time and Servings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tiempo (min) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={form.preparationTime}
                      onChange={(e) => setForm({ ...form, preparationTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Porciones *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={form.servings}
                      onChange={(e) => setForm({ ...form, servings: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="4"
                    />
                  </div>
                </div>

                {/* YouTube URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL de YouTube (opcional)
                  </label>
                  <input
                    type="url"
                    value={form.youtubeUrl}
                    onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Miniatura *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
                    <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => setForm({ ...form, thumbnail: e.target.files?.[0] || null })}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="cursor-pointer text-green-600 font-semibold hover:text-green-700"
                    >
                      {form.thumbnail ? form.thumbnail.name : 'Seleccionar imagen'}
                    </label>
                    <p className="text-gray-500 text-sm mt-2">PNG, JPG hasta 5MB</p>
                  </div>
                </div>

                {/* Ingredients */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ingredientes *
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={form.ingredients}
                    onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    placeholder="200g queso parmesano rallado
1 cucharadita de orégano seco
1/2 cucharadita de ajo en polvo
Pimienta negra molida
Paprika opcional

💡 Usa saltos de línea para separar ingredientes"
                  />
                  <p className="text-gray-500 text-xs mt-2">
                    💡 <strong>Formato libre:</strong> Escribe cada ingrediente en una línea nueva. Puedes usar cualquier formato que desees.
                  </p>
                </div>

                {/* Preparation */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preparación *
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={form.preparation}
                    onChange={(e) => setForm({ ...form, preparation: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    placeholder="Paso 1: ..."
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 min-w-32"
              >
                {loading ? 'Creando...' : 'Crear Receta'}
              </button>
            </div>
          </form>
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