'use client';

import { useEffect, useState } from 'react';
import { client } from '@/lib/sanity';

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export default function TestSanityPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testSanity = async () => {
      const testResults: TestResult[] = [];
      
      // Test 1: Basic connection
      try {
        const basicQuery = '*[_type == "post"][0..2] { _id, title }';
        const posts = await client.fetch(basicQuery);
        testResults.push({
          success: true,
          message: `✅ Conexión básica OK - ${posts.length} posts encontrados`,
          data: posts
        });
      } catch (error) {
        testResults.push({
          success: false,
          message: '❌ Error en conexión básica',
          error: error instanceof Error ? error.message : String(error)
        });
      }

      // Test 2: Categories
      try {
        const categoriesQuery = '*[_type == "category"] { _id, title }';
        const categories = await client.fetch(categoriesQuery);
        testResults.push({
          success: true,
          message: `✅ Categorías OK - ${categories.length} categorías encontradas`,
          data: categories
        });
      } catch (error) {
        testResults.push({
          success: false,
          message: '❌ Error en categorías',
          error: error instanceof Error ? error.message : String(error)
        });
      }

      // Test 3: Full query
      try {
        const fullQuery = `*[_type == "post"] | order(publishedAt desc) {
          _id,
          title,
          slug,
          "mainImage": coalesce(mainImage, image),
          category->{
            _id,
            title,
            slug
          }
        }`;
        const fullPosts = await client.fetch(fullQuery);
        testResults.push({
          success: true,
          message: `✅ Query completa OK - ${fullPosts.length} posts con detalles`,
          data: fullPosts.slice(0, 2)
        });
      } catch (error) {
        testResults.push({
          success: false,
          message: '❌ Error en query completa',
          error: error instanceof Error ? error.message : String(error)
        });
      }

      setResults(testResults);
      setLoading(false);
    };

    testSanity();
  }, []);

  if (loading) {
    return <div className="p-8">🔄 Testando conexión con Sanity...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🔍 Test de Conexión Sanity</h1>
      
      <div className="space-y-6">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <h3 className="font-bold mb-2">{result.message}</h3>
            
            {result.error && (
              <div className="text-red-600 text-sm mb-2">
                <strong>Error:</strong> {result.error}
              </div>
            )}
            
            {result.data && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-gray-600">
                  Ver datos (click para expandir)
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold text-blue-800 mb-2">ℹ️ Variables de entorno:</h3>
        <div className="text-sm space-y-1">
          <div>PROJECT_ID: {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '❌ No definido'}</div>
          <div>DATASET: {process.env.NEXT_PUBLIC_SANITY_DATASET || '❌ No definido'}</div>
          <div>API_VERSION: {process.env.NEXT_PUBLIC_SANITY_API_VERSION || '❌ No definido'}</div>
          <div>NODE_ENV: {process.env.NODE_ENV}</div>
        </div>
      </div>
    </div>
  );
}