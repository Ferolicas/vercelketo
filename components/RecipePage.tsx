'use client'

import React, { useState } from 'react'
import { Clock, Users, Star, ChefHat, Heart, BookOpen, ArrowLeft, Share, Phone, MessageCircle, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Recipe } from '@/types/sanity'
import Comments from '@/components/Comments'
import AdPlacement from '@/components/ads/AdPlacement'
import InContentAd from '@/components/ads/InContentAd'
import BookRecommendationWidget from '@/components/recipe/BookRecommendationWidget'
import RecipeEngagementSuite from '@/components/recipe/RecipeEngagementSuite'
import AdSenseAutoAds from '@/components/ads/AdSenseAutoAds'
import BookUpsellWidget from '@/components/recipe/BookUpsellWidget'
import AffiliateLinksWidget from '@/components/recipe/AffiliateLinksWidget'

interface RecipePageProps {
  recipe: Recipe
  thumbnailUrl: string | null
  youtubeId: string | null
}

export default function RecipePageClient({ recipe, thumbnailUrl, youtubeId }: RecipePageProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showAllIngredients, setShowAllIngredients] = useState(false)
  const [showExitIntent, setShowExitIntent] = useState(false)

  // Exit intent detection
  React.useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showExitIntent) {
        setShowExitIntent(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [showExitIntent])

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
    <>
      {/* AdSense Auto Ads Configuration */}
      <AdSenseAutoAds 
        enableAutoAds={true}
        enableManualControl={true}
        adDensity="medium"
        adFormats={{
          display: true,
          inFeed: true,
          inArticle: true,
          matchedContent: true,
          link: false,
          multiplex: true
        }}
        pageExclusions={['/admin', '/api']}
      />
      
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
                src={`https://www.youtube.com/embed/${youtubeId}?controls=0&modestbranding=1&showinfo=0&rel=0&fs=1&autoplay=0&cc_load_policy=0&iv_load_policy=3&logo=0&disablekb=1`}
                title=""
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
                  // Create a new iframe with autoplay and controls visible
                  const newIframe = document.createElement('iframe')
                  newIframe.id = 'youtube-player'
                  newIframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=1&modestbranding=1&showinfo=0&rel=0&fs=1&cc_load_policy=0&iv_load_policy=3&disablekb=0`
                  newIframe.title = ""
                  newIframe.allowFullscreen = true
                  newIframe.className = 'absolute top-0 left-0 w-full h-full'
                  newIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  
                  // Replace the old iframe and hide thumbnail
                  iframe.parentNode?.replaceChild(newIframe, iframe)
                  thumbnail.style.display = 'none'
                }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/40 to-black/60"></div>
              
              {/* Custom Play Button */}
              <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center border-3 border-white/90 shadow-2xl group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
                <div className="w-0 h-0 border-l-[22px] border-l-white border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent ml-1 drop-shadow-sm" />
              </div>
              
              {/* Play Text */}
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-white font-semibold text-sm">▶ Ver Tutorial Completo</p>
                  <p className="text-white/80 text-xs">Haz clic para reproducir</p>
                </div>
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

      {/* AdSense Header - Solo Desktop */}
      <AdPlacement 
        position="header" 
        className="py-4 bg-gray-50"
        showOnMobile={false}
        showOnDesktop={true}
      />

      {/* Content Layout with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
        
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

            {/* Pre-Recipe Ad */}
            <InContentAd 
              adSlot="recipe-pre-content" 
              className="my-8"
              minViewportHeight={400}
            />

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

            {/* Recipe Engagement Suite */}
            <RecipeEngagementSuite 
              recipe={{
                id: recipe._id || 'unknown',
                name: recipe.name,
                preparationTime: recipe.preparationTime || 30,
                cookingTime: recipe.preparationTime,
                servings: recipe.servings || 1,
                difficulty: 'easy' as const,
                ingredients: recipe.ingredients?.split('\n').filter(i => i.trim()) || [],
                instructions: [],
                rating: recipe.averageRating,
                totalRatings: recipe.totalRatings
              }}
              onEngagementEvent={(event, data) => {
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', event, {
                    event_category: 'recipe_engagement',
                    event_label: data.recipe_id,
                    ...data
                  });
                }
              }}
            />

            {/* Mid-Recipe Ad */}
            <div className="my-12">
              <InContentAd 
                adSlot="recipe-mid-content" 
                className="border-t border-b border-gray-200 py-8"
                minViewportHeight={300}
              />
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
          
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="space-y-3">
                {displayedIngredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0" />
                    <span className="text-sm">{ingredient.trim() || `${index === 0 ? '1 taza Lorem Ipsum' : index === 1 ? '200g dolor sit amet' : '2 cucharaditas Lorem'}`}</span>
                  </div>
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
            </div>

            {/* Book Upsell - Optimizado para conversión */}
            <div className="my-12">
              <BookUpsellWidget 
                position="inline"
                recipeCategory={recipe.category?.name || 'general'}
                priority="high"
                context="recipe_page"
              />
            </div>

            {/* Affiliate Links - Productos relevantes */}
            <div className="my-12">
              <AffiliateLinksWidget 
                recipeCategory={recipe.category?.name || 'general'}
                recipeIngredients={recipe.ingredients?.split('\n').filter(i => i.trim()) || []}
                position="inline"
                maxProducts={3}
              />
            </div>

            {/* Comments */}
            <div id="comments-section" className="pt-8">
              <Comments postSlug={recipe.slug.current} postTitle={recipe.name} />
            </div>

            {/* Bottom Content Ad */}
            <div className="mt-12">
              <AdPlacement 
                position="content-bottom" 
                className="border-t pt-8"
              />
            </div>
          </div>
        </div>
        
        {/* Sidebar - Right Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            
            {/* Book Upsell Sidebar */}
            <BookUpsellWidget 
              position="floating"
              recipeCategory={recipe.category?.name || 'general'}
              priority="high"
            />
            
            {/* Affiliate Links Sidebar */}
            <AffiliateLinksWidget 
              recipeCategory={recipe.category?.name || 'general'}
              recipeIngredients={recipe.ingredients?.split('\n').filter(i => i.trim()) || []}
              position="sidebar"
              maxProducts={2}
            />
            
            {/* Sidebar Ad */}
            <AdPlacement 
              position="sidebar" 
              className="hidden lg:block"
            />
            
            {/* Related Recipes Placeholder */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <ChefHat className="w-5 h-5 mr-2 text-green-600" />
                Recetas Similares
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">
                  Próximamente: Recetas relacionadas basadas en ingredientes y categoría.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                        <ChefHat className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">Receta Keto #{i}</h4>
                        <p className="text-xs text-gray-600">Próximamente...</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        </div>
        
      </div>
      </div>

      {/* Mobile Sticky Ad */}
      <AdPlacement 
        position="mobile-sticky" 
        showOnMobile={true}
        showOnDesktop={false}
      />

      {/* Floating Affiliate Product */}
      <AffiliateLinksWidget 
        recipeCategory={recipe.category?.name || 'general'}
        recipeIngredients={recipe.ingredients?.split('\n').filter(i => i.trim()) || []}
        position="floating"
        maxProducts={1}
      />

      {/* Exit Intent Modal */}
      {showExitIntent && (
        <BookUpsellWidget 
          position="exit-intent"
          recipeCategory={recipe.category?.name || 'general'}
          trigger="exit"
          priority="high"
        />
      )}
    </>
  )
}