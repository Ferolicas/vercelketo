// Script para limpiar completamente todos los registros de Sanity y crear nuevas categorías
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'nfqa4osj',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03'
})

async function cleanupAndRecreate() {
  console.log('🧹 Iniciando limpieza completa de Sanity...\n')
  
  try {
    // 1. Eliminar todos los documentos de todos los tipos
    console.log('1. Eliminando todos los registros existentes...')
    
    const allDocs = await client.fetch('*[defined(_id)]{ _id, _type }')
    console.log(`   📊 Se encontraron ${allDocs.length} documentos`)
    
    if (allDocs.length > 0) {
      const transaction = client.transaction()
      
      allDocs.forEach(doc => {
        transaction.delete(doc._id)
      })
      
      await transaction.commit()
      console.log('   ✅ Todos los registros eliminados exitosamente')
    } else {
      console.log('   ℹ️ No hay registros para eliminar')
    }

    // 2. Crear nuevas categorías
    console.log('\n2. Creando nuevas categorías...')
    
    const newCategories = [
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

    const categoryTransaction = client.transaction()
    
    newCategories.forEach(category => {
      categoryTransaction.create(category)
    })
    
    await categoryTransaction.commit()
    console.log('   ✅ 5 nuevas categorías creadas exitosamente')
    
    // 3. Verificar que las categorías se crearon correctamente
    console.log('\n3. Verificando categorías creadas...')
    const createdCategories = await client.fetch('*[_type == "category"]{ _id, name, slug, icon }')
    
    createdCategories.forEach(cat => {
      console.log(`   ${cat.icon} ${cat.name} (${cat.slug.current}) - ID: ${cat._id}`)
    })
    
    console.log(`\n🎉 Proceso completado exitosamente!`)
    console.log(`✅ ${createdCategories.length} categorías creadas y verificadas`)
    
    return {
      success: true,
      categoriesCreated: createdCategories.length,
      categories: createdCategories
    }
    
  } catch (error) {
    console.error('❌ Error durante el proceso:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Ejecutar
cleanupAndRecreate()
  .then(result => {
    if (result.success) {
      console.log('\n🚀 Limpieza y recreación completada exitosamente!')
      process.exit(0)
    } else {
      console.error('\n💥 Error en el proceso:', result.error)
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('\n💥 Error fatal:', error)
    process.exit(1)
  })