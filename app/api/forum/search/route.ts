import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

// GET - Buscar posts del foro
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase() || ''
    const category = searchParams.get('category') || 'all'

    if (!query.trim()) {
      return NextResponse.json({ posts: [] })
    }

    // Buscar posts que coincidan con el título, contenido o autor
    let postsQuery = `*[_type == "forumPost" && approved == true && isDeleted != true && (
      title match "*${query}*" || 
      content match "*${query}*" || 
      authorName match "*${query}*"`

    // Agregar filtro por categoría si no es 'all'
    if (category !== 'all') {
      postsQuery += `) && category == "${category}"]`
    } else {
      postsQuery += `)]`
    }

    postsQuery += ` | order(isPinned desc, createdAt desc) [0...20] {
      _id,
      title,
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

    const posts = await client.fetch<any[]>(postsQuery)

    // También buscar en las respuestas de los posts
    const repliesQuery = `*[_type == "forumReply" && content match "*${query}*" && approved == true && isDeleted != true] {
      post-> {
        _id,
        title,
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
      }
    }`

    const replyPosts = await client.fetch<any[]>(repliesQuery)
    const uniqueReplyPosts = replyPosts
      .filter((reply: any) => reply.post && reply.post._id)
      .map((reply: any) => reply.post)
      .filter((post: any, index: number, self: any[]) => 
        index === self.findIndex((p: any) => p._id === post._id)
      )

    // Combinar posts y eliminar duplicados
    const allPosts = [...posts, ...uniqueReplyPosts]
    const uniquePosts = allPosts.filter((post: any, index: number, self: any[]) => 
      index === self.findIndex((p: any) => p._id === post._id)
    )

    return NextResponse.json({ 
      posts: uniquePosts,
      total: uniquePosts.length
    })

  } catch (error) {
    console.error('Error searching forum posts:', error)
    return NextResponse.json(
      { error: 'Error al buscar publicaciones' },
      { status: 500 }
    )
  }
}