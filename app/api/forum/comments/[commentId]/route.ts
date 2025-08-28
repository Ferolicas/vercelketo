import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity'

// PUT - Actualizar comentario
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params
    const body = await request.json()
    const { content, authorId } = body

    if (!content || !authorId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    if (content.length < 5 || content.length > 1000) {
      return NextResponse.json(
        { error: 'El comentario debe tener entre 5 y 1000 caracteres' },
        { status: 400 }
      )
    }

    // Verificar que el autor es el propietario del comentario
    const existingComment = await writeClient.fetch(
      `*[_type == "forumComment" && _id == $commentId && authorId == $authorId][0]`,
      { commentId, authorId }
    )

    if (!existingComment) {
      return NextResponse.json(
        { error: 'No tienes permisos para editar este comentario' },
        { status: 403 }
      )
    }

    // Actualizar el comentario
    await writeClient
      .patch(commentId)
      .set({
        content: content.trim(),
        updatedAt: new Date().toISOString(),
        isEdited: true
      })
      .commit()

    // Recargar comentarios del post
    const postId = existingComment.post._ref
    const comments = await writeClient.fetch(`*[_type == "forumComment" && post._ref == $postId && isDeleted != true] | order(createdAt desc) {
      _id,
      content,
      authorName,
      authorEmail,
      authorId,
      createdAt,
      updatedAt,
      approved,
      isDeleted,
      likes,
      "replies": *[_type == "forumComment" && parent._ref == ^._id && isDeleted != true] | order(createdAt asc) {
        _id,
        content,
        authorName,
        authorEmail,
        authorId,
        createdAt,
        updatedAt,
        approved,
        isDeleted,
        likes,
        parentId: parent._ref
      }
    }`, { postId })

    return NextResponse.json({
      message: 'Comentario actualizado exitosamente',
      comments
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params
    const body = await request.json()
    const { authorId } = body

    if (!authorId) {
      return NextResponse.json(
        { error: 'ID del autor requerido' },
        { status: 400 }
      )
    }

    // Verificar que el autor es el propietario del comentario
    const existingComment = await writeClient.fetch(
      `*[_type == "forumComment" && _id == $commentId && authorId == $authorId][0]`,
      { commentId, authorId }
    )

    if (!existingComment) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar este comentario' },
        { status: 403 }
      )
    }

    // Soft delete
    await writeClient
      .patch(commentId)
      .set({
        isDeleted: true,
        content: '[Comentario eliminado por el usuario]',
        updatedAt: new Date().toISOString()
      })
      .commit()

    // Actualizar contador de comentarios del post
    const postId = existingComment.post._ref
    const commentCount = await writeClient.fetch(
      `count(*[_type == "forumComment" && post._ref == $postId && isDeleted != true])`,
      { postId }
    )

    await writeClient
      .patch(postId)
      .set({ replyCount: commentCount })
      .commit()

    // Recargar comentarios del post
    const comments = await writeClient.fetch(`*[_type == "forumComment" && post._ref == $postId && isDeleted != true] | order(createdAt desc) {
      _id,
      content,
      authorName,
      authorEmail,
      authorId,
      createdAt,
      updatedAt,
      approved,
      isDeleted,
      likes,
      "replies": *[_type == "forumComment" && parent._ref == ^._id && isDeleted != true] | order(createdAt asc) {
        _id,
        content,
        authorName,
        authorEmail,
        authorId,
        createdAt,
        updatedAt,
        approved,
        isDeleted,
        likes,
        parentId: parent._ref
      }
    }`, { postId })

    return NextResponse.json({
      message: 'Comentario eliminado exitosamente',
      comments
    })

  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Error al eliminar comentario' },
      { status: 500 }
    )
  }
}