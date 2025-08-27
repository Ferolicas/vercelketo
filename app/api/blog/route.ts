import { NextRequest, NextResponse } from 'next/server'
import { writeClient, client } from '@/lib/sanity'

// GET - Obtener posts del blog
export async function GET() {
  try {
    const posts = await client.fetch(
      `*[_type == "blogPost"] | order(createdAt desc) {
        _id,
        title,
        slug,
        excerpt,
        featuredImage,
        author,
        tags,
        published,
        createdAt
      }`
    )

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Error al obtener artículos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo post del blog
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    const author = formData.get('author') as string
    const tagsJson = formData.get('tags') as string
    const published = formData.get('published') === 'true'
    const imageFile = formData.get('featuredImage') as File

    // Validaciones
    if (!title || !excerpt || !content || !author) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { error: 'La imagen destacada es requerida' },
        { status: 400 }
      )
    }

    // Parsear tags
    let tags: string[] = []
    try {
      if (tagsJson) {
        tags = JSON.parse(tagsJson).filter((t: string) => t.trim())
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Formato de etiquetas inválido' },
        { status: 400 }
      )
    }

    // Subir imagen a Sanity
    const imageBuffer = await imageFile.arrayBuffer()
    const imageAsset = await writeClient.assets.upload('image', Buffer.from(imageBuffer), {
      filename: imageFile.name
    })

    // Crear slug único
    const baseSlug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    let slug = baseSlug
    let counter = 1
    while (true) {
      const existingPost = await client.fetch(
        `*[_type == "blogPost" && slug.current == $slug][0]`,
        { slug }
      )
      if (!existingPost) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Convertir contenido simple a formato de bloques de Sanity
    const contentBlocks = content.split('\n\n').map(paragraph => ({
      _type: 'block',
      _key: Math.random().toString(36).substr(2, 9),
      style: 'normal',
      markDefs: [],
      children: [{
        _type: 'span',
        _key: Math.random().toString(36).substr(2, 9),
        text: paragraph,
        marks: []
      }]
    }))

    // Crear documento del post
    const postDoc = {
      _type: 'blogPost',
      title,
      slug: {
        _type: 'slug',
        current: slug
      },
      excerpt,
      content: contentBlocks,
      featuredImage: {
        _type: 'image',
        asset: {
          _ref: imageAsset._id,
          _type: 'reference'
        }
      },
      author,
      tags,
      published,
      createdAt: new Date().toISOString()
    }

    const result = await writeClient.create(postDoc)

    return NextResponse.json({
      message: '¡Artículo creado exitosamente!',
      post: result
    })

  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Error al crear artículo' },
      { status: 500 }
    )
  }
}