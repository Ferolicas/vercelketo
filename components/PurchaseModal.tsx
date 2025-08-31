'use client'

import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Product {
  _id: string
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
        return_url: `${window.location.origin}/complete-order`,
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
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl 
                 font-semibold text-lg transition-all hover:shadow-lg hover:scale-105 
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? 'Procesando...' : `Proceder al Pago €${finalPrice.toFixed(2)}`}
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
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          discountCode: discountCodeToApply,
        }),
      })

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
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl max-w-sm w-full max-h-[90vh] flex flex-col text-white border border-white/10 overflow-hidden">
        {/* Header - Fixed */}
        <div className="relative p-4 border-b border-white/10 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-white/20 text-white rounded-full p-2 hover:bg-white/30 backdrop-blur-md z-10"
          >
            <X size={16} />
          </button>
          
          <div className="flex items-center gap-4">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg bg-white/10"
              />
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white mb-1 line-clamp-2 leading-tight">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                {discountApplied ? (
                  <>
                    <span className="text-white/60 line-through text-sm">
                      €{product.price}
                    </span>
                    <span className="text-white font-bold text-lg">
                      €{finalPrice.toFixed(2)}
                    </span>
                    <span className="text-green-400 text-xs font-medium bg-green-400/20 px-2 py-1 rounded">
                      20% off
                    </span>
                  </>
                ) : (
                  <span className="text-white font-bold text-lg">
                    €{product.price}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Description Section */}
          <div className="p-4 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white/90 mb-3">Descripción</h3>
            <div className="text-white/70 text-sm mb-4 leading-relaxed max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              <p className="whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Qué incluye */}
            {product.includes && product.includes.length > 0 && (
              <div>
                <h4 className="font-semibold text-white/90 mb-2 text-sm">Qué incluye:</h4>
                <div className="space-y-2">
                  {product.includes.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="text-green-400 mt-0.5 flex-shrink-0" size={14} />
                      <span className="text-xs text-white/70 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Discount Code Section */}
          {!discountApplied && (
            <div className="p-4 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white/90 mb-3">¿Tienes un código de descuento?</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  placeholder="Ingresa tu código"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm 
                           placeholder:text-white/50 focus:outline-none focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={handleApplyDiscount}
                  disabled={loadingIntent || !discountCode.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Aplicar
                </button>
              </div>
              {discountError && (
                <p className="text-red-400 text-xs mt-2">{discountError}</p>
              )}
            </div>
          )}

          {/* Payment Section */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-white/90 mb-4 text-center">Finalizar Compra</h3>
            
            {loadingIntent ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-3 text-white/70">Preparando pago...</span>
              </div>
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
                Error al cargar el formulario de pago
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}