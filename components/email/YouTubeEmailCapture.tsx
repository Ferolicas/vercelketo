'use client'

import { useState } from 'react'
import { PlayIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface YouTubeEmailCaptureProps {
  trigger?: 'immediate' | 'scroll'
  position?: 'modal' | 'inline'
}

export default function YouTubeEmailCapture({
  trigger = 'scroll',
  position = 'modal'
}: YouTubeEmailCaptureProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubmitted(true)
      
      // Redirect to YouTube after short delay
      setTimeout(() => {
        window.open('https://youtube.com/@PlanetaKeto', '_blank')
        setIsVisible(false)
      }, 2000)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  if (position === 'modal') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <div className="text-center">
            <div className="text-4xl mb-4">📺</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Accede a mi canal de YouTube!
            </h3>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <PlayIcon className="h-5 w-5 mr-2" />
                      Ver Canal Gratis
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div>
                <div className="text-4xl mb-4">✅</div>
                <p className="text-lg text-green-600">¡Gracias! Redirigiendo al canal...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}