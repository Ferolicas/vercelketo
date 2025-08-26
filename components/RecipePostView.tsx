// components/RecipePostView.tsx
'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import Image from 'next/image'
import { Star, Timer, Utensils, Soup, Weight, Scale, Share2, ChevronUp, ChevronDown, ChefHat, Users } from 'lucide-react'
import { useState, Suspense } from 'react'
import confetti from 'canvas-confetti'

import { urlFor } from '@/lib/sanity'
import Comments from '@/components/Comments'
import { BackButton } from './BackButton'

// Componente placeholder para los botones de compartir
function ShareButtons({ url, title }: { url: string; title: string }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `Receta: ${title}`, url });
    } else {
      alert('Usa el botón de compartir de tu navegador o copia el enlace.');
    }
  };
  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
    >
      <Share2 size={20} />
      <span>Compartir</span>
    </button>
  );
}

// Definición del tipo para los datos de la receta
interface PostData {
  name: string
  preparationTime?: number
  youtubeUrl?: string
  ingredients?: string[]
  preparation?: string
  slug: { current: string }
  averageRating?: number
  servings?: number
  thumbnail?: any
  description?: string
  category?: { name?: string; title?: string; slug?: { current: string } }
  tags?: string[]
  chefNotes?: string
  excerpt?: string
  mainImage?: any;
}

// Configuración para PortableText (sin cambios)
const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({children}) => <h2 className="text-3xl font-bold mt-6 mb-4 text-gray-800">{children}</h2>,
    h2: ({children}) => <h3 className="text-2xl font-semibold mt-5 mb-3 text-gray-700">{children}</h3>,
    h3: ({children}) => <h4 className="text-xl font-semibold mt-4 mb-2 text-gray-600">{children}</h4>,
    normal: ({children}) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
    blockquote: ({children}) => <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-gray-600 my-4">{children}</blockquote>,
  },
  list: {
    bullet: ({children}) => <ul className="list-disc list-inside mb-4 pl-4 text-gray-700 space-y-1">{children}</ul>,
    number: ({children}) => <ol className="list-decimal list-inside mb-4 pl-4 text-gray-700 space-y-1">{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href;
      return href ? <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{children}</a> : <>{children}</>;
    },
    strong: ({children}) => <strong className="font-semibold text-gray-800">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>,
  },
}

// Componente para el video de YouTube (sin cambios)
function YouTubeEmbed({ videoUrl }: { videoUrl: string }) {
  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId) return <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center"><p className="text-gray-500">URL de video no válida</p></div>;
  return (
    <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden shadow-lg">
      <iframe src={`https://www.youtube.com/embed/${videoId}`} title="Video de la receta" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute top-0 left-0 w-full h-full" />
    </div>
  )
}

// 👇 CAMBIO 2: Modificamos 'ExpandableContent' para que acepte un STRING para los ingredientes
function ExpandableContent({ title, content, isIngredients = false }: { title: string; content: string | string[] | PortableTextBlock[]; isIngredients?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Lógica para los ingredientes (ahora funciona con un string o array)
  if (isIngredients && (typeof content === 'string' || Array.isArray(content))) {
    const stringContent = Array.isArray(content) ? content : content.split('\n').filter(item => item.trim() !== ''); // Handle array or string
    const visibleItems = isExpanded ? stringContent : stringContent.slice(0, 5);
    const hasMore = stringContent.length > 5;
    return (
      <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
        <ul className="space-y-2">
          {visibleItems.map((item, index) => (
            <li key={index} className="flex items-start space-x-3"><span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span><span className="text-gray-700">{String(item)}</span></li>
          ))}
        </ul>
        {hasMore && (<button onClick={() => setIsExpanded(!isExpanded)} className="mt-4 flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"><span>{isExpanded ? 'Ver menos' : `Ver ${stringContent.length - visibleItems.length} más`}</span>{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</button>)}
      </div>
    );
  }
  
  // Lógica para la descripción (sin cambios)
  if (Array.isArray(content) && content.length > 0 && typeof content[0] === 'object' && '_type' in content[0] && content[0]._type === 'block') {
    return (
      <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
        <div className="text-gray-700 leading-relaxed prose prose-emerald max-w-none"><PortableText value={content as PortableTextBlock[]} components={portableTextComponents} /></div>
      </div>
    );
  }
  return null;
}


interface RecipePostViewProps {
  recipe: PostData;
}

export function RecipePostView({ recipe }: RecipePostViewProps) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg max-w-4xl mx-auto my-6">
      <div className="flex justify-between items-center mb-4">
        <BackButton text="Volver a las recetas" />
        <ShareButtons url={shareUrl} title={recipe.name} />
      </div>

      <div className="mb-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{recipe.name}</h2>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div />
        {recipe.averageRating && (
          <div className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-yellow-400 fill-current" />
            <span className="text-lg font-semibold text-gray-800">{recipe.averageRating}</span>
            <span className="text-gray-600">/5</span>
          </div>
        )}
      </div>
      
      {recipe.youtubeUrl && (
        <div className="mb-8">
          <Suspense fallback={<div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center"><p className="text-gray-500">Cargando video...</p></div>}>
            <YouTubeEmbed videoUrl={recipe.youtubeUrl} />
          </Suspense>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg shadow-sm">
          <Timer size={20} className="text-emerald-600" />
          <div>
            <span className="block font-medium text-gray-700 text-sm break-normal">Duración</span>
            <span className="text-gray-600">{recipe.preparationTime || 'N/A'}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg shadow-sm">
          <ChefHat size={20} className="text-emerald-600" />
          <div>
            <span className="block font-medium text-gray-700 text-sm">Dificultad</span>
            <span className="text-gray-600 capitalize">Intermedio</span>
          </div>
        </div>
        {recipe.servings && (
          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg shadow-sm">
            <Users size={20} className="text-emerald-600" />
            <div>
              <span className="block font-medium text-gray-700 text-sm">Porciones</span>
              <span className="text-gray-600">{recipe.servings}</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-8 break-words">
        {/* La llamada a ExpandableContent para ingredientes sigue igual y ahora funciona */}
        {recipe.ingredients && (
          <ExpandableContent title="Ingredientes" content={recipe.ingredients} isIngredients={true} />
        )}
        {/* La llamada para la descripción también se mantiene igual */}
        {recipe.preparation && (
          <ExpandableContent title="Preparación" content={recipe.preparation} />
        )}
      </div>

      {recipe.chefNotes && (
        <div className="my-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">💡 Notas del Chef</h3>
          <p className="text-yellow-700">{recipe.chefNotes}</p>
        </div>
      )}

      
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Etiquetas</h3>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      )}

      {recipe.slug?.current && recipe.name && (
        <Comments postSlug={recipe.slug.current} postTitle={recipe.name} />
      )}
    </div>
  )
}