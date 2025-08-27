'use client';

import { useState, useEffect } from 'react';
import { Star, MessageCircle, Send, Loader2, Reply, Edit2, Trash2, User, Sparkles, Award } from 'lucide-react';

interface Comment {
  _id: string;
  _createdAt: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  authorId: string;
  rating?: number;
  approved: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  parentComment?: string;
  adminReply?: string;
  adminReplyPublished?: boolean;
  adminReplyDate?: string;
  replies?: Comment[];
}

interface CommentsProps {
  postSlug: string;
  postTitle: string;
}

export default function Comments({ postSlug, postTitle }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [userAuthorId, setUserAuthorId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
    rating: 0,
    parentComment: null as string | null
  });
  
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Asegurar que el componente está montado en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cargar comentarios
  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  // Cargar authorId del localStorage solo después del montaje
  useEffect(() => {
    if (isMounted) {
      const savedAuthorId = localStorage.getItem('commentAuthorId');
      if (savedAuthorId) {
        setUserAuthorId(savedAuthorId);
      }
    }
  }, [isMounted]);

  const generateAuthorId = (email: string): string => {
    const timestamp = Date.now();
    const hash = btoa(email + timestamp).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    return `author_${hash}_${timestamp}`;
  };

  const fetchComments = async () => {
    try {
      // Force fresh data from server without cache
      const response = await fetch(`/api/comments?postSlug=${postSlug}&_t=${Date.now()}`, { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const data = await response.json();

      if (response.ok) {
        const organized = organizeComments(data.comments || []);
        setComments(organized);
        console.log('Comments updated successfully:', organized.length, 'comments loaded');
      } else {
        console.error('Error fetching comments:', data.error);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const organizeComments = (commentList: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // Primero, crear un mapa de todos los comentarios
    commentList.forEach(comment => {
      commentMap.set(comment._id, { ...comment, replies: [] });
    });

    // Luego, organizar en jerarquía
    commentList.forEach(comment => {
      const commentWithReplies = commentMap.get(comment._id)!;
      
      if (comment.parentComment) {
        const parent = commentMap.get(comment.parentComment);
        if (parent) {
          parent.replies!.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica: campos obligatorios no vacíos
    if (!formData.name.trim() || !formData.email.trim() || !formData.content.trim()) {
      setMessage({ type: 'error', text: 'Por favor completa todos los campos obligatorios' });
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Por favor ingresa un email válido' });
      return;
    }

    if (formData.content.trim().length < 4) {
      setMessage({ type: 'error', text: 'El contenido del comentario debe tener al menos 4 caracteres.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      // Generar authorId si no existe
      let currentAuthorId = userAuthorId;
      if (!currentAuthorId) {
        currentAuthorId = generateAuthorId(formData.email);
        setUserAuthorId(currentAuthorId);
        if (isMounted) {
          localStorage.setItem('commentAuthorId', currentAuthorId);
        }
      }

      const response = await fetch('/api/comments', {
        method: editingComment ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          content: formData.content,
          rating: formData.parentComment ? null : (formData.rating || null),
          parentComment: formData.parentComment,
          postSlug,
          postTitle,
          authorId: currentAuthorId,
          commentId: editingComment
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: editingComment ? 'Comentario actualizado' : data.message 
        });
        
        // Reset form
        setFormData({ name: '', email: '', content: '', rating: 0, parentComment: null });
        setReplyingTo(null);
        setEditingComment(null);
        
        // Refresh comments immediately without page reload
        await fetchComments();
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al procesar el comentario' });
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setMessage({ type: 'error', text: 'Error al procesar el comentario' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
    setFormData(prev => ({ ...prev, parentComment: commentId, rating: 0 }));
    setEditingComment(null);
  };

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment._id);
    setFormData({
      name: comment.author.name,
      email: comment.author.email,
      content: comment.content,
      rating: comment.rating || 0,
      parentComment: comment.parentComment || null
    });
    setReplyingTo(null);
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, authorId: userAuthorId })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Comentario eliminado' });
        // Immediately update comments without page reload
        await fetchComments();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Error al eliminar comentario' });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      setMessage({ type: 'error', text: 'Error al eliminar comentario' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRatingClick = (rating: number) => {
    if (formData.parentComment) return; // No rating for replies
    
    setFormData(prev => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }));
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setEditingComment(null);
    setFormData({ name: '', email: '', content: '', rating: 0, parentComment: null });
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) {
      return "Fecha no disponible";
    }

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Fecha inválida";
      }

      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error("Error al procesar la fecha:", error);
      return "Error al procesar fecha";
    }
  };

  const canModifyComment = (comment: Comment): boolean => {
    return isMounted && userAuthorId === comment.authorId;
  };

  const renderComment = (comment: Comment, isReply = false) => {
    if (comment.isDeleted) {
      return (
        <div key={comment._id} className={`${isReply ? 'ml-6' : ''} p-4 bg-gray-50 rounded-lg border border-gray-200`}>
          <p className="text-gray-500 italic text-sm">Comentario eliminado</p>
        </div>
      );
    }

    return (
      <div key={comment._id} className={`${isReply ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''} mb-4`}>
        <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3 flex-1">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900 text-sm">{comment.author.name}</h4>
                  {comment.isEdited && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Editado</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{formatDate(comment._createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {comment.rating && !isReply && (
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= comment.rating!
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-yellow-600 font-medium text-xs ml-1">{comment.rating}.0</span>
                </div>
              )}
              
              {canModifyComment(comment) && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="ml-11">
            <p className="text-gray-700 leading-relaxed mb-3 text-sm">{comment.content}</p>
            
            {comment.adminReply && comment.adminReplyPublished && (
              <div className="mt-3 p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                <div className="flex items-center mb-2">
                  <Award className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="text-xs font-medium text-orange-700">Chef Planeta Keto</span>
                  <span className="text-xs text-orange-600 ml-2">
                    {formatDate(comment.adminReplyDate!)}
                  </span>
                </div>
                <p className="text-orange-700 text-sm">{comment.adminReply}</p>
              </div>
            )}
            
            <div className="flex items-center mt-3">
              <button
                onClick={() => handleReply(comment._id)}
                className="flex items-center text-xs text-gray-500 hover:text-orange-500 transition-colors font-medium"
              >
                <Reply className="w-3 h-3 mr-1" />
                Responder
              </button>
            </div>
          </div>
          
          {/* Respuestas */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // No renderizar nada hasta que esté montado para evitar hidratación diferente
  if (!isMounted) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <MessageCircle className="w-6 h-6 text-orange-500 mr-2" />
          <h3 className="text-xl font-bold text-gray-900">
            Comentarios
          </h3>
        </div>
        <p className="text-gray-600 text-sm">
          {comments.reduce((count, comment) => count + 1 + (comment.replies?.length || 0), 0)} comentarios
        </p>
      </div>

      {/* Comment Form */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        {(replyingTo || editingComment) && (
          <div className="mb-4 p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-700">
                {editingComment ? 'Editando comentario' : 'Respondiendo comentario'}
              </span>
              <button
                type="button"
                onClick={cancelReply}
                className="text-orange-500 hover:text-orange-600 text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 text-sm"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 text-sm"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          {/* Rating */}
          {!formData.parentComment && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación (opcional)
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className={`w-8 h-8 transition-colors ${
                      star <= formData.rating
                        ? 'text-yellow-400 hover:text-yellow-500'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  >
                    <Star className="w-full h-full fill-current" />
                  </button>
                ))}
                {formData.rating > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    {formData.rating === 5 ? 'Excelente' : formData.rating === 4 ? 'Muy buena' : formData.rating === 3 ? 'Buena' : formData.rating === 2 ? 'Regular' : 'Mejorable'}
                  </span>
                )}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              {formData.parentComment ? 'Tu respuesta *' : 'Tu comentario *'}
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-vertical text-gray-900 text-sm"
              placeholder={formData.parentComment ? "Escribe tu respuesta..." : "Comparte tu experiencia con esta receta..."}
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="text-right">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium inline-flex items-center"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {editingComment ? 'Actualizar' : (formData.parentComment ? 'Responder' : 'Comentar')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de comentarios */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">Cargando comentarios...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Sé el primero en comentar</h4>
          <p className="text-gray-600 text-sm">Comparte tu experiencia con esta receta</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
}