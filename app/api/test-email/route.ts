import { NextResponse } from 'next/server'
import { sendPurchaseEmailWithNewsletter } from '@/lib/resend'

export async function POST() {
  try {
    // Enviar email de prueba
    const result = await sendPurchaseEmailWithNewsletter(
      'ferneyolicas@gmail.com',
      'Ferney Olicas',
      'TEST-KETO-2024-001',
      'Guía Keto Completa - PRUEBA',
      'KETOPAGO1234*',
      true,
      'https://planetaketo.es/download/test'
    )

    if (result) {
      return NextResponse.json({ 
        success: true, 
        message: 'Email de prueba enviado exitosamente',
        emailId: result.id 
      })
    } else {
      throw new Error('No se pudo enviar el email')
    }
  } catch (error) {
    console.error('Error enviando email de prueba:', error)
    return NextResponse.json({ 
      error: 'Error al enviar email de prueba',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Usa POST para enviar email de prueba' })
}