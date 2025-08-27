// Test script to check API endpoints
const testAPIs = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing API endpoints...\n');
  
  // Test 1: Forum API POST
  console.log('1️⃣ Testing Forum API POST...');
  try {
    const forumResponse = await fetch(`${baseUrl}/api/forum`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Post',
        content: 'This is a test post',
        category: 'test',
        authorName: 'Test User',
        authorEmail: 'test@test.com',
        authorId: 'test_123',
        tags: []
      })
    });
    
    const forumResult = await forumResponse.text();
    console.log('Forum API Response Status:', forumResponse.status);
    console.log('Forum API Response:', forumResult);
  } catch (error) {
    console.error('Forum API Error:', error.message);
  }
  
  // Test 2: Recipes API GET
  console.log('\n2️⃣ Testing Recipes API GET...');
  try {
    const recipesResponse = await fetch(`${baseUrl}/api/recipes`);
    const recipesResult = await recipesResponse.json();
    console.log('Recipes API Status:', recipesResponse.status);
    console.log('Recipes API Response:', recipesResult);
  } catch (error) {
    console.error('Recipes API Error:', error.message);
  }
  
  // Test 3: Categories API GET
  console.log('\n3️⃣ Testing Categories API GET...');
  try {
    const categoriesResponse = await fetch(`${baseUrl}/api/categories`);
    const categoriesResult = await categoriesResponse.json();
    console.log('Categories API Status:', categoriesResponse.status);
    console.log('Categories API Response:', categoriesResult);
  } catch (error) {
    console.error('Categories API Error:', error.message);
  }
  
  // Test 4: Products API GET
  console.log('\n4️⃣ Testing Products API GET...');
  try {
    const productsResponse = await fetch(`${baseUrl}/api/products`);
    const productsResult = await productsResponse.json();
    console.log('Products API Status:', productsResponse.status);
    console.log('Products API Response:', productsResult);
  } catch (error) {
    console.error('Products API Error:', error.message);
  }
  
  // Test 5: Blog API GET
  console.log('\n5️⃣ Testing Blog API GET...');
  try {
    const blogResponse = await fetch(`${baseUrl}/api/blog`);
    const blogResult = await blogResponse.json();
    console.log('Blog API Status:', blogResponse.status);
    console.log('Blog API Response:', blogResult);
  } catch (error) {
    console.error('Blog API Error:', error.message);
  }
  
  // Test 6: Services API GET
  console.log('\n6️⃣ Testing Services API GET...');
  try {
    const servicesResponse = await fetch(`${baseUrl}/api/services`);
    const servicesResult = await servicesResponse.json();
    console.log('Services API Status:', servicesResponse.status);
    console.log('Services API Response:', servicesResult);
  } catch (error) {
    console.error('Services API Error:', error.message);
  }
};

// Run tests if this script is executed directly
if (require.main === module) {
  testAPIs().then(() => {
    console.log('\n✅ API testing completed');
    process.exit(0);
  }).catch(error => {
    console.error('❌ API testing failed:', error);
    process.exit(1);
  });
}

module.exports = { testAPIs };