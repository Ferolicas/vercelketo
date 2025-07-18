'use client';

import { useState, useEffect } from 'react';
import { Star, MessageCircle, Send, Loader2, Reply, Edit2, Trash2 } from 'lucide-react';

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
    // Opción 1: Añadir un parámetro de caché busting (timestamp)
    // Opción 2: Usar cache: 'no-store' (más limpia si el servidor lo soporta bien)
    const response = await fetch(`/api/comments?postSlug=${postSlug}&_t=${Date.now()}`, { 
      cache: 'no-store' // <--- ¡Añade esta línea!
    });
    const data = await response.json();

    if (response.ok) {
      const organized = organizeComments(data.comments || []);
      setComments(organized);
      // console.log("Comentarios actualizados:", organized); // Para depuración
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
          ...formData,
          postSlug,
          authorId: currentAuthorId,
          commentId: editingComment,
          rating: formData.parentComment ? null : (formData.rating || null)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: editingComment ? 'Comentario actualizado' : data.message 
        });
        setFormData({ name: '', email: '', content: '', rating: 0, parentComment: null });
        setReplyingTo(null);
        setEditingComment(null);
        await fetchComments();
      } else {
        // En caso de que Sanity (o tu API) devuelva un error específico,
        // podrías intentar mostrarlo aquí.
        // Por ahora, usamos el mensaje genérico o el de la API si lo trae.
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
      <div key={comment._id} className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
        <div className="border-b border-gray-200 pb-6 last:border-b-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-800">{comment.author.name}</h4>
                {comment.isEdited && (
                  <span className="text-xs text-gray-500 italic">(editado)</span>
                )}
              </div>
              <p className="text-sm text-gray-500">{formatDate(comment._createdAt)}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              {comment.rating && !isReply && (
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= comment.rating!
                          ? 'text-yellow-400 fill-current'
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
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-3">{comment.content}</p>
          
          {comment.adminReply && comment.adminReplyPublished && (
            <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
              <div className="flex items-center mb-1">
                <span className="text-sm font-semibold text-blue-800">PLANETA KETO</span>
                <span className="text-xs text-blue-600 ml-2">
                  {formatDate(comment.adminReplyDate!)}
                </span>
              </div>
              <p className="text-blue-800 text-sm">{comment.adminReply}</p>
            </div>
          )}
          
          <div className="flex items-center space-x-4 mt-3">
            <button
              onClick={() => handleReply(comment._id)}
              className="flex items-center text-sm text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <Reply className="w-4 h-4 mr-1" />
              Responder
            </button>
          </div>
          
          {/* Respuestas */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-6 space-y-4">
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
      <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
          <p className="mt-2 text-gray-600">Cargando comentarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center mb-6">
        <MessageCircle className="w-6 h-6 text-emerald-600 mr-2" />
        <h3 className="text-2xl font-bold text-gray-800">
          Comentarios ({comments.reduce((count, comment) => count + 1 + (comment.replies?.length || 0), 0)})
        </h3>
      </div>

      {/* Formulario de comentarios */}
      <form onSubmit={handleSubmit} className="mb-8">
        {(replyingTo || editingComment) && (
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                {editingComment ? 'Editando comentario' : 'Respondiendo comentario'}
              </span>
              <button
                type="button"
                onClick={cancelReply}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        {/* Rating solo para comentarios principales */}
        {!formData.parentComment && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calificación (opcional)
            </label>
            <div className="flex items-center space-x-1">
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
                  {formData.rating} de 5 estrellas
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            {formData.parentComment ? 'Respuesta' : 'Comentario'} *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-vertical"
            placeholder={formData.parentComment ? "Escribe tu respuesta..." : "Comparte tu experiencia con esta receta..."}
          />
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          {submitting ? 'Enviando...' : (editingComment ? 'Actualizar' : (formData.parentComment ? 'Responder' : 'Enviar comentario'))}
        </button>
      </form>

      {/* Lista de comentarios */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
          <p className="mt-2 text-gray-600">Cargando comentarios...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Sé el primero en comentar esta receta</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
}