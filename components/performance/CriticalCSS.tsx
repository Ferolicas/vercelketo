'use client'

import { useEffect } from 'react'

// Critical CSS inliner for above-the-fold content
export default function CriticalCSS() {
  useEffect(() => {
    // Inline critical CSS for above-the-fold content
    const criticalStyles = `
      /* Critical CSS for Planeta Keto above-the-fold */
      .hero-section { 
        background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
        min-height: 60vh;
      }
      
      .navigation {
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.95);
      }
      
      .recipe-card {
        transform: translateZ(0); /* Force GPU acceleration */
        will-change: transform;
      }
      
      /* Prevent layout shifts */
      .image-placeholder {
        aspect-ratio: 16/9;
        background: linear-gradient(90deg, #f0f0f0 25%, transparent 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      /* Optimize font loading */
      @font-face {
        font-family: 'Geist';
        font-display: swap;
        src: url('/fonts/geist-variable.woff2') format('woff2');
      }
    `

    // Only inject if not already present
    if (!document.querySelector('#critical-css')) {
      const style = document.createElement('style')
      style.id = 'critical-css'
      style.textContent = criticalStyles
      document.head.insertBefore(style, document.head.firstChild)
    }

    // Preload critical resources
    const criticalResources = [
      { href: '/logo.webp', as: 'image', type: 'image/webp' },
      { href: '/og-image.jpg', as: 'image', type: 'image/jpeg' },
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' }
    ]

    criticalResources.forEach(resource => {
      const existingLink = document.querySelector(`link[href="${resource.href}"]`)
      if (!existingLink) {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = resource.href
        link.as = resource.as
        if (resource.type) link.type = resource.type
        if (resource.as === 'style') link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
      }
    })

    // Remove critical CSS after main CSS loads
    const handleLoad = () => {
      setTimeout(() => {
        const criticalStyle = document.querySelector('#critical-css')
        if (criticalStyle) {
          criticalStyle.remove()
        }
      }, 1000)
    }

    window.addEventListener('load', handleLoad)
    return () => window.removeEventListener('load', handleLoad)
  }, [])

  return null
}

// Component to prevent Cumulative Layout Shift (CLS)
export function LayoutStabilizer({ children }: { children: React.ReactNode }) {
  return (
    <div 
      className="min-h-screen"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '1px 1000px'
      }}
    >
      {children}
    </div>
  )
}