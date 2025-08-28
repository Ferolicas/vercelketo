import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/lib/sanity'
import { v4 as uuidv4 } from 'uuid'

// GET - Obtener comentarios de un post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params

    if (!postId) {
      return NextResponse.json(
        { error: 'ID del post requerido' },
        { status: 400 }
      )
    }

    // Obtener comentarios principales
    const commentsQuery = `*[_type == "forumComment" && post._ref == $postId && !defined(parent._ref) && isDeleted != true] | order(createdAt desc) {
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
    }`

    const comments = await client.fetch(commentsQuery, { postId })

    return NextResponse.json({ 
      comments,
      total: comments.length
    })

  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Error al obtener comentarios' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo comentario
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const body = await request.json()
    const { content, authorName, authorEmail, authorId, parentId } = body

    if (!content || !authorName || !authorEmail || !authorId) {
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

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(authorEmail)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Crear comentario
    const commentDoc = {
      _type: 'forumComment',
      _id: `forumComment_${uuidv4()}`,
      content: content.trim(),
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim(),
      authorId,
      post: { _type: 'reference', _ref: postId },
      parent: parentId ? { _type: 'reference', _ref: parentId } : undefined,
      approved: true, // Auto-approve for now
      isDeleted: false,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await writeClient.create(commentDoc)

    // Actualizar contador de comentarios del post
    const commentCount = await client.fetch(
      `count(*[_type == "forumComment" && post._ref == $postId && isDeleted != true])`,
      { postId }
    )

    await writeClient
      .patch(postId)
      .set({ replyCount: commentCount })
      .commit()

    // Recargar comentarios
    const comments = await client.fetch(`*[_type == "forumComment" && post._ref == $postId && isDeleted != true] | order(createdAt desc) {
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
      message: 'Comentario creado exitosamente',
      comments
    })

  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Error al crear comentario' },
      { status: 500 }
    )
  }
}