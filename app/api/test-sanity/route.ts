import { NextRequest, NextResponse } from 'next/server'
import { writeClient, client } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  console.log('🧪 Testing Sanity connection...');
  
  try {
    // Test read operations
    console.log('📖 Testing read client...');
    const readResult = await client.fetch(`*[_type == "category"][0..2] { _id, name }`);
    console.log('✅ Read client working:', readResult.length, 'categories found');
    
    // Test write operations - create a simple test document
    console.log('✏️ Testing write client...');
    const testDoc = {
      _type: 'test',
      name: 'API Test',
      timestamp: new Date().toISOString()
    };
    
    const writeResult = await writeClient.create(testDoc);
    console.log('✅ Write client working, document created:', writeResult._id);
    
    // Clean up - delete the test document
    await writeClient.delete(writeResult._id);
    console.log('🗑️ Test document cleaned up');
    
    return NextResponse.json({
      success: true,
      message: 'Sanity connection test successful',
      readTest: { categoriesFound: readResult.length },
      writeTest: { documentCreated: writeResult._id }
    });
    
  } catch (error) {
    console.error('❌ Sanity connection test failed:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Sanity test failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    );
  }
}