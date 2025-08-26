// Script para crear recetas de ejemplo en cada categoría
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'nfqa4osj',
  dataset: 'production',
  useCdn: false,
  token: 'skzKvOdB6g2Z4PwweXAputGeI5jp1yWlbctKO5kFWAErpKrlwwYlf8sdiiPXcq9SJYXPoZn7ZLMSkNp4VPQ3Vq0KqmWlw9Tam9YHJIscOoXCKwBfS3wF7XvwZwtMF1eLvTKz02AvJ9lXqTDdVQ8BnX9GF6us6DsDljF38RrhjNtvJ6cLUKR5',
  apiVersion: '2024-01-01'
})

async function createSampleRecipes() {
  console.log('🍳 Creando recetas de ejemplo para cada categoría...\n')
  
  try {
    // Obtener las categorías actuales
    const categories = await client.fetch('*[_type == "category"]{ _id, name, slug }')
    console.log(`📊 Categorías disponibles: ${categories.length}`)
    
    const sampleRecipes = [
      // Desayuno
      {
        _type: 'recipe',
        name: 'Huevos Revueltos Keto con Aguacate',
        slug: { current: 'huevos-revueltos-keto-aguacate', _type: 'slug' },
        description: 'Un desayuno cremoso y nutritivo perfecto para empezar el día con energía. Rico en grasas saludables y proteínas.',
        ingredients: [
          '3 huevos frescos',
          '1 aguacate maduro',
          '2 cucharadas de mantequilla',
          '2 cucharadas de queso crema',
          'Sal y pimienta al gusto',
          'Cebollín picado para decorar'
        ],
        preparation: 'Paso 1: Bate los huevos en un bowl con sal y pimienta.\nPaso 2: Calienta la mantequilla en una sartén a fuego medio.\nPaso 3: Agrega los huevos batidos y revuelve constantemente.\nPaso 4: Cuando estén casi listos, añade el queso crema.\nPaso 5: Sirve con aguacate en rodajas y cebollín.',
        preparationTime: 10,
        servings: 2,
        averageRating: 4.8,
        totalRatings: 124,
        category: categories.find(c => c.slug.current === 'desayuno')?._id
      },
      // Almuerzo
      {
        _type: 'recipe',
        name: 'Ensalada César Keto con Pollo',
        slug: { current: 'ensalada-cesar-keto-pollo', _type: 'slug' },
        description: 'Una versión keto de la clásica ensalada César, con pollo a la plancha y aderezo casero sin carbohidratos.',
        ingredients: [
          '200g de pechuga de pollo',
          '150g de lechuga romana',
          '50g de queso parmesano rallado',
          '3 cucharadas de mayonesa keto',
          '1 cucharada de mostaza Dijon',
          '2 dientes de ajo picados',
          'Jugo de 1/2 limón',
          'Aceite de oliva extra virgen'
        ],
        preparation: 'Paso 1: Sazona y cocina el pollo a la plancha hasta dorar.\nPaso 2: Corta la lechuga en trozos grandes.\nPaso 3: Mezcla mayonesa, mostaza, ajo y limón para el aderezo.\nPaso 4: Combina la lechuga con el aderezo.\nPaso 5: Añade el pollo en tiras y el queso parmesano.',
        preparationTime: 20,
        servings: 2,
        averageRating: 4.6,
        totalRatings: 89,
        category: categories.find(c => c.slug.current === 'almuerzo')?._id
      },
      // Cena
      {
        _type: 'recipe',
        name: 'Salmón a la Plancha con Espárragos',
        slug: { current: 'salmon-plancha-esparragos', _type: 'slug' },
        description: 'Una cena ligera pero nutritiva con salmón rico en omega-3 y espárragos frescos, perfecta para cerrar el día.',
        ingredients: [
          '2 filetes de salmón (150g c/u)',
          '300g de espárragos frescos',
          '3 cucharadas de aceite de oliva',
          '2 cucharadas de mantequilla',
          '2 dientes de ajo laminados',
          'Jugo de 1 limón',
          'Sal marina y pimienta negra',
          'Eneldo fresco para decorar'
        ],
        preparation: 'Paso 1: Sazona los filetes de salmón con sal y pimienta.\nPaso 2: Cocina el salmón en aceite de oliva, 4 minutos por lado.\nPaso 3: Saltea los espárragos con mantequilla y ajo.\nPaso 4: Rocía con jugo de limón al servir.\nPaso 5: Decora con eneldo fresco.',
        preparationTime: 15,
        servings: 2,
        averageRating: 4.9,
        totalRatings: 156,
        category: categories.find(c => c.slug.current === 'cena')?._id
      },
      // Aperitivo
      {
        _type: 'recipe',
        name: 'Chips de Queso Parmesano Crujientes',
        slug: { current: 'chips-queso-parmesano-crujientes', _type: 'slug' },
        description: 'Snack crujiente y adictivo hecho solo con queso parmesano. Perfecto para satisfacer antojos sin salir de cetosis.',
        ingredients: [
          '200g de queso parmesano rallado grueso',
          '1 cucharadita de orégano seco',
          '1/2 cucharadita de pimentón dulce',
          'Pimienta negra molida al gusto'
        ],
        preparation: 'Paso 1: Precalienta el horno a 200°C.\nPaso 2: Mezcla el queso con las especias.\nPaso 3: Forma montoncitos en bandeja con papel hornear.\nPaso 4: Hornea 8-10 minutos hasta dorar.\nPaso 5: Deja enfriar para que se pongan crujientes.',
        preparationTime: 15,
        servings: 4,
        averageRating: 4.7,
        totalRatings: 203,
        category: categories.find(c => c.slug.current === 'aperitivo')?._id
      },
      // Postre
      {
        _type: 'recipe',
        name: 'Mousse de Chocolate Keto',
        slug: { current: 'mousse-chocolate-keto', _type: 'slug' },
        description: 'Un postre cremoso y decadente sin azúcar, endulzado con eritritol y rico en chocolate negro. ¡Imposible resistirse!',
        ingredients: [
          '200g de chocolate negro 85%',
          '300ml de crema de leche para batir',
          '3 yemas de huevo',
          '60g de eritritol',
          '1 cucharadita de extracto de vainilla',
          'Una pizca de sal marina',
          'Cacao en polvo para decorar'
        ],
        preparation: 'Paso 1: Derrite el chocolate a baño maría.\nPaso 2: Bate las yemas con eritritol hasta blanquear.\nPaso 3: Incorpora el chocolate tibio a las yemas.\nPaso 4: Bate la crema hasta formar picos suaves.\nPaso 5: Incorpora la crema con movimientos envolventes.\nPaso 6: Refrigera 4 horas antes de servir.',
        preparationTime: 30,
        servings: 6,
        averageRating: 4.9,
        totalRatings: 178,
        category: categories.find(c => c.slug.current === 'postre')?._id
      }
    ]
    
    console.log('\n🏗️ Creando recetas...')
    let created = 0
    
    for (const recipe of sampleRecipes) {
      if (!recipe.category) {
        console.log(`   ⚠️ No se encontró categoría para: ${recipe.name}`)
        continue
      }
      
      try {
        const result = await client.create(recipe)
        console.log(`   ✅ ${recipe.name} creada - ID: ${result._id}`)
        created++
        
        // Pausa entre creaciones
        await new Promise(resolve => setTimeout(resolve, 300))
      } catch (error) {
        console.log(`   ❌ Error creando ${recipe.name}: ${error.message}`)
      }
    }
    
    console.log(`\n📊 Recetas creadas: ${created}/${sampleRecipes.length}`)
    
    // Verificación final
    console.log('\n🔍 Verificando resultado...')
    const finalRecipes = await client.fetch('*[_type == "recipe"]{ name, category->name }')
    
    console.log(`\n✅ Total de recetas en DB: ${finalRecipes.length}`)
    finalRecipes.forEach((recipe, index) => {
      console.log(`   ${index + 1}. ${recipe.name} (${recipe.category?.name || 'Sin categoría'})`)
    })
    
    return created === sampleRecipes.length
    
  } catch (error) {
    console.error('❌ Error creando recetas:', error.message)
    return false
  }
}

// Ejecutar
createSampleRecipes()
  .then(success => {
    console.log('\n' + '='.repeat(60))
    if (success) {
      console.log('🎉 ¡RECETAS DE EJEMPLO CREADAS EXITOSAMENTE!')
      console.log('✅ Ahora la página de recetas debería cargar correctamente')
    } else {
      console.log('⚠️ Algunas recetas no se pudieron crear')
      console.log('ℹ️ Pero debería haber suficientes para probar el sistema')
    }
    console.log('='.repeat(60))
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })