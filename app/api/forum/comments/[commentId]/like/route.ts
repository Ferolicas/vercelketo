import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity'

// POST - Like/unlike comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params

    if (!commentId) {
      return NextResponse.json(
        { error: 'ID del comentario requerido' },
        { status: 400 }
      )
    }

    // Incrementar likes del comentario
    await writeClient
      .patch(commentId)
      .inc({ likes: 1 })
      .commit()

    // Obtener el post asociado para recargar todos los comentarios
    const comment = await writeClient.fetch(
      `*[_type == "forumComment" && _id == $commentId][0]`,
      { commentId }
    )

    if (!comment) {
      return NextResponse.json(
        { error: 'Comentario no encontrado' },
        { status: 404 }
      )
    }

    const postId = comment.post._ref

    // Recargar comentarios actualizados
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
      message: 'Like agregado exitosamente',
      comments
    })

  } catch (error) {
    console.error('Error liking comment:', error)
    return NextResponse.json(
      { error: 'Error al dar like al comentario' },
      { status: 500 }
    )
  }
}

// DELETE - Unlike comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params

    if (!commentId) {
      return NextResponse.json(
        { error: 'ID del comentario requerido' },
        { status: 400 }
      )
    }

    // Decrementar likes del comentario (mínimo 0)
    await writeClient
      .patch(commentId)
      .dec({ likes: 1 })
      .commit()

    // Obtener el post asociado para recargar todos los comentarios
    const comment = await writeClient.fetch(
      `*[_type == "forumComment" && _id == $commentId][0]`,
      { commentId }
    )

    if (!comment) {
      return NextResponse.json(
        { error: 'Comentario no encontrado' },
        { status: 404 }
      )
    }

    const postId = comment.post._ref

    // Recargar comentarios actualizados
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
      message: 'Like removido exitosamente',
      comments
    })

  } catch (error) {
    console.error('Error unliking comment:', error)
    return NextResponse.json(
      { error: 'Error al remover like del comentario' },
      { status: 500 }
    )
  }
}