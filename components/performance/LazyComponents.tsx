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

// Lazy load heavy components that aren't immediately visible
export const LazyAnalyticsDashboard = dynamic(
  () => import('@/components/analytics/AnalyticsDashboard'),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    ),
    ssr: false // Dashboard doesn't need SSR
  }
)

export const LazyForumComponent = dynamic(
  () => import('@/components/ForumComponent'),
  {
    loading: () => (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }
)

export const LazyRecipeCard = dynamic(
  () => import('@/components/RecipeCard'),
  {
    loading: () => <CardSkeleton />,
    ssr: true // Recipe cards benefit from SSR for SEO
  }
)

export const LazyCommentSystem = dynamic(
  () => import('@/components/CommentSystem'),
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
    ssr: false // Comments can load after page
  }
)

// Newsletter signup - can be lazy loaded as it's usually below fold
export const LazyNewsletterSignup = dynamic(
  () => import('@/components/NewsletterSignup'),
  {
    loading: () => (
      <div className="bg-green-50 p-6 rounded-lg animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4 w-2/3"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    ),
    ssr: false
  }
)

// Social sharing buttons - not critical for initial load
export const LazySocialShare = dynamic(
  () => import('@/components/SocialShare'),
  {
    loading: () => (
      <div className="flex space-x-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    ),
    ssr: false
  }
)

// AdSense components - lazy load to not block critical rendering
export const LazyAdBanner = dynamic(
  () => import('@/components/ads/AdBanner'),
  {
    loading: () => (
      <div className="bg-gray-100 p-4 rounded-lg text-center animate-pulse">
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    ),
    ssr: false
  }
)

export const LazyAdSidebar = dynamic(
  () => import('@/components/ads/AdSidebar'),
  {
    loading: () => (
      <div className="bg-gray-100 p-4 rounded-lg animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    ),
    ssr: false
  }
)

// Admin components - should definitely be lazy loaded
export const LazyAdminPanel = dynamic(
  () => import('@/components/admin/AdminPanel'),
  {
    loading: () => (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    ),
    ssr: false
  }
)

// Recipe calculator - interactive component that can be lazy
export const LazyKettoCalculator = dynamic(
  () => import('@/components/KetoCalculator'),
  {
    loading: () => (
      <div className="bg-white p-6 rounded-lg shadow animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-12 bg-green-200 rounded"></div>
      </div>
    ),
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
    }, 1000)
    
    // Preload newsletter after 3 seconds
    setTimeout(() => {
      import('@/components/NewsletterSignup')
    }, 3000)
  }
  
  return null
}