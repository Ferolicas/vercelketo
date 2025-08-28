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
  source: {
    type: 'forumPost' | 'forumReply' | 'recipeComment' | 'blogComment';
    title?: string;
    slug?: string;
    parentTitle?: string;
  };
  _createdAt: string;
  type: 'post' | 'reply' | 'comment';
  status: 'pending' | 'approved' | 'rejected';
  reported?: boolean;
  reportReason?: string;
}

export default function ModerationModal({ isOpen, onClose }: ModerationModalProps) {
  const [pendingContent, setPendingContent] = useState<PendingContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [filterType, setFilterType] = useState<'all' | 'forumPost' | 'forumReply' | 'recipeComment' | 'blogComment'>('all');
  const [showReportedOnly, setShowReportedOnly] = useState(false);

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

  const handleModerationAction = async (
    itemId: string, 
    action: 'approve' | 'reject' | 'delete', 
    type: 'post' | 'reply' | 'comment'
  ) => {
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
      
      // Update the item status
      setPendingContent(prev => 
        prev.map(item => 
          item._id === itemId ? { ...item, status: action === 'approve' ? 'approved' as const : 'rejected' as const } : item
        ).filter(item => action !== 'delete' || item._id !== itemId)
      );
      
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('Error processing moderation:', error);
      alert('Error al procesar la moderación');
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

  const filteredContent = pendingContent.filter(item => {
    if (activeTab !== 'all' && item.status !== activeTab) return false;
    if (filterType !== 'all' && item.source.type !== filterType) return false;
    if (showReportedOnly && !item.reported) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Panel de Moderación</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Aprobados
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Rechazados
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los tipos</option>
              <option value="forumPost">Posts del foro</option>
              <option value="forumReply">Respuestas del foro</option>
              <option value="recipeComment">Comentarios de recetas</option>
              <option value="blogComment">Comentarios del blog</option>
            </select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showReportedOnly}
                onChange={(e) => setShowReportedOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Solo reportados</span>
            </label>
          </div>

          {/* Contenido */}
          <div className="space-y-4 overflow-y-auto max-h-[60vh]">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando contenido...</p>
              </div>
            ) : filteredContent.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay contenido para moderar</p>
              </div>
            ) : (
              filteredContent.map((item) => (
                <div key={item._id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.source.type === 'forumPost' ? 'bg-blue-100 text-blue-800' :
                          item.source.type === 'forumReply' ? 'bg-green-100 text-green-800' :
                          item.source.type === 'recipeComment' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {item.source.type === 'forumPost' ? 'Post Foro' :
                           item.source.type === 'forumReply' ? 'Respuesta Foro' :
                           item.source.type === 'recipeComment' ? 'Comentario Receta' :
                           'Comentario Blog'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          item.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status === 'pending' ? 'Pendiente' :
                           item.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                        </span>
                        {item.reported && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Reportado
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-800">{item.title || item.source.title}</h3>
                      {item.source.parentTitle && (
                        <p className="text-sm text-gray-600">En respuesta a: {item.source.parentTitle}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(item._createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {item.authorName}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">{item.content}</p>

                  {item.reportReason && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm text-red-700">
                        <strong>Motivo del reporte:</strong> {item.reportReason}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {item.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleModerationAction(item._id, 'approve', item.type)}
                          disabled={processing === item._id}
                          className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleModerationAction(item._id, 'reject', item.type)}
                          disabled={processing === item._id}
                          className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          Rechazar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleModerationAction(item._id, 'delete', item.type)}
                        disabled={processing === item._id}
                        className="flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Eliminar
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (item.source.slug) {
                          const url = item.source.type === 'forumPost' 
                            ? `/foro/post/${item.source.slug}`
                            : item.source.type === 'recipeComment'
                            ? `/recetas/${item.source.slug}`
                            : `/blog/${item.source.slug}`;
                          window.open(url, '_blank');
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

