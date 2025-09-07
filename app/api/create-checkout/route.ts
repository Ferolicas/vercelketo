import { NextResponse } from 'next/server'
import { stripe, validateCoupon } from '@/lib/stripe'
import { client } from '@/lib/sanity'

export async function POST(request: Request) {
  try {
    const { productId, discountCode } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Obtener información del producto desde Sanity
    const product = await client.fetch(`
      *[_type == "product" && _id == $productId][0]{
        _id,
        name,
        title,
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

    // Generar título desde title, name, o slug
    const productTitle = product.title || product.name || 
      product.slug?.current?.replace(/-/g, ' ')?.replace(/\b\w/g, (l: string) => l.toUpperCase()) || 
      'Producto'

    // En modo development o cuando Stripe no está configurado
    if (!stripe) {
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
      try {
        coupon = await validateCoupon(discountCode)
        if (!coupon || !coupon.valid) {
          return NextResponse.json({ error: 'Invalid discount code' }, { status: 400 })
        }
        discountAmount = coupon.percent_off ? (product.price * coupon.percent_off / 100) : 0
      } catch (discountError) {
        // Continue without discount if validation fails
        discountAmount = 0
        coupon = null
      }
    }

    const finalAmount = Math.max(product.price - discountAmount, 0.5) // Minimum 50 cents

    try {
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
    } catch (stripeError: any) {
      // Return development mock for testing purposes
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({ 
          clientSecret: 'pi_mock_development_secret',
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
      }
      
      return NextResponse.json({ 
        error: 'Payment service temporarily unavailable' 
      }, { status: 503 })
    }
  } catch (error: any) {
    // Return development mock for any unexpected errors
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        clientSecret: 'pi_mock_development_secret',
        amount: 10, // Default price for testing
        originalPrice: 10,
        discount: 0,
        discountCode: null,
        product: {
          _id: 'mock-product',
          title: 'Producto de Prueba',
          name: 'Producto de Prueba',
          description: 'Producto de prueba para desarrollo',
          price: 10,
          image: null
        }
      })
    }
    
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}