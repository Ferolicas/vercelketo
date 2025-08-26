// Script para probar la conexión con Sanity y verificar los datos
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'nfqa4osj',
  dataset: 'production',
  useCdn: false,
  token: 'skzKvOdB6g2Z4PwweXAputGeI5jp1yWlbctKO5kFWAErpKrlwwYlf8sdiiPXcq9SJYXPoZn7ZLMSkNp4VPQ3Vq0KqmWlw9Tam9YHJIscOoXCKwBfS3wF7XvwZwtMF1eLvTKz02AvJ9lXqTDdVQ8BnX9GF6us6DsDljF38RrhjNtvJ6cLUKR5',
  apiVersion: '2024-01-01'
})

// Cliente público (como lo usa la API)
const publicClient = createClient({
  projectId: 'nfqa4osj',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01'
})

async function testConnection() {
  console.log('🔍 Probando conexión con Sanity...\n')
  
  try {
    // Test con cliente privado
    console.log('1. Probando con cliente privado (con token)...')
    const categoriesPrivate = await client.fetch('*[_type == "category"]')
    const recipesPrivate = await client.fetch('*[_type == "recipe"]')
    
    console.log(`   ✅ Categorías: ${categoriesPrivate.length}`)
    console.log(`   ✅ Recetas: ${recipesPrivate.length}`)
    
    // Test con cliente público (como la API)
    console.log('\n2. Probando con cliente público (sin token, como la API)...')
    const categoriesPublic = await publicClient.fetch('*[_type == "category"]')
    const recipesPublic = await publicClient.fetch('*[_type == "recipe"]')
    
    console.log(`   ✅ Categorías: ${categoriesPublic.length}`)
    console.log(`   ✅ Recetas: ${recipesPublic.length}`)
    
    // Mostrar algunas categorías
    console.log('\n3. Categorías disponibles:')
    categoriesPublic.forEach(cat => {
      console.log(`   ${cat.icon} ${cat.name} (${cat.slug?.current})`)
    })
    
    // Mostrar algunas recetas
    console.log('\n4. Recetas disponibles:')
    recipesPublic.forEach(recipe => {
      console.log(`   🍳 ${recipe.name}`)
    })
    
    console.log('\n✅ Conexión con Sanity funcionando correctamente')
    return true
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
    return false
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1)
})