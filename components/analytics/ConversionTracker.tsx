'use client'

import { useEffect } from 'react'

interface ConversionTrackerProps {
  enableEnhancedEcommerce?: boolean
  enableCustomEvents?: boolean
}

export default function ConversionTracker({
  enableEnhancedEcommerce = true,
  enableCustomEvents = true
}: ConversionTrackerProps) {
  useEffect(() => {
    // Initialize basic tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        enhanced_measurement_settings: {
          scrolls_enabled: true,
          outbound_clicks_enabled: true
        }
      })
    }
  }, [])

  return null
}

// Helper functions for specific tracking
export const trackBookConversion = (step: 'view' | 'purchase', data?: any) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return

  (window as any).gtag('event', step === 'view' ? 'view_item' : 'purchase', {
    event_category: 'ecommerce',
    currency: 'EUR',
    value: 14.75,
    ...data
  })
}

export const trackAffiliateClick = (productName: string) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return

  (window as any).gtag('event', 'affiliate_click', {
    event_category: 'affiliate',
    event_label: productName
  })
}

export const trackEmailSignup = (source: string) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return

  (window as any).gtag('event', 'sign_up', {
    method: source
  })
}