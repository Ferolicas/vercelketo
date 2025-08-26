'use client';

import { useState } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import type { Category, CreateRecipeForm } from '@/types/sanity';

interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSuccess: () => void;
}

export default function CreateRecipeModal({ isOpen, onClose, categories, onSuccess }: CreateRecipeModalProps) {
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [form, setForm] = useState({
    name: '',
    description: '',
    preparation: '',
    youtubeUrl: '',
    preparationTime: '',
    servings: '',
    categoryId: '',
    thumbnail: null as File | null
  });

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
      
      // Ingredients (filter out empty ones)
      const validIngredients = ingredients.filter(ing => ing.trim() !== '');
      formData.append('ingredients', JSON.stringify(validIngredients));
      
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
      alert('¡Receta creada exitosamente!');
      onSuccess();
      onClose();
      resetForm();

    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Error al crear la receta: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      preparation: '',
      youtubeUrl: '',
      preparationTime: '',
      servings: '',
      categoryId: '',
      thumbnail: null
    });
    setIngredients(['']);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Crear Nueva Receta</h2>
                <p className="text-green-100 mt-1">Agrega una deliciosa receta keto</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de la receta *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ej: Pizza Keto Deliciosa"
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Ingredientes *
                    </label>
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-1"
                    >
                      <Plus size={16} />
                      Agregar
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={ingredient}
                          onChange={(e) => updateIngredient(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          placeholder={`Ingrediente ${index + 1}`}
                        />
                        {ingredients.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeIngredient(index)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
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
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 min-w-32"
              >
                {loading ? 'Creando...' : 'Crear Receta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}