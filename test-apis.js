// Test para verificar que las APIs funcionen correctamente
const testAPIs = async () => {
  console.log('🧪 Testing APIs locally...');

  try {
    // Test categories API
    console.log('\n1. Testing /api/categories...');
    const categoriesRes = await fetch('http://localhost:3001/api/categories');
    const categoriesData = await categoriesRes.json();
    
    if (categoriesData.success) {
      console.log(`✅ Categories API works: ${categoriesData.data.length} categories`);
      categoriesData.data.forEach(cat => {
        console.log(`  - ${cat.icon} ${cat.name} (${cat._id})`);
      });
    } else {
      console.log('❌ Categories API failed:', categoriesData.error);
    }

    // Test recipes API  
    console.log('\n2. Testing /api/recipes...');
    const recipesRes = await fetch('http://localhost:3001/api/recipes');
    const recipesData = await recipesRes.json();
    
    if (recipesData.success) {
      console.log(`✅ Recipes API works: ${recipesData.data.length} recipes`);
      recipesData.data.slice(0, 3).forEach(recipe => {
        console.log(`  - ${recipe.name} (${recipe.category?.name || 'No category'})`);
      });
    } else {
      console.log('❌ Recipes API failed:', recipesData.error);
    }

    console.log('\n🎉 API tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Only run if being called directly
if (typeof window === 'undefined' && require.main === module) {
  testAPIs();
}