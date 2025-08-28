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
          item._id === itemId ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' } : item
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

