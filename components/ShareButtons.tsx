// components/ShareButtons.tsx
'use client'

import { Share2, Mail } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
  description: string
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const shareButtons = [
    {
      name: 'WhatsApp',
      icon: '📱',
      bgColor: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`
    },
    {
      name: 'Telegram',
      icon: '✈️',
      bgColor: 'bg-blue-500 hover:bg-blue-600',
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    },
    {
      name: 'Facebook',
      icon: '📘',
      bgColor: 'bg-blue-700 hover:bg-blue-800',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },
    {
      name: 'Instagram',
      icon: '📷',
      bgColor: 'bg-pink-500 hover:bg-pink-600',
      url: `https://www.instagram.com/` // Instagram no permite compartir enlaces directamente
    },
    {
      name: 'Email',
      icon: <Mail size={16} />,
      bgColor: 'bg-gray-600 hover:bg-gray-700',
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`
    }
  ]

  const handleShare = (shareUrl: string, platform: string) => {
    if (platform === 'Instagram') {
      // Para Instagram, copiar al portapapeles
      navigator.clipboard.writeText(url)
      alert('Enlace copiado al portapapeles. Puedes pegarlo en Instagram.')
      return
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer')
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <Share2 size={20} />
        <span>Compartir</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border p-4 z-50 min-w-[200px]">
          <div className="grid grid-cols-1 gap-2">
            {shareButtons.map((button) => (
              <button
                key={button.name}
                onClick={() => handleShare(button.url, button.name)}
                className={`flex items-center space-x-3 p-2 rounded-lg text-white transition-colors ${button.bgColor}`}
              >
                <span className="text-lg">{button.icon}</span>
                <span className="text-sm font-medium">{button.name}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="mt-3 w-full text-gray-500 text-sm hover:text-gray-700"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Overlay para cerrar el menú */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}