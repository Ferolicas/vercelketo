'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Check } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Product {
  _id: string
  title: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image?: string
  includes?: string[]
}

interface PurchaseModalProps {
  product: Product
  onClose: () => void
}

interface ToastProps {
  message: string
  type: 'error' | 'success'
  onClose: () => void
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      type === 'error' ? 'bg-red-500' : 'bg-green-500'
    } text-white max-w-md`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

function CheckoutForm({ product, onClose, finalPrice }: { product: Product; onClose: () => void; finalPrice: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    setLoading(true)
    setError(null)

    // Simulación para modo development
    if (process.env.NODE_ENV === 'development' && !stripe) {
      console.log('🚧 Development mode: Simulating payment')
      setTimeout(() => {
        setLoading(false)
        alert('Pago simulado exitoso en modo desarrollo')
        onClose()
      }, 2000)
      return
    }

    if (!stripe || !elements) {
      setError('Error de configuración de Stripe')
      setLoading(false)
      return
    }

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message || 'Error al procesar el pago')
      setLoading(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/complete-order`,
      },
    })

    if (confirmError) {
      setError(confirmError.message || 'Error al confirmar el pago')
    }

    setLoading(false)
  }

  const isDevMode = process.env.NODE_ENV === 'development' && !stripe

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isDevMode && (
        <PaymentElement 
          options={{
            layout: "tabs",
          }}
        />
      )}
      {isDevMode && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-2">💳 Formulario de pago (simulado)</p>
          <p className="text-sm text-gray-400">En producción aparecería aquí el formulario real de Stripe</p>
        </div>
      )}
      {error && (
        <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg 
                 font-semibold text-lg transition-all shadow-lg hover:shadow-xl
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Procesando...
          </div>
        ) : (
          `${isDevMode ? 'Simular Pago' : 'Pagar'} €${finalPrice.toFixed(2)}`
        )}
      </button>
    </form>
  )
}

export default function PurchaseModal({ product, onClose }: PurchaseModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loadingIntent, setLoadingIntent] = useState(true)
  const [finalPrice, setFinalPrice] = useState(product.price)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const createPaymentIntent = useCallback(async () => {
    setLoadingIntent(true)
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
        }),
      })

      const data = await response.json()
      if (data.error) {
        console.error('Error:', data.error)
        setToast({ message: 'Error al crear el pago. Inténtalo de nuevo.', type: 'error' })
        return
      }

      setClientSecret(data.clientSecret)
      setFinalPrice(data.amount)
    } catch (error) {
      console.error('Error:', error)
      setToast({ message: 'Error al crear el pago. Inténtalo de nuevo.', type: 'error' })
    } finally {
      setLoadingIntent(false)
    }
  }, [product._id])

  // Focus management and keyboard handling
  useEffect(() => {
    if (closeButtonRef.current) {
      closeButtonRef.current.focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
      
      // Focus trap
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
          
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  // Create payment intent
  useEffect(() => {
    createPaymentIntent()
  }, [createPaymentIntent])


  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const discountPercentage = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div 
          ref={modalRef}
          className="bg-white rounded-2xl max-w-md w-full max-h-[95vh] flex flex-col shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-100">
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>
            
            {/* Product Title and Price */}
            <div className="pr-8">
              <h2 id="modal-title" className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                {product.title || product.name}
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-green-600">
                  €{finalPrice.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > finalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    €{product.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Description Section */}
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Qué incluye:
              </h3>
              <div className="text-gray-600 text-sm leading-relaxed space-y-3">
                {product.description?.split('\n').map((line, index) => {
                  if (line.trim().startsWith('✅') || line.trim().startsWith('📊') || line.trim().startsWith('📅') || line.trim().startsWith('🛒') || line.trim().startsWith('⏰') || line.trim().startsWith('📝') || line.trim().startsWith('🎁')) {
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                        <span className="text-gray-700">{line.replace(/^[✅📊📅🛒⏰📝🎁]\s*/, '')}</span>
                      </div>
                    )
                  }
                  if (line.trim().startsWith('-')) {
                    return (
                      <div key={index} className="flex items-start space-x-3 ml-6">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-600 text-xs">{line.replace(/^-\s*/, '')}</span>
                      </div>
                    )
                  }
                  if (line.trim() && !line.includes('---') && !line.includes('@') && !line.includes('YouTube') && !line.includes('IMPORTANTE')) {
                    return (
                      <p key={index} className="text-gray-700 font-medium">
                        {line.trim()}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
            </div>

            {/* Payment Section */}
            <div className="p-6">
              {loadingIntent ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  <span className="ml-3 text-gray-600">Preparando pago seguro...</span>
                </div>
              ) : clientSecret === 'pi_mock_development_secret' ? (
                // Modo desarrollo sin Stripe
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm text-center">
                      <strong>Modo Desarrollo:</strong> Simulación de pago
                    </p>
                  </div>
                  <CheckoutForm product={product} onClose={onClose} finalPrice={finalPrice} />
                </div>
              ) : clientSecret ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#16a34a',
                        colorBackground: '#ffffff',
                        colorText: '#374151',
                        colorDanger: '#dc2626',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        spacingUnit: '4px',
                        borderRadius: '8px',
                      },
                    },
                  }}
                >
                  <CheckoutForm product={product} onClose={onClose} finalPrice={finalPrice} />
                </Elements>
              ) : (
                <div className="text-center text-red-500 py-12">
                  <p className="mb-4">Error al cargar el formulario de pago</p>
                  <button 
                    onClick={() => createPaymentIntent()}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </>
  )
}