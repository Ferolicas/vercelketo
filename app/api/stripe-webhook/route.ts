import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { client } from '@/lib/sanity'

// Initialize Stripe only if we have the secret key
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null

// Helper functions
const calculateTaxes = (amount: number) => {
  const stripeCommission = amount * 0.029 + 0.35 // 2.9% + 0.35€ typical Stripe fee
  const iva = amount * 0.21 // 21% IVA in Spain
  const irpf = amount * 0.15 // 15% IRPF (professional services)
  const netAmount = amount - stripeCommission - iva - irpf
  
  return {
    stripeCommission: Math.round(stripeCommission * 100) / 100,
    iva: Math.round(iva * 100) / 100,
    irpf: Math.round(irpf * 100) / 100,
    netAmount: Math.round(netAmount * 100) / 100
  }
}

const generateKetoCode = (status: string, transactionNumber: number) => {
  const prefix = status === 'success' ? 'KETO' : 'FAIL'
  return `${prefix}-${transactionNumber.toString().padStart(4, '0')}-${Date.now().toString().slice(-4)}`
}

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object

    try {
      // Obtener Payment Intent con información expandida para acceder a los charges y payment method
      const fullPaymentIntent = await stripe.paymentIntents.retrieve(paymentIntent.id, {
        expand: ['charges.data.payment_method_details', 'payment_method']
      })
      
      // Obtener detalles del producto
      const product = await client.fetch(
        `*[_type == "product" && _id == $productId][0]`,
        { productId: paymentIntent.metadata?.productId }
      )

      if (!product) {
        throw new Error('Product not found')
      }

      // Generar número de transacción único
      const transactionCount = await client.fetch(`count(*[_type == "transaction"])`)
      const transactionNumber = transactionCount + 1001

      // Calcular impuestos
      const amount = fullPaymentIntent.amount / 100 // Stripe usa centavos
      const taxes = calculateTaxes(amount)

      // Determinar estado de la transacción
      const status = event.type === 'payment_intent.succeeded' ? 'success' : 'failed'
      
      // Generar código KETO
      const ketoCode = generateKetoCode(status, transactionNumber)

      // Obtener información del método de pago para datos del cliente
      let customerEmail = 'N/A'
      let customerName = 'N/A'
      let city = 'N/A'
      let paymentMethodType = 'card'

      // Intentar obtener datos del charge primero
      if ((fullPaymentIntent as any).charges?.data?.length > 0) {
        const charge = (fullPaymentIntent as any).charges.data[0]
        customerEmail = charge.billing_details?.email || fullPaymentIntent.receipt_email || 'N/A'
        customerName = charge.billing_details?.name || 'N/A'
        city = charge.billing_details?.address?.city || 'N/A'
        
        // Obtener el método de pago actual usado
        if (charge.payment_method_details?.type) {
          paymentMethodType = charge.payment_method_details.type
        }
      }

      // Si no tenemos datos del cliente, intentar obtenerlos del payment method
      if ((customerEmail === 'N/A' || customerName === 'N/A' || city === 'N/A') && (fullPaymentIntent as any).payment_method) {
        const paymentMethod = (fullPaymentIntent as any).payment_method
        
        if (paymentMethod.billing_details) {
          if (customerEmail === 'N/A' && paymentMethod.billing_details.email) {
            customerEmail = paymentMethod.billing_details.email
          }
          if (customerName === 'N/A' && paymentMethod.billing_details.name) {
            customerName = paymentMethod.billing_details.name
          }
          if (city === 'N/A' && paymentMethod.billing_details.address?.city) {
            city = paymentMethod.billing_details.address.city
          }
        }
        
        if (paymentMethodType === 'card' && paymentMethod.type) {
          paymentMethodType = paymentMethod.type
        }
      }

      // Crear transacción en Sanity
      const transaction = await client.create({
        _type: 'transaction',
        ketoCode,
        stripeSessionId: fullPaymentIntent.id,
        amount,
        ...taxes,
        customerEmail,
        customerName,
        productId: {
         _ref: product._id,
         _type: 'reference',
       },
       paymentMethod: paymentMethodType,
       city,
       status,
       createdAt: new Date().toISOString(),
       failureReason: event.type === 'payment_intent.payment_failed' ? fullPaymentIntent.last_payment_error?.message : undefined,
     })

     // No enviar email aquí - se enviará cuando el cliente complete sus datos
     // Solo registrar la transacción exitosa

     console.log(`Transaction processed (${status}):`, ketoCode)
   } catch (error) {
     console.error('Error processing transaction:', error)
     return NextResponse.json({ error: 'Error processing transaction' }, { status: 500 })
   }
 }

 return NextResponse.json({ received: true })
}