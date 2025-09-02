import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity'

export async function DELETE() {
  try {
    console.log('🔍 Buscando todas las publicaciones del foro...')
    
    // Obtener todos los posts del foro
    const forumPosts = await writeClient.fetch(`*[_type == "forumPost"]{_id, title}`)
    
    console.log(`📊 Encontradas ${forumPosts.length} publicaciones del foro`)
    
    if (forumPosts.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No hay publicaciones del foro para eliminar',
        deleted: 0
      })
    }
    
    console.log('🗑️  Eliminando publicaciones del foro...')
    
    // Crear transacción para eliminar todos los posts del foro
    const transaction = writeClient.transaction()
    
    // Agregar eliminaciones a la transacción
    for (const post of forumPosts) {
      console.log(`   - Preparando eliminación: "${post.title}" (${post._id})`)
      transaction.delete(post._id)
    }
    
    console.log('🧹 Buscando comentarios del foro...')
    
    // Obtener todos los comentarios del foro
    const forumComments = await writeClient.fetch(`*[_type == "forumComment"]{_id}`)
    
    for (const comment of forumComments) {
      transaction.delete(comment._id)
    }
    
    console.log('💥 Ejecutando eliminación masiva...')
    
    // Ejecutar transacción
    await transaction.commit()
    
    console.log(`✅ Eliminadas ${forumPosts.length} publicaciones y ${forumComments.length} comentarios del foro`)
    
    return NextResponse.json({
      success: true,
      message: `✅ Eliminadas ${forumPosts.length} publicaciones y ${forumComments.length} comentarios del foro`,
      deleted: forumPosts.length + forumComments.length
    })
    
  } catch (error) {
    console.error('❌ Error eliminando publicaciones del foro:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error eliminando publicaciones del foro',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

// Para proteger la ruta, también podríamos añadir verificación de autenticación
export async function GET() {
  return NextResponse.json({ 
    message: 'Utiliza método DELETE para eliminar publicaciones del foro' 
  })
}