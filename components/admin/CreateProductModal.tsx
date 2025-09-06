'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon, PhotoIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { client } from '@/lib/sanity'
import { z } from 'zod'

const productSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'El precio debe ser un número válido'),
  originalPrice: z.string().optional().refine((val) => !val || /^\d+(\.\d{1,2})?$/.test(val), 'El precio original debe ser un número válido'),
  stripePriceId: z.string().optional()
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

interface CreateProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function CreateProductModal({ isOpen, onClose, onSuccess }: CreateProductModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    stripePriceId: '',
    featured: false
  })
  const [image, setImage] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const validateForm = useCallback(() => {
    try {
      productSchema.parse(formData)
      const newErrors: Record<string, string> = {}
      
      if (!image) {
        newErrors.image = 'La imagen del producto es requerida'
      }
      
      if (!pdfFile) {
        newErrors.pdfFile = 'El archivo PDF es requerido'
      }
      
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
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
  }, [formData, image, pdfFile])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setToast({ message: 'Por favor corrige los errores en el formulario', type: 'error' })
      return
    }

    // Validate file sizes
    if (image && image.size > 5 * 1024 * 1024) {
      setToast({ message: 'La imagen no puede ser mayor a 5MB', type: 'error' })
      return
    }
    
    if (pdfFile && pdfFile.size > 10 * 1024 * 1024) {
      setToast({ message: 'El PDF no puede ser mayor a 10MB', type: 'error' })
      return
    }

    setIsSubmitting(true)

    try {
      // Upload image
      let imageAsset = null
      if (image) {
        imageAsset = await client.assets.upload('image', image)
      }

      // Upload PDF
      let pdfAsset = null
      if (pdfFile) {
        pdfAsset = await client.assets.upload('file', pdfFile)
      }

      // Create product
      const product = await client.create({
        _type: 'product',
        title: formData.title,
        slug: {
          _type: 'slug',
          current: formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        },
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stripePriceId: formData.stripePriceId || undefined,
        category: 'Libro',
        image: imageAsset ? {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id
          },
          alt: formData.title
        } : undefined,
        pdfFile: pdfAsset ? {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: pdfAsset._id
          }
        } : undefined,
        featured: formData.featured,
        clickCount: 0,
        createdAt: new Date().toISOString()
      })

      setToast({ message: '¡Producto creado exitosamente!', type: 'success' })
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        originalPrice: '',
        stripePriceId: '',
        featured: false
      })
      setImage(null)
      setPdfFile(null)
      setIsDirty(false)
      
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 1500)
      
    } catch (error) {
      console.error('Error creating product:', error)
      setToast({ message: 'Error al crear el producto. Por favor intenta de nuevo.', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, image, pdfFile, validateForm, onSuccess, onClose])

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

  const handleInputChange = useCallback((field: string, value: string | boolean) => {
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
    return Object.keys(errors).length === 0 && 
           formData.title.trim() !== '' && 
           formData.price.trim() !== '' && 
           image !== null && 
           pdfFile !== null
  }, [errors, formData, image, pdfFile])

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
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 id="modal-title" className="text-2xl font-bold">Crear Producto</h3>
                <p className="text-green-100 mt-1">Agregar nuevo libro digital</p>
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
                Título del Producto *
              </label>
              <input
                ref={titleInputRef}
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Guía Completa Keto 2024"
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && (
                <p id="title-error" className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Descripción del producto..."
                aria-describedby={errors.description ? 'description-error' : undefined}
              />
              {errors.description && (
                <p id="description-error" className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Precios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio a Cobrar (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="29.99"
                  aria-describedby={errors.price ? 'price-error' : undefined}
                />
                {errors.price && (
                  <p id="price-error" className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Original (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.originalPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="49.99"
                  aria-describedby={errors.originalPrice ? 'originalPrice-error' : undefined}
                />
                {errors.originalPrice && (
                  <p id="originalPrice-error" className="mt-1 text-sm text-red-600">{errors.originalPrice}</p>
                )}
              </div>
            </div>

            {/* Stripe Price ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stripe Price ID
              </label>
              <input
                type="text"
                value={formData.stripePriceId}
                onChange={(e) => handleInputChange('stripePriceId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="price_1234..."
              />
              <p className="mt-1 text-xs text-gray-500">ID del precio en Stripe para pagos automatizados</p>
            </div>

            {/* Imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen del Producto *
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PhotoIcon className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {image ? image.name : 'Click para subir imagen'}
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
                      setImage(file)
                      setIsDirty(true)
                      if (errors.image) {
                        setErrors(prev => ({ ...prev, image: '' }))
                      }
                    }}
                  />
                </label>
              </div>
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
              )}
            </div>

            {/* Archivo PDF */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivo PDF *
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <DocumentIcon className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {pdfFile ? pdfFile.name : 'Click para subir PDF'}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      if (file && file.size > 10 * 1024 * 1024) {
                        setToast({ message: 'El PDF no puede ser mayor a 10MB', type: 'error' })
                        return
                      }
                      setPdfFile(file)
                      setIsDirty(true)
                      if (errors.pdfFile) {
                        setErrors(prev => ({ ...prev, pdfFile: '' }))
                      }
                    }}
                  />
                </label>
              </div>
              {errors.pdfFile && (
                <p className="mt-1 text-sm text-red-600">{errors.pdfFile}</p>
              )}
            </div>

            {/* Featured */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Mostrar como destacado
              </label>
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
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  'Crear Producto'
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