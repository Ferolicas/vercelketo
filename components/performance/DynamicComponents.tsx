'use client'

// Dynamic import wrapper for heavy components
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load heavy admin components
export const DynamicAdminDashboard = dynamic(
  () => import('../admin/Dashboard'), 
  {
    loading: () => <div className="animate-pulse bg-gray-100 h-96 rounded-lg" />,
    ssr: false
  }
)

export const DynamicCreateModals = dynamic(
  () => import('../admin/CreatePostModal').then(mod => ({ default: mod.default })),
  {
    loading: () => <div className="animate-pulse bg-gray-100 h-48 rounded-lg" />,
    ssr: false
  }
)

// Lazy load forum components
export const DynamicForumContent = dynamic(
  () => import('../ForoContent'),
  {
    loading: () => <div className="animate-pulse bg-gray-100 h-64 rounded-lg" />
  }
)

// Lazy load comment system
export const DynamicCommentSystem = dynamic(
  () => import('../forum/CommentSystem'),
  {
    loading: () => <div className="animate-pulse bg-gray-100 h-32 rounded-lg" />
  }
)

// Lazy load analytics dashboard (admin only)
export const DynamicAnalyticsDashboard = dynamic(
  () => import('../analytics/AnalyticsDashboard'),
  {
    loading: () => <div className="animate-pulse bg-gray-100 h-64 rounded-lg" />,
    ssr: false
  }
)

// Lazy load product recommendations
export const DynamicProductRecommendations = dynamic(
  () => import('../ProductRecommendations'),
  {
    loading: () => <div className="animate-pulse bg-gray-100 h-48 rounded-lg" />
  }
)

// Wrapper component for suspense boundaries
export function LazyComponentWrapper({ 
  children, 
  fallback = <div className="animate-pulse bg-gray-100 h-32 rounded-lg" /> 
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
}