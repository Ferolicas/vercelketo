'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { client } from '@/lib/sanity'
import { z } from 'zod'

const postSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  excerpt: z.string().min(20, 'El resumen debe tener al menos 20 caracteres'),
  content: z.string().min(50, 'El contenido debe tener al menos 50 caracteres'),
  author: z.string().optional(),
  tags: z.string().optional()
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
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    tags: ''
  })
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const validateForm = useCallback(() => {
    try {
      postSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }, [formData])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setToast({ message: 'Por favor corrige los errores en el formulario', type: 'error' })
      return
    }

    // Validate file size
    if (featuredImage && featuredImage.size > 5 * 1024 * 1024) {
      setToast({ message: 'La imagen no puede ser mayor a 5MB', type: 'error' })
      return
    }

    setIsSubmitting(true)

    try {
      // Upload featured image
      let imageAsset = null
      if (featuredImage) {
        imageAsset = await client.assets.upload('image', featuredImage)
      }

      // Create blog post
      const blogPost = await client.create({
        _type: 'blogPost',
        title: formData.title,
        slug: {
          _type: 'slug',
          current: formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        },
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author || 'Planeta Keto',
        featuredImage: imageAsset ? {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id
          },
          alt: formData.title
        } : undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        published: true,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      })

      setToast({ message: '¡Blog post creado exitosamente!', type: 'success' })
      
      // Reset form
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        tags: ''
      })
      setFeaturedImage(null)
      setIsDirty(false)
      
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 1500)
      
    } catch (error) {
      console.error('Error creating blog post:', error)
      setToast({ message: 'Error al crear el blog post. Por favor intenta de nuevo.', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, featuredImage, validateForm, onSuccess, onClose])

  // Focus management and keyboard handling
  useEffect(() => {
    if (!isOpen) return

    const timer = setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus()
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

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
    return Object.keys(errors).length === 0 && formData.title.trim() !== '' && formData.excerpt.trim() !== '' && formData.content.trim() !== ''
  }, [errors, formData])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 id="modal-title" className="text-2xl font-bold">Crear Blog Post</h3>
                <p className="text-purple-100 mt-1">Agregar nuevo artículo al blog</p>
              </div>
              <button
                ref={closeButtonRef}
                onClick={handleClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                aria-label="Cerrar modal"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Artículo *
              </label>
              <input
                ref={titleInputRef}
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Los Beneficios de la Dieta Keto"
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && (
                <p id="title-error" className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Autor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Autor
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Planeta Keto"
              />
            </div>

            {/* Resumen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resumen/Descripción *
              </label>
              <textarea
                rows={3}
                required
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.excerpt ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Breve descripción del artículo..."
                aria-describedby={errors.excerpt ? 'excerpt-error' : undefined}
              />
              {errors.excerpt && (
                <p id="excerpt-error" className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
              )}
            </div>

            {/* Contenido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido Completo *
              </label>
              <textarea
                rows={8}
                required
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Contenido completo del artículo. Puedes usar markdown para formatear..."
                aria-describedby={errors.content ? 'content-error' : undefined}
              />
              {errors.content && (
                <p id="content-error" className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Etiquetas)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="keto, dieta, nutrición, recetas (separadas por comas)"
              />
              <p className="mt-1 text-xs text-gray-500">Separa los tags con comas</p>
            </div>

            {/* Imagen destacada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen Destacada
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PhotoIcon className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {featuredImage ? featuredImage.name : 'Click para subir imagen (opcional)'}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      if (file && file.size > 5 * 1024 * 1024) {
                        setToast({ message: 'La imagen no puede ser mayor a 5MB', type: 'error' })
                        return
                      }
                      setFeaturedImage(file)
                      setIsDirty(true)
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  'Crear Blog Post'
                )}
              </button>
            </div>
          </form>
          </motion.div>
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
  )
}