'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  fill?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  quality = 85,
  placeholder = 'blur',
  blurDataURL
}: OptimizedImageProps) {
  const [isLoading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Generate blur data URL if not provided
  const defaultBlurDataURL = blurDataURL || generateBlurDataURL(width || 400, height || 300)

  const handleLoad = () => {
    setLoading(false)
  }

  const handleError = () => {
    setHasError(true)
    setLoading(false)
  }

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={fill ? {} : { width: width || 400, height: height || 300 }}
      >
        <span className="text-gray-400 text-sm">Error al cargar imagen</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          duration-700 ease-in-out group-hover:opacity-75
          ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
        `}
        style={{
          objectFit: 'cover',
        }}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}

// Generate simple blur data URL for better loading experience
function generateBlurDataURL(width: number, height: number): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6"/>
          <stop offset="100%" style="stop-color:#e5e7eb"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#gradient)"/>
    </svg>
  `
  
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

// Recipe card optimized image component
interface RecipeImageProps {
  recipe: {
    name: string
    image?: any
    category?: { name: string }
  }
  width?: number
  height?: number
  priority?: boolean
  className?: string
}

export function RecipeImage({ 
  recipe, 
  width = 400, 
  height = 300, 
  priority = false,
  className = ''
}: RecipeImageProps) {
  const imageUrl = recipe.image || '/images/recipe-placeholder.webp'
  
  return (
    <OptimizedImage
      src={imageUrl}
      alt={`Receta ${recipe.name} - ${recipe.category?.name || 'Keto'}`}
      width={width}
      height={height}
      priority={priority}
      quality={85}
      className={className}
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
      placeholder="blur"
    />
  )
}

// Hero image component with optimized loading
interface HeroImageProps {
  src: string
  alt: string
  className?: string
}

export function HeroImage({ src, alt, className = '' }: HeroImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={1920}
      height={1080}
      priority={true}
      quality={90}
      className={className}
      sizes="100vw"
      placeholder="blur"
    />
  )
}

// Avatar/profile image component
interface AvatarImageProps {
  src: string
  alt: string
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export function AvatarImage({ 
  src, 
  alt, 
  size = 'medium',
  className = ''
}: AvatarImageProps) {
  const dimensions = {
    small: 32,
    medium: 64,
    large: 128
  }
  
  const dim = dimensions[size]
  
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={dim}
      height={dim}
      quality={95}
      className={`rounded-full ${className}`}
      sizes={`${dim}px`}
    />
  )
}