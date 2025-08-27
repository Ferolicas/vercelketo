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
        <div key={comment._id} className={`${isReply ? 'ml-12' : ''} p-6 bg-gray-800/50 rounded-xl border border-gray-700/50`}>
          <p className="text-gray-500 italic">Comentario eliminado</p>
        </div>
      );
    }

    return (
      <div key={comment._id} className={`${isReply ? 'ml-12 border-l-2 border-green-500/30 pl-8' : ''} mb-10`}>
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-500/5 to-transparent rounded-full blur-xl"></div>
          
          <div className="relative flex items-start justify-between mb-6">
            <div className="flex items-start space-x-6 flex-1">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-xl">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-black text-white text-lg">{comment.author.name}</h4>
                  {comment.isEdited && (
                    <span className="text-xs text-green-400 font-semibold bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">EDITADO</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 font-medium">{formatDate(comment._createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {comment.rating && !isReply && (
                <div className="flex items-center space-x-2 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= comment.rating!
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-yellow-400 font-bold text-sm ml-2">{comment.rating}.0</span>
                </div>
              )}
              
              {canModifyComment(comment) && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="p-3 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-full transition-all duration-200"
                    title="Editar"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all duration-200"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="ml-22 relative">
            <p className="text-gray-300 leading-relaxed mb-6 font-medium text-lg">{comment.content}</p>
            
            {comment.adminReply && comment.adminReplyPublished && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-l-4 border-green-500 rounded-lg backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <Award className="w-6 h-6 text-green-400 mr-3" />
                  <span className="text-sm font-black text-green-400 uppercase tracking-wide">PLANETA KETO CHEF</span>
                  <span className="text-xs text-green-400 ml-4">
                    {formatDate(comment.adminReplyDate!)}
                  </span>
                </div>
                <p className="text-green-300 font-medium text-lg">{comment.adminReply}</p>
              </div>
            )}
            
            <div className="flex items-center space-x-8 mt-6">
              <button
                onClick={() => handleReply(comment._id)}
                className="flex items-center text-sm text-gray-400 hover:text-green-400 transition-all duration-300 font-semibold group hover:scale-105"
              >
                <Reply className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                RESPONDER
              </button>
            </div>
          </div>
          
          {/* Respuestas */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-8 space-y-6">
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
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-green-500/20">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Loader2 className="w-10 h-10 animate-spin text-white" />
          </div>
          <p className="text-gray-300 text-lg font-medium">Inicializando plataforma premium...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-green-500/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            COMUNIDAD PREMIUM
          </h3>
          <p className="text-gray-300 text-lg font-medium">
            {comments.reduce((count, comment) => count + 1 + (comment.replies?.length || 0), 0)} miembros han compartido su experiencia
          </p>
        </div>

        {/* Premium Comment Form */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-10 mb-16 border border-green-500/20 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/10 to-transparent rounded-full blur-2xl"></div>
          
          {(replyingTo || editingComment) && (
            <div className="relative mb-8 p-6 bg-green-500/10 border-l-4 border-green-500 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-green-400 flex items-center">
                  <Sparkles className="w-5 h-5 mr-3" />
                  {editingComment ? 'EDITANDO COMENTARIO' : 'RESPONDIENDO A MIEMBRO'}
                </span>
                <button
                  type="button"
                  onClick={cancelReply}
                  className="text-green-400 hover:text-green-300 text-sm font-semibold transition-colors"
                >
                  CANCELAR
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-green-400 mb-4 uppercase tracking-wide">
                  Nombre de usuario *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-6 py-4 bg-gray-900/80 border border-green-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-white font-medium placeholder-gray-400"
                  placeholder="Tu nombre de usuario"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-green-400 mb-4 uppercase tracking-wide">
                  Email premium *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-6 py-4 bg-gray-900/80 border border-green-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-white font-medium placeholder-gray-400"
                  placeholder="usuario@email.com"
                />
              </div>
            </div>

            {/* Premium Rating */}
            {!formData.parentComment && (
              <div>
                <label className="block text-sm font-bold text-green-400 mb-6 uppercase tracking-wide">
                  CALIFICACIÓN PREMIUM (opcional)
                </label>
                <div className="flex items-center justify-center space-x-4 bg-gray-900/60 rounded-2xl p-8 border border-green-500/20">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className={`w-14 h-14 transition-all duration-300 hover:scale-125 rounded-full border-2 flex items-center justify-center ${
                        star <= formData.rating
                          ? 'text-yellow-400 border-yellow-400 bg-yellow-400/10 hover:text-yellow-300'
                          : 'text-gray-500 border-gray-600 hover:text-yellow-300 hover:border-yellow-400'
                      }`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                  {formData.rating > 0 && (
                    <div className="ml-6 text-center">
                      <div className="text-2xl font-black text-yellow-400 mb-1">{formData.rating}.0</div>
                      <div className="text-sm text-yellow-400 font-semibold">
                        {formData.rating === 5 ? 'OBRA MAESTRA' : formData.rating === 4 ? 'EXCELENTE' : formData.rating === 3 ? 'BUENA' : formData.rating === 2 ? 'REGULAR' : 'MEJORABLE'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="content" className="block text-sm font-bold text-green-400 mb-6 uppercase tracking-wide">
                {formData.parentComment ? 'TU RESPUESTA PROFESIONAL *' : 'COMPARTE TU MASTERPIECE *'}
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-6 py-4 bg-gray-900/80 border border-green-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-vertical transition-all duration-300 text-white font-medium leading-relaxed placeholder-gray-400"
                placeholder={formData.parentComment ? "Comparte tu experiencia profesional..." : "Describe tu creación, tips secretos, modificaciones que hiciste..."}
              />
            </div>

            {message && (
              <div className={`p-4 rounded-xl border ${
                message.type === 'success' 
                  ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                  : 'bg-red-500/10 text-red-400 border-red-500/30'
              }`}>
                <div className="flex items-center">
                  {message.type === 'success' ? (
                    <Award className="w-5 h-5 mr-2 text-green-400" />
                  ) : (
                    <span className="w-5 h-5 mr-2">⚠️</span>
                  )}
                  {message.text}
                </div>
              </div>
            )}

            <div className="text-center relative">
              <button
                type="submit"
                disabled={submitting}
                className="px-12 py-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-400 hover:to-emerald-400 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-black text-lg shadow-2xl hover:shadow-green-500/25 hover:scale-105 inline-flex items-center uppercase tracking-wide"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-4 animate-spin" />
                    PROCESANDO...
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6 mr-4" />
                    {editingComment ? 'ACTUALIZAR' : (formData.parentComment ? 'ENVIAR RESPUESTA' : 'PUBLICAR EXPERIENCIA')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Lista de comentarios premium */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
            <p className="text-gray-300 text-lg font-medium">Cargando experiencias premium...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Star className="w-12 h-12 text-white" />
            </div>
            <h4 className="text-3xl font-black text-white mb-4">SÉ EL PRIMERO EN COMPARTIR</h4>
            <p className="text-gray-300 text-lg font-medium">Comparte tu masterpiece con la comunidad premium</p>
          </div>
        ) : (
          <div>
            <div className="mb-12 text-center">
              <h4 className="text-3xl font-black text-white mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">COMUNIDAD DE CHEFS</h4>
              <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto shadow-lg"></div>
            </div>
            <div className="space-y-8">
              {comments.map((comment) => renderComment(comment))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}