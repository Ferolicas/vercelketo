'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, ThumbsUp, Eye, Clock, Edit, Trash2, Send, Pin } from 'lucide-react';

interface ForumPost {
  _id: string;
  title: string;
  content: string;
  authorName: string;
  authorEmail: string;
  authorId: string;
  category: string;
  tags?: string[];
  isPinned: boolean;
  views: number;
  likes: number;
  replyCount: number;
  createdAt: string;
  updatedAt?: string;
  isEdited: boolean;
}

interface ForumReply {
  _id: string;
  content: string;
  authorName: string;
  authorEmail: string;
  authorId: string;
  likes: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface ForumPostDetailProps {
  post: ForumPost;
}

export default function ForumPostDetail({ post }: ForumPostDetailProps) {
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [newReply, setNewReply] = useState({
    content: '',
    authorName: '',
    authorEmail: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Forum categories for display
  const forumCategories = [
    { id: 'principiantes', title: 'Principiantes', color: 'bg-green-100 text-green-800', icon: '🌱' },
    { id: 'testimonios', title: 'Testimonios', color: 'bg-blue-100 text-blue-800', icon: '🎉' },
    { id: 'recetas', title: 'Recetas', color: 'bg-orange-100 text-orange-800', icon: '👩‍🍳' },
    { id: 'dudas', title: 'Dudas', color: 'bg-yellow-100 text-yellow-800', icon: '❓' },
    { id: 'ejercicio', title: 'Ejercicio', color: 'bg-red-100 text-red-800', icon: '💪' },
    { id: 'productos', title: 'Productos', color: 'bg-purple-100 text-purple-800', icon: '🛒' }
  ];

  const categoryData = forumCategories.find(cat => cat.id === post.category) || forumCategories[0];

  // Cargar respuestas
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await fetch(`/api/forum/replies?postId=${post._id}`);
        if (response.ok) {
          const data = await response.json();
          setReplies(data.replies);
        }
      } catch (error) {
        console.error('Error loading replies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [post._id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Generate unique author ID if not exists
      let authorId = localStorage.getItem('forumAuthorId');
      if (!authorId) {
        authorId = `author_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('forumAuthorId', authorId);
      }

      const response = await fetch('/api/forum/replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newReply.content,
          postId: post._id,
          authorName: newReply.authorName,
          authorEmail: newReply.authorEmail,
          authorId: authorId
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Add the new reply to the list
        const newReplyData = {
          ...result.reply,
          authorName: newReply.authorName,
          authorEmail: newReply.authorEmail,
          likes: 0,
          isEdited: false
        };

        setReplies(prevReplies => [...prevReplies, newReplyData]);
        setNewReply({ content: '', authorName: '', authorEmail: '' });
        setShowReplyForm(false);
        alert('¡Respuesta enviada exitosamente!');
      } else {
        throw new Error(result.error || 'Error al enviar respuesta');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert(`Error al enviar la respuesta: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReply = async (replyId: string) => {
    if (!editContent.trim()) return;

    try {
      const authorId = localStorage.getItem('forumAuthorId');
      if (!authorId) {
        alert('No tienes permisos para editar esta respuesta');
        return;
      }

      const response = await fetch('/api/forum/replies', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replyId,
          authorId,
          content: editContent
        })
      });

      const result = await response.json();

      if (response.ok) {
        setReplies(prevReplies =>
          prevReplies.map(reply =>
            reply._id === replyId
              ? { ...reply, content: editContent, isEdited: true, updatedAt: new Date().toISOString() }
              : reply
          )
        );
        setEditingReply(null);
        setEditContent('');
        alert('¡Respuesta actualizada exitosamente!');
      } else {
        throw new Error(result.error || 'Error al actualizar respuesta');
      }
    } catch (error) {
      console.error('Error updating reply:', error);
      alert(`Error al actualizar la respuesta: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta respuesta?')) return;

    try {
      const authorId = localStorage.getItem('forumAuthorId');
      if (!authorId) {
        alert('No tienes permisos para eliminar esta respuesta');
        return;
      }

      const response = await fetch('/api/forum/replies', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replyId,
          authorId,
          postId: post._id
        })
      });

      const result = await response.json();

      if (response.ok) {
        setReplies(prevReplies => prevReplies.filter(reply => reply._id !== replyId));
        alert('¡Respuesta eliminada exitosamente!');
      } else {
        throw new Error(result.error || 'Error al eliminar respuesta');
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      alert(`Error al eliminar la respuesta: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const canEdit = (reply: ForumReply) => {
    const authorId = localStorage.getItem('forumAuthorId');
    return authorId === reply.authorId;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        href="/foro" 
        className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Volver al foro
      </Link>

      {/* Post Header */}
      <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-4">
            {post.isPinned && (
              <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold mr-3 flex items-center">
                <Pin size={12} className="mr-1" />
                Fijado
              </div>
            )}
            <div className={`${categoryData.color} px-3 py-1 rounded-full text-xs font-semibold flex items-center`}>
              <span className="mr-1">{categoryData.icon}</span>
              {categoryData.title}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          <div className="prose max-w-none text-gray-700 mb-6">
            {post.content.split('\\n').map((paragraph, index) => (
              <p key={index} className="mb-3">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {post.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{post.authorName}</div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {formatDate(post.createdAt)}
                    {post.isEdited && post.updatedAt && (
                      <span className="ml-2 text-xs">(editado {formatDate(post.updatedAt)})</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-gray-500">
              <div className="flex items-center">
                <Eye size={16} className="mr-1" />
                {post.views}
              </div>
              <div className="flex items-center">
                <ThumbsUp size={16} className="mr-1" />
                {post.likes}
              </div>
              <div className="flex items-center">
                <MessageCircle size={16} className="mr-1" />
                {replies.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 inline-flex items-center"
        >
          <MessageCircle className="mr-2" size={18} />
          💬 Responder
        </button>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">✍️ Escribir Respuesta</h3>
          <form onSubmit={handleReplySubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre *</label>
                <input
                  type="text"
                  required
                  value={newReply.authorName}
                  onChange={(e) => setNewReply({...newReply, authorName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={newReply.authorEmail}
                  onChange={(e) => setNewReply({...newReply, authorEmail: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tu respuesta *</label>
              <textarea
                required
                rows={4}
                value={newReply.content}
                onChange={(e) => setNewReply({...newReply, content: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Escribe tu respuesta aquí..."
              />
            </div>
            
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
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
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2" size={16} />
                    Enviar Respuesta
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Replies Section */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="mr-2" size={24} />
            Respuestas ({replies.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando respuestas...</p>
            </div>
          ) : replies.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay respuestas aún</h3>
              <p className="text-gray-500">¡Sé el primero en responder!</p>
            </div>
          ) : (
            replies.map((reply) => (
              <div key={reply._id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                        {reply.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{reply.authorName}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {formatDate(reply.createdAt)}
                          {reply.isEdited && reply.updatedAt && (
                            <span className="ml-2 text-xs">(editado {formatDate(reply.updatedAt)})</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {editingReply === reply._id ? (
                      <div className="mb-4">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          rows={3}
                        />
                        <div className="flex justify-end gap-2 mt-3">
                          <button
                            onClick={() => {
                              setEditingReply(null);
                              setEditContent('');
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleEditReply(reply._id)}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-700 mb-4">
                        {reply.content.split('\\n').map((paragraph, index) => (
                          <p key={index} className="mb-2">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <button className="flex items-center hover:text-green-600 transition-colors">
                        <ThumbsUp size={14} className="mr-1" />
                        {reply.likes}
                      </button>
                      
                      {canEdit(reply) && editingReply !== reply._id && (
                        <>
                          <button
                            onClick={() => {
                              setEditingReply(reply._id);
                              setEditContent(reply.content);
                            }}
                            className="flex items-center hover:text-blue-600 transition-colors"
                          >
                            <Edit size={14} className="mr-1" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteReply(reply._id)}
                            className="flex items-center hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}