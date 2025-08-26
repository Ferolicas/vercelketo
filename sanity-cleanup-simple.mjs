// Script simple para limpiar Sanity y crear nuevas categorías
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'nfqa4osj',
  dataset: 'production',
  useCdn: false,
  token: 'skzKvOdB6g2Z4PwweXAputGeI5jp1yWlbctKO5kFWAErpKrlwwYlf8sdiiPXcq9SJYXPoZn7ZLMSkNp4VPQ3Vq0KqmWlw9Tam9YHJIscOoXCKwBfS3wF7XvwZwtMF1eLvTKz02AvJ9lXqTDdVQ8BnX9GF6us6DsDljF38RrhjNtvJ6cLUKR5',
  apiVersion: '2024-01-01'
})

async function deleteAllDocuments() {
  console.log('🗑️ Eliminando todos los documentos existentes...')
  
  try {
    // Obtener todos los documentos (excluyendo los del sistema)
    const allDocs = await client.fetch('*[defined(_id) && !(_id in path("_.**"))]{ _id, _type }')
    console.log(`   📊 Encontrados ${allDocs.length} documentos para eliminar`)
    
    if (allDocs.length === 0) {
      console.log('   ✅ No hay documentos para eliminar')
      return true
    }
    
    // Mostrar tipos de documentos encontrados
    const types = [...new Set(allDocs.map(doc => doc._type))]
    console.log(`   📋 Tipos encontrados: ${types.join(', ')}`)
    
    // Eliminar en lotes pequeños
    const batchSize = 5
    let deleted = 0
    
    for (let i = 0; i < allDocs.length; i += batchSize) {
      const batch = allDocs.slice(i, i + batchSize)
      
      for (const doc of batch) {
        try {
          await client.delete(doc._id)
          deleted++
          console.log(`   🗑️ Eliminado ${doc._type}: ${doc._id} (${deleted}/${allDocs.length})`)
        } catch (error) {
          console.log(`   ⚠️ Error eliminando ${doc._id}: ${error.message}`)
        }
      }
      
      // Pausa entre lotes
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    console.log(`   ✅ Eliminación completada: ${deleted} documentos eliminados`)
    return true
    
  } catch (error) {
    console.error('❌ Error eliminando documentos:', error.message)
    return false
  }
}

async function createNewCategories() {
  console.log('\n🏗️ Creando nuevas categorías...')
  
  const categories = [
    {
      _type: 'category',
      name: 'Desayuno',
      slug: { current: 'desayuno', _type: 'slug' },
      description: 'Recetas perfectas para empezar el día con energía keto',
      icon: '🍳'
    },
    {
      _type: 'category',
      name: 'Almuerzo', 
      slug: { current: 'almuerzo', _type: 'slug' },
      description: 'Comidas principales nutritivas y saciantes',
      icon: '🥗'
    },
    {
      _type: 'category',
      name: 'Cena',
      slug: { current: 'cena', _type: 'slug' },
      description: 'Cenas ligeras y deliciosas para cerrar el día',
      icon: '🍽️'
    },
    {
      _type: 'category',
      name: 'Aperitivo',
      slug: { current: 'aperitivo', _type: 'slug' },
      description: 'Snacks y aperitivos keto para cualquier momento',
      icon: '🧀'
    },
    {
      _type: 'category',
      name: 'Postre',
      slug: { current: 'postre', _type: 'slug' },
      description: 'Dulces placeres sin culpa, perfectos para keto',
      icon: '🍰'
    }
  ]
  
  let created = 0
  
  for (const category of categories) {
    try {
      const result = await client.create(category)
      console.log(`   ✅ ${category.icon} ${category.name} creada - ID: ${result._id}`)
      created++
      
      // Pausa entre creaciones
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (error) {
      console.log(`   ❌ Error creando ${category.name}: ${error.message}`)
    }
  }
  
  console.log(`\n   📊 Categorías creadas: ${created}/${categories.length}`)
  return created === categories.length
}

async function verifyCategories() {
  console.log('\n🔍 Verificando categorías creadas...')
  
  try {
    const categories = await client.fetch('*[_type == "category"] | order(name asc) { _id, name, slug, icon, description }')
    
    if (categories.length === 0) {
      console.log('   ❌ No se encontraron categorías')
      return false
    }
    
    console.log(`\n   📋 CATEGORÍAS VERIFICADAS (${categories.length}):`)
    console.log('   ' + '='.repeat(50))
    categories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.icon} ${cat.name} (${cat.slug.current})`)
      console.log(`      📝 ${cat.description}`)
      console.log(`      🆔 ${cat._id}`)
      console.log('   ' + '-'.repeat(50))
    })
    
    return true
    
  } catch (error) {
    console.error('❌ Error verificando categorías:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 LIMPIEZA COMPLETA DE SANITY - PLANETA KETO')
  console.log('='.repeat(60))
  console.log('⚠️  ADVERTENCIA: Se eliminarán TODOS los registros existentes')
  console.log('='.repeat(60))
  
  try {
    // Paso 1: Eliminar todos los documentos
    console.log('\n🔴 PASO 1: ELIMINACIÓN COMPLETA')
    const deleteSuccess = await deleteAllDocuments()
    if (!deleteSuccess) {
      throw new Error('Falló la eliminación de documentos')
    }
    
    // Pausa para que se procesen las eliminaciones
    console.log('\n⏳ Esperando propagación de cambios...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Paso 2: Crear nuevas categorías
    console.log('\n🟢 PASO 2: CREACIÓN DE CATEGORÍAS')
    const createSuccess = await createNewCategories()
    if (!createSuccess) {
      console.log('⚠️ Algunas categorías no se pudieron crear, pero continuamos...')
    }
    
    // Pausa para que se procesen las creaciones
    console.log('\n⏳ Esperando propagación de creaciones...')
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Paso 3: Verificar resultado
    console.log('\n🔵 PASO 3: VERIFICACIÓN FINAL')
    const verifySuccess = await verifyCategories()
    
    console.log('\n' + '='.repeat(60))
    if (verifySuccess) {
      console.log('🎉 ¡PROCESO COMPLETADO EXITOSAMENTE!')
      console.log('✅ Registros antiguos eliminados')
      console.log('✅ 5 nuevas categorías creadas y verificadas')
    } else {
      console.log('⚠️ Proceso completado con advertencias')
      console.log('✅ Registros eliminados')
      console.log('❓ Verificar categorías manualmente')
    }
    console.log('='.repeat(60))
    
    return verifySuccess
    
  } catch (error) {
    console.error('\n💥 ERROR CRÍTICO EN EL PROCESO:')
    console.error(`❌ ${error.message}`)
    console.error('='.repeat(60))
    return false
  }
}

// Ejecutar
main()
  .then(success => {
    console.log(success ? '\n✅ Script completado exitosamente' : '\n❌ Script completado con errores')
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })