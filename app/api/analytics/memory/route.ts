import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Memory usage data structure
interface MemoryMetric {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  timestamp: number;
  url?: string;
  userAgent?: string;
  sessionId?: string;
  userId?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  usagePercentage: number;
  memoryPressure: 'low' | 'medium' | 'high' | 'critical';
}

interface MemoryReport {
  metrics: MemoryMetric[];
  summary: {
    totalSamples: number;
    averageUsage: number;
    peakUsage: number;
    memoryLeaks: MemoryLeak[];
    pressureDistribution: Record<string, number>;
    trends: {
      increasing: boolean;
      rate: number; // MB per hour
    };
  };
  timestamp: number;
}

interface MemoryLeak {
  startTime: number;
  endTime: number;
  growthRate: number; // MB per minute
  severity: 'minor' | 'moderate' | 'severe';
  url: string;
}

// In-memory storage for demo (use database in production)
const memoryMetrics: MemoryMetric[] = [];
const MAX_METRICS = 5000; // Limit memory usage

// Memory pressure thresholds (percentage of heap limit)
const MEMORY_THRESHOLDS = {
  low: 50,
  medium: 70,
  high: 85,
  critical: 95,
};

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';
    const body = await request.json();
    
    // Validate the memory data
    if (!body.usedJSHeapSize || !body.totalJSHeapSize || !body.jsHeapSizeLimit) {
      return NextResponse.json(
        { error: 'Invalid memory data' },
        { status: 400 }
      );
    }
    
    // Calculate usage percentage and pressure level
    const usagePercentage = (body.usedJSHeapSize / body.jsHeapSizeLimit) * 100;
    const memoryPressure = calculateMemoryPressure(usagePercentage);
    
    // Create memory metric
    const metric: MemoryMetric = {
      usedJSHeapSize: body.usedJSHeapSize,
      totalJSHeapSize: body.totalJSHeapSize,
      jsHeapSizeLimit: body.jsHeapSizeLimit,
      timestamp: body.timestamp || Date.now(),
      url: body.url,
      userAgent,
      sessionId: body.sessionId,
      userId: body.userId,
      deviceType: detectDeviceType(userAgent),
      usagePercentage,
      memoryPressure,
    };
    
    // Store the metric
    memoryMetrics.push(metric);
    
    // Limit memory usage
    if (memoryMetrics.length > MAX_METRICS) {
      memoryMetrics.splice(0, memoryMetrics.length - MAX_METRICS);
    }
    
    // Log critical memory issues
    if (memoryPressure === 'critical') {
      console.error(`Critical memory usage detected: ${usagePercentage.toFixed(2)}% on ${metric.url}`);
    } else if (memoryPressure === 'high') {
      console.warn(`High memory usage detected: ${usagePercentage.toFixed(2)}% on ${metric.url}`);
    }
    
    // Check for potential memory leaks
    const potentialLeak = detectMemoryLeak(metric);
    if (potentialLeak) {
      console.warn('Potential memory leak detected:', potentialLeak);
    }
    
    return NextResponse.json({ 
      success: true, 
      metric,
      potentialLeak 
    });
  } catch (error) {
    console.error('Memory metric collection failed:', error);
    return NextResponse.json(
      { error: 'Failed to collect memory metric' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '24h';
    const url = searchParams.get('url');
    const deviceType = searchParams.get('deviceType');
    const sessionId = searchParams.get('sessionId');
    
    // Calculate time filter
    const now = Date.now();
    const timeRangeMs = parseTimeRange(timeRange);
    const startTime = now - timeRangeMs;
    
    // Filter metrics
    let filteredMetrics = memoryMetrics.filter(metric => 
      metric.timestamp >= startTime
    );
    
    if (url) {
      filteredMetrics = filteredMetrics.filter(metric => 
        metric.url?.includes(url)
      );
    }
    
    if (deviceType) {
      filteredMetrics = filteredMetrics.filter(metric => 
        metric.deviceType === deviceType
      );
    }
    
    if (sessionId) {
      filteredMetrics = filteredMetrics.filter(metric => 
        metric.sessionId === sessionId
      );
    }
    
    // Generate report
    const report = generateMemoryReport(filteredMetrics);
    
    return NextResponse.json(report);
  } catch (error) {
    console.error('Memory report generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate memory report' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'clear') {
      memoryMetrics.length = 0;
      return NextResponse.json({ success: true, message: 'Memory metrics cleared' });
    }
    
    if (action === 'cleanup') {
      const now = Date.now();
      const cutoff = now - (24 * 60 * 60 * 1000); // 24 hours
      
      const initialLength = memoryMetrics.length;
      for (let i = memoryMetrics.length - 1; i >= 0; i--) {
        if (memoryMetrics[i].timestamp < cutoff) {
          memoryMetrics.splice(i, 1);
        }
      }
      
      const removed = initialLength - memoryMetrics.length;
      return NextResponse.json({ 
        success: true, 
        message: `Removed ${removed} old memory metrics` 
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Memory metrics cleanup failed:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup memory metrics' },
      { status: 500 }
    );
  }
}

function calculateMemoryPressure(usagePercentage: number): 'low' | 'medium' | 'high' | 'critical' {
  if (usagePercentage >= MEMORY_THRESHOLDS.critical) {
    return 'critical';
  } else if (usagePercentage >= MEMORY_THRESHOLDS.high) {
    return 'high';
  } else if (usagePercentage >= MEMORY_THRESHOLDS.medium) {
    return 'medium';
  } else {
    return 'low';
  }
}

function detectDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
  const ua = userAgent.toLowerCase();
  
  if (/mobile|android|iphone|ipod|blackberry|windows phone/.test(ua)) {
    return 'mobile';
  }
  
  if (/tablet|ipad|kindle|silk/.test(ua)) {
    return 'tablet';
  }
  
  return 'desktop';
}

function parseTimeRange(timeRange: string): number {
  const ranges: Record<string, number> = {
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
  };
  
  return ranges[timeRange] || ranges['24h'];
}

function detectMemoryLeak(currentMetric: MemoryMetric): MemoryLeak | null {
  // Get recent metrics for the same session/URL
  const recentMetrics = memoryMetrics
    .filter(metric => 
      metric.sessionId === currentMetric.sessionId &&
      metric.url === currentMetric.url &&
      metric.timestamp > (currentMetric.timestamp - 10 * 60 * 1000) // Last 10 minutes
    )
    .sort((a, b) => a.timestamp - b.timestamp);
  
  if (recentMetrics.length < 5) {
    return null; // Need at least 5 data points
  }
  
  // Calculate memory growth rate
  const firstMetric = recentMetrics[0];
  const lastMetric = recentMetrics[recentMetrics.length - 1];
  
  const timeDiffMinutes = (lastMetric.timestamp - firstMetric.timestamp) / (1000 * 60);
  const memoryDiffMB = (lastMetric.usedJSHeapSize - firstMetric.usedJSHeapSize) / (1024 * 1024);
  const growthRate = memoryDiffMB / timeDiffMinutes;
  
  // Check if memory is consistently growing
  let consistentGrowth = true;
  for (let i = 1; i < recentMetrics.length; i++) {
    if (recentMetrics[i].usedJSHeapSize <= recentMetrics[i - 1].usedJSHeapSize) {
      consistentGrowth = false;
      break;
    }
  }
  
  // Determine severity based on growth rate
  let severity: 'minor' | 'moderate' | 'severe' = 'minor';
  if (growthRate > 5) { // > 5MB per minute
    severity = 'severe';
  } else if (growthRate > 1) { // > 1MB per minute
    severity = 'moderate';
  }
  
  // Only report if there's consistent growth above threshold
  if (consistentGrowth && growthRate > 0.5) { // > 0.5MB per minute
    return {
      startTime: firstMetric.timestamp,
      endTime: lastMetric.timestamp,
      growthRate,
      severity,
      url: currentMetric.url || 'unknown',
    };
  }
  
  return null;
}

function generateMemoryReport(metrics: MemoryMetric[]): MemoryReport {
  if (metrics.length === 0) {
    return {
      metrics: [],
      summary: {
        totalSamples: 0,
        averageUsage: 0,
        peakUsage: 0,
        memoryLeaks: [],
        pressureDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
        trends: { increasing: false, rate: 0 },
      },
      timestamp: Date.now(),
    };
  }
  
  // Calculate summary statistics
  const totalSamples = metrics.length;
  const averageUsage = metrics.reduce((sum, metric) => sum + metric.usagePercentage, 0) / totalSamples;
  const peakUsage = Math.max(...metrics.map(metric => metric.usagePercentage));
  
  // Pressure distribution
  const pressureDistribution = { low: 0, medium: 0, high: 0, critical: 0 };
  metrics.forEach(metric => {
    pressureDistribution[metric.memoryPressure]++;
  });
  
  // Detect memory leaks across all sessions
  const memoryLeaks: MemoryLeak[] = [];
  const sessionGroups: Record<string, MemoryMetric[]> = {};
  
  // Group by session
  metrics.forEach(metric => {
    if (metric.sessionId) {
      if (!sessionGroups[metric.sessionId]) {
        sessionGroups[metric.sessionId] = [];
      }
      sessionGroups[metric.sessionId].push(metric);
    }
  });
  
  // Check each session for leaks
  Object.values(sessionGroups).forEach(sessionMetrics => {
    if (sessionMetrics.length >= 5) {
      const sortedMetrics = sessionMetrics.sort((a, b) => a.timestamp - b.timestamp);
      const leak = detectMemoryLeakInSession(sortedMetrics);
      if (leak) {
        memoryLeaks.push(leak);
      }
    }
  });
  
  // Calculate trends
  const trends = calculateMemoryTrends(metrics);
  
  return {
    metrics,
    summary: {
      totalSamples,
      averageUsage,
      peakUsage,
      memoryLeaks,
      pressureDistribution,
      trends,
    },
    timestamp: Date.now(),
  };
}

function detectMemoryLeakInSession(sessionMetrics: MemoryMetric[]): MemoryLeak | null {
  const firstMetric = sessionMetrics[0];
  const lastMetric = sessionMetrics[sessionMetrics.length - 1];
  
  const timeDiffHours = (lastMetric.timestamp - firstMetric.timestamp) / (1000 * 60 * 60);
  const memoryDiffMB = (lastMetric.usedJSHeapSize - firstMetric.usedJSHeapSize) / (1024 * 1024);
  const growthRate = memoryDiffMB / (timeDiffHours * 60); // MB per minute
  
  // Check for consistent growth
  let growthCount = 0;
  for (let i = 1; i < sessionMetrics.length; i++) {
    if (sessionMetrics[i].usedJSHeapSize > sessionMetrics[i - 1].usedJSHeapSize) {
      growthCount++;
    }
  }
  
  const growthRatio = growthCount / (sessionMetrics.length - 1);
  
  // Determine severity
  let severity: 'minor' | 'moderate' | 'severe' = 'minor';
  if (growthRate > 2) {
    severity = 'severe';
  } else if (growthRate > 0.5) {
    severity = 'moderate';
  }
  
  // Report leak if growth is consistent and significant
  if (growthRatio > 0.7 && growthRate > 0.1) {
    return {
      startTime: firstMetric.timestamp,
      endTime: lastMetric.timestamp,
      growthRate,
      severity,
      url: firstMetric.url || 'unknown',
    };
  }
  
  return null;
}

function calculateMemoryTrends(metrics: MemoryMetric[]): { increasing: boolean; rate: number } {
  if (metrics.length < 2) {
    return { increasing: false, rate: 0 };
  }
  
  const sortedMetrics = metrics.sort((a, b) => a.timestamp - b.timestamp);
  const firstMetric = sortedMetrics[0];
  const lastMetric = sortedMetrics[sortedMetrics.length - 1];
  
  const timeDiffHours = (lastMetric.timestamp - firstMetric.timestamp) / (1000 * 60 * 60);
  const memoryDiffMB = (lastMetric.usedJSHeapSize - firstMetric.usedJSHeapSize) / (1024 * 1024);
  const rate = memoryDiffMB / timeDiffHours;
  
  return {
    increasing: rate > 0.1, // Growing more than 0.1MB per hour
    rate,
  };
}