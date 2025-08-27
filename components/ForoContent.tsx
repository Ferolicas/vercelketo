'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ForumPost } from '@/types/sanity';
import { ContentAd } from './AdSystem';
import { Plus, MessageCircle, Eye, ThumbsUp, Clock, Pin, Users, Send } from 'lucide-react';

interface ForoContentProps {
  forumPosts: ForumPost[];
  categories: any[];
  pinnedPosts: ForumPost[];
  currentPage: number;
  totalPages: number;
  selectedCategory?: string;
  sortOrder: string;
  totalPosts: number;
}

export default function ForoContent({
  forumPosts,
  categories,
  pinnedPosts
}: ForoContentProps) {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    category: '',
    content: '',
    authorName: '',
    authorEmail: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Mock data de posts para el foro
  const mockPosts = [
    {
      _id: '1',
      title: '¿Cómo empezar con la dieta keto siendo principiante?',
      content: 'Hola a todos, soy nueva en esto de la dieta keto y no sé por dónde empezar. ¿Alguien me puede dar consejos básicos?',
      author: { name: 'María García', email: 'maria@email.com' },
      category: { title: 'Principiantes', color: 'bg-green-100 text-green-800', icon: '🌱' },
      _createdAt: '2024-01-15T10:30:00Z',
      views: 142,
      likes: 23,
      replyCount: 12,
      isPinned: false
    },
    {
      _id: '2',
      title: '¡Perdí 10kg en 3 meses con keto! Mi experiencia',
      content: 'Quiero compartir mi experiencia con la dieta keto. He perdido 10 kilos en 3 meses y me siento increíble...',
      author: { name: 'Carlos Mendoza', email: 'carlos@email.com' },
      category: { title: 'Testimonios', color: 'bg-blue-100 text-blue-800', icon: '🎉' },
      _createdAt: '2024-01-14T15:45:00Z',
      views: 89,
      likes: 45,
      replyCount: 8,
      isPinned: true
    },
    {
      _id: '3',
      title: 'Receta de pan keto que no falla',
      content: 'Después de muchos intentos, encontré la receta perfecta de pan keto. ¡Es súper fácil y queda delicioso!',
      author: { name: 'Ana López', email: 'ana@email.com' },
      category: { title: 'Recetas', color: 'bg-orange-100 text-orange-800', icon: '👩‍🍳' },
      _createdAt: '2024-01-13T09:20:00Z',
      views: 234,
      likes: 67,
      replyCount: 15,
      isPinned: false
    },
    {
      _id: '4',
      title: '¿Es normal tener fatiga los primeros días?',
      content: 'Llevo 4 días con keto y me siento muy cansada. ¿Es normal? ¿Cuándo mejora?',
      author: { name: 'Laura Ruiz', email: 'laura@email.com' },
      category: { title: 'Dudas', color: 'bg-yellow-100 text-yellow-800', icon: '❓' },
      _createdAt: '2024-01-12T18:10:00Z',
      views: 78,
      likes: 12,
      replyCount: 9,
      isPinned: false
    }
  ];
  
  const mockCategories = [
    { _id: '1', title: 'Principiantes', color: 'bg-green-100 text-green-800', icon: '🌱' },
    { _id: '2', title: 'Testimonios', color: 'bg-blue-100 text-blue-800', icon: '🎉' },
    { _id: '3', title: 'Recetas', color: 'bg-orange-100 text-orange-800', icon: '👩‍🍳' },
    { _id: '4', title: 'Dudas', color: 'bg-yellow-100 text-yellow-800', icon: '❓' },
    { _id: '5', title: 'Ejercicio', color: 'bg-red-100 text-red-800', icon: '💪' },
    { _id: '6', title: 'Productos', color: 'bg-purple-100 text-purple-800', icon: '🛒' }
  ];
  
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Generate unique author ID if not exists
      let authorId = localStorage.getItem('forumAuthorId');
      if (!authorId) {
        authorId = `author_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('forumAuthorId', authorId);
      }
      
      // Create forum post in Sanity
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          authorName: newPost.authorName,
          authorEmail: newPost.authorEmail,
          authorId: authorId,
          tags: []
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('¡Publicación creada exitosamente!');
        setNewPost({ title: '', category: '', content: '', authorName: '', authorEmail: '' });
        setShowCreatePost(false);
        
        // Optionally refresh the page or add the new post to the list
        window.location.reload();
      } else {
        throw new Error(result.error || 'Error al crear publicación');
      }
    } catch (error) {
      console.error('Error creating forum post:', error);
      alert(`Error al crear la publicación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setSubmitting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          💬 Foro Keto
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          La comunidad cetogénica más activa en español
        </p>
        
        <button
          onClick={() => setShowCreatePost(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center"
        >
          <Plus className="mr-2" size={20} />
          🗣️ Crear Nueva Publicación
        </button>
      </div>
      
      {/* Categories Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Users className="mr-2" size={20} />
          Categorías del Foro
        </h3>
        <div className="flex flex-wrap gap-3">
          {mockCategories.map((category) => (
            <div key={category._id} className={`${category.color} px-4 py-2 rounded-xl text-sm font-semibold flex items-center cursor-pointer hover:scale-105 transition-transform`}>
              <span className="mr-2">{category.icon}</span>
              {category.title}
            </div>
          ))}
        </div>
      </div>
      
      {/* Posts List */}
      <div className="space-y-4">
        {mockPosts.map((post) => (
          <div key={post._id} className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
            post.isPinned ? 'border-2 border-yellow-400' : ''
          }`}>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    {post.isPinned && (
                      <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold mr-3 flex items-center">
                        <Pin size={12} className="mr-1" />
                        Fijado
                      </div>
                    )}
                    <div className={`${post.category.color} px-3 py-1 rounded-full text-xs font-semibold flex items-center`}>
                      <span className="mr-1">{post.category.icon}</span>
                      {post.category.title}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-green-600 transition-colors cursor-pointer">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">
                          {post.author.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{post.author.name}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {formatDate(post._createdAt)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye size={14} className="mr-1" />
                        {post.views}
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp size={14} className="mr-1" />
                        {post.likes}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle size={14} className="mr-1" />
                        {post.replyCount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-white rounded-t-3xl">
                <h3 className="text-2xl font-bold">✍️ Crear Nueva Publicación</h3>
                <p className="text-green-100 mt-1">Comparte con la comunidad keto</p>
              </div>
              
              <form onSubmit={handleSubmitPost} className="p-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre *</label>
                      <input
                        type="text"
                        required
                        value={newPost.authorName}
                        onChange={(e) => setNewPost({...newPost, authorName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={newPost.authorEmail}
                        onChange={(e) => setNewPost({...newPost, authorEmail: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Título *</label>
                    <input
                      type="text"
                      required
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="¿Cuál es tu pregunta o tema?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría *</label>
                    <select
                      required
                      value={newPost.category}
                      onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Selecciona una categoría</option>
                      {mockCategories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.icon} {category.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contenido *</label>
                    <textarea
                      required
                      rows={6}
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Comparte tu experiencia, pregunta o consejo con la comunidad..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowCreatePost(false)}
                    disabled={submitting}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Publicando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2" size={16} />
                        Publicar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <ContentAd position="bottom" />
    </div>
  );
}