'use client'

import { useEffect } from 'react';

interface CreatePostButtonProps {
  className?: string;
}

export default function CreatePostButton({ className }: CreatePostButtonProps) {
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).openCreatePost) {
      (window as any).openCreatePost();
    }
  };

  return (
    <button
      className={className}
      onClick={handleClick}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      🗣️ Crear Nueva Publicación
    </button>
  );
}