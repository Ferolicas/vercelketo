// Script para limpiar Sanity y crear nuevas categorías usando el token correcto
import { createClient } from '@sanity/client'
import { config } from 'dotenv'

// Cargar variables de entorno
config()

const client = createClient({
  projectId: 'nfqa4osj',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01'
})

async function deleteAllDocuments() {
  console.log('🗑️ Eliminando todos los documentos existentes...')
  
  try {
    // Obtener todos los documentos
    const allDocs = await client.fetch('*[defined(_id) && !(_id in path("_.**"))]{ _id }')
    console.log(`   📊 Encontrados ${allDocs.length} documentos para eliminar`)
    
    if (allDocs.length === 0) {
      console.log('   ✅ No hay documentos para eliminar')
      return true
    }
    
    // Eliminar en lotes pequeños para evitar errores de timeout
    const batchSize = 10
    let deleted = 0
    
    for (let i = 0; i < allDocs.length; i += batchSize) {
      const batch = allDocs.slice(i, i + batchSize)
      const transaction = client.transaction()
      
      batch.forEach(doc => {
        transaction.delete(doc._id)
      })
      
      try {
        await transaction.commit()
        deleted += batch.length
        console.log(`   🗑️ Eliminados ${deleted}/${allDocs.length} documentos`)
      } catch (error) {
        console.log(`   ⚠️ Error eliminando lote: ${error.message}`)
      }
    }
    
    console.log(`   ✅ Eliminación completada: ${deleted} documentos`)
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
      console.log(`   ✅ ${category.icon} ${category.name} - ID: ${result._id}`)
      created++
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
    
    console.log(`\n   📋 Categorías encontradas (${categories.length}):`)
    categories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.icon} ${cat.name} (${cat.slug.current})`)
      console.log(`      📝 ${cat.description}`)
      console.log(`      🆔 ${cat._id}\n`)
    })
    
    return true
    
  } catch (error) {
    console.error('❌ Error verificando categorías:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 INICIANDO LIMPIEZA COMPLETA DE SANITY\n')
  console.log('='*50)
  
  try {
    // Paso 1: Eliminar todos los documentos
    const deleteSuccess = await deleteAllDocuments()
    if (!deleteSuccess) {
      throw new Error('Falló la eliminación de documentos')
    }
    
    // Esperar un momento para que se procesen las eliminaciones
    console.log('\n⏳ Esperando que se procesen las eliminaciones...')
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Paso 2: Crear nuevas categorías
    const createSuccess = await createNewCategories()
    if (!createSuccess) {
      throw new Error('Falló la creación de categorías')
    }
    
    // Paso 3: Verificar resultado
    const verifySuccess = await verifyCategories()
    if (!verifySuccess) {
      throw new Error('Falló la verificación de categorías')
    }
    
    console.log('='*50)
    console.log('🎉 ¡PROCESO COMPLETADO EXITOSAMENTE!')
    console.log('✅ Todos los registros antiguos eliminados')
    console.log('✅ 5 nuevas categorías creadas')
    console.log('✅ Verificación completada')
    console.log('='*50)
    
    return true
    
  } catch (error) {
    console.error('\n💥 ERROR EN EL PROCESO:')
    console.error(`❌ ${error.message}`)
    console.error('='*50)
    return false
  }
}

// Ejecutar el script principal
main()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })