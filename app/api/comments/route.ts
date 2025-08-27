import { NextRequest, NextResponse } from 'next/server'
import { writeClient, client } from '@/lib/sanity'
import { v4 as uuidv4 } from 'uuid'

// GET - Obtener comentarios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postSlug = searchParams.get('postSlug')
    
    if (!postSlug) {
      return NextResponse.json(
        { error: 'postSlug es requerido' },
        { status: 400 }
      )
    }

    // Obtener comentarios del post
    const comments = await client.fetch(
      `*[_type == "comment" && postSlug == $postSlug && approved == true && isDeleted != true] | order(createdAt asc) {
        _id,
        _createdAt,
        content,
        "author": {
          "name": authorName,
          "email": authorEmail
        },
        authorId,
        rating,
        approved,
        isEdited,
        isDeleted,
        parentComment,
        adminReply,
        adminReplyPublished,
        adminReplyDate,
        createdAt,
        updatedAt
      }`,
      { postSlug }
    )

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Error al obtener comentarios' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo comentario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      postSlug,
      postTitle,
      name,
      email,
      content,
      rating,
      parentComment,
      authorId
    } = body

    // Validaciones
    if (!postSlug || !postTitle || !name || !email || !content || !authorId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    if (content.length < 4) {
      return NextResponse.json(
        { error: 'El comentario debe tener al menos 4 caracteres' },
        { status: 400 }
      )
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Crear documento del comentario
    const commentDoc = {
      _type: 'comment',
      _id: `comment_${uuidv4()}`,
      postSlug,
      postTitle,
      authorName: name,
      authorEmail: email,
      authorId,
      content,
      rating: rating && !parentComment ? rating : null,
      parentComment: parentComment ? { _type: 'reference', _ref: parentComment } : null,
      approved: true,
      isEdited: false,
      isDeleted: false,
      createdAt: new Date().toISOString()
    }

    const result = await writeClient.create(commentDoc)

    return NextResponse.json({
      message: '¡Comentario publicado exitosamente!',
      comment: result
    })

  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Error al crear comentario' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar comentario
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      commentId,
      authorId,
      name,
      email,
      content,
      rating
    } = body

    // Validaciones
    if (!commentId || !authorId || !name || !email || !content) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el usuario puede editar este comentario
    const existingComment = await client.fetch(
      `*[_type == "comment" && _id == $commentId && authorId == $authorId][0]`,
      { commentId, authorId }
    )

    if (!existingComment) {
      return NextResponse.json(
        { error: 'No tienes permisos para editar este comentario' },
        { status: 403 }
      )
    }

    // Actualizar el comentario
    const updatedComment = await writeClient
      .patch(commentId)
      .set({
        authorName: name,
        authorEmail: email,
        content,
        rating: rating || null,
        isEdited: true,
        updatedAt: new Date().toISOString()
      })
      .commit()

    return NextResponse.json({
      message: 'Comentario actualizado exitosamente',
      comment: updatedComment
    })

  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Error al actualizar comentario' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar comentario (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { commentId, authorId } = body

    if (!commentId || !authorId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el usuario puede eliminar este comentario
    const existingComment = await client.fetch(
      `*[_type == "comment" && _id == $commentId && authorId == $authorId][0]`,
      { commentId, authorId }
    )

    if (!existingComment) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar este comentario' },
        { status: 403 }
      )
    }

    // Soft delete - marcar como eliminado
    await writeClient
      .patch(commentId)
      .set({
        isDeleted: true,
        content: '[Comentario eliminado por el usuario]',
        updatedAt: new Date().toISOString()
      })
      .commit()

    return NextResponse.json({
      message: 'Comentario eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Error al eliminar comentario' },
      { status: 500 }
    )
  }
}