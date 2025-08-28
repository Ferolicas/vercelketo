'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, Edit, Trash2, Send, Clock } from 'lucide-react';

interface Comment {
  _id: string;
  content: string;
  authorName: string;
  authorEmail: string;
  authorId: string;
  createdAt: string;
  updatedAt?: string;
  approved: boolean;
  isDeleted: boolean;
  likes: number;
  replies: Comment[];
  parentId?: string;
}

interface CommentSystemProps {
  postId: string;
  onCommentCountChange?: (count: number) => void;
}

export default function CommentSystem({ postId, onCommentCountChange }: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');

  // Get author info from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('forumAuthorName');
    const savedEmail = localStorage.getItem('forumAuthorEmail');
    if (savedName) setAuthorName(savedName);
    if (savedEmail) setAuthorEmail(savedEmail);
  }, []);

  // Load comments
  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/forum/${postId}/comments`);
      const data = await response.json();
      setComments(data.comments || []);
      onCommentCountChange?.(data.comments?.length || 0);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim() || !authorEmail.trim()) return;

    setSubmitting(true);
    try {
      // Generate or get author ID
      let authorId = localStorage.getItem('forumAuthorId');
      if (!authorId) {
        authorId = `author_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('forumAuthorId', authorId);
      }

      // Save author info
      localStorage.setItem('forumAuthorName', authorName);
      localStorage.setItem('forumAuthorEmail', authorEmail);

      const response = await fetch(`/api/forum/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          authorName,
          authorEmail,
          authorId,
          parentId: replyingTo
        })
      });

      const data = await response.json();
      if (response.ok) {
        setComments(data.comments);
        setNewComment('');
        setNewReply('');
        setReplyingTo(null);
        onCommentCountChange?.(data.comments.length);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const authorId = localStorage.getItem('forumAuthorId');
      const response = await fetch(`/api/forum/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent,
          authorId
        })
      });

      const data = await response.json();
      if (response.ok) {
        setComments(data.comments);
        setEditingComment(null);
        setEditContent('');
      }
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('¿Estás seguro de eliminar este comentario?')) return;

    try {
      const authorId = localStorage.getItem('forumAuthorId');
      const response = await fetch(`/api/forum/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authorId })
      });

      const data = await response.json();
      if (response.ok) {
        setComments(data.comments);
        onCommentCountChange?.(data.comments.length);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/forum/comments/${commentId}/like`, {
        method: 'POST'
      });
      
      const data = await response.json();
      if (response.ok) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const isAuthor = (comment: Comment) => {
    const authorId = localStorage.getItem('forumAuthorId');
    return comment.authorId === authorId;
  };

  const renderComment = (comment: Comment, depth = 0) => {
    if (comment.isDeleted) return null;

    const canEdit = isAuthor(comment);
    const isEditing = editingComment === comment._id;

    return (
      <div key={comment._id} className={`${depth > 0 ? 'ml-8' : ''}`}>
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2"
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {comment.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="font-medium text-gray-900">{comment.authorName}</span>
                <div className="text-xs text-gray-500 flex items-center space-x-2"
                  <Clock className="h-3 w-3" />
                  <span>{new Date(comment.createdAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                  {comment.updatedAt && (
                    <span className="text-blue-500">(editado)</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleLikeComment(comment._id)}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
              >
                <ThumbsUp className="h-4 w-4" />
                <span className="text-xs">{comment.likes}</span>
              </button>
              {canEdit && (
                <>
                  <button
                    onClick={() => {
                      setEditingComment(comment._id);
                      setEditContent(comment.content);
                    }}
                    className="text-gray-500 hover:text-blue-500"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
                rows={3}
              />
              <div className="mt-2 flex space-x-2"
                <button
                  onClick={() => handleEditComment(comment._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setEditingComment(null);
                    setEditContent('');
                  }}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 mt-2">{comment.content}</p>
          )}

          {/* Reply Button */}
          <button
            onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
            className="mt-2 text-sm text-blue-500 hover:text-blue-700"
          >
            <MessageCircle className="h-4 w-4 inline mr-1" />
            Responder
          </button>

          {/* Reply Form */}
          {replyingTo === comment._id && (
            <form onSubmit={handleSubmitComment} className="mt-4 ml-8"
            >
              <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="w-full p-2 border rounded-lg text-sm"
                rows={2}
              />
              <div className="mt-2 flex space-x-2"
                <button
                  type="submit"
                  disabled={submitting || !newReply.trim()}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  <Send className="h-4 w-4 inline mr-1" />
                  {submitting ? 'Enviando...' : 'Enviar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo(null);
                    setNewReply('');
                  }}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-2"
            >
              {comment.replies.map(reply => renderComment(reply, depth + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center"
      >
        <MessageCircle className="mr-2" />
        Comentarios ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-6 bg-white rounded-lg p-4 shadow-sm border"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
        >
          <input
            type="text"
            placeholder="Tu nombre"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
            required
          />
          <input
            type="email"
            placeholder="Tu email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
            required
          />
        </div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Comparte tu opinión o experiencia..."
          className="w-full p-3 border rounded-lg text-sm"
          rows={4}
          required
        />
        <div className="mt-3 flex justify-end"
        >
          <button
            type="submit"
            disabled={submitting || !newComment.trim() || !authorName.trim() || !authorEmail.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <Send className="h-4 w-4 mr-2" />
            {submitting ? 'Enviando...' : 'Comentar'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4"
      >
        {loading ? (
          <div className="text-center py-8"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando comentarios...</p>
          </div>
        ) : (
          comments.filter(comment => !comment.parentId).map(comment => renderComment(comment))
        )}
      </div>

      {comments.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500"
        >
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Sé el primero en comentar</p>
        </div>
      )}
    </div>
  );
}