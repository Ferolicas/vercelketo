// Script para recrear las recetas con referencias de categoría correctas
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'nfqa4osj',
  dataset: 'production',
  useCdn: false,
  token: 'skzKvOdB6g2Z4PwweXAputGeI5jp1yWlbctKO5kFWAErpKrlwwYlf8sdiiPXcq9SJYXPoZn7ZLMSkNp4VPQ3Vq0KqmWlw9Tam9YHJIscOoXCKwBfS3wF7XvwZwtMF1eLvTKz02AvJ9lXqTDdVQ8BnX9GF6us6DsDljF38RrhjNtvJ6cLUKR5',
  apiVersion: '2024-01-01'
})

const recipesData = [
  {
    name: 'Huevos Revueltos Keto con Aguacate',
    slug: 'huevos-revueltos-keto-aguacate',
    categorySlug: 'desayuno',
    description: 'Desayuno keto cremoso y nutritivo con huevos revueltos y aguacate fresco. Rico en grasas saludables y proteínas.',
    ingredients: [
      '3 huevos grandes',
      '1 aguacate maduro',
      '2 cucharadas de mantequilla',
      '2 cucharadas de queso crema',
      'Sal y pimienta al gusto',
      'Cebollino fresco picado'
    ],
    preparation: 'Batir los huevos con sal y pimienta. Calentar mantequilla en sartén a fuego medio. Agregar huevos y revolver suavemente hasta que estén cremosos. Retirar del fuego, agregar queso crema y mezclar. Servir con aguacate en rodajas y cebollino.',
    preparationTime: 10,
    servings: 2,
    averageRating: 4.8,
    totalRatings: 24
  },
  {
    name: 'Ensalada César Keto con Pollo',
    slug: 'ensalada-cesar-keto-pollo',
    categorySlug: 'almuerzo',
    description: 'Clásica ensalada César adaptada para keto, con pollo a la plancha y aderezo casero sin carbohidratos.',
    ingredients: [
      '200g pechuga de pollo',
      '150g lechuga romana',
      '50g queso parmesano',
      '3 cucharadas de mayonesa',
      '1 cucharada de mostaza Dijon',
      '2 filetes de anchoa',
      '1 diente de ajo',
      'Jugo de medio limón'
    ],
    preparation: 'Cocinar el pollo a la plancha y cortar en tiras. Mezclar mayonesa, mostaza, ajo machacado, anchoas y limón para el aderezo. Cortar lechuga romana, mezclar con aderezo, agregar pollo y espolvorear con parmesano.',
    preparationTime: 20,
    servings: 2,
    averageRating: 4.6,
    totalRatings: 18
  },
  {
    name: 'Salmón a la Plancha con Espárragos',
    slug: 'salmon-plancha-esparragos',
    categorySlug: 'cena',
    description: 'Cena elegante y nutritiva con salmón rico en omega-3 acompañado de espárragos tiernos.',
    ingredients: [
      '200g filete de salmón',
      '200g espárragos frescos',
      '2 cucharadas de aceite de oliva',
      '1 limón',
      '2 dientes de ajo',
      'Sal marina y pimienta',
      'Mantequilla con hierbas'
    ],
    preparation: 'Sazonar el salmón con sal y pimienta. Calentar aceite en sartén y cocinar salmón 4 min por lado. En otra sartén, saltear espárragos con ajo. Servir con mantequilla de hierbas y limón.',
    preparationTime: 25,
    servings: 2,
    averageRating: 4.9,
    totalRatings: 32
  },
  {
    name: 'Chips de Queso Parmesano Crujientes',
    slug: 'chips-queso-parmesano',
    categorySlug: 'aperitivo',
    description: 'Snack keto crujiente y sabroso hecho con queso parmesano. Perfecto para picar entre comidas.',
    ingredients: [
      '200g queso parmesano rallado',
      '1 cucharadita de orégano seco',
      '1/2 cucharadita de ajo en polvo',
      'Pimienta negra molida',
      'Paprika opcional'
    ],
    preparation: 'Precalentar horno a 200°C. Formar montoncitos de queso parmesano en bandeja con papel pergamino. Espolvorear con especias. Hornear 5-7 minutos hasta dorar. Dejar enfriar para que se pongan crujientes.',
    preparationTime: 15,
    servings: 4,
    averageRating: 4.7,
    totalRatings: 28
  },
  {
    name: 'Mousse de Chocolate Keto',
    slug: 'mousse-chocolate-keto',
    categorySlug: 'postre',
    description: 'Postre cremoso y decadente sin azúcar, endulzado con eritritol. Perfecto final para cualquier comida keto.',
    ingredients: [
      '200ml crema para batir',
      '100g chocolate negro 85%',
      '60g eritritol',
      '3 yemas de huevo',
      '1 cucharadita de extracto de vainilla',
      'Pizca de sal'
    ],
    preparation: 'Derretir chocolate a baño maría. Batir crema hasta punto de nieve. En otro bol, batir yemas con eritritol hasta blanquear. Incorporar chocolate tibio a las yemas, luego la crema batida suavemente. Refrigerar 2 horas.',
    preparationTime: 30,
    servings: 4,
    averageRating: 4.8,
    totalRatings: 35
  }
]

async function recreateRecipesWithCategories() {
  console.log('🔄 Recreando recetas con referencias de categoría correctas...\n')
  
  try {
    // 1. Obtener categorías actuales
    const categories = await client.fetch('*[_type == "category"]{ _id, name, slug }')
    console.log(`📁 Categorías disponibles: ${categories.length}`)
    
    if (categories.length === 0) {
      console.log('❌ No hay categorías disponibles. Crear categorías primero.')
      return false
    }
    
    categories.forEach(cat => {
      console.log(`   ${cat.name} (${cat.slug.current}) - ID: ${cat._id}`)
    })
    
    // 2. Eliminar recetas actuales
    console.log('\n🗑️ Eliminando recetas actuales...')
    const currentRecipes = await client.fetch('*[_type == "recipe"]{ _id }')
    console.log(`   Encontradas ${currentRecipes.length} recetas para eliminar`)
    
    for (const recipe of currentRecipes) {
      await client.delete(recipe._id)
      console.log(`   ❌ Eliminada receta: ${recipe._id}`)
    }
    
    // 3. Crear nuevas recetas con categorías
    console.log('\n✨ Creando recetas con referencias correctas...')
    let created = 0
    
    for (const recipeData of recipesData) {
      const category = categories.find(c => c.slug.current === recipeData.categorySlug)
      
      if (!category) {
        console.log(`   ⚠️ Categoría no encontrada: ${recipeData.categorySlug}`)
        continue
      }
      
      const recipeDoc = {
        _type: 'recipe',
        name: recipeData.name,
        slug: {
          _type: 'slug',
          current: recipeData.slug
        },
        description: recipeData.description,
        ingredients: recipeData.ingredients,
        preparation: recipeData.preparation,
        preparationTime: recipeData.preparationTime,
        servings: recipeData.servings,
        category: {
          _type: 'reference',
          _ref: category._id
        },
        averageRating: recipeData.averageRating,
        totalRatings: recipeData.totalRatings,
        createdAt: new Date().toISOString(),
        thumbnail: null // Se agregará después si es necesario
      }
      
      try {
        const result = await client.create(recipeDoc)
        console.log(`   ✅ ${recipeData.name} → ${category.name} (ID: ${result._id})`)
        created++
        
        // Pausa para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 200))
        
      } catch (error) {
        console.log(`   ❌ Error creando ${recipeData.name}: ${error.message}`)
      }
    }
    
    console.log(`\n📊 Recetas creadas: ${created}/${recipesData.length}`)
    
    // 4. Verificación final con referencias
    console.log('\n🔍 Verificación final con referencias...')
    const finalRecipes = await client.fetch(`*[_type == "recipe"] {
      _id,
      name,
      category->{
        _id,
        name,
        slug
      }
    } | order(name asc)`)
    
    console.log('\n📋 Estado final de recetas:')
    finalRecipes.forEach((recipe, index) => {
      const categoryName = recipe.category?.name || 'SIN CATEGORÍA'
      const status = recipe.category ? '✅' : '❌'
      console.log(`   ${index + 1}. ${status} ${recipe.name} → ${categoryName}`)
    })
    
    const recipesWithCategory = finalRecipes.filter(r => r.category)
    console.log(`\n🎯 Resultado: ${recipesWithCategory.length}/${finalRecipes.length} recetas con categoría`)
    
    return recipesWithCategory.length === finalRecipes.length
    
  } catch (error) {
    console.error('❌ Error recreando recetas:', error.message)
    return false
  }
}

// Ejecutar
recreateRecipesWithCategories()
  .then(success => {
    console.log('\n' + '='.repeat(50))
    if (success) {
      console.log('🎉 ¡RECETAS RECREADAS EXITOSAMENTE!')
      console.log('✅ Todas las recetas tienen categoría correcta')
      console.log('✅ Las APIs deberían funcionar perfectamente')
    } else {
      console.log('⚠️ Algunas recetas no se pudieron recrear')
    }
    console.log('='.repeat(50))
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })