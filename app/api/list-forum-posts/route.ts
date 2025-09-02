import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function GET() {
  try {
    console.log('🔍 Listando todas las publicaciones del foro...')
    
    // Obtener todos los posts del foro (solo lectura)
    const forumPosts = await client.fetch(`*[_type == "forumPost"]{_id, title, authorName, createdAt}`)
    
    console.log(`📊 Encontradas ${forumPosts.length} publicaciones del foro`)
    
    // También obtener comentarios
    const forumComments = await client.fetch(`*[_type == "forumComment"]{_id}`)
    
    return NextResponse.json({
      success: true,
      forumPosts: forumPosts,
      forumCommentsCount: forumComments.length,
      totalItems: forumPosts.length + forumComments.length
    })
    
  } catch (error) {
    console.error('❌ Error listando publicaciones del foro:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error listando publicaciones del foro',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}