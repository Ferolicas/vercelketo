import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'nfqa4osj',
  dataset: 'production',
  token: process.env.SANITY_DEPLOY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function deleteForumPosts() {
  try {
    console.log('🔍 Buscando todas las publicaciones del foro...')
    
    // Obtener todos los posts del foro
    const forumPosts = await client.fetch(`*[_type == "forumPost"]{_id, title}`)
    
    console.log(`📊 Encontradas ${forumPosts.length} publicaciones del foro`)
    
    if (forumPosts.length === 0) {
      console.log('✅ No hay publicaciones del foro para eliminar')
      return
    }
    
    console.log('🗑️  Eliminando publicaciones del foro...')
    
    // Eliminar todos los posts del foro
    for (const post of forumPosts) {
      console.log(`   - Eliminando: "${post.title}" (${post._id})`)
      await client.delete(post._id)
    }
    
    console.log('🧹 Eliminando comentarios del foro...')
    
    // Obtener y eliminar todos los comentarios del foro
    const forumComments = await client.fetch(`*[_type == "forumComment"]{_id}`)
    
    for (const comment of forumComments) {
      await client.delete(comment._id)
    }
    
    console.log(`✅ Eliminadas ${forumPosts.length} publicaciones y ${forumComments.length} comentarios del foro`)
    console.log('🎉 Proceso completado exitosamente')
    
  } catch (error) {
    console.error('❌ Error eliminando publicaciones del foro:', error)
    process.exit(1)
  }
}

deleteForumPosts()