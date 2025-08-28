import { NextRequest, NextResponse } from 'next/server'
import { writeClient, client } from '@/lib/sanity'

// GET - Obtener listas de afiliados
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const slug = searchParams.get('slug')
    const limit = searchParams.get('limit')
    
    let query = `*[_type == "affiliateList"]`
    const params: any = {}
    
    if (slug) {
      query += ` && slug.current == $slug`
      params.slug = slug
    }
    
    if (featured === 'true') {
      query += ` && featured == true`
    }
    
    query += ` | order(createdAt desc)`
    
    if (limit) {
      query += ` [0...${parseInt(limit)}]`
    }
    
    query += ` {
      _id,
      title,
      description,
      "imageUrl": image.asset->url,
      items[]{
        title,
        description,
        "imageUrl": image.asset->url,
        link,
        price,
        currency,
        rating,
        category
      },
      featured,
      createdAt,
      updatedAt
    }`

    const affiliateLists = await client.fetch(query, params)

    return NextResponse.json({ affiliateLists })
  } catch (error) {
    console.error('Error fetching affiliate lists:', error)
    return NextResponse.json(
      { error: 'Error al obtener listas de afiliados' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva lista de afiliados
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const imageFile = formData.get('image') as File
    const affiliateDataJson = formData.get('affiliateData') as string

    if (!title || !affiliateDataJson) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    let affiliateData
    try {
      affiliateData = JSON.parse(affiliateDataJson)
    } catch (error) {
      return NextResponse.json(
        { error: 'Formato de datos inválido' },
        { status: 400 }
      )
    }

    // Upload image if provided
    let imageAsset = null
    if (imageFile && imageFile.size > 0) {
      const imageBuffer = await imageFile.arrayBuffer()
      imageAsset = await writeClient.assets.upload('image', Buffer.from(imageBuffer), {
        filename: imageFile.name
      })
    }

    // Create slug for the list
    const baseSlug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    let slug = baseSlug
    let counter = 1
    while (true) {
      const existing = await client.fetch(
        `*[_type == "affiliateList" && slug.current == $slug][0]`,
        { slug }
      )
      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Process items - upload images if provided as base64
    const processedItems = []
    for (const item of affiliateData.items) {
      let itemImageAsset = null

      if (item.imageUrl && item.imageUrl.startsWith('data:')) {
        // Convert base64 to buffer
        const base64Data = item.imageUrl.split(',')[1]
        const buffer = Buffer.from(base64Data, 'base64')
        
        itemImageAsset = await writeClient.assets.upload('image', buffer, {
          filename: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
        })
      }

      processedItems.push({
        _type: 'affiliateItem',
        title: item.title,
        description: item.description,
        link: item.link,
        ...(itemImageAsset ? {
          image: {
            _type: 'image',
            asset: {
              _ref: itemImageAsset._id,
              _type: 'reference'
            }
          }
        } : {})
      })
    }

    // Create the affiliate list document
    const affiliateListDoc = {
      _type: 'affiliateList',
      title: title.trim(),
      description: description.trim(),
      slug: {
        _type: 'slug',
        current: slug
      },
      items: processedItems,
      featured: false,
      createdAt: new Date().toISOString()
    }

    // Add main image if provided
    if (imageAsset) {
      affiliateListDoc.image = {
        _type: 'image',
        asset: {
          _ref: imageAsset._id,
          _type: 'reference'
        }
      }
    }

    const result = await writeClient.create(affiliateListDoc)

    return NextResponse.json({
      message: '¡Lista de afiliados creada exitosamente!',
      affiliateList: result
    })

  } catch (error) {
    console.error('Error creating affiliate list:', error)
    return NextResponse.json(
      { error: 'Error al crear lista de afiliados' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar lista de afiliados
export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'ID requerido' },
        { status: 400 }
      )
    }

    const result = await writeClient
      .patch(id)
      .set(updateData)
      .commit()

    return NextResponse.json({
      message: 'Lista actualizada exitosamente',
      affiliateList: result
    })

  } catch (error) {
    console.error('Error updating affiliate list:', error)
    return NextResponse.json(
      { error: 'Error al actualizar lista' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar lista de afiliados
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID requerido' },
        { status: 400 }
      )
    }

    await writeClient.delete(id)

    return NextResponse.json({
      message: 'Lista eliminada exitosamente'
    })

  } catch (error) {
    console.error('Error deleting affiliate list:', error)
    return NextResponse.json(
      { error: 'Error al eliminar lista' },
      { status: 500 }
    )
  }
}