'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
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

function CheckoutForm({ product, onClose, finalPrice }: { product: Product; onClose: () => void; finalPrice: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    // Development mode simulation when Stripe is not configured
    if (process.env.NODE_ENV === 'development' && !stripe) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        alert('✅ Pago simulado exitoso en modo desarrollo')
        onClose()
      }, 2000)
      return
    }

    if (!stripe || !elements) {
      setError('Stripe no está configurado correctamente')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || 'Error al procesar el pago')
        setLoading(false)
        return
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/complete-order?payment_intent={PAYMENT_INTENT_ID}`,
        },
      })

      if (confirmError) {
        setError(confirmError.message || 'Error al confirmar el pago')
      }
    } catch (err) {
      setError('Error inesperado al procesar el pago')
    }

    setLoading(false)
  }

  const isDevMode = process.env.NODE_ENV === 'development' && !stripe

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isDevMode ? (
        <PaymentElement 
          options={{
            layout: "tabs",
          }}
        />
      ) : (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 text-center">
          <p className="text-blue-400 text-sm mb-2">
            💳 <strong>Modo Desarrollo</strong>
          </p>
          <p className="text-white/70 text-xs">
            Simulación de pago - En producción aparecería aquí el formulario real de Stripe
          </p>
        </div>
      )}
      {error && (
        <div className="text-red-400 text-sm p-3 bg-red-500/10 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl 
                 font-semibold text-lg transition-all hover:shadow-lg hover:scale-105 
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? 'Procesando...' : `${isDevMode ? 'Simular Pago' : 'Pagar'} €${finalPrice.toFixed(2)}`}
      </button>
    </form>
  )
}

export default function PurchaseModal({ product, onClose }: PurchaseModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loadingIntent, setLoadingIntent] = useState(true)
  const [finalPrice, setFinalPrice] = useState(product.price)

  const createPaymentIntent = async () => {
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.error) {
        // In development, create mock secret to continue testing UI
        if (process.env.NODE_ENV === 'development') {
          setClientSecret('pi_mock_development_secret')
          setFinalPrice(product.price)
        }
        return
      }

      setClientSecret(data.clientSecret)
      setFinalPrice(data.amount)
    } catch (error) {
      // In development, create mock secret to continue testing UI
      if (process.env.NODE_ENV === 'development') {
        setClientSecret('pi_mock_development_secret')
        setFinalPrice(product.price)
      }
    } finally {
      setLoadingIntent(false)
    }
  }

  useEffect(() => {
    createPaymentIntent()
  }, [product._id])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl max-w-sm w-full text-white border border-white/10 overflow-hidden">
        {/* Header - Simplified */}
        <div className="relative p-6 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 text-white rounded-full p-2 hover:bg-white/30 backdrop-blur-md"
          >
            <X size={16} />
          </button>
          
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              {product.title || product.name}
            </h2>
            <div className="text-2xl font-bold text-white">
              €{finalPrice.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Payment Section - Simplified */}
        <div className="p-6">
          {loadingIntent ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="ml-3 text-white/70">Preparando pago...</span>
            </div>
          ) : clientSecret === 'pi_mock_development_secret' ? (
            // Development mock mode
            <CheckoutForm product={product} onClose={onClose} finalPrice={finalPrice} />
          ) : clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#3b82f6',
                    colorBackground: '#1e293b',
                    colorText: '#f1f5f9',
                    colorDanger: '#ef4444',
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
            <div className="text-center text-red-400 py-8">
              <p className="mb-4">Error al cargar el formulario de pago</p>
              <button 
                onClick={createPaymentIntent}
                className="text-blue-400 hover:text-blue-300 font-medium underline"
              >
                Intentar de nuevo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}