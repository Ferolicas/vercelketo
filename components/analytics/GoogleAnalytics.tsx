'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

interface GoogleAnalyticsProps {
  measurementId: string
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!measurementId) return

    const handleRouteChange = () => {
      const url = pathname + searchParams.toString()
      window.gtag('config', measurementId, {
        page_location: window.location.href,
        page_path: url,
      })
    }

    handleRouteChange()
  }, [pathname, searchParams, measurementId])

  if (!measurementId) return null

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
              custom_map: {
                'custom_parameter_1': 'recipe_category',
                'custom_parameter_2': 'user_type'
              }
            });

            // Enhanced E-commerce tracking setup
            gtag('config', '${measurementId}', {
              custom_parameter_1: 'keto_recipes',
              custom_parameter_2: 'organic_user',
              send_page_view: false
            });

            // Track scroll depth for engagement
            let scrollDepth = 0;
            window.addEventListener('scroll', function() {
              const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
              if (scrolled > scrollDepth + 25) {
                scrollDepth = Math.floor(scrolled / 25) * 25;
                gtag('event', 'scroll_depth', {
                  event_category: 'engagement',
                  event_label: scrollDepth + '%',
                  value: scrollDepth
                });
              }
            });

            // Track time on page
            let startTime = Date.now();
            window.addEventListener('beforeunload', function() {
              const timeSpent = Math.round((Date.now() - startTime) / 1000);
              gtag('event', 'time_on_page', {
                event_category: 'engagement',
                event_label: window.location.pathname,
                value: timeSpent
              });
            });
          `,
        }}
      />
    </>
  )
}

// Custom tracking functions for Planeta Keto events
export const trackRecipeView = (recipeId: string, recipeName: string, category: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      event_category: 'recipes',
      event_label: recipeName,
      item_id: recipeId,
      item_name: recipeName,
      item_category: category,
      content_type: 'recipe',
      custom_parameter_1: category
    })
  }
}

export const trackRecipeShare = (recipeId: string, recipeName: string, method: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'share', {
      event_category: 'recipes',
      event_label: recipeName,
      method: method,
      content_type: 'recipe',
      item_id: recipeId
    })
  }
}

export const trackBookDownload = (bookId: string, bookName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: Date.now().toString(),
      value: 0,
      currency: 'EUR',
      event_category: 'books',
      event_label: bookName,
      items: [{
        item_id: bookId,
        item_name: bookName,
        item_category: 'digital_book',
        quantity: 1,
        price: 0
      }]
    })
  }
}

export const trackAdSenseClick = (adUnit: string, placement: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ad_click', {
      event_category: 'adsense',
      event_label: adUnit,
      custom_parameter_1: placement,
      non_interaction: false
    })
  }
}

export const trackNewsletterSignup = (email: string, source: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      event_category: 'newsletter',
      event_label: source,
      method: 'email',
      custom_parameter_2: 'subscriber'
    })
  }
}

export const trackSearchQuery = (query: string, results: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      event_category: 'site_search',
      search_term: query,
      event_label: `${results} results`,
      value: results
    })
  }
}

export const trackForumInteraction = (action: string, postId: string, postTitle: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: 'forum',
      event_label: postTitle,
      item_id: postId,
      content_type: 'forum_post'
    })
  }
}