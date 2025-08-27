'use client';

import { useState } from 'react';
import { X, Upload, Users } from 'lucide-react';

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateServiceModal({ isOpen, onClose, onSuccess }: CreateServiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState(['']);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'EUR',
    duration: '',
    contactUrl: '',
    whatsapp: '',
    featured: false,
    image: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Basic fields
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('currency', form.currency);
      formData.append('duration', form.duration);
      formData.append('contactUrl', form.contactUrl);
      formData.append('whatsapp', form.whatsapp);
      formData.append('featured', String(form.featured));
      formData.append('features', JSON.stringify(features.filter(f => f.trim())));
      
      // Image
      if (form.image) {
        formData.append('image', form.image);
      }

      // En producción, implementar API /api/services
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular
      
      alert('¡Servicio creado exitosamente!');
      onSuccess();
      onClose();
      resetForm();

    } catch (error) {
      console.error('Error creating service:', error);
      alert('Error al crear el servicio');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      currency: 'EUR',
      duration: '',
      contactUrl: '',
      whatsapp: '',
      featured: false,
      image: null
    });
    setFeatures(['']);
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Crear Nuevo Servicio</h2>
                <p className="text-teal-100 mt-1">Agrega un servicio profesional</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                disabled={loading}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre del Servicio *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Ej: Consultoría Nutricional Keto"
                  />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Describe el servicio, beneficios y lo que incluye..."
                  />
                </div>

                {/* Price and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Precio *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        required
                        min="0"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="97.00"
                      />
                      <select
                        value={form.currency}
                        onChange={(e) => setForm({ ...form, currency: e.target.value })}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-gray-600 text-sm focus:ring-0"
                      >
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duración (opcional)
                    </label>
                    <input
                      type="text"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="60 minutos"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL de Contacto *
                  </label>
                  <input
                    type="url"
                    required
                    value={form.contactUrl}
                    onChange={(e) => setForm({ ...form, contactUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="https://calendly.com/tu-usuario"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp (opcional)
                  </label>
                  <input
                    type="text"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="+34123456789"
                  />
                </div>

                {/* Featured */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <label className="ml-3 text-sm font-semibold text-gray-700">
                    Servicio destacado
                  </label>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Imagen del Servicio *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-teal-400 transition-colors">
                    <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
                      className="hidden"
                      id="service-image-upload"
                    />
                    <label
                      htmlFor="service-image-upload"
                      className="cursor-pointer text-teal-600 font-semibold hover:text-teal-700"
                    >
                      {form.image ? form.image.name : 'Seleccionar imagen'}
                    </label>
                    <p className="text-gray-500 text-sm mt-2">PNG, JPG hasta 5MB</p>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Características del Servicio *
                    </label>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-teal-600 hover:text-teal-700 font-semibold text-sm flex items-center gap-1"
                    >
                      <Users size={16} />
                      Agregar
                    </button>
                  </div>
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                          placeholder={`Característica ${index + 1}`}
                        />
                        {features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Preview */}
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                  <h4 className="text-lg font-bold text-teal-800 mb-4">Vista Previa</h4>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-2xl">
                        🎯
                      </div>
                      {form.featured && (
                        <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                          ⭐ Destacado
                        </span>
                      )}
                    </div>
                    <h5 className="text-xl font-bold text-gray-900 mb-2">
                      {form.name || 'Nombre del servicio'}
                    </h5>
                    <p className="text-gray-600 mb-4 text-sm">
                      {form.description || 'Descripción del servicio...'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-teal-600">
                        €{form.price || '0'}
                        {form.duration && <span className="text-sm text-gray-500 ml-1">/ {form.duration}</span>}
                      </div>
                      <button className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700">
                        Contratar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 min-w-32"
              >
                {loading ? 'Creando...' : 'Crear Servicio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}