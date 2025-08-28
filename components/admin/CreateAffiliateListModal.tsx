'use client'

import { useState } from 'react'
import { X, Plus, Image, Link, Save, Loader2 } from 'lucide-react'
import { urlFor } from '@/lib/sanity'

interface AffiliateItem {
  id: string
  title: string
  description: string
  imageUrl: string
  link: string
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
  const [affiliateLink, setAffiliateLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<AffiliateItem[]>([])
  const [currentItem, setCurrentItem] = useState<Partial<AffiliateItem>>({
    title: '',
    description: '',
    imageUrl: '',
    link: ''
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setCurrentItem(prev => ({ ...prev, imageUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const addItem = () => {
    if (!currentItem.title || !currentItem.description || !currentItem.link) {
      alert('Por favor completa todos los campos del producto')
      return
    }

    const newItem: AffiliateItem = {
      id: Date.now().toString(),
      title: currentItem.title,
      description: currentItem.description,
      imageUrl: currentItem.imageUrl || '',
      link: currentItem.link
    }

    setItems([...items, newItem])
    setCurrentItem({ title: '', description: '', imageUrl: '', link: '' })
    setImageFile(null)
    setImagePreview(null)
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      alert('Por favor ingresa un título para la lista')
      return
    }

    if (items.length === 0) {
      alert('Por favor agrega al menos un producto a la lista')
      return
    }

    setLoading(true)

    try {
      // Upload images and create affiliate list
      const formData = new FormData()
      
      // Upload main image if provided
      if (imageFile) {
        formData.append('image', imageFile)
      }

      // Create affiliate list data
      const affiliateData = {
        title: title.trim(),
        description: description.trim(),
        items: items.map(item => ({
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          link: item.link
        }))
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
    setAffiliateLink('')
    setItems([])
    setCurrentItem({ title: '', description: '', imageUrl: '', link: '' })
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
          {/* Main List Info */}
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

          {/* Items Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Agregar Productos</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título del Producto *</label>
                <input
                  type="text"
                  value={currentItem.title || ''}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nombre del producto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enlace de Afiliado *</label>
                <input
                  type="url"
                  value={currentItem.link || ''}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, link: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://amazon.com/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
              <textarea
                value={currentItem.description || ''}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Descripción breve del producto..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Producto</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setCurrentItem(prev => ({ ...prev, imageUrl: reader.result as string }))
                    }
                    reader.readAsDataURL(file)
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <button
              type="button"
              onClick={addItem}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Agregar Producto a la Lista
            </button>
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Productos Agregados ({items.length})</h3>
              
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:text-blue-600">
                        Ver enlace →
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
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
              disabled={loading || items.length === 0}
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