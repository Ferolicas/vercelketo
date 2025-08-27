import { NextRequest, NextResponse } from 'next/server'
import { writeClient, client } from '@/lib/sanity'

// GET - Obtener productos
export async function GET() {
  try {
    const products = await client.fetch(
      `*[_type == "product"] | order(featured desc, createdAt desc) {
        _id,
        name,
        slug,
        description,
        price,
        currency,
        image,
        affiliateUrl,
        featured,
        createdAt
      }`
    )

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const currency = formData.get('currency') as string
    const affiliateUrl = formData.get('affiliateUrl') as string
    const featured = formData.get('featured') === 'true'
    const imageFile = formData.get('image') as File

    // Validaciones
    if (!name || !description || !price || !currency || !affiliateUrl) {
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
      const existingProduct = await client.fetch(
        `*[_type == "product" && slug.current == $slug][0]`,
        { slug }
      )
      if (!existingProduct) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Crear documento del producto
    const productDoc = {
      _type: 'product',
      name,
      slug: {
        _type: 'slug',
        current: slug
      },
      description,
      price,
      currency,
      image: {
        _type: 'image',
        asset: {
          _ref: imageAsset._id,
          _type: 'reference'
        }
      },
      affiliateUrl,
      featured,
      createdAt: new Date().toISOString()
    }

    const result = await writeClient.create(productDoc)

    return NextResponse.json({
      message: '¡Producto creado exitosamente!',
      product: result
    })

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}