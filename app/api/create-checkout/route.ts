import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { client } from '@/lib/sanity';

// Initialize Stripe only if we have the secret key
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null;

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json({ 
        error: 'Payment processing is not configured. Please contact support.' 
      }, { status: 503 });
    }

    const body = await request.json();
    const { productId, discountCode } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Obtener información del producto desde Sanity
    const product = await client.fetch(
      `*[_type in ["product", "service"] && _id == $productId][0]{
        _id,
        name,
        description,
        price,
        currency
      }`,
      { productId }
    );

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    let finalAmount = product.price;
    let discount = 0;

    // Aplicar código de descuento si se proporciona
    if (discountCode) {
      // Validar códigos de descuento simples
      const validCodes = {
        'KETO20': 0.2,  // 20% descuento
        'PLANETA15': 0.15,  // 15% descuento
        'PROMO10': 0.1,  // 10% descuento
      };

      if (validCodes[discountCode as keyof typeof validCodes]) {
        discount = Math.round(finalAmount * validCodes[discountCode as keyof typeof validCodes]);
        finalAmount = finalAmount - discount;
      } else {
        return NextResponse.json({ error: 'Invalid discount code' }, { status: 400 });
      }
    }

    // Crear Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100), // Stripe espera centavos
      currency: product.currency?.toLowerCase() || 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        productId: product._id,
        productName: product.name,
        originalPrice: product.price.toString(),
        discount: discount.toString(),
        discountCode: discountCode || '',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: finalAmount,
      discount: discount,
      productName: product.name,
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}