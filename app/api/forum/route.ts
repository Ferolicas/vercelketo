import { NextRequest, NextResponse } from 'next/server'
import { writeClient, client } from '@/lib/sanity'
import { v4 as uuidv4 } from 'uuid'

// GET - Obtener posts del foro
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = `*[_type == "forumPost" && approved == true && isDeleted != true`
    
    if (category && category !== 'all') {
      query += ` && category == "${category}"`
    }
    
    query += `] | order(isPinned desc, createdAt desc) [${offset}...${offset + limit}] {
      _id,
      title,
      slug,
      content,
      "author": {
        "name": authorName,
        "email": authorEmail
      },
      authorId,
      category,
      tags,
      isPinned,
      isEdited,
      views,
      likes,
      replyCount,
      lastActivityAt,
      createdAt,
      updatedAt
    }`

    const posts = await client.fetch(query)

    // También obtener el total de posts para paginación
    let countQuery = `count(*[_type == "forumPost" && approved == true && isDeleted != true`
    if (category && category !== 'all') {
      countQuery += ` && category == "${category}"`
    }
    countQuery += `])`

    const total = await client.fetch(countQuery)

    return NextResponse.json({ 
      posts, 
      total,
      hasMore: offset + limit < total
    })
  } catch (error) {
    console.error('Error fetching forum posts:', error)
    return NextResponse.json(
      { error: 'Error al obtener publicaciones' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo post del foro
export async function POST(request: NextRequest) {
  console.log('🚀 Forum POST API called');
  
  try {
    const body = await request.json()
    console.log('📝 Request body received:', JSON.stringify(body, null, 2));
    
    const {
      title,
      content,
      category,
      authorName,
      authorEmail,
      authorId,
      tags
    } = body

    // Validaciones
    if (!title || !content || !category || !authorName || !authorEmail || !authorId) {
      console.log('❌ Validation failed - missing required fields');
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    console.log('✅ Validation passed');

    if (title.length < 5 || title.length > 200) {
      return NextResponse.json(
        { error: 'El título debe tener entre 5 y 200 caracteres' },
        { status: 400 }
      )
    }

    if (content.length < 10 || content.length > 5000) {
      return NextResponse.json(
        { error: 'El contenido debe tener entre 10 y 5000 caracteres' },
        { status: 400 }
      )
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(authorEmail)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Crear slug único
    const baseSlug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 96)

    // Verificar si el slug ya existe y crear uno único
    let slug = baseSlug
    let counter = 1
    while (true) {
      const existingPost = await client.fetch(
        `*[_type == "forumPost" && slug.current == $slug][0]`,
        { slug }
      )
      if (!existingPost) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Crear documento del post
    const postDoc = {
      _type: 'forumPost',
      _id: `forumPost_${uuidv4()}`,
      title,
      slug: {
        _type: 'slug',
        current: slug
      },
      content,
      authorName,
      authorEmail,
      authorId,
      category,
      tags: tags || [],
      isPinned: false,
      isLocked: false,
      approved: true,
      isEdited: false,
      isDeleted: false,
      views: 0,
      likes: 0,
      replyCount: 0,
      lastActivityAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }

    console.log('📄 Creating document:', JSON.stringify(postDoc, null, 2));

    const result = await writeClient.create(postDoc)
    
    console.log('✅ Document created successfully:', result._id);

    return NextResponse.json({
      message: '¡Publicación creada exitosamente!',
      post: result
    })

  } catch (error) {
    console.error('❌ Error creating forum post:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { error: `Error al crear publicación: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    )
  }
}

// PUT - Actualizar post del foro
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      postId,
      authorId,
      title,
      content,
      category,
      tags
    } = body

    // Validaciones
    if (!postId || !authorId || !title || !content || !category) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el usuario puede editar este post
    const existingPost = await client.fetch(
      `*[_type == "forumPost" && _id == $postId && authorId == $authorId][0]`,
      { postId, authorId }
    )

    if (!existingPost) {
      return NextResponse.json(
        { error: 'No tienes permisos para editar esta publicación' },
        { status: 403 }
      )
    }

    // Actualizar el post
    const updatedPost = await writeClient
      .patch(postId)
      .set({
        title,
        content,
        category,
        tags: tags || [],
        isEdited: true,
        updatedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString()
      })
      .commit()

    return NextResponse.json({
      message: 'Publicación actualizada exitosamente',
      post: updatedPost
    })

  } catch (error) {
    console.error('Error updating forum post:', error)
    return NextResponse.json(
      { error: 'Error al actualizar publicación' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar post del foro (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, authorId } = body

    if (!postId || !authorId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el usuario puede eliminar este post
    const existingPost = await client.fetch(
      `*[_type == "forumPost" && _id == $postId && authorId == $authorId][0]`,
      { postId, authorId }
    )

    if (!existingPost) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar esta publicación' },
        { status: 403 }
      )
    }

    // Soft delete - marcar como eliminado
    await writeClient
      .patch(postId)
      .set({
        isDeleted: true,
        content: '[Publicación eliminada por el usuario]',
        updatedAt: new Date().toISOString()
      })
      .commit()

    return NextResponse.json({
      message: 'Publicación eliminada exitosamente'
    })

  } catch (error) {
    console.error('Error deleting forum post:', error)
    return NextResponse.json(
      { error: 'Error al eliminar publicación' },
      { status: 500 }
    )
  }
}