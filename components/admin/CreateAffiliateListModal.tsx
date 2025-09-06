'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { X, Image, Link, Save, Loader2 } from 'lucide-react'
import { urlFor } from '@/lib/sanity'

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

interface CreateAffiliateListModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateAffiliateListModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: CreateAffiliateListModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [amazonListUrl, setAmazonListUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setToast({ message: 'Por favor ingresa un título para la lista', type: 'error' })
      return
    }

    if (!amazonListUrl.trim()) {
      setToast({ message: 'Por favor ingresa el enlace de la lista de Amazon', type: 'error' })
      return
    }

    // Validate Amazon URL
    if (!amazonListUrl.includes('amazon.') || !amazonListUrl.startsWith('http')) {
      setToast({ message: 'Por favor ingresa un enlace válido de Amazon', type: 'error' })
      return
    }

    // Validate file size
    if (imageFile && imageFile.size > 5 * 1024 * 1024) {
      setToast({ message: 'La imagen no puede ser mayor a 5MB', type: 'error' })
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      
      // Upload main image if provided
      if (imageFile) {
        formData.append('image', imageFile)
      }

      // Create affiliate list data
      const affiliateData = {
        title: title.trim(),
        description: description.trim(),
        amazonListUrl: amazonListUrl.trim()
      }

      formData.append('affiliateData', JSON.stringify(affiliateData))

      const response = await fetch('/api/affiliates', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setToast({ message: '¡Lista de afiliados creada exitosamente!', type: 'success' })
        
        setTimeout(() => {
          onSuccess()
          onClose()
          resetForm()
        }, 1500)
      } else {
        throw new Error(result.error || 'Error al crear la lista')
      }
    } catch (error) {
      console.error('Error creating affiliate list:', error)
      setToast({ message: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = useCallback(() => {
    setTitle('')
    setDescription('')
    setImageFile(null)
    setImagePreview(null)
    setAmazonListUrl('')
    setIsDirty(false)
  }, [])

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
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    if (isDirty) {
      const confirmClose = window.confirm('¿Estás seguro de que quieres cerrar? Se perderán los cambios no guardados.')
      if (!confirmClose) return
    }
    onClose()
  }, [isDirty, onClose])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div 
          ref={modalRef}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-900">Crear Lista de Afiliados</h2>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Información de la Lista</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la Lista *
              </label>
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setIsDirty(true)
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: Productos Keto Recomendados"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  setIsDirty(true)
                }}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Breve descripción de la lista..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enlace de la Lista de Amazon *
              </label>
              <div className="flex items-center space-x-2">
                <Link size={20} className="text-gray-500" />
                <input
                  type="url"
                  value={amazonListUrl}
                  onChange={(e) => {
                    setAmazonListUrl(e.target.value)
                    setIsDirty(true)
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://www.amazon.es/hz/wishlist/ls/XXXXXXXXX"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Pega aquí el enlace de tu lista de Amazon ya creada
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen Principal
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="main-image"
                />
                <label
                  htmlFor="main-image"
                  className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                >
                  <Image size={20} className="mr-2" />
                  Subir Imagen
                </label>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !amazonListUrl.trim()}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  Crear Lista
                </>
              )}
            </button>
          </div>
          </form>
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