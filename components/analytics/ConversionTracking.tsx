'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// Conversion tracking for Planeta Keto monetization events
export const ConversionTracking = {
  // Track recipe engagement (high-value event for AdSense)
  trackRecipeEngagement: (recipeId: string, recipeName: string, engagementType: 'view' | 'share' | 'print' | 'favorite') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'recipe_engagement', {
        event_category: 'recipes',
        event_label: recipeName,
        custom_parameter_1: engagementType,
        custom_parameter_2: 'high_value_user',
        item_id: recipeId,
        item_name: recipeName,
        content_type: 'recipe',
        value: engagementType === 'view' ? 1 : engagementType === 'share' ? 3 : engagementType === 'print' ? 5 : 10
      })
    }
  },

  // Track book/product purchases (main conversion goal)
  trackPurchase: (transactionId: string, value: number, currency: string, items: any[]) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: currency,
        event_category: 'ecommerce',
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          quantity: item.quantity,
          price: item.price
        }))
      })
      
      // Also track as custom conversion for AdSense optimization
      window.gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with actual conversion tracking ID
        value: value,
        currency: currency,
        transaction_id: transactionId
      })
    }
  },

  // Track newsletter signups (lead generation)
  trackNewsletterSignup: (source: string, email?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'sign_up', {
        method: 'email',
        event_category: 'newsletter',
        event_label: source,
        custom_parameter_2: 'lead_generated',
        value: 5 // Assign value to newsletter signups for AdSense optimization
      })
    }
  },

  // Track AdSense ad interactions (for optimization)
  trackAdInteraction: (adUnit: string, interactionType: 'impression' | 'click', placement: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', `ad_${interactionType}`, {
        event_category: 'adsense',
        event_label: adUnit,
        custom_parameter_1: placement,
        custom_parameter_2: 'ad_revenue',
        non_interaction: interactionType === 'impression',
        value: interactionType === 'click' ? 1 : 0
      })
    }
  },

  // Track user journey progression (for funnel analysis)
  trackUserJourney: (stage: 'visitor' | 'engaged' | 'subscriber' | 'customer', action: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'user_journey', {
        event_category: 'funnel',
        event_label: stage,
        custom_parameter_1: action,
        custom_parameter_2: stage,
        value: stage === 'visitor' ? 1 : stage === 'engaged' ? 3 : stage === 'subscriber' ? 7 : 15
      })
    }
  },

  // Track search queries (for content optimization)
  trackSiteSearch: (query: string, results: number, filters?: string[]) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: query,
        event_category: 'site_search',
        event_label: `${results} results`,
        custom_parameter_1: filters?.join(',') || 'no_filters',
        value: results > 0 ? Math.min(results, 10) : 0
      })
    }
  },

  // Track time spent on high-value pages
  trackPageEngagement: (pageType: 'recipe' | 'blog' | 'product' | 'forum', timeSpent: number, scrollDepth: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_engagement', {
        event_category: 'engagement',
        event_label: pageType,
        custom_parameter_1: `${Math.round(timeSpent)}s`,
        custom_parameter_2: `${Math.round(scrollDepth)}%`,
        value: Math.round((timeSpent / 60) * (scrollDepth / 100) * 10) // Engagement score
      })
    }
  },

  // Track social shares (viral content indicator)
  trackSocialShare: (platform: string, contentType: string, contentId: string, contentTitle: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'share', {
        method: platform,
        content_type: contentType,
        item_id: contentId,
        event_category: 'social',
        event_label: contentTitle,
        custom_parameter_1: platform,
        value: 5 // Social shares are valuable for organic reach
      })
    }
  },

  // Track forum engagement (community building)
  trackForumActivity: (action: 'view_post' | 'create_post' | 'comment' | 'like', postId: string, userId?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'forum_activity', {
        event_category: 'forum',
        event_label: action,
        custom_parameter_1: postId,
        custom_parameter_2: 'community_engagement',
        item_id: postId,
        value: action === 'view_post' ? 1 : action === 'create_post' ? 10 : action === 'comment' ? 5 : 2
      })
    }
  }
}

// Enhanced E-commerce tracking setup
interface EnhancedEcommerceProps {
  measurementId: string
}

export default function ConversionTrackingSetup({ measurementId }: EnhancedEcommerceProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      // Enable enhanced e-commerce
      window.gtag('config', measurementId, {
        custom_map: {
          'custom_parameter_1': 'content_group1',
          'custom_parameter_2': 'content_group2'
        }
      })

      // Set up automatic scroll tracking
      let maxScroll = 0
      const trackScroll = () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
        if (scrollPercent > maxScroll && scrollPercent >= 25) {
          maxScroll = Math.floor(scrollPercent / 25) * 25
          ConversionTracking.trackPageEngagement(
            window.location.pathname.includes('/recetas/') ? 'recipe' : 
            window.location.pathname.includes('/blog/') ? 'blog' :
            window.location.pathname.includes('/productos/') ? 'product' :
            window.location.pathname.includes('/foro/') ? 'forum' : 'recipe',
            Date.now() - performance.timing.navigationStart,
            maxScroll
          )
        }
      }

      const scrollHandler = () => {
        clearTimeout((window as any).scrollTimeout)
        ;(window as any).scrollTimeout = setTimeout(trackScroll, 100)
      }

      window.addEventListener('scroll', scrollHandler, { passive: true })
      
      return () => {
        window.removeEventListener('scroll', scrollHandler)
        clearTimeout((window as any).scrollTimeout)
      }
    }
  }, [measurementId])

  return null
}