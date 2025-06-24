// app/categorias/[slug]/[post]/PostContent.tsx (Client Component)

"use client"

import { Star, ChevronDown, ChevronUp } from 'lucide-react'
import { Suspense, useState } from 'react'

// Tipos para los datos del post
interface PostData {
  title: string
  author?: { name: string }
  preparationTime: string
  level: string
  youtubeUrl?: string
  ingredients: string[]
  body: string
  slug: string
  rating?: number // Agregamos el rating como opcional
}

// Componente para el video de YouTube
function YouTubeEmbed({ videoUrl }: { videoUrl: string }) {
  // Extraer el ID del video de YouTube de diferentes formatos de URL
  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const videoId = getYouTubeVideoId(videoUrl)
  
  if (!videoId) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">URL de video no válida</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Video de la receta"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  )
}

// Componente para contenido desplegable
function ExpandableContent({ 
  title, 
  content, 
  isIngredients = false 
}: { 
  title: string
  content: string | string[]
  isIngredients?: boolean 
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Para ingredientes, mostrar como lista
  if (isIngredients && Array.isArray(content)) {
    const visibleItems = isExpanded ? content : content.slice(0, Math.ceil(content.length * 0.4))
    const hasMore = content.length > Math.ceil(content.length * 0.4)
    
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
        <ul className="space-y-2">
          {visibleItems.map((ingredient, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-gray-700">{ingredient}</span>
            </li>
          ))}
        </ul>
        
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            <span>{isExpanded ? 'Ver menos' : `Ver ${content.length - visibleItems.length} más`}</span>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        )}
      </div>
    )
  }
  
  // Para descripción, mostrar como texto
  if (typeof content === 'string') {
    const words = content.split(' ')
    const visibleWords = isExpanded ? words : words.slice(0, Math.ceil(words.length * 0.4))
    const hasMore = words.length > Math.ceil(words.length * 0.4)
    
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
        <div className="text-gray-700 leading-relaxed">
          <p>
            {visibleWords.join(' ')}
            {!isExpanded && hasMore && '...'}
          </p>
        </div>
        
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            <span>{isExpanded ? 'Ver menos' : 'Ver más'}</span>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        )}
      </div>
    )
  }
  
  return null
}

// Componente principal del contenido interactivo
export default function PostContent({ postData }: { postData: PostData }) {
  return (
    <>
      {/* Video de YouTube */}
      {postData.youtubeUrl && (
        <div className="mb-8">
          <Suspense fallback={
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Cargando video...</p>
            </div>
          }>
            <YouTubeEmbed videoUrl={postData.youtubeUrl} />
          </Suspense>
        </div>
      )}

      {/* Lista de ingredientes */}
      {postData.ingredients && postData.ingredients.length > 0 && (
        <div className="mb-8">
          <ExpandableContent
            title="Ingredientes"
            content={postData.ingredients}
            isIngredients={true}
          />
        </div>
      )}

      {/* Descripción/Instrucciones */}
      {postData.body && (
        <div className="mb-8">
          <ExpandableContent
            title="Preparación"
            content={postData.body}
          />
        </div>
      )}
    </>
  )
}