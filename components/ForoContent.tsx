'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ForumPost } from '@/types/sanity';
import { ContentAd } from './AdSystem';
import { Plus, MessageCircle, Eye, ThumbsUp, Clock, Pin, Users, Send, Search } from 'lucide-react';

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
  forumPosts: initialForumPosts,
  categories,
  pinnedPosts: initialPinnedPosts
}: ForoContentProps) {
  const [forumPosts, setForumPosts] = useState(initialForumPosts);
  const [pinnedPosts, setPinnedPosts] = useState(initialPinnedPosts);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    category: '',
    content: '',
    authorName: '',
    authorEmail: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>(initialForumPosts);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Forum categories for the form
  const forumCategories = [
    { id: 'principiantes', title: 'Principiantes', color: 'bg-green-100 text-green-800', icon: '🌱' },
    { id: 'testimonios', title: 'Testimonios', color: 'bg-blue-100 text-blue-800', icon: '🎉' },
    { id: 'recetas', title: 'Recetas', color: 'bg-orange-100 text-orange-800', icon: '👩‍🍳' },
    { id: 'dudas', title: 'Dudas', color: 'bg-yellow-100 text-yellow-800', icon: '❓' },
    { id: 'ejercicio', title: 'Ejercicio', color: 'bg-red-100 text-red-800', icon: '💪' },
    { id: 'productos', title: 'Productos', color: 'bg-purple-100 text-purple-800', icon: '🛒' }
  ];

  // Filter posts based on category and search query
  useEffect(() => {
    const fetchFilteredPosts = async () => {
      setIsSearching(true);
      
      if (searchQuery.trim()) {
        // Use search API when there's a search query
        try {
          const response = await fetch(`/api/forum/search?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory === 'Todos' ? 'all' : selectedCategory}`);
          const data = await response.json();
          setFilteredPosts(data.posts || []);
        } catch (error) {
          console.error('Error searching posts:', error);
          setFilteredPosts([]);
        }
      } else {
        // Use local filtering for category selection
        let filtered = [...forumPosts];
        if (selectedCategory !== 'Todos') {
          filtered = filtered.filter(post => post.category === selectedCategory);
        }
        setFilteredPosts(filtered);
      }
      
      setIsSearching(false);
    };

    // Add debouncing for search
    const timeoutId = setTimeout(() => {
      fetchFilteredPosts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [forumPosts, selectedCategory, searchQuery]);

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
        
        // Add the new post to the list without reloading
        const newPostData = {
          ...result.post,
          author: { name: newPost.authorName, email: newPost.authorEmail },
          replyCount: 0,
          views: 0,
          likes: 0,
          isPinned: false
        };
        
        setForumPosts(prevPosts => [newPostData, ...prevPosts]);
        setNewPost({ title: '', category: '', content: '', authorName: '', authorEmail: '' });
        setShowCreatePost(false);
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

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar en títulos, descripciones y autores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Categories Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Users className="mr-2" size={20} />
          Categorías del Foro
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('Todos')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center cursor-pointer hover:scale-105 transition-transform ${
              selectedCategory === 'Todos' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {forumCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`${category.color} px-4 py-2 rounded-xl text-sm font-semibold flex items-center cursor-pointer hover:scale-105 transition-transform ${
                selectedCategory === category.id 
                  ? 'ring-2 ring-offset-2 ring-green-500' 
                  : ''
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.title}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Count */}
      {(filteredPosts.length > 0 || searchQuery) && (
        <div className="text-center mb-6">
          <div className="text-sm text-gray-600">
            {isSearching ? (
              <span className="inline-flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Buscando...
              </span>
            ) : (
              <span>
                Mostrando {filteredPosts.length} {filteredPosts.length === 1 ? 'publicación' : 'publicaciones'}
                {selectedCategory !== 'Todos' && ` en ${forumCategories.find(c => c.id === selectedCategory)?.title}`}
                {searchQuery && ` para "${searchQuery}"`}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {isSearching ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-4 w-1/4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-gray-400 mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {searchQuery ? 'No se encontraron resultados' : 'No hay publicaciones aún'}
            </h3>
            <p className="text-gray-500">
              {searchQuery 
                ? 'Intenta con otras palabras clave o ajusta los filtros' 
                : '¡Sé el primero en crear una publicación!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              // Buscar la categoría en forumCategories
              const categoryData = forumCategories.find(cat => cat.id === post.category) || 
                                  forumCategories[0]; // fallback a la primera categoría
              
              return (
                <div key={post._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`${categoryData.color} px-3 py-1 rounded-full text-xs font-semibold`}>
                          {categoryData.icon} {categoryData.title}
                        </span>
                        {post.pinned && (
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                            <Pin size={12} className="mr-1" /> Fijado
                          </span>
                        )}
                      </div>
                      
                      <Link href={`/foro/${post.slug?.current || post._id}`} className="block">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-green-600 transition-colors">
                          {post.title}
                        </h2>
                      </Link>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.content || 'Sin contenido...'}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">
                              {(post.authorName || 'U').charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{post.authorName || 'Usuario'}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {formatDate(post.createdAt)}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Eye size={14} className="mr-1" />
                            {(post as any).views || 0}
                          </div>
                          <div className="flex items-center">
                            <ThumbsUp size={14} className="mr-1" />
                            {(post as any).likes || 0}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle size={14} className="mr-1" />
                            {(post as any).replyCount || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Crear Nueva Publicación</h2>
            </div>
            
            <form onSubmit={handleSubmitPost} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="¿De qué quieres hablar?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  required
                  value={newPost.category}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Selecciona una categoría</option>
                  {forumCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido *
                </label>
                <textarea
                  required
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Comparte tu experiencia, pregunta o consejo..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPost.authorName}
                    onChange={(e) => setNewPost({...newPost, authorName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newPost.authorEmail}
                    onChange={(e) => setNewPost({...newPost, authorEmail: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
      )}
      
      <ContentAd position="bottom" />
    </div>
  );
}