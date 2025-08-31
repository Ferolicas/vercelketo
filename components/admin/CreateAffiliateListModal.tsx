'use client'

import { useState } from 'react'
import { X, Image, Link, Save, Loader2 } from 'lucide-react'
import { urlFor } from '@/lib/sanity'

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
      alert('Por favor ingresa un título para la lista')
      return
    }

    if (!amazonListUrl.trim()) {
      alert('Por favor ingresa el enlace de la lista de Amazon')
      return
    }

    // Validate Amazon URL
    if (!amazonListUrl.includes('amazon.') || !amazonListUrl.startsWith('http')) {
      alert('Por favor ingresa un enlace válido de Amazon')
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
        alert('¡Lista de afiliados creada exitosamente!')
        onSuccess()
        resetForm()
      } else {
        throw new Error(result.error || 'Error al crear la lista')
      }
    } catch (error) {
      console.error('Error creating affiliate list:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setImageFile(null)
    setImagePreview(null)
    setAmazonListUrl('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Crear Lista de Afiliados</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                onChange={(e) => setDescription(e.target.value)}
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
                  onChange={(e) => setAmazonListUrl(e.target.value)}
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
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
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
  )
}