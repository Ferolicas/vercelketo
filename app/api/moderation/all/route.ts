import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

// GET - Obtener todo el contenido para moderación
export async function GET(request: NextRequest) {
  try {
    // Obtener posts del foro pendientes
    const forumPostsQuery = `*[_type == "forumPost" && approved == false && isDeleted != true] | order(createdAt desc) {
      _id,
      title,
      content,
      authorName,
      authorEmail,
      category,
      tags,
      isPinned,
      "type": "post",
      "source": {
        "type": "forumPost",
        "title": title,
        "slug": slug.current
      },
      _createdAt,
      "status": "pending",
      reported,
      reportReason
    }`

    // Obtener respuestas del foro pendientes
    const forumRepliesQuery = `*[_type == "forumReply" && approved == false && isDeleted != true] | order(createdAt desc) {
      _id,
      content,
      authorName,
      authorEmail,
      "type": "reply",
      "source": {
        "type": "forumReply",
        "title": post->title,
        "slug": post->slug.current,
        "parentTitle": post->title
      },
      _createdAt,
      "status": "pending",
      reported,
      reportReason
    }`

    // Obtener comentarios de recetas pendientes
    const recipeCommentsQuery = `*[_type == "recipeComment" && approved == false && isDeleted != true] | order(createdAt desc) {
      _id,
      content,
      authorName,
      authorEmail,
      "type": "comment",
      "source": {
        "type": "recipeComment",
        "title": recipe->title,
        "slug": recipe->slug.current
      },
      _createdAt,
      "status": "pending",
      reported,
      reportReason
    }`

    // Obtener comentarios del blog pendientes
    const blogCommentsQuery = `*[_type == "blogComment" && approved == false && isDeleted != true] | order(createdAt desc) {
      _id,
      content,
      authorName,
      authorEmail,
      "type": "comment",
      "source": {
        "type": "blogComment",
        "title": post->title,
        "slug": post->slug.current
      },
      _createdAt,
      "status": "pending",
      reported,
      reportReason
    }`

    // Obtener contenido aprobado y rechazado
    const approvedQuery = `*[_type in ["forumPost", "forumReply", "recipeComment", "blogComment"] && approved == true && isDeleted != true] | order(createdAt desc) [0...50] {
      _id,
      title,
      content,
      authorName,
      authorEmail,
      category,
      "type": _type == "forumPost" ? "post" : _type == "forumReply" ? "reply" : "comment",
      "source": {
        "type": _type == "forumPost" ? "forumPost" : _type == "forumReply" ? "forumReply" : _type == "recipeComment" ? "recipeComment" : "blogComment",
        "title": select(_type == "forumPost" => title, _type == "forumReply" => post->title, _type == "recipeComment" => recipe->title, _type == "blogComment" => post->title),
        "slug": select(_type == "forumPost" => slug.current, _type == "forumReply" => post->slug.current, _type == "recipeComment" => recipe->slug.current, _type == "blogComment" => post->slug.current)
      },
      _createdAt,
      "status": "approved",
      reported,
      reportReason
    }`

    const rejectedQuery = `*[_type in ["forumPost", "forumReply", "recipeComment", "blogComment"] && approved == false && isDeleted != true] | order(createdAt desc) [0...50] {
      _id,
      title,
      content,
      authorName,
      authorEmail,
      category,
      "type": _type == "forumPost" ? "post" : _type == "forumReply" ? "reply" : "comment",
      "source": {
        "type": _type == "forumPost" ? "forumPost" : _type == "forumReply" ? "forumReply" : _type == "recipeComment" ? "recipeComment" : "blogComment",
        "title": select(_type == "forumPost" => title, _type == "forumReply" => post->title, _type == "recipeComment" => recipe->title, _type == "blogComment" => post->title),
        "slug": select(_type == "forumPost" => slug.current, _type == "forumReply" => post->slug.current, _type == "recipeComment" => recipe->slug.current, _type == "blogComment" => post->slug.current)
      },
      _createdAt,
      "status": "rejected",
      reported,
      reportReason
    }`

    // Ejecutar todas las queries
    const [forumPosts, forumReplies, recipeComments, blogComments, approved, rejected] = await Promise.all([
      client.fetch(forumPostsQuery),
      client.fetch(forumRepliesQuery),
      client.fetch(recipeCommentsQuery),
      client.fetch(blogCommentsQuery),
      client.fetch(approvedQuery),
      client.fetch(rejectedQuery)
    ]);

    // Combinar todo el contenido
    const allContent = [
      ...forumPosts,
      ...forumReplies,
      ...recipeComments,
      ...blogComments,
      ...approved,
      ...rejected
    ];

    return NextResponse.json({ 
      content: allContent,
      total: allContent.length,
      pending: [...forumPosts, ...forumReplies, ...recipeComments, ...blogComments].length,
      approved: approved.length,
      rejected: rejected.length
    })

  } catch (error) {
    console.error('Error fetching moderation content:', error)
    return NextResponse.json(
      { error: 'Error al obtener contenido para moderación' },
      { status: 500 }
    )
  }
}