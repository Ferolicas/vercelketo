import { NextRequest, NextResponse } from 'next/server'
import { writeClient, client } from '@/lib/sanity'
import { v4 as uuidv4 } from 'uuid'

// GET - Obtener respuestas de un post del foro
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    
    if (!postId) {
      return NextResponse.json(
        { error: 'ID del post es requerido' },
        { status: 400 }
      )
    }

    const replies = await client.fetch(
      `*[_type == "forumReply" && forumPost._ref == $postId && isDeleted != true] | order(createdAt asc) {
        _id,
        content,
        authorName,
        authorEmail,
        authorId,
        likes,
        isEdited,
        createdAt,
        updatedAt
      }`,
      { postId }
    )

    return NextResponse.json({ replies })
  } catch (error) {
    console.error('Error fetching forum replies:', error)
    return NextResponse.json(
      { error: 'Error al obtener respuestas' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva respuesta
export async function POST(request: NextRequest) {
  console.log('🚀 Forum Reply POST API called');
  
  try {
    const body = await request.json()
    console.log('📝 Reply request body:', JSON.stringify(body, null, 2));
    
    const {
      content,
      postId,
      authorName,
      authorEmail,
      authorId
    } = body

    // Validaciones
    if (!content || !postId || !authorName || !authorEmail || !authorId) {
      console.log('❌ Reply validation failed - missing required fields');
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    if (content.length < 5 || content.length > 2000) {
      return NextResponse.json(
        { error: 'El contenido debe tener entre 5 y 2000 caracteres' },
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

    // Verificar que el post existe
    const existingPost = await client.fetch(
      `*[_type == "forumPost" && _id == $postId][0]`,
      { postId }
    )

    if (!existingPost) {
      return NextResponse.json(
        { error: 'El post no existe' },
        { status: 404 }
      )
    }

    // Crear documento de la respuesta
    const replyDoc = {
      _type: 'forumReply',
      _id: `forumReply_${uuidv4()}`,
      content,
      forumPost: {
        _type: 'reference',
        _ref: postId
      },
      authorName,
      authorEmail,
      authorId,
      likes: 0,
      isEdited: false,
      isDeleted: false,
      createdAt: new Date().toISOString()
    }

    console.log('📄 Creating reply document:', JSON.stringify(replyDoc, null, 2));

    const result = await writeClient.create(replyDoc)
    
    // Actualizar el contador de respuestas en el post
    await writeClient
      .patch(postId)
      .set({
        replyCount: existingPost.replyCount ? existingPost.replyCount + 1 : 1,
        lastActivityAt: new Date().toISOString()
      })
      .commit()
    
    console.log('✅ Reply created successfully:', result._id);

    return NextResponse.json({
      message: '¡Respuesta creada exitosamente!',
      reply: result
    })

  } catch (error) {
    console.error('❌ Error creating forum reply:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { error: `Error al crear respuesta: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    )
  }
}

// PUT - Actualizar respuesta
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      replyId,
      authorId,
      content
    } = body

    // Validaciones
    if (!replyId || !authorId || !content) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    if (content.length < 5 || content.length > 2000) {
      return NextResponse.json(
        { error: 'El contenido debe tener entre 5 y 2000 caracteres' },
        { status: 400 }
      )
    }

    // Verificar que el usuario puede editar esta respuesta
    const existingReply = await client.fetch(
      `*[_type == "forumReply" && _id == $replyId && authorId == $authorId][0]`,
      { replyId, authorId }
    )

    if (!existingReply) {
      return NextResponse.json(
        { error: 'No tienes permisos para editar esta respuesta' },
        { status: 403 }
      )
    }

    // Actualizar la respuesta
    const updatedReply = await writeClient
      .patch(replyId)
      .set({
        content,
        isEdited: true,
        updatedAt: new Date().toISOString()
      })
      .commit()

    return NextResponse.json({
      message: 'Respuesta actualizada exitosamente',
      reply: updatedReply
    })

  } catch (error) {
    console.error('Error updating forum reply:', error)
    return NextResponse.json(
      { error: 'Error al actualizar respuesta' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar respuesta (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { replyId, authorId, postId } = body

    if (!replyId || !authorId || !postId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el usuario puede eliminar esta respuesta
    const existingReply = await client.fetch(
      `*[_type == "forumReply" && _id == $replyId && authorId == $authorId][0]`,
      { replyId, authorId }
    )

    if (!existingReply) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar esta respuesta' },
        { status: 403 }
      )
    }

    // Soft delete - marcar como eliminada
    await writeClient
      .patch(replyId)
      .set({
        isDeleted: true,
        content: '[Respuesta eliminada por el usuario]',
        updatedAt: new Date().toISOString()
      })
      .commit()

    // Actualizar el contador de respuestas en el post
    const post = await client.fetch(
      `*[_type == "forumPost" && _id == $postId][0]`,
      { postId }
    )

    if (post && post.replyCount > 0) {
      await writeClient
        .patch(postId)
        .set({
          replyCount: post.replyCount - 1
        })
        .commit()
    }

    return NextResponse.json({
      message: 'Respuesta eliminada exitosamente'
    })

  } catch (error) {
    console.error('Error deleting forum reply:', error)
    return NextResponse.json(
      { error: 'Error al eliminar respuesta' },
      { status: 500 }
    )
  }
}