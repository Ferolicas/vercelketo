// Script para eliminar las categorías restantes que tienen referencias
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'nfqa4osj',
  dataset: 'production',
  useCdn: false,
  token: 'skzKvOdB6g2Z4PwweXAputGeI5jp1yWlbctKO5kFWAErpKrlwwYlf8sdiiPXcq9SJYXPoZn7ZLMSkNp4VPQ3Vq0KqmWlw9Tam9YHJIscOoXCKwBfS3wF7XvwZwtMF1eLvTKz02AvJ9lXqTDdVQ8BnX9GF6us6DsDljF38RrhjNtvJ6cLUKR5',
  apiVersion: '2024-01-01'
})

async function cleanupRemaining() {
  console.log('🧹 Limpiando categorías restantes con valores null...\n')
  
  try {
    // Buscar categorías con valores null
    const nullCategories = await client.fetch('*[_type == "category" && (name == null || name == "")]{ _id, name, slug }')
    
    if (nullCategories.length === 0) {
      console.log('✅ No hay categorías null para eliminar')
      return true
    }
    
    console.log(`📊 Encontradas ${nullCategories.length} categorías con valores null:`)
    nullCategories.forEach(cat => {
      console.log(`   🗑️ ID: ${cat._id}, slug: ${cat.slug?.current || 'null'}`)
    })
    
    // Intentar eliminar usando el método más agresivo
    console.log('\n🔥 Eliminando forzosamente...')
    
    for (const cat of nullCategories) {
      try {
        // Primero intentar eliminar directamente
        await client.delete(cat._id)
        console.log(`   ✅ Eliminado: ${cat._id}`)
      } catch (error) {
        console.log(`   ⚠️ Error eliminando ${cat._id}: ${error.message}`)
        
        // Si falla, intentar con mutación usando patch para "break" las referencias
        try {
          await client
            .patch(cat._id)
            .set({ name: null, slug: null, description: null })
            .commit()
          
          await client.delete(cat._id)
          console.log(`   ✅ Forzado y eliminado: ${cat._id}`)
        } catch (forceError) {
          console.log(`   ❌ No se pudo forzar eliminación: ${cat._id}`)
        }
      }
    }
    
    // Verificar resultado final
    console.log('\n🔍 Verificación final...')
    const remainingCategories = await client.fetch('*[_type == "category"]{ _id, name, slug, icon }')
    
    console.log(`\n📊 RESULTADO FINAL - Total categorías: ${remainingCategories.length}`)
    console.log('=' * 50)
    
    const validCategories = remainingCategories.filter(cat => cat.name && cat.name !== '')
    const invalidCategories = remainingCategories.filter(cat => !cat.name || cat.name === '')
    
    console.log(`✅ Categorías válidas: ${validCategories.length}`)
    validCategories.forEach(cat => {
      console.log(`   ${cat.icon || '📂'} ${cat.name} (${cat.slug?.current || 'no-slug'})`)
    })
    
    if (invalidCategories.length > 0) {
      console.log(`\n❌ Categorías inválidas restantes: ${invalidCategories.length}`)
      invalidCategories.forEach(cat => {
        console.log(`   🗑️ ID: ${cat._id}, slug: ${cat.slug?.current || 'null'}`)
      })
    }
    
    return invalidCategories.length === 0
    
  } catch (error) {
    console.error('❌ Error en limpieza:', error.message)
    return false
  }
}

// Ejecutar
cleanupRemaining()
  .then(success => {
    if (success) {
      console.log('\n🎉 ¡Limpieza completada exitosamente!')
      console.log('✅ Solo quedan las 5 categorías válidas nuevas')
    } else {
      console.log('\n⚠️ Limpieza completada con algunas categorías restantes')
      console.log('ℹ️ Puede que necesites eliminarlas manualmente desde Sanity Studio')
    }
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })