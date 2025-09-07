import { NextResponse } from 'next/server'
import { stripe, validateCoupon } from '@/lib/stripe'
import { client } from '@/lib/sanity'

export async function POST(request: Request) {
  try {
    const { productId, discountCode } = await request.json()

    // Obtener información del producto desde Sanity
    const product = await client.fetch(`
      *[_type == "product" && _id == $productId][0]{
        _id,
        name,
        slug,
        description,
        price,
        currency,
        stripePriceId,
        affiliateUrl,
        featured,
        "image": image.asset->url
      }
    `, { productId })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Generar título desde nombre o slug
    const productTitle = product.name || 
      product.slug?.current?.replace(/-/g, ' ')?.replace(/\b\w/g, (l: string) => l.toUpperCase()) || 
      'Producto'

    // En modo development o cuando Stripe no está configurado
    if (!stripe) {
      console.log('🚧 Development mode: Using mock payment intent (Stripe not configured)')
      return NextResponse.json({ 
        clientSecret: 'pi_mock_development_secret',
        amount: product.price,
        originalPrice: product.price,
        discount: 0,
        discountCode: null,
        product: {
          _id: product._id,
          title: productTitle,
          name: productTitle,
          description: product.description,
          price: product.price,
          image: product.image
        }
      })
    }

    // Validar código de descuento si se proporciona
    let discountAmount = 0
    let coupon = null
    if (discountCode) {
      coupon = await validateCoupon(discountCode)
      if (!coupon || !coupon.valid) {
        return NextResponse.json({ error: 'Invalid discount code' }, { status: 400 })
      }
      discountAmount = coupon.percent_off ? (product.price * coupon.percent_off / 100) : 0
    }

    const finalAmount = product.price - discountAmount

    // Crear Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100), // Stripe usa centavos
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        productId: product._id,
        productTitle: productTitle,
        discountCode: discountCode || '',
        originalPrice: product.price.toString(),
        finalPrice: finalAmount.toString(),
      },
      receipt_email: undefined, // Se llenará cuando el usuario complete el formulario
    })

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      amount: finalAmount,
      originalPrice: product.price,
      discount: discountAmount,
      discountCode: discountCode || null,
      product: {
        _id: product._id,
        title: productTitle,
        name: productTitle,
        description: product.description,
        price: product.price,
        image: product.image
      }
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json({ error: 'Error creating payment intent' }, { status: 500 })
  }
}
