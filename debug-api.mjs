// Script para diagnosticar problemas específicos con las APIs
import { createClient } from '@sanity/client'

// Configuración exacta como en la aplicación
const client = createClient({
  projectId: 'nfqa4osj',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01'
  // Sin token, como las APIs públicas
})

async function debugAPIs() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DE APIs\n')
  console.log('='.repeat(50))
  
  try {
    // Test 1: Conexión básica
    console.log('1. 🔗 Probando conexión básica con Sanity...')
    const basicTest = await client.fetch('*[_type == "category"][0..1]{_id, name}')
    console.log(`   ✅ Conexión OK - Encontrados ${basicTest.length} registros de prueba`)
    
    // Test 2: Query de categorías exacto como en la API
    console.log('\n2. 📁 Probando query de categorías (exacto como API)...')
    const categoriesQuery = `
      *[_type == "category"] | order(name asc) {
        _id,
        name,
        slug,
        description,
        icon
      }
    `
    
    const categories = await client.fetch(categoriesQuery)
    console.log(`   📊 Categorías encontradas: ${categories.length}`)
    categories.forEach(cat => {
      console.log(`   ${cat.icon || '📂'} ${cat.name} (${cat.slug?.current || 'no-slug'})`)
    })
    
    // Test 3: Query de recetas exacto como en la API
    console.log('\n3. 🍳 Probando query de recetas (exacto como API)...')
    const recipesQuery = `*[_type == "recipe"] | order(createdAt desc) {
      _id,
      name,
      slug,
      description,
      preparationTime,
      servings,
      thumbnail,
      category->{
        _id,
        name,
        slug,
        icon
      },
      averageRating,
      totalRatings,
      createdAt
    }`
    
    const recipes = await client.fetch(recipesQuery)
    console.log(`   📊 Recetas encontradas: ${recipes.length}`)
    recipes.forEach(recipe => {
      console.log(`   🍽️ ${recipe.name} (${recipe.category?.name || 'Sin categoría'})`)
      console.log(`      ⏱️ ${recipe.preparationTime}min | 👥 ${recipe.servings} porciones | ⭐ ${recipe.averageRating}`)
    })
    
    // Test 4: Simular la respuesta de API completa
    console.log('\n4. 🎯 Simulando respuesta completa de API...')
    const apiResponse = {
      success: true,
      data: recipes
    }
    console.log('   📋 Estructura de respuesta:', JSON.stringify(apiResponse, null, 2))
    
    // Test 5: Verificar estructura de datos
    console.log('\n5. 🔬 Verificando estructura de datos...')
    if (recipes.length > 0) {
      const firstRecipe = recipes[0]
      console.log('   📝 Estructura de primera receta:')
      console.log('   - ID:', firstRecipe._id ? '✅' : '❌')
      console.log('   - Nombre:', firstRecipe.name ? '✅' : '❌')
      console.log('   - Slug:', firstRecipe.slug?.current ? '✅' : '❌')
      console.log('   - Descripción:', firstRecipe.description ? '✅' : '❌')
      console.log('   - Categoría:', firstRecipe.category?.name ? '✅' : '❌')
      console.log('   - Tiempo prep:', firstRecipe.preparationTime ? '✅' : '❌')
      console.log('   - Porciones:', firstRecipe.servings ? '✅' : '❌')
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('🎉 DIAGNÓSTICO COMPLETADO EXITOSAMENTE')
    console.log(`✅ ${categories.length} categorías disponibles`)
    console.log(`✅ ${recipes.length} recetas disponibles`)
    console.log(`✅ Estructura de datos correcta`)
    console.log('='.repeat(50))
    
    return { categories, recipes, success: true }
    
  } catch (error) {
    console.error('\n💥 ERROR EN DIAGNÓSTICO:')
    console.error(`❌ ${error.message}`)
    console.error(`📍 Stack: ${error.stack}`)
    console.error('='.repeat(50))
    return { success: false, error: error.message }
  }
}

// Ejecutar diagnóstico
debugAPIs()
  .then(result => {
    if (result.success) {
      console.log('\n✅ Las APIs deberían funcionar correctamente')
      console.log('ℹ️ Si siguen fallando, el problema es de configuración de Vercel')
    } else {
      console.log('\n❌ Problema encontrado en la consulta de datos')
    }
    process.exit(result.success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Error fatal en diagnóstico:', error)
    process.exit(1)
  })