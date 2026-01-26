import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { gzipSync } from 'zlib';

// Bundle analysis data structure
interface BundleChunk {
  name: string;
  size: number;
  gzippedSize: number;
  modules: string[];
  type: 'initial' | 'async' | 'runtime';
}

interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: BundleChunk[];
  assets: Array<{
    name: string;
    size: number;
    type: string;
  }>;
  timestamp: number;
  buildId: string;
}

// Cache for bundle analysis results
let cachedAnalysis: BundleAnalysis | null = null;
let lastAnalysisTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    // Check if we have cached results
    const now = Date.now();
    if (cachedAnalysis && (now - lastAnalysisTime) < CACHE_DURATION) {
      return NextResponse.json(cachedAnalysis);
    }

    // Perform bundle analysis
    const analysis = await analyzeBundles();
    
    // Cache the results
    cachedAnalysis = analysis;
    lastAnalysisTime = now;

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Bundle analysis failed:', error);
    return NextResponse.json(
      { error: 'Failed to analyze bundles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'clear-cache') {
      cachedAnalysis = null;
      lastAnalysisTime = 0;
      return NextResponse.json({ success: true, message: 'Cache cleared' });
    }
    
    if (action === 'force-analysis') {
      const analysis = await analyzeBundles();
      cachedAnalysis = analysis;
      lastAnalysisTime = Date.now();
      return NextResponse.json(analysis);
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Bundle analysis POST failed:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

async function analyzeBundles(): Promise<BundleAnalysis> {
  const buildDir = path.join(process.cwd(), '.next');
  const staticDir = path.join(buildDir, 'static');
  
  try {
    // Check if build directory exists
    await fs.access(buildDir);
  } catch {
    // Return mock data for development
    return {
      totalSize: 0,
      gzippedSize: 0,
      chunks: [],
      assets: [],
      timestamp: Date.now(),
      buildId: 'development',
    };
  }

  const chunks: BundleChunk[] = [];
  const assets: Array<{ name: string; size: number; type: string }> = [];
  let totalSize = 0;
  let gzippedSize = 0;

  try {
    // Read build manifest
    const buildManifestPath = path.join(buildDir, 'build-manifest.json');
    let buildManifest: any = {};
    
    try {
      const buildManifestContent = await fs.readFile(buildManifestPath, 'utf-8');
      buildManifest = JSON.parse(buildManifestContent);
    } catch {
      // Build manifest not found, continue with file system analysis
    }

    // Analyze static files
    const staticFiles = await getStaticFiles(staticDir);
    
    for (const file of staticFiles) {
      const filePath = path.join(staticDir, file);
      const stats = await fs.stat(filePath);
      const content = await fs.readFile(filePath);
      const gzipped = gzipSync(content);
      
      const fileSize = stats.size;
      const gzippedFileSize = gzipped.length;
      
      totalSize += fileSize;
      gzippedSize += gzippedFileSize;
      
      // Categorize files
      const fileType = getFileType(file);
      const chunkType = getChunkType(file);
      
      if (fileType === 'js' || fileType === 'css') {
        chunks.push({
          name: file,
          size: fileSize,
          gzippedSize: gzippedFileSize,
          modules: await extractModules(filePath, fileType),
          type: chunkType,
        });
      } else {
        assets.push({
          name: file,
          size: fileSize,
          type: fileType,
        });
      }
    }

    // Sort chunks by size (largest first)
    chunks.sort((a, b) => b.size - a.size);
    assets.sort((a, b) => b.size - a.size);

    return {
      totalSize,
      gzippedSize,
      chunks,
      assets,
      timestamp: Date.now(),
      buildId: await getBuildId(),
    };
  } catch (error) {
    console.error('Error analyzing bundles:', error);
    throw error;
  }
}

async function getStaticFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subFiles = await getStaticFiles(path.join(dir, entry.name));
        files.push(...subFiles.map(f => path.join(entry.name, f)));
      } else {
        files.push(entry.name);
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }
  
  return files;
}

function getFileType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  
  switch (ext) {
    case '.js':
      return 'js';
    case '.css':
      return 'css';
    case '.map':
      return 'sourcemap';
    case '.woff':
    case '.woff2':
    case '.ttf':
    case '.eot':
      return 'font';
    case '.png':
    case '.jpg':
    case '.jpeg':
    case '.gif':
    case '.svg':
    case '.webp':
      return 'image';
    default:
      return 'other';
  }
}

function getChunkType(filename: string): 'initial' | 'async' | 'runtime' {
  if (filename.includes('runtime')) {
    return 'runtime';
  }
  if (filename.includes('chunks/pages/') || filename.includes('chunks/app/')) {
    return 'async';
  }
  return 'initial';
}

async function extractModules(filePath: string, fileType: string): Promise<string[]> {
  try {
    if (fileType !== 'js') {
      return [];
    }
    
    const content = await fs.readFile(filePath, 'utf-8');
    const modules: string[] = [];
    
    // Extract webpack module names (simplified)
    const moduleRegex = /\/\*\*\* (.*?) \*\*\*/g;
    let match;
    
    while ((match = moduleRegex.exec(content)) !== null) {
      const moduleName = match[1];
      if (moduleName && !modules.includes(moduleName)) {
        modules.push(moduleName);
      }
    }
    
    // Extract import statements
    const importRegex = /import.*?from ['"]([^'"]+)['"]/g;
    while ((match = importRegex.exec(content)) !== null) {
      const importName = match[1];
      if (importName && !modules.includes(importName)) {
        modules.push(importName);
      }
    }
    
    return modules.slice(0, 20); // Limit to first 20 modules
  } catch {
    return [];
  }
}

async function getBuildId(): Promise<string> {
  try {
    const buildIdPath = path.join(process.cwd(), '.next', 'BUILD_ID');
    const buildId = await fs.readFile(buildIdPath, 'utf-8');
    return buildId.trim();
  } catch {
    return 'unknown';
  }
}

// Additional endpoint for bundle optimization suggestions
export async function PUT(request: NextRequest) {
  try {
    const analysis = await analyzeBundles();
    const suggestions = generateOptimizationSuggestions(analysis);
    
    return NextResponse.json({
      analysis,
      suggestions,
    });
  } catch (error) {
    console.error('Bundle optimization analysis failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate optimization suggestions' },
      { status: 500 }
    );
  }
}

function generateOptimizationSuggestions(analysis: BundleAnalysis) {
  const suggestions: Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
    impact: 'high' | 'medium' | 'low';
    action?: string;
  }> = [];
  
  // Check total bundle size
  const totalSizeMB = analysis.totalSize / (1024 * 1024);
  if (totalSizeMB > 5) {
    suggestions.push({
      type: 'error',
      message: `Total bundle size is ${totalSizeMB.toFixed(2)}MB, which is very large`,
      impact: 'high',
      action: 'Consider code splitting and lazy loading'
    });
  } else if (totalSizeMB > 2) {
    suggestions.push({
      type: 'warning',
      message: `Total bundle size is ${totalSizeMB.toFixed(2)}MB, consider optimization`,
      impact: 'medium',
      action: 'Review large dependencies and implement tree shaking'
    });
  }
  
  // Check individual chunk sizes
  const largeChunks = analysis.chunks.filter(chunk => chunk.size > 500 * 1024);
  if (largeChunks.length > 0) {
    suggestions.push({
      type: 'warning',
      message: `${largeChunks.length} chunks are larger than 500KB`,
      impact: 'medium',
      action: 'Split large chunks or lazy load components'
    });
  }
  
  // Check compression ratio
  const compressionRatio = analysis.gzippedSize / analysis.totalSize;
  if (compressionRatio > 0.7) {
    suggestions.push({
      type: 'info',
      message: 'Poor compression ratio detected',
      impact: 'low',
      action: 'Consider using more compressible code patterns'
    });
  }
  
  // Check for duplicate modules
  const allModules = analysis.chunks.flatMap(chunk => chunk.modules);
  const duplicateModules = allModules.filter((module, index) => 
    allModules.indexOf(module) !== index
  );
  
  if (duplicateModules.length > 0) {
    suggestions.push({
      type: 'warning',
      message: `${duplicateModules.length} duplicate modules detected`,
      impact: 'medium',
      action: 'Configure webpack to deduplicate modules'
    });
  }
  
  return suggestions;
}