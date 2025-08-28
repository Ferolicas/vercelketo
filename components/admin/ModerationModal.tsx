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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Moderación de Contenido</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Cargando contenido pendiente...</span>
            </div>
          ) : pendingContent.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay contenido pendiente</h3>
              <p className="text-gray-600">Todos los contenidos han sido moderados.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingContent.map((item) => (
                <div key={item._id} className="border rounded-lg p-6 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="font-medium text-gray-900">{item.authorName}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{item.authorEmail}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(item._createdAt)}</span>
                        <span className="text-gray-500">•</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.type === 'post' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.type === 'post' ? 'Publicación' : 'Respuesta'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {item.title && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  )}

                  {item.forumPost && (
                    <div className="mb-3">
                      <span className="text-sm text-gray-500">En respuesta a: </span>
                      <span className="text-sm font-medium text-green-600">{item.forumPost.title}</span>
                    </div>
                  )}

                  <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{item.content}</p>
                  </div>

                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => handleModerationAction(item._id, 'reject', item.type)}
                      disabled={processing === item._id}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>{processing === item._id ? 'Procesando...' : 'Rechazar'}</span>
                    </button>
                    <button
                      onClick={() => handleModerationAction(item._id, 'approve', item.type)}
                      disabled={processing === item._id}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>{processing === item._id ? 'Procesando...' : 'Aprobar'}</span>
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