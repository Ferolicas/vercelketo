'use client';

import { useState, useEffect } from 'react';
import { Star, MessageCircle, Send, Loader2, Reply, Edit2, Trash2, Heart, Sparkles, User } from 'lucide-react';

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

    // AÑADIR ESTA VALIDACIÓN DE LONGITUD para el contenido del comentario
    // DEBE COINCIDIR CON EL Rule.min(4) DE TU ESQUEMA EN SANITY
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

  const formatDate = (dateString: string | undefined): string => { // Añade 'undefined' al tipo
    // Si la cadena de fecha es nula o indefinida, devuelve un mensaje
    if (!dateString) {
      return "Fecha no disponible";
    }

    try {
      const date = new Date(dateString);

      // Comprueba si la fecha es un objeto de fecha válido.
      // Esto es crucial para evitar el "1 de enero de 1970"
      if (isNaN(date.getTime())) {
        return "Fecha inválida"; // O puedes devolver "Fecha no disponible" si prefieres
      }

      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Asegura el formato de 24 horas si lo deseas
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
        <div key={comment._id} className={`${isReply ? 'ml-8' : ''} p-4 bg-gray-50 rounded-lg`}>
          <p className="text-gray-500 italic">Comentario eliminado</p>
        </div>
      );
    }

    return (
      <div key={comment._id} className={`${isReply ? 'ml-8 border-l-2 border-rose-200 pl-6' : ''} mb-8`}>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-800">{comment.author.name}</h4>
                  {comment.isEdited && (
                    <span className="text-xs text-gray-500 italic bg-gray-100 px-2 py-1 rounded-full">(editado)</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 font-light">{formatDate(comment._createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {comment.rating && !isReply && (
                <div className="flex items-center space-x-1 bg-amber-50 px-3 py-1 rounded-full">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= comment.rating!
                          ? 'text-amber-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              {canModifyComment(comment) && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all duration-200"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="ml-16">
            <p className="text-gray-700 leading-relaxed mb-4 font-light text-lg">{comment.content}</p>
            
            {comment.adminReply && comment.adminReplyPublished && (
              <div className="mt-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 border-l-4 border-rose-400 rounded-lg">
                <div className="flex items-center mb-2">
                  <Sparkles className="w-4 h-4 text-rose-500 mr-2" />
                  <span className="text-sm font-semibold text-rose-800">PLANETA KETO</span>
                  <span className="text-xs text-rose-600 ml-3">
                    {formatDate(comment.adminReplyDate!)}
                  </span>
                </div>
                <p className="text-rose-800 font-light">{comment.adminReply}</p>
              </div>
            )}
            
            <div className="flex items-center space-x-6 mt-4">
              <button
                onClick={() => handleReply(comment._id)}
                className="flex items-center text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium group"
              >
                <Reply className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Responder
              </button>
            </div>
          </div>
          
          {/* Respuestas */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-6 space-y-4 ml-8">
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
      <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-10 shadow-xl border border-white/50">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <p className="text-gray-600 font-light">Preparando el espacio para tu experiencia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-10 shadow-xl border border-white/50">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-3xl font-light text-gray-800 mb-2">
          Comparte tu experiencia
        </h3>
        <p className="text-gray-600 font-light">
          {comments.reduce((count, comment) => count + 1 + (comment.replies?.length || 0), 0)} personas ya han compartido su experiencia
        </p>
      </div>

      {/* Elegant Comment Form */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 mb-12 border border-rose-100">
        {(replyingTo || editingComment) && (
          <div className="mb-6 p-4 bg-rose-100 border-l-4 border-rose-400 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-rose-800 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                {editingComment ? 'Editando tu comentario' : 'Respondiendo a otro miembro'}
              </span>
              <button
                type="button"
                onClick={cancelReply}
                className="text-rose-600 hover:text-rose-800 text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-3">
                Tu nombre *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300 font-light"
                placeholder="¿Cómo te llamas?"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-3">
                Tu email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300 font-light"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          {/* Elegant Rating */}
          {!formData.parentComment && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                ¿Qué te pareció la receta? (opcional)
              </label>
              <div className="flex items-center justify-center space-x-2 bg-white rounded-xl p-4 border border-rose-200">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className={`w-10 h-10 transition-all duration-300 hover:scale-110 ${
                      star <= formData.rating
                        ? 'text-amber-400 hover:text-amber-500'
                        : 'text-gray-300 hover:text-amber-300'
                    }`}
                  >
                    <Star className="w-full h-full fill-current" />
                  </button>
                ))}
                {formData.rating > 0 && (
                  <span className="ml-4 text-sm text-gray-600 font-light">
                    {formData.rating === 5 ? '¡Perfecta!' : formData.rating === 4 ? '¡Muy buena!' : formData.rating === 3 ? 'Buena' : formData.rating === 2 ? 'Regular' : 'Mejorable'}
                  </span>
                )}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-3">
              {formData.parentComment ? 'Tu respuesta *' : 'Comparte tu experiencia *'}
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-vertical transition-all duration-300 font-light leading-relaxed"
              placeholder={formData.parentComment ? "Escribe tu respuesta..." : "¿Cómo te quedó la receta? ¿Algún tip especial que quieras compartir?"}
            />
          </div>

          {message && (
            <div className={`p-4 rounded-xl border ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border-green-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <Heart className="w-5 h-5 mr-2 text-green-600" />
                ) : (
                  <span className="w-5 h-5 mr-2">⚠️</span>
                )}
                {message.text}
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-4 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-xl hover:from-rose-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl inline-flex items-center"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-3" />
                  {editingComment ? 'Actualizar comentario' : (formData.parentComment ? 'Enviar respuesta' : 'Compartir experiencia')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de comentarios */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <p className="text-gray-600 font-light">Cargando experiencias de nuestra comunidad...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-xl font-light text-gray-700 mb-2">¡Sé la primera en compartir!</h4>
          <p className="text-gray-500 font-light">Ayuda a otras personas contando tu experiencia con esta receta</p>
        </div>
      ) : (
        <div>
          <div className="mb-8">
            <h4 className="text-2xl font-light text-gray-800 text-center mb-2">Experiencias de nuestra comunidad</h4>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mx-auto"></div>
          </div>
          <div className="space-y-6">
            {comments.map((comment) => renderComment(comment))}
          </div>
        </div>
      )}
    </div>
  );
}