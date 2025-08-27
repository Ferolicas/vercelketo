'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle, CheckCircle, XCircle, Eye, Calendar, User, Star, Reply } from 'lucide-react';

interface ModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PendingContent {
  _id: string;
  authorName: string;
  authorEmail: string;
  content: string;
  title?: string;
  category?: string;
  forumPost?: {
    title: string;
    slug: string;
  };
  _createdAt: string;
  type: 'post' | 'reply';
}

export default function ModerationModal({ isOpen, onClose }: ModerationModalProps) {
  const [pendingContent, setPendingContent] = useState<PendingContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadPendingContent();
    }
  }, [isOpen]);

  const loadPendingContent = async () => {
    try {
      setLoading(true);
      
      // Fetch real pending content from API
      const response = await fetch('/api/moderation');
      if (!response.ok) {
        throw new Error('Failed to fetch pending content');
      }
      
      const data = await response.json();
      setPendingContent(data.pending || []);
    } catch (error) {
      console.error('Error loading pending content:', error);
      setPendingContent([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleModerationAction = async (itemId: string, action: 'approve' | 'reject', type: 'post' | 'reply') => {
    try {
      setProcessing(itemId);
      
      const response = await fetch('/api/moderation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, itemId, type })
      });
      
      if (!response.ok) {
        throw new Error('Failed to process moderation action');
      }
      
      // Remove the item from the list
      setPendingContent(prev => prev.filter(item => item._id !== itemId));
      
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('Error processing moderation:', error);
      alert('Error al procesar la moderación');
    } finally {
      setProcessing(null);
    }
  };

  // Remove the old mock data - I'll replace it with the actual render logic
        {
          _id: 'comment1',
          authorName: 'María González',
          authorEmail: 'maria@email.com',
          content: '¡Excelente receta! La hice ayer y quedó perfecta. Mis hijos la amaron y no notaron que era keto. Definitivamente la haré de nuevo.',
          rating: 5,
          recipe: {
            name: 'Huevos Revueltos Keto con Aguacate',
            slug: 'huevos-revueltos-keto-aguacate'
          },
          createdAt: '2024-01-15T10:30:00Z',
          isReply: false
        },
        {
          _id: 'comment2',
          authorName: 'Carlos Mendoza',
          authorEmail: 'carlos@email.com',
          content: 'Gracias por compartir esta receta. ¿Podrías decirme si se puede usar stevia en lugar de eritritol? Soy nuevo en la dieta keto.',
          recipe: {
            name: 'Mousse de Chocolate Keto',
            slug: 'mousse-chocolate-keto'
          },
          createdAt: '2024-01-14T15:45:00Z',
          isReply: false
        },
        {
          _id: 'comment3',
          authorName: 'Ana Ruiz',
          authorEmail: 'ana@email.com',
          content: 'Totalmente de acuerdo! Yo también uso mantequilla de almendras y queda deliciosa. Otra opción es la crema de cacahuete natural.',
          recipe: {
            name: 'Huevos Revueltos Keto con Aguacate',
            slug: 'huevos-revueltos-keto-aguacate'
          },
          createdAt: '2024-01-13T09:20:00Z',
          isReply: true,
          parentComment: {
            content: '¿Se puede sustituir la mantequilla por algo más saludable?',
            authorName: 'Pedro López'
          }
        },
        {
          _id: 'comment4',
          authorName: 'Luis Torres',
          authorEmail: 'luis@email.com',
          content: 'Esta receta no me funcionó bien. El salmón se me secó mucho y los espárragos quedaron muy duros. Tal vez faltaron más detalles en la preparación.',
          rating: 2,
          recipe: {
            name: 'Salmón a la Plancha con Espárragos',
            slug: 'salmon-plancha-esparragos'
          },
          createdAt: '2024-01-12T18:10:00Z',
          isReply: false
        }
      ];
      
      setPendingComments(mockComments);
    } catch (error) {
      console.error('Error loading pending comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (commentId: string) => {
    setProcessing(commentId);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simular API call
      
      setPendingComments(prev => prev.filter(comment => comment._id !== commentId));
      alert('Comentario aprobado exitosamente');
    } catch (error) {
      console.error('Error approving comment:', error);
      alert('Error al aprobar el comentario');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (commentId: string) => {
    setProcessing(commentId);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simular API call
      
      setPendingComments(prev => prev.filter(comment => comment._id !== commentId));
      alert('Comentario rechazado');
    } catch (error) {
      console.error('Error rejecting comment:', error);
      alert('Error al rechazar el comentario');
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Moderación del Foro</h2>
                <p className="text-purple-100 mt-1">Revisa y gestiona publicaciones y respuestas pendientes</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"></div>
              </div>
            ) : pendingContent.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">¡Todo al día!</h3>
                <p>No hay publicaciones o respuestas pendientes de moderación</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats Header */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Resumen de Moderación</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{pendingContent.length}</p>
                      <p className="text-purple-700 text-sm">Elementos Pendientes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-pink-600">{pendingContent.filter(c => c.type === 'post').length}</p>
                      <p className="text-pink-700 text-sm">Publicaciones</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-indigo-600">{pendingContent.filter(c => c.type === 'reply').length}</p>
                      <p className="text-indigo-700 text-sm">Respuestas</p>
                    </div>
                  </div>
                </div>

                {/* Content List */}
                <div className="space-y-4">
                  {pendingContent.map((item) => (
                    <div key={item._id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                      {/* Content Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                              {item.authorName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{item.authorName}</h4>
                              <p className="text-gray-500 text-sm">{item.authorEmail}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                              item.type === 'post' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {item.type === 'post' ? (
                                <>
                                  <MessageCircle size={12} className="mr-1" />
                                  Publicación
                                </>
                              ) : (
                                <>
                                  <Reply size={12} className="mr-1" />
                                  Respuesta
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {formatDate(item._createdAt)}
                            </div>
                            {item.type === 'post' && item.category && (
                              <div className="flex items-center">
                                <Eye size={14} className="mr-1" />
                                Categoría: {item.category}
                              </div>
                            )}
                            {item.type === 'reply' && item.forumPost && (
                              <div className="flex items-center">
                                <MessageCircle size={14} className="mr-1" />
                                En: {item.forumPost.title}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Post Title (if it's a post) */}
                      {item.type === 'post' && item.title && (
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        </div>
                      )}

                      {/* Content */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <p className="text-gray-800 leading-relaxed">{item.content}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleModerationAction(item._id, 'approve', item.type)}
                          disabled={processing === item._id}
                          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                          <CheckCircle size={16} className="mr-2" />
                          {processing === item._id ? 'Procesando...' : 'Aprobar'}
                        </button>
                        
                        <button
                          onClick={() => handleModerationAction(item._id, 'reject', item.type)}
                          disabled={processing === item._id}
                          className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                          <XCircle size={16} className="mr-2" />
                          {processing === item._id ? 'Procesando...' : 'Rechazar'}
                        </button>

                        {item.type === 'post' ? (
                          <a
                            href={`/foro`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-xl font-medium transition-colors"
                          >
                            <Eye size={16} className="mr-2" />
                            Ver Foro
                          </a>
                        ) : item.forumPost?.slug ? (
                          <a
                            href={`/foro/${item.forumPost.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-xl font-medium transition-colors"
                          >
                            <Eye size={16} className="mr-2" />
                            Ver Publicación
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}