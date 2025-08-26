// Script final para eliminar la última categoría problemática
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'nfqa4osj',
  dataset: 'production',
  useCdn: false,
  token: 'skzKvOdB6g2Z4PwweXAputGeI5jp1yWlbctKO5kFWAErpKrlwwYlf8sdiiPXcq9SJYXPoZn7ZLMSkNp4VPQ3Vq0KqmWlw9Tam9YHJIscOoXCKwBfS3wF7XvwZwtMF1eLvTKz02AvJ9lXqTDdVQ8BnX9GF6us6DsDljF38RrhjNtvJ6cLUKR5',
  apiVersion: '2024-01-01'
})

async function finalCleanup() {
  console.log('🔥 LIMPIEZA FINAL AGRESIVA\n')
  
  try {
    // Eliminar el documento que está causando la referencia
    const problematicDoc = '479729ab-acf6-42b5-9852-027af8381694'
    const problematicCategory = 'ff3d9272-28ef-4f77-8e37-bc91ef6e9d05'
    
    console.log('1. Eliminando documento problemático que mantiene referencias...')
    
    try {
      await client.delete(problematicDoc)
      console.log(`   ✅ Eliminado documento: ${problematicDoc}`)
    } catch (error) {
      console.log(`   ⚠️ Error eliminando documento: ${error.message}`)
    }
    
    // Esperar un momento
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('\n2. Intentando eliminar la categoría problemática...')
    
    try {
      await client.delete(problematicCategory)
      console.log(`   ✅ Eliminada categoría problemática: ${problematicCategory}`)
    } catch (error) {
      console.log(`   ⚠️ Aún no se puede eliminar: ${error.message}`)
      
      // Último recurso: buscar y eliminar TODOS los documentos que la referencien
      console.log('\n3. Buscando TODAS las referencias...')
      
      try {
        const referencingDocs = await client.fetch(`*[references("${problematicCategory}")]{ _id, _type }`)
        console.log(`   📊 Encontrados ${referencingDocs.length} documentos que la referencian`)
        
        for (const doc of referencingDocs) {
          try {
            await client.delete(doc._id)
            console.log(`   🗑️ Eliminado ${doc._type}: ${doc._id}`)
          } catch (delError) {
            console.log(`   ❌ No se pudo eliminar ${doc._id}: ${delError.message}`)
          }
        }
        
        // Intentar eliminar la categoría nuevamente
        await new Promise(resolve => setTimeout(resolve, 1000))
        await client.delete(problematicCategory)
        console.log(`   ✅ ¡Finalmente eliminada la categoría problemática!`)
        
      } catch (searchError) {
        console.log(`   ❌ Error buscando referencias: ${searchError.message}`)
      }
    }
    
    // Verificación final
    console.log('\n🔍 VERIFICACIÓN FINAL COMPLETA...')
    
    const allCategories = await client.fetch('*[_type == "category"]{ _id, name, slug, icon }')
    const validCategories = allCategories.filter(cat => cat.name && cat.name.trim() !== '')
    const invalidCategories = allCategories.filter(cat => !cat.name || cat.name.trim() === '')
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 ESTADO FINAL DE CATEGORÍAS')
    console.log('='.repeat(60))
    
    console.log(`✅ Categorías VÁLIDAS: ${validCategories.length}`)
    validCategories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.icon} ${cat.name} (${cat.slug?.current})`)
    })
    
    if (invalidCategories.length > 0) {
      console.log(`\n❌ Categorías INVÁLIDAS: ${invalidCategories.length}`)
      invalidCategories.forEach(cat => {
        console.log(`   🗑️ ${cat._id} - slug: ${cat.slug?.current || 'null'}`)
      })
    }
    
    console.log('\n' + '='.repeat(60))
    
    if (validCategories.length === 5 && invalidCategories.length === 0) {
      console.log('🎉 ¡PERFECTO! Solo las 5 categorías válidas permanecen')
      return true
    } else {
      console.log('⚠️ Aún hay categorías inválidas o falta alguna válida')
      return false
    }
    
  } catch (error) {
    console.error('💥 Error en limpieza final:', error.message)
    return false
  }
}

// Ejecutar
finalCleanup()
  .then(success => {
    console.log('\n' + (success ? '✅ LIMPIEZA COMPLETADA' : '❌ LIMPIEZA PARCIAL'))
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })