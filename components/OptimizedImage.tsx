'use client'

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  objectFit = 'cover'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Generate blur placeholder if not provided
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  if (error) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ 
          width: fill ? '100%' : width, 
          height: fill ? '100%' : height,
          minHeight: fill ? undefined : height || 200
        }}
      >
        <div className="text-gray-400 text-center p-4">
          <svg className="mx-auto h-12 w-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <p className="text-sm">Imagen no disponible</p>
        </div>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    quality,
    priority,
    placeholder,
    blurDataURL: blurDataURL || defaultBlurDataURL,
    onLoad: handleLoadingComplete,
    onError: handleError,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    style: { objectFit }
  };

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          {...imageProps}
          fill
          sizes={sizes}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <Image
        {...imageProps}
        width={width || 400}
        height={height || 300}
        sizes={sizes}
      />
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width: width || 400, height: height || 300 }}
        />
      )}
    </div>
  );
}

// Componente específico para imágenes de Sanity con optimización automática
interface SanityImageProps extends Omit<OptimizedImageProps, 'src'> {
  image: {
    asset: {
      _ref: string;
      url?: string;
    };
    hotspot?: {
      x: number;
      y: number;
    };
    crop?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    alt?: string;
  };
  maxWidth?: number;
}

export function SanityOptimizedImage({
  image,
  alt: propAlt,
  maxWidth = 800,
  ...props
}: SanityImageProps) {
  if (!image?.asset?._ref) {
    return null;
  }

  // Convertir _ref de Sanity a URL optimizada
  const imageRef = image.asset._ref;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  
  // Construir URL optimizada de Sanity
  const baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${imageRef.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`;
  const optimizedUrl = `${baseUrl}?w=${maxWidth}&q=85&auto=format&fit=max`;

  const alt = propAlt || image.alt || 'Imagen de Planeta Keto';

  return (
    <OptimizedImage
      {...props}
      src={optimizedUrl}
      alt={alt}
      placeholder="blur"
    />
  );
}