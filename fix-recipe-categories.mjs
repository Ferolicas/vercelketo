// Script para arreglar las referencias de categorías en las recetas
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'nfqa4osj',
  dataset: 'production',
  useCdn: false,
  token: 'skzKvOdB6g2Z4PwweXAputGeI5jp1yWlbctKO5kFWAErpKrlwwYlf8sdiiPXcq9SJYXPoZn7ZLMSkNp4VPQ3Vq0KqmWlw9Tam9YHJIscOoXCKwBfS3wF7XvwZwtMF1eLvTKz02AvJ9lXqTDdVQ8BnX9GF6us6DsDljF38RrhjNtvJ6cLUKR5',
  apiVersion: '2024-01-01'
})

async function fixRecipeCategories() {
  console.log('🔧 Arreglando referencias de categorías en recetas...\n')
  
  try {
    // Obtener categorías
    const categories = await client.fetch('*[_type == "category"]{ _id, name, slug }')
    console.log(`📁 Categorías disponibles: ${categories.length}`)
    categories.forEach(cat => {
      console.log(`   ${cat.name} (${cat.slug.current}) - ID: ${cat._id}`)
    })
    
    // Obtener recetas sin categoría
    const recipes = await client.fetch('*[_type == "recipe"]{ _id, name, category }')
    console.log(`\n🍳 Recetas encontradas: ${recipes.length}`)
    
    const recipesWithoutCategory = recipes.filter(recipe => !recipe.category)
    console.log(`🔧 Recetas sin categoría: ${recipesWithoutCategory.length}`)
    
    // Mapear recetas a categorías basado en el nombre
    const recipeMapping = {
      'Huevos Revueltos Keto con Aguacate': 'desayuno',
      'Ensalada César Keto con Pollo': 'almuerzo', 
      'Salmón a la Plancha con Espárragos': 'cena',
      'Chips de Queso Parmesano Crujientes': 'aperitivo',
      'Mousse de Chocolate Keto': 'postre'
    }
    
    console.log('\n🔗 Asignando categorías...')
    let fixed = 0
    
    for (const recipe of recipesWithoutCategory) {
      const categorySlug = recipeMapping[recipe.name]
      
      if (!categorySlug) {
        console.log(`   ⚠️ No se encontró mapeo para: ${recipe.name}`)
        continue
      }
      
      const category = categories.find(c => c.slug.current === categorySlug)
      if (!category) {
        console.log(`   ⚠️ No se encontró categoría: ${categorySlug}`)
        continue
      }
      
      try {
        await client
          .patch(recipe._id)
          .set({
            category: {
              _ref: category._id,
              _type: 'reference'
            }
          })
          .commit()
        
        console.log(`   ✅ ${recipe.name} → ${category.name}`)
        fixed++
        
        // Pausa para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 300))
        
      } catch (error) {
        console.log(`   ❌ Error actualizando ${recipe.name}: ${error.message}`)
      }
    }
    
    console.log(`\n📊 Recetas actualizadas: ${fixed}/${recipesWithoutCategory.length}`)
    
    // Verificación final
    console.log('\n🔍 Verificación final...')
    const updatedRecipes = await client.fetch(`*[_type == "recipe"] {
      _id,
      name,
      category->{
        _id,
        name,
        slug
      }
    }`)
    
    console.log('\n📋 Estado final de recetas:')
    updatedRecipes.forEach((recipe, index) => {
      const categoryName = recipe.category?.name || 'SIN CATEGORÍA'
      const status = recipe.category ? '✅' : '❌'
      console.log(`   ${index + 1}. ${status} ${recipe.name} → ${categoryName}`)
    })
    
    const recipesWithCategory = updatedRecipes.filter(r => r.category)
    console.log(`\n🎯 Resultado: ${recipesWithCategory.length}/${updatedRecipes.length} recetas con categoría`)
    
    return recipesWithCategory.length === updatedRecipes.length
    
  } catch (error) {
    console.error('❌ Error arreglando categorías:', error.message)
    return false
  }
}

// Ejecutar
fixRecipeCategories()
  .then(success => {
    console.log('\n' + '='.repeat(50))
    if (success) {
      console.log('🎉 ¡REFERENCIAS ARREGLADAS EXITOSAMENTE!')
      console.log('✅ Todas las recetas ahora tienen categoría asignada')
      console.log('✅ La página de recetas debería funcionar correctamente')
    } else {
      console.log('⚠️ Algunas referencias no se pudieron arreglar')
      console.log('ℹ️ Pero la mayoría debería estar funcionando')
    }
    console.log('='.repeat(50))
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })