'use client'

import { memo, useState, useEffect, useRef } from 'react'
import { Timer, CheckCircle, Calculator, Share2, Heart, BookmarkPlus, Users, Star, Play, Pause } from 'lucide-react'

interface RecipeEngagementSuiteProps {
  recipe: {
    id: string
    name: string
    preparationTime: number
    cookingTime?: number
    servings: number
    difficulty: 'easy' | 'medium' | 'hard'
    ingredients: string[]
    instructions: string[]
    rating?: number
    totalRatings?: number
  }
  onEngagementEvent?: (event: string, data: any) => void
}

function RecipeEngagementSuite({ recipe, onEngagementEvent }: RecipeEngagementSuiteProps) {
  const [activeTab, setActiveTab] = useState<'timer' | 'checklist' | 'calculator' | 'reviews'>('timer')
  const [timerState, setTimerState] = useState<'idle' | 'running' | 'paused'>('idle')
  const [timeLeft, setTimeLeft] = useState(recipe.preparationTime * 60) // en segundos
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set())
  const [userRating, setUserRating] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [servingMultiplier, setServingMultiplier] = useState(1)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Timer functionality
  useEffect(() => {
    if (timerState === 'running' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerState('idle')
            onEngagementEvent?.('timer_completed', { recipe_id: recipe.id })
            // Mostrar notificación
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`¡${recipe.name} está listo!`, {
                icon: '/logo.webp',
                body: 'Tu receta keto ha terminado de cocinarse.'
              })
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [timerState, timeLeft, recipe.id, recipe.name, onEngagementEvent])

  // Engagement tracking
  useEffect(() => {
    startTimeRef.current = Date.now()
    return () => {
      const timeSpent = Date.now() - startTimeRef.current
      onEngagementEvent?.('time_on_recipe', { 
        recipe_id: recipe.id, 
        time_spent_ms: timeSpent,
        interactions: {
          timer_used: timerState !== 'idle',
          ingredients_checked: checkedIngredients.size,
          rating_given: userRating > 0,
          recipe_saved: isSaved
        }
      })
    }
  }, [recipe.id, timerState, checkedIngredients.size, userRating, isSaved, onEngagementEvent])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleTimer = () => {
    if (timerState === 'idle') {
      setTimerState('running')
      onEngagementEvent?.('timer_started', { recipe_id: recipe.id })
    } else if (timerState === 'running') {
      setTimerState('paused')
      onEngagementEvent?.('timer_paused', { recipe_id: recipe.id })
    } else {
      setTimerState('running')
      onEngagementEvent?.('timer_resumed', { recipe_id: recipe.id })
    }
  }

  const resetTimer = () => {
    setTimerState('idle')
    setTimeLeft(recipe.preparationTime * 60)
    onEngagementEvent?.('timer_reset', { recipe_id: recipe.id })
  }

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedIngredients(newChecked)
    
    onEngagementEvent?.('ingredient_checked', { 
      recipe_id: recipe.id, 
      ingredient_index: index,
      total_checked: newChecked.size,
      completion_percentage: (newChecked.size / recipe.ingredients.length) * 100
    })
  }

  const shareRecipe = async () => {
    const shareData = {
      title: `Receta Keto: ${recipe.name}`,
      text: `¡Mira esta deliciosa receta keto que encontré en Planeta Keto!`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        onEngagementEvent?.('recipe_shared', { recipe_id: recipe.id, method: 'native' })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      onEngagementEvent?.('recipe_shared', { recipe_id: recipe.id, method: 'clipboard' })
      // Mostrar feedback visual
    }
  }

  const saveRecipe = () => {
    setIsSaved(!isSaved)
    onEngagementEvent?.('recipe_saved', { 
      recipe_id: recipe.id, 
      action: !isSaved ? 'saved' : 'unsaved' 
    })
  }

  const submitRating = (rating: number) => {
    setUserRating(rating)
    onEngagementEvent?.('recipe_rated', { 
      recipe_id: recipe.id, 
      rating,
      previous_rating: userRating 
    })
  }

  // Calculadora de porciones
  const adjustedIngredients = recipe.ingredients.map(ingredient => {
    if (servingMultiplier === 1) return ingredient
    
    // Simple regex para encontrar números y ajustarlos
    return ingredient.replace(/(\d+(?:\.\d+)?)/g, (match) => {
      const num = parseFloat(match)
      const adjusted = num * servingMultiplier
      return adjusted % 1 === 0 ? adjusted.toString() : adjusted.toFixed(1)
    })
  })

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header con tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {[
            { id: 'timer', icon: Timer, label: 'Timer', color: 'text-orange-500' },
            { id: 'checklist', icon: CheckCircle, label: 'Lista', color: 'text-green-500' },
            { id: 'calculator', icon: Calculator, label: 'Calculadora', color: 'text-blue-500' },
            { id: 'reviews', icon: Star, label: 'Valorar', color: 'text-yellow-500' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-50 text-gray-900 border-b-2 border-green-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : ''}`} />
                <span className="hidden sm:inline">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Timer Tab */}
        {activeTab === 'timer' && (
          <div className="text-center">
            <div className="mb-6">
              <div className={`text-6xl font-mono font-bold mb-4 ${
                timerState === 'running' ? 'text-green-600' : 
                timerState === 'paused' ? 'text-orange-500' : 'text-gray-600'
              }`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-600">
                Tiempo de preparación: {recipe.preparationTime} minutos
                {recipe.cookingTime && ` | Cocción: ${recipe.cookingTime} minutos`}
              </div>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={toggleTimer}
                className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-colors ${
                  timerState === 'running'
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {timerState === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {timerState === 'idle' ? 'Iniciar' : timerState === 'running' ? 'Pausar' : 'Continuar'}
              </button>
              
              <button
                onClick={resetTimer}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Reiniciar
              </button>
            </div>

            {timeLeft === 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-800 font-semibold">🎉 ¡Receta completada!</div>
                <div className="text-green-600 text-sm mt-1">
                  Tu {recipe.name} está listo para disfrutar
                </div>
              </div>
            )}
          </div>
        )}

        {/* Checklist Tab */}
        {activeTab === 'checklist' && (
          <div>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Ingredientes ({recipe.servings} porciones)</h3>
              <div className="text-sm text-gray-600 mb-4">
                Progreso: {checkedIngredients.size}/{recipe.ingredients.length} ingredientes
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(checkedIngredients.size / recipe.ingredients.length) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <label key={index} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checkedIngredients.has(index)}
                    onChange={() => toggleIngredient(index)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <span className={`ml-3 transition-all ${
                    checkedIngredients.has(index) 
                      ? 'text-gray-500 line-through' 
                      : 'text-gray-900 group-hover:text-green-600'
                  }`}>
                    {ingredient}
                  </span>
                </label>
              ))}
            </div>

            {checkedIngredients.size === recipe.ingredients.length && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <div className="text-green-800 font-semibold">✅ ¡Todos los ingredientes listos!</div>
                <div className="text-green-600 text-sm mt-1">
                  Ahora puedes empezar a cocinar
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Calculadora de Porciones</h3>
              
              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-medium text-gray-700">
                  Porciones deseadas:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setServingMultiplier(Math.max(0.5, servingMultiplier - 0.5))}
                    className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold text-green-600 w-16 text-center">
                    {Math.round(recipe.servings * servingMultiplier)}
                  </span>
                  <button
                    onClick={() => setServingMultiplier(servingMultiplier + 0.5)}
                    className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {servingMultiplier !== 1 && (
                <div className="text-sm text-blue-600 mb-4">
                  Multiplicador: x{servingMultiplier} | Receta original: {recipe.servings} porciones
                </div>
              )}
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Ingredientes Ajustados:</h4>
              <div className="space-y-2">
                {adjustedIngredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0" />
                    <span className={servingMultiplier !== 1 ? 'text-blue-700 font-medium' : 'text-gray-700'}>
                      {ingredient}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="text-center">
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">¿Qué te pareció esta receta?</h3>
              <div className="text-sm text-gray-600">
                Tu opinión nos ayuda a mejorar
              </div>
            </div>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => submitRating(star)}
                  className={`w-10 h-10 transition-colors ${
                    star <= userRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                  }`}
                >
                  <Star className="w-full h-full fill-current" />
                </button>
              ))}
            </div>

            {userRating > 0 && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-800 font-semibold">
                  ¡Gracias por tu valoración de {userRating} estrellas!
                </div>
                <div className="text-green-600 text-sm mt-1">
                  Tu feedback nos ayuda a crear mejores recetas
                </div>
              </div>
            )}

            {recipe.rating && recipe.totalRatings && (
              <div className="text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{recipe.rating.toFixed(1)}</span>
                  <span>({recipe.totalRatings.toLocaleString()} valoraciones)</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-3 justify-center">
          <button
            onClick={shareRecipe}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Compartir</span>
          </button>
          
          <button
            onClick={saveRecipe}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isSaved 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            <BookmarkPlus className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isSaved ? 'Guardada' : 'Guardar'}
            </span>
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">
              {Math.floor(Math.random() * 500) + 100} cocinaron hoy
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(RecipeEngagementSuite)