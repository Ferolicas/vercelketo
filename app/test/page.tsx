'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestPage() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    alert('Button works! Count: ' + (count + 1));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page - Next.js 15</h1>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={handleClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Test Button (Count: {count})
          </button>
        </div>
        
        <div>
          <Link href="/" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-block">
            Back to Home
          </Link>
        </div>
        
        <div>
          <Link href="/recetas" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded inline-block">
            Go to Recetas
          </Link>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold">Debug Info:</h2>
        <p>React hydrated: {typeof window !== 'undefined' ? 'Yes' : 'No'}</p>
        <p>Current count: {count}</p>
        <p>Next.js version: 15.3.3</p>
      </div>
    </div>
  );
}