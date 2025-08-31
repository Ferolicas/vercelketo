'use client'

import { useState } from 'react'

export default function TestStripePage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testStripeConfig = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: 'test-product-id'
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(`✅ Stripe configurado correctamente! ClientSecret recibido: ${data.clientSecret ? 'Sí' : 'No'}`)
      } else {
        setResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ Error de conexión: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Test de Configuración Stripe
          </h1>
          <p className="text-gray-600 mb-8">
            Verifica que las variables de Stripe estén configuradas correctamente en Vercel
          </p>
          
          <button
            onClick={testStripeConfig}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Probando...' : 'Probar Stripe'}
          </button>

          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm">{result}</p>
            </div>
          )}

          <div className="mt-8 text-sm text-gray-500">
            <p><strong>Variables esperadas:</strong></p>
            <ul className="list-disc list-inside">
              <li>STRIPE_SECRET_KEY</li>
              <li>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</li>
              <li>STRIPE_WEBHOOK_SECRET</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}