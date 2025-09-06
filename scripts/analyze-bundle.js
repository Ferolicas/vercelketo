#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Bundle analysis script for Planeta Keto
console.log('🔍 Analyzing Planeta Keto bundle sizes...\n');

// Step 1: Build with bundle analyzer
console.log('📦 Building with bundle analyzer...');
try {
  execSync('npm run build', { 
    stdio: 'inherit',
    env: { ...process.env, ANALYZE: 'true' }
  });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Analyze static chunks
console.log('\n📊 Analyzing static chunks...');
const staticDir = path.join(__dirname, '../.next/static/chunks');

if (fs.existsSync(staticDir)) {
  const chunks = fs.readdirSync(staticDir)
    .filter(file => file.endsWith('.js'))
    .map(file => {
      const fullPath = path.join(staticDir, file);
      const stats = fs.statSync(fullPath);
      return {
        name: file,
        size: stats.size,
        sizeKB: Math.round(stats.size / 1024)
      };
    })
    .sort((a, b) => b.size - a.size);

  console.log('\n🚀 Top 10 largest chunks:');
  chunks.slice(0, 10).forEach((chunk, index) => {
    const emoji = index === 0 ? '🔴' : index < 3 ? '🟡' : '🟢';
    console.log(`${emoji} ${chunk.name}: ${chunk.sizeKB}KB`);
  });

  // Flag problematic chunks (>100KB)
  const largeChunks = chunks.filter(chunk => chunk.sizeKB > 100);
  if (largeChunks.length > 0) {
    console.log('\n⚠️  Large chunks detected (>100KB):');
    largeChunks.forEach(chunk => {
      console.log(`   - ${chunk.name}: ${chunk.sizeKB}KB`);
    });
  }
} else {
  console.log('❌ Static chunks directory not found');
}

// Step 3: Check for unused dependencies
console.log('\n🔍 Checking for potential optimizations...');

const packageJson = require('../package.json');
const dependencies = Object.keys(packageJson.dependencies);

// Check for potentially removable dependencies
const heavyDeps = [
  'framer-motion',
  'canvas-confetti',
  '@sanity/ui',
  'styled-components'
];

const foundHeavyDeps = heavyDeps.filter(dep => dependencies.includes(dep));
if (foundHeavyDeps.length > 0) {
  console.log('\n💡 Consider optimizing these heavy dependencies:');
  foundHeavyDeps.forEach(dep => {
    console.log(`   - ${dep}: Consider dynamic imports or alternatives`);
  });
}

// Performance recommendations
console.log('\n✨ Performance Recommendations:');
console.log('1. 🎯 Use dynamic imports for admin components');
console.log('2. 📦 Split vendor bundles with webpack optimization');
console.log('3. 🖼️  Optimize images with next/image and WebP');
console.log('4. ⚡ Implement code splitting for routes');
console.log('5. 🧹 Remove unused dependencies and code');

console.log('\n✅ Bundle analysis complete!');