'use client'

import { useState } from 'react'
import { Clock, Users, Star, ChefHat, Heart, BookOpen, ArrowLeft, Share, Phone, MessageCircle, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Recipe } from '@/types/sanity'
import Comments from '@/components/Comments'

interface RecipePageProps {
  recipe: Recipe
  thumbnailUrl: string | null
  youtubeId: string | null
}

export default function RecipePageClient({ recipe, thumbnailUrl, youtubeId }: RecipePageProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showAllIngredients, setShowAllIngredients] = useState(false)

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.name,
          text: `Mira esta deliciosa receta keto: ${recipe.name}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Enlace copiado al portapapeles')
    }
  }

  // Scroll to comments section
  const scrollToComments = () => {
    const commentsSection = document.getElementById('comments-section')
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // WhatsApp contact
  const handleWhatsAppContact = () => {
    window.open('https://api.whatsapp.com/send/?phone=34624973740&text&type=phone_number&app_absent=0', '_blank')
  }

  const ingredientsList = recipe.ingredients?.split('\n').filter(ingredient => ingredient.trim()) || []
  const displayedIngredients = showAllIngredients ? ingredientsList : ingredientsList.slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Video with Navigation Buttons */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-orange-100 to-red-100">
        {/* Modern YouTube Video Player */}
        {youtubeId ? (
          <div className="relative w-full h-full">
            {/* YouTube Embed with Custom Styling */}
            <div className="relative w-full h-full overflow-hidden rounded-none">
              <iframe
                id="youtube-player"
                src={`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&showinfo=0&rel=0&fs=1&controls=1&autoplay=0&cc_load_policy=0&iv_load_policy=3&logo=0&color=white&disablekb=0`}
                title={`Tutorial: ${recipe.name}`}
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                style={{ display: 'none' }}
              />
            </div>
            
            {/* Video Thumbnail with Custom Play Button */}
            <div 
              id="video-thumbnail"
              className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center cursor-pointer group"
              style={{
                backgroundImage: `url(https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              onClick={() => {
                const iframe = document.getElementById('youtube-player') as HTMLIFrameElement
                const thumbnail = document.getElementById('video-thumbnail')
                if (iframe && thumbnail) {
                  // Update src with autoplay and ensure it loads immediately
                  iframe.src = `https://www.youtube.com/embed/${youtubeId}?modestbranding=1&showinfo=0&rel=0&fs=1&controls=1&autoplay=1&cc_load_policy=0&iv_load_policy=3&logo=0&color=white&disablekb=0&enablejsapi=1`
                  iframe.style.display = 'block'
                  thumbnail.style.display = 'none'
                  // Force iframe to focus and trigger play
                  setTimeout(() => {
                    iframe.focus()
                  }, 100)
                }
              }}
            >
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative z-10 w-20 h-20 bg-orange-500/90 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/80 shadow-2xl group-hover:bg-orange-600/90 transition-all duration-300 transform group-hover:scale-110">
                <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-2" />
              </div>
            </div>
          </div>
        ) : (
          /* Fallback image if no video */
          thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt={recipe.name}
              fill
              className="object-cover"
              priority
            />
          )
        )}
        
        {/* Navigation Buttons */}
        <div className="absolute top-12 left-4 right-4 flex justify-between items-center z-10">
          <Link href="/recetas">
            <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          </Link>
          
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        
        {/* Category and Rating */}
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm font-medium">
            {recipe.category?.name || 'Keto'}
          </span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-medium text-gray-700">
              {(recipe.averageRating || 0) > 0 ? (recipe.averageRating || 0).toFixed(1) : '4.9'}
            </span>
          </div>
        </div>

        {/* Recipe Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {recipe.name}
          </h1>
          <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
        </div>

        {/* Recipe by Chef */}
        <div className="space-y-3">
          <p className="text-gray-600 text-sm font-medium">Receta por</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 overflow-hidden">
                <Image
                  src="/logo.webp"
                  alt="Chef"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Chef Planeta Keto</p>
                <p className="text-gray-500 text-sm">Chef</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleShare}
                className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
              >
                <Share className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={handleWhatsAppContact}
                className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
              >
                <Phone className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Descripción</h3>
          <div>
            <p className="text-gray-600 leading-relaxed">
              {showFullDescription 
                ? (recipe.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.') 
                : `${(recipe.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua').substring(0, 120)}...`
              }
            </p>
            <button 
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-orange-500 font-medium ml-1 hover:text-orange-600 transition-colors"
            >
              {showFullDescription ? 'Leer menos' : 'Leer más'}
            </button>
          </div>
        </div>

        {/* Cooking Time and Cuisine */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-gray-500 text-xs">Tiempo de Cocción</p>
              <p className="font-semibold text-gray-900">{recipe.preparationTime} min</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
              <ChefHat className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-gray-500 text-xs">Cocina</p>
              <p className="font-semibold text-gray-900">Keto</p>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="w-4 h-4 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900">Ingredientes</h3>
            </div>
            <span className="text-gray-600 text-sm">
              {recipe.servings || 1} Porción{(recipe.servings || 1) > 1 ? 'es' : ''}
            </span>
          </div>
          
          <div className="space-y-3">
            {displayedIngredients.map((ingredient, index) => (
              <p key={index} className="text-gray-700 text-sm">
                {ingredient.trim() || `${index === 0 ? '1 taza Lorem Ipsum' : index === 1 ? '200g dolor sit amet' : '2 cucharaditas Lorem'}`}
              </p>
            ))}
            
            {ingredientsList.length > 3 && (
              <button 
                onClick={() => setShowAllIngredients(!showAllIngredients)}
                className="text-orange-500 font-medium text-sm hover:text-orange-600 transition-colors flex items-center"
              >
                {showAllIngredients ? 'Ver menos' : `Ver todos (${ingredientsList.length})`}
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showAllIngredients ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Comments */}
        <div id="comments-section" className="pt-8">
          <Comments postSlug={recipe.slug.current} postTitle={recipe.name} />
        </div>
      </div>
    </div>
  )
}