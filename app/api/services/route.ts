import { NextRequest, NextResponse } from 'next/server'
import { writeClient, client } from '@/lib/sanity'

// GET - Obtener servicios
export async function GET() {
  try {
    const services = await client.fetch(
      `*[_type == "service"] | order(featured desc, createdAt desc) {
        _id,
        name,
        slug,
        description,
        price,
        currency,
        duration,
        image,
        features,
        contactUrl,
        whatsapp,
        featured,
        createdAt
      }`
    )

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Error al obtener servicios' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo servicio
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const currency = formData.get('currency') as string
    const duration = formData.get('duration') as string
    const contactUrl = formData.get('contactUrl') as string
    const whatsapp = formData.get('whatsapp') as string
    const featured = formData.get('featured') === 'true'
    const featuresJson = formData.get('features') as string
    const imageFile = formData.get('image') as File

    // Validaciones
    if (!name || !description || !price || !currency || !contactUrl) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { error: 'La imagen es requerida' },
        { status: 400 }
      )
    }

    // Parsear features
    let features: string[] = []
    try {
      if (featuresJson) {
        features = JSON.parse(featuresJson).filter((f: string) => f.trim())
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Formato de características inválido' },
        { status: 400 }
      )
    }

    // Subir imagen a Sanity
    const imageBuffer = await imageFile.arrayBuffer()
    const imageAsset = await writeClient.assets.upload('image', Buffer.from(imageBuffer), {
      filename: imageFile.name
    })

    // Crear slug único
    const baseSlug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    let slug = baseSlug
    let counter = 1
    while (true) {
      const existingService = await client.fetch(
        `*[_type == "service" && slug.current == $slug][0]`,
        { slug }
      )
      if (!existingService) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Crear documento del servicio
    const serviceDoc = {
      _type: 'service',
      name,
      slug: {
        _type: 'slug',
        current: slug
      },
      description,
      price,
      currency,
      duration: duration || null,
      image: {
        _type: 'image',
        asset: {
          _ref: imageAsset._id,
          _type: 'reference'
        }
      },
      features,
      contactUrl,
      whatsapp: whatsapp || null,
      featured,
      createdAt: new Date().toISOString()
    }

    const result = await writeClient.create(serviceDoc)

    return NextResponse.json({
      message: '¡Servicio creado exitosamente!',
      service: result
    })

  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Error al crear servicio' },
      { status: 500 }
    )
  }
}