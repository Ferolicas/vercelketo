'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Loading skeleton components
const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
)

const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow animate-pulse">
    <div className="h-48 bg-gray-200 rounded mb-4"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
  </div>
)

// Components that actually exist and work in your project

// RecipeCard component (named export)
export const LazyRecipeCard = dynamic(
  () => import('@/components/RecipeCard').then(mod => ({ default: mod.RecipeCard })),
  {
    loading: () => <CardSkeleton />,
    ssr: true
  }
)

// ModernRecipeCard component
export const LazyModernRecipeCard = dynamic(
  () => import('@/components/ModernRecipeCard'),
  {
    loading: () => <CardSkeleton />,
    ssr: true
  }
)

// Comments component
export const LazyComments = dynamic(
  () => import('@/components/Comments'),
  {
    loading: () => (
      <div className="bg-gray-50 p-8 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-4 w-1/4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    ),
    ssr: false
  }
)

// ProductRecommendations component
export const LazyProductRecommendations = dynamic(
  () => import('@/components/ProductRecommendations'),
  {
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow">
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    ),
    ssr: false
  }
)

// PurchaseModal component
export const LazyPurchaseModal = dynamic(
  () => import('@/components/PurchaseModal'),
  {
    loading: () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-pulse">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    ),
    ssr: false
  }
)

// ServiciosYProductos component
export const LazyServiciosYProductos = dynamic(
  () => import('@/components/ServiciosYProductos'),
  {
    loading: () => (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    ),
    ssr: false
  }
)

// ForumPostDetail component
export const LazyForumPostDetail = dynamic(
  () => import('@/components/ForumPostDetail'),
  {
    loading: () => (
      <div className="bg-white p-6 rounded-lg shadow animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    ),
    ssr: false
  }
)

// Performance components that exist
export const LazyPerformanceOptimizer = dynamic(
  () => import('@/components/PerformanceOptimizer'),
  {
    loading: () => <LoadingSkeleton className="h-4" />,
    ssr: false
  }
)

// Higher-order component for intersection observer lazy loading
interface LazyOnViewProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  threshold?: number
  rootMargin?: string
}

export function LazyOnView({
  children,
  fallback = <LoadingSkeleton className="h-64" />,
  threshold = 0.1,
  rootMargin = '50px'
}: LazyOnViewProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
}

// Component for lazy loading content sections
interface LazySectionProps {
  children: React.ReactNode
  className?: string
  fallback?: React.ReactNode
}

export function LazySection({ 
  children, 
  className = '',
  fallback = <LoadingSkeleton className="h-64" />
}: LazySectionProps) {
  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  )
}

// Preloader for critical components
export function PreloadCriticalComponents() {
  // Preload components that will likely be needed soon
  if (typeof window !== 'undefined') {
    // Preload recipe cards after initial page load
    setTimeout(() => {
      import('@/components/RecipeCard')
      import('@/components/ModernRecipeCard')
    }, 1000)
    
    // Preload comments after 2 seconds
    setTimeout(() => {
      import('@/components/Comments')
    }, 2000)
    
    // Preload product recommendations after 3 seconds
    setTimeout(() => {
      import('@/components/ProductRecommendations')
    }, 3000)
  }
  
  return null
}