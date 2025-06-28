// components/RecipePostView.tsx
'use client'

// CORREGIDO: Importa el tipo PortableTextComponents
import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import Image from 'next/image'
import { Star, Timer, Utensils, Soup, Weight, Scale, Share2, ChevronUp, ChevronDown, ArrowLeft } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import confetti from 'canvas-confetti'

import { urlFor } from '@/lib/sanity'
import Comments from '@/components/Comments'

// Asegúrate de que este tipo coincida con los datos que recibes del postBySlug query
interface PostData {
  title: string
  author?: { name: string }
  preparationTime?: string
  level?: string
  youtubeUrl?: string
  ingredients: string[]
  body: PortableTextBlock[] // Es PortableTextBlock[]
  slug: { current: string }
  rating?: number
  servings?: number
  calories?: number
  macros?: {
    carbs?: number
    protein?: number
    fat?: number
    fiber?: number
  }
  tags?: string[]
  chefNotes?: string
  excerpt?: string
  category?: { title: string; slug: { current: string } }
  mainImage?: any; // SanityImageSource para urlFor
}

// CORREGIDO: Asigna explícitamente el tipo PortableTextComponents al objeto
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
    // El tipo para `value` es opcional, ya que puede no estar presente en todos los casos.
    // El componente ahora comprueba si `value.href` existe antes de renderizar el enlace.
    link: ({ children, value }) => {
      const href = value?.href;
      if (href) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {children}
          </a>
        );
      }
      // Si no hay href, renderiza solo el texto.
      return <>{children}</>;
    },
    strong: ({children}) => <strong className="font-semibold text-gray-800">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>,
  },
  // Añade más tipos si tienes custom components en tu blockContent (ej. `image` para imágenes en el cuerpo)
}


// Componente para el video de YouTube
function YouTubeEmbed({ videoUrl }: { videoUrl: string }) {
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
      {/* CORREGIDO: Asegúrate de que la URL de embed de YouTube sea correcta.
         El formato `https://www.youtube.com/embed/${videoId}` parece ser un error de copia.
         Debería ser algo como `https://www.youtube.com/embed/${videoId}`
      */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`} // **CAMBIO CRÍTICO AQUÍ**
        title="Video de la receta"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  )
}

// Componente para contenido desplegable (ingredientes y preparación)
function ExpandableContent({ 
  title, 
  content, 
  isIngredients = false 
}: { 
  title: string
  content: string[] | PortableTextBlock[] // Aceptar PortableTextBlock[]
  isIngredients?: boolean 
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Para ingredientes, mostrar como lista
  if (isIngredients && Array.isArray(content) && content.every(item => typeof item === 'string')) {
    const stringContent = content as string[];
    const visibleItems = isExpanded ? stringContent : stringContent.slice(0, Math.ceil(stringContent.length * 0.4));
    const hasMore = stringContent.length > Math.ceil(stringContent.length * 0.4);
    
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
        <ul className="space-y-2">
          {visibleItems.map((item, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
        
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            <span>{isExpanded ? 'Ver menos' : `Ver ${stringContent.length - visibleItems.length} más`}</span>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        )}
      </div>
    )
  }
  
  // Para PortableText (Preparación)
  // Verificamos si es un array, no está vacío y si el primer elemento parece un PortableTextBlock
  if (Array.isArray(content) && content.length > 0 && typeof content[0] === 'object' && '_type' in content[0] && content[0]._type === 'block') {
    const portableContent = content as PortableTextBlock[];

    // No necesitamos truncar PortableText con "ver más/menos" basado en palabras
    // porque PortableText puede contener estructuras complejas.
    // Simplemente se muestra el contenido completo o se gestiona la visibilidad desde otro nivel
    // si el PortableText en sí es demasiado largo.
    // Si quieres un "ver más/menos" para PortableText, tendrías que implementar
    // una lógica de truncado más sofisticada a nivel de PortableText o pasar solo una parte
    // del array de PortableTextBlock.
    // Por ahora, mostrará el PortableText completo.

    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
        <div className="text-gray-700 leading-relaxed">
          <PortableText value={portableContent} components={portableTextComponents} />
        </div>
      </div>
    )
  }

  // Eliminado el bloque `if (typeof content === 'string')` con `content.split(' ')`
  // porque tu `body` (Preparación) es `PortableTextBlock[]` y `ingredients` es `string[]`.
  // No hay escenario en tu `PostData` donde `content` para la Preparación sea un string simple,
  // y los ingredientes ya se manejan en el primer `if`.
  
  return null // Si el contenido no coincide con ninguno de los tipos esperados, no renderizar nada.
}

interface RecipePostViewProps {
  recipe: PostData;
  onBackClick: () => void;
}

export function RecipePostView({ recipe, onBackClick }: RecipePostViewProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Receta Keto: ${recipe.title} en Planeta Keto`,
        text: `Descubre esta increíble receta keto: ${recipe.title}. ¡Perfecta para tu dieta cetogénica!`,
        url: window.location.href,
      }).then(() => {
        console.log('Contenido compartido con éxito');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }).catch((error) => console.error('Error al compartir:', error));
    } else {
      alert('Tu navegador no soporta la función de compartir. Puedes copiar el enlace manualmente.');
    }
  };

  // Determinar la URL de la imagen principal usando urlFor
  // Asumiendo que `recipe.mainImage` contiene el objeto de imagen de Sanity
  const mainImageUrl = recipe.mainImage ? urlFor(recipe.mainImage).url() : '/placeholder-recipe.jpg';

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-4xl mx-auto my-6">
      {/* Botón de volver */}
      <div className="mb-4">
        <button
          onClick={onBackClick}
          className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver a las recetas</span>
        </button>
      </div>

      {mainImageUrl && (
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden mb-6">
          <Image
            src={mainImageUrl}
            alt={recipe.title}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      )}

      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{recipe.title}</h2>
      <p className="text-gray-600 text-lg mb-6">{recipe.excerpt}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 text-gray-700">
        {recipe.preparationTime && (
          <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-md">
            <Timer className="w-5 h-5 text-emerald-600" />
            <span>Tiempo: {recipe.preparationTime}</span>
          </div>
        )}
        {recipe.level && (
          <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-md">
            <Utensils className="w-5 h-5 text-emerald-600" />
            <span>Dificultad: {recipe.level}</span>
          </div>
        )}
        {recipe.servings && (
          <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-md">
            <Soup className="w-5 h-5 text-emerald-600" />
            <span>Porciones: {recipe.servings}</span>
          </div>
        )}
        {recipe.rating && (
          <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-md">
            <Star fill="currentColor" className="w-5 h-5 text-yellow-500" />
            <span>Calificación: {recipe.rating}/5</span>
          </div>
        )}
        {recipe.calories && (
          <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-md">
            <Scale className="w-5 h-5 text-emerald-600" />
            <span>Calorías: {recipe.calories} kcal</span>
          </div>
        )}
          {recipe.macros && (
          <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-md">
            <Weight className="w-5 h-5 text-emerald-600" />
            <span>Macros: C:{recipe.macros.carbs || 0}g P:{recipe.macros.protein || 0}g G:{recipe.macros.fat || 0}g</span>
          </div>
        )}
      </div>

      {/* Video de YouTube */}
      {recipe.youtubeUrl && (
        <div className="mb-8">
          <Suspense fallback={
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Cargando video...</p>
            </div>
          }>
            <YouTubeEmbed videoUrl={recipe.youtubeUrl} />
          </Suspense>
        </div>
      )}

      {/* Lista de ingredientes */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="mb-8">
          <ExpandableContent
            title="Ingredientes"
            content={recipe.ingredients}
            isIngredients={true}
          />
        </div>
      )}

      {/* Descripción/Instrucciones (ahora con PortableText) */}
      {recipe.body && (
        <div className="mb-8 break-words">
          <ExpandableContent
            title="Preparación"
            content={recipe.body}
          />
        </div>
      )}

      {recipe.chefNotes && (
        <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-md mb-6 italic">
          <h4 className="font-semibold mb-2">Notas del Chef:</h4>
          <p>{recipe.chefNotes}</p>
        </div>
      )}

      {recipe.tags && recipe.tags.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Etiquetas:</h4>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <span key={index} className="bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end mt-8">
        <button
          onClick={handleShare}
          className="hover:text-blue-600 text-white font-bold py-3 px-6 rounded-full flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
          aria-label="Compartir esta receta"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Componente de comentarios */}
      {recipe.slug?.current && recipe.title && (
        <Comments
          postSlug={recipe.slug.current}
          postTitle={recipe.title}
        />
      )}
    </div>
  )
}