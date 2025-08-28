'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle, CheckCircle, XCircle, Eye, Calendar, User, Star, Reply, Trash2, Filter, AlertTriangle } from 'lucide-react';

interface EnhancedModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ContentItem {
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
  tags?: string[];
}

export default function EnhancedModerationModal({ isOpen, onClose }: EnhancedModerationModalProps) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [filterType, setFilterType] = useState<'all' | 'forumPost' | 'forumReply' | 'recipeComment' | 'blogComment'>('all');
  const [showReportedOnly, setShowReportedOnly] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadContent();
    }
  }, [isOpen, activeTab]);

  const loadContent = async () => {
    try {
      setLoading(true);
      
      // Fetch all content for moderation
      const response = await fetch('/api/moderation/all');
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      
      const data = await response.json();
      setContent(data.content || []);
    } catch (error) {
      console.error('Error loading content:', error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModerationAction = async (
    itemId: string, 
    action: 'approve' | 'reject' | 'delete' | 'edit',
    type: string
  ) => {
    try {
      setProcessing(itemId);
      
      const response = await fetch('/api/moderation/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, itemId, type })
      });
      
      if (!response.ok) {
        throw new Error('Failed to process moderation action');
      }
      
      const result = await response.json();
      
      // Update the item status
      setContent(prev => {
        if (action === 'delete') {
          return prev.filter(item => item._id !== itemId);
        }
        return prev.map(item => 
          item._id === itemId ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' } : item
        );
      });
      
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

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'forumPost': return '💬';
      case 'forumReply': return '↩️';
      case 'recipeComment': return '🍳';
      case 'blogComment': return '📝';
      default: return '📄';
    }
  };

  const getSourceColor = (type: string) => {
    switch (type) {
      case 'forumPost': return 'bg-blue-100 text-blue-800';
      case 'forumReply': return 'bg-green-100 text-green-800';
      case 'recipeComment': return 'bg-orange-100 text-orange-800';
      case 'blogComment': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContent = content.filter(item => {
    const matchesTab = activeTab === 'pending' ? item.status === 'pending' : item.status === activeTab;
    const matchesType = filterType === 'all' || item.source.type === filterType;
    const matchesReport = !showReportedOnly || item.reported;
    return matchesTab && matchesType && matchesReport;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Moderación de Contenido</h2>
            <p className="text-sm text-gray-600 mt-1">Gestiona publicaciones, respuestas y comentarios</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Tabs */}
            <div className="flex space-x-1">
              {(['pending', 'approved', 'rejected'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'pending' ? 'Pendientes' : tab === 'approved' ? 'Aprobados' : 'Rechazados'}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">Todos los tipos</option>
                <option value="forumPost">Posts del Foro</option>
                <option value="forumReply">Respuestas Foro</option>
                <option value="recipeComment">Comentarios Recetas</option>
                <option value="blogComment">Comentarios Blog</option>
              </select>
            </div>

            {/* Reported Filter */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showReportedOnly}
                onChange={(e) => setShowReportedOnly(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Solo reportados</span>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Cargando contenido...</span>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay contenido</h3>
              <p className="text-gray-600">No hay contenido que coincida con los filtros seleccionados.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContent.map((item) => (
                <div key={item._id} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="font-medium text-gray-900">{item.authorName}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{item.authorEmail}</span>
                        {item.reported && (
                          <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Reportado
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(item._createdAt)}</span>
                        <span className="text-gray-500">•</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(item.source.type)}`}>
                          <span className="mr-1">{getSourceIcon(item.source.type)}</span>
                          {item.source.type === 'forumPost' ? 'Post Foro' :
                           item.source.type === 'forumReply' ? 'Respuesta Foro' :
                           item.source.type === 'recipeComment' ? 'Comentario Receta' :
                           'Comentario Blog'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Source Info */}
                  {item.source.title && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">En: </span>
                      <span className="text-sm font-medium text-blue-600">{item.source.title}</span>
                      {item.source.parentTitle && (
                        <div className="text-xs text-gray-500 mt-1">
                          Respuesta a: {item.source.parentTitle}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Report Reason */}
                  {item.reportReason && (
                    <div className="mb-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                      <div className="text-sm font-medium text-yellow-800 mb-1">Motivo del reporte:</div>
                      <div className="text-sm text-yellow-700">{item.reportReason}</div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{item.content}</p>
                  </div>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-2">
                    {item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleModerationAction(item._id, 'reject', item.type)}
                          disabled={processing === item._id}
                          className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Rechazar</span>
                        </button>
                        <button
                          onClick={() => handleModerationAction(item._id, 'approve', item.type)}
                          disabled={processing === item._id}
                          className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Aprobar</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleModerationAction(item._id, 'delete', item.type)}
                      disabled={processing === item._id}
                      className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}