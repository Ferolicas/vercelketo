'use client'

import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { Product } from '@/types'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

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

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

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

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement 
        options={{
          layout: "tabs",
        }}
      />
      {error && (
        <div className="text-red-400 text-sm p-3 bg-red-500/10 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl 
                 font-semibold text-lg transition-all hover:shadow-lg 
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Procesando...' : `Pagar €${finalPrice.toFixed(2)}`}
      </button>
    </form>
  )
}

export default function PurchaseModal({ product, onClose }: PurchaseModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loadingIntent, setLoadingIntent] = useState(true)
  const [discountCode, setDiscountCode] = useState('')
  const [discountApplied, setDiscountApplied] = useState(false)
  const [finalPrice, setFinalPrice] = useState(product.price)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountError, setDiscountError] = useState('')

  const createPaymentIntent = async (discountCodeToApply = '') => {
    setLoadingIntent(true)
    try {
      // Retry logic for Turbopack hot reload timing issues
      let response: Response | undefined
      let retries = 3
      
      while (retries > 0) {
        response = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product._id,
            discountCode: discountCodeToApply,
          }),
        })
        
        if (response.ok || response.status !== 404) {
          break
        }
        
        retries--
        if (retries > 0) {
          console.log('Retrying API call due to 404...')
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
      
      if (!response) {
        console.error('Failed to get response after retries')
        alert('Error de conexión. Inténtalo de nuevo.')
        onClose()
        return
      }

      const data = await response.json()
      if (data.error) {
        if (data.error === 'Invalid discount code') {
          setDiscountError('Código de descuento inválido')
          return
        }
        console.error('Error:', data.error)
        alert('Error al crear el pago. Inténtalo de nuevo.')
        onClose()
        return
      }

      setClientSecret(data.clientSecret)
      setFinalPrice(data.amount)
      setDiscountAmount(data.discount || 0)
      if (discountCodeToApply && data.discount > 0) {
        setDiscountApplied(true)
        setDiscountError('')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear el pago. Inténtalo de nuevo.')
      onClose()
    } finally {
      setLoadingIntent(false)
    }
  }

  useEffect(() => {
    createPaymentIntent()
  }, [product._id, onClose])

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      setDiscountError('Ingresa un código de descuento')
      return
    }
    setDiscountError('')
    createPaymentIntent(discountCode)
  }

  const discountPercentage = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl max-w-md w-full shadow-2xl border border-green-200 overflow-hidden">
        {/* Header */}
        <div className="relative p-6 text-center border-b border-green-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition-colors"
          >
            <X size={16} />
          </button>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {product.title}
          </h2>
          
          <div className="flex items-center justify-center gap-2">
            {product.originalPrice && product.originalPrice > product.price ? (
              <>
                <span className="text-gray-500 line-through text-lg">
                  €{product.originalPrice}
                </span>
                <span className="text-2xl font-bold text-green-600">
                  €{product.price}
                </span>
                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  50% OFF
                </span>
              </>
            ) : discountApplied ? (
              <>
                <span className="text-gray-500 line-through text-lg">
                  €{product.price}
                </span>
                <span className="text-2xl font-bold text-green-600">
                  €{finalPrice.toFixed(2)}
                </span>
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  20% OFF
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-green-600">
                €{product.price}
              </span>
            )}
          </div>
        </div>

        {/* Payment Section */}
        <div className="p-6">
          {loadingIntent ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-700">Preparando pago...</span>
            </div>
          ) : clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#059669',
                    colorBackground: '#ffffff',
                    colorText: '#1f2937',
                    colorDanger: '#dc2626',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    spacingUnit: '6px',
                    borderRadius: '12px',
                  },
                },
              }}
            >
              <CheckoutForm product={product} onClose={onClose} finalPrice={finalPrice} />
            </Elements>
          ) : (
            <div className="text-center text-red-600 py-8">
              Error al cargar el formulario de pago
            </div>
          )}
        </div>
      </div>
    </div>
  )
}