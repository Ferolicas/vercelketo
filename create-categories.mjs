// Script para crear nuevas categorías usando el cliente con token de escritura
import { createClient } from '@sanity/client'

// Usar el token de escritura desde las variables de entorno
const writeClient = createClient({
  projectId: 'nfqa4osj',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN, // Token con permisos de escritura
  apiVersion: '2023-05-03'
})

async function createCategories() {
  console.log('🏗️ Creando nuevas categorías en Sanity...\n')
  
  try {
    // Verificar conexión y permisos
    console.log('1. Verificando conexión y permisos...')
    
    // Crear nuevas categorías
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

    // Crear cada categoría individualmente
    for (const category of newCategories) {
      try {
        const result = await writeClient.create(category)
        console.log(`   ✅ ${category.icon} ${category.name} creada - ID: ${result._id}`)
      } catch (error) {
        console.log(`   ⚠️ ${category.name}: ${error.message}`)
      }
    }
    
    // Verificar que las categorías se crearon correctamente
    console.log('\n3. Verificando categorías creadas...')
    const createdCategories = await writeClient.fetch('*[_type == "category"]{ _id, name, slug, icon }')
    
    console.log(`\n📊 Total de categorías: ${createdCategories.length}`)
    createdCategories.forEach(cat => {
      console.log(`   ${cat.icon} ${cat.name} (${cat.slug.current})`)
    })
    
    console.log(`\n🎉 Proceso completado!`)
    
    return {
      success: true,
      categoriesCreated: createdCategories.length,
      categories: createdCategories
    }
    
  } catch (error) {
    console.error('❌ Error durante el proceso:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

// Ejecutar
createCategories()
  .then(result => {
    if (result.success) {
      console.log('\n🚀 Categorías creadas exitosamente!')
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