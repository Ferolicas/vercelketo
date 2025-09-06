#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Performance audit script for Planeta Keto
class PerformanceAuditor {
  constructor() {
    this.results = {
      bundleAnalysis: {},
      imageOptimization: {},
      cacheStrategy: {},
      webVitals: {},
      recommendations: []
    }
  }

  // Analyze JavaScript bundle sizes
  analyzeBundles() {
    console.log('📦 Analyzing bundle sizes...')
    
    const nextBuildPath = path.join(process.cwd(), '.next')
    if (!fs.existsSync(nextBuildPath)) {
      console.log('❌ No build found. Run "npm run build" first.')
      return
    }

    const staticPath = path.join(nextBuildPath, 'static')
    
    try {
      // Analyze chunks
      const chunks = this.findFiles(staticPath, '.js')
      const totalSize = chunks.reduce((acc, chunk) => {
        const stats = fs.statSync(chunk)
        return acc + stats.size
      }, 0)

      this.results.bundleAnalysis = {
        totalChunks: chunks.length,
        totalSize: Math.round(totalSize / 1024), // KB
        averageChunkSize: Math.round(totalSize / chunks.length / 1024), // KB
        largestChunks: chunks
          .map(chunk => ({
            name: path.basename(chunk),
            size: Math.round(fs.statSync(chunk).size / 1024) // KB
          }))
          .sort((a, b) => b.size - a.size)
          .slice(0, 5)
      }

      console.log(`  ✅ Total JS size: ${this.results.bundleAnalysis.totalSize}KB`)
      console.log(`  ✅ Number of chunks: ${this.results.bundleAnalysis.totalChunks}`)
      
    } catch (error) {
      console.log('❌ Bundle analysis failed:', error.message)
    }
  }

  // Check image optimization
  analyzeImages() {
    console.log('🖼️  Analyzing image optimization...')
    
    const publicPath = path.join(process.cwd(), 'public')
    const images = this.findFiles(publicPath, ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'])
    
    let totalSize = 0
    let unoptimizedCount = 0
    const largeImages = []
    
    images.forEach(imagePath => {
      const stats = fs.statSync(imagePath)
      const sizeKB = Math.round(stats.size / 1024)
      totalSize += sizeKB
      
      // Check for unoptimized formats
      if (imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg') || imagePath.endsWith('.png')) {
        unoptimizedCount++
      }
      
      // Flag large images (>500KB)
      if (sizeKB > 500) {
        largeImages.push({
          name: path.basename(imagePath),
          size: sizeKB,
          path: imagePath.replace(process.cwd(), '')
        })
      }
    })

    this.results.imageOptimization = {
      totalImages: images.length,
      totalSize: totalSize,
      unoptimizedImages: unoptimizedCount,
      largeImages: largeImages,
      webpUsage: images.filter(img => img.endsWith('.webp')).length,
      avifUsage: images.filter(img => img.endsWith('.avif')).length
    }

    console.log(`  ✅ Total images: ${images.length}`)
    console.log(`  ✅ Total image size: ${totalSize}KB`)
    console.log(`  ⚠️  Unoptimized images: ${unoptimizedCount}`)
  }

  // Analyze caching strategy
  analyzeCaching() {
    console.log('💾 Analyzing caching strategy...')
    
    const nextConfigPath = path.join(process.cwd(), 'next.config.ts')
    let hasHeaders = false
    let hasCacheControl = false
    
    if (fs.existsSync(nextConfigPath)) {
      const configContent = fs.readFileSync(nextConfigPath, 'utf8')
      hasHeaders = configContent.includes('async headers()')
      hasCacheControl = configContent.includes('Cache-Control')
    }

    this.results.cacheStrategy = {
      hasCustomHeaders: hasHeaders,
      hasCacheControl: hasCacheControl,
      serviceWorkerExists: fs.existsSync(path.join(process.cwd(), 'public', 'sw.js')),
      nextConfigOptimized: hasHeaders && hasCacheControl
    }

    console.log(`  ✅ Custom headers: ${hasHeaders ? 'Yes' : 'No'}`)
    console.log(`  ✅ Cache-Control: ${hasCacheControl ? 'Yes' : 'No'}`)
  }

  // Generate recommendations
  generateRecommendations() {
    console.log('💡 Generating recommendations...')
    
    const recommendations = []

    // Bundle size recommendations
    if (this.results.bundleAnalysis.totalSize > 1000) {
      recommendations.push({
        type: 'Bundle Optimization',
        priority: 'high',
        description: `Total bundle size is ${this.results.bundleAnalysis.totalSize}KB. Consider code splitting.`,
        action: 'Implement dynamic imports and lazy loading for non-critical components'
      })
    }

    // Image optimization recommendations
    if (this.results.imageOptimization.unoptimizedImages > 0) {
      recommendations.push({
        type: 'Image Optimization',
        priority: 'medium',
        description: `${this.results.imageOptimization.unoptimizedImages} images could use modern formats.`,
        action: 'Convert JPEG/PNG to WebP or AVIF format for better compression'
      })
    }

    if (this.results.imageOptimization.largeImages.length > 0) {
      recommendations.push({
        type: 'Large Images',
        priority: 'high',
        description: `Found ${this.results.imageOptimization.largeImages.length} images larger than 500KB.`,
        action: 'Optimize large images using next/image with quality settings'
      })
    }

    // Caching recommendations
    if (!this.results.cacheStrategy.serviceWorkerExists) {
      recommendations.push({
        type: 'Caching Strategy',
        priority: 'medium',
        description: 'No service worker found for advanced caching.',
        action: 'Implement service worker for better caching and offline support'
      })
    }

    this.results.recommendations = recommendations
    
    recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.type}: ${rec.description}`)
      console.log(`     Action: ${rec.action}`)
    })
  }

  // Find files by extension
  findFiles(dir, extensions, files = []) {
    if (!fs.existsSync(dir)) return files
    
    const entries = fs.readdirSync(dir)
    
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        this.findFiles(fullPath, extensions, files)
      } else {
        const ext = path.extname(entry).toLowerCase()
        const exts = Array.isArray(extensions) ? extensions : [extensions]
        
        if (exts.includes(ext)) {
          files.push(fullPath)
        }
      }
    })
    
    return files
  }

  // Run complete audit
  async runAudit() {
    console.log('🚀 Starting Planeta Keto Performance Audit...\n')
    
    this.analyzeBundles()
    this.analyzeImages()
    this.analyzeCaching()
    this.generateRecommendations()
    
    console.log('\n📊 Audit Summary:')
    console.log('==================')
    console.log(`Bundle Size: ${this.results.bundleAnalysis.totalSize || 0}KB`)
    console.log(`Images: ${this.results.imageOptimization.totalImages || 0} (${this.results.imageOptimization.totalSize || 0}KB)`)
    console.log(`Recommendations: ${this.results.recommendations.length}`)
    
    // Save results to file
    const resultsPath = path.join(process.cwd(), 'performance-audit-results.json')
    fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2))
    console.log(`\n💾 Detailed results saved to: ${resultsPath}`)
  }
}

// Run the audit
if (require.main === module) {
  const auditor = new PerformanceAuditor()
  auditor.runAudit()
}

module.exports = PerformanceAuditor