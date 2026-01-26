import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Performance metric types
interface PerformanceMetric {
  name: string;
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
  userAgent: string;
  sessionId?: string;
  userId?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  connectionType?: string;
  viewport?: {
    width: number;
    height: number;
  };
}

interface PerformanceReport {
  metrics: PerformanceMetric[];
  summary: {
    totalMetrics: number;
    averageValues: Record<string, number>;
    ratingDistribution: Record<string, Record<string, number>>;
  };
  timestamp: number;
}

// In-memory storage for demo (use database in production)
const performanceMetrics: PerformanceMetric[] = [];
const MAX_METRICS = 10000; // Limit memory usage

// Performance thresholds
const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
  'dns-lookup': { good: 50, needsImprovement: 200 },
  'tcp-connect': { good: 100, needsImprovement: 300 },
  'request-response': { good: 200, needsImprovement: 500 },
  'dom-processing': { good: 1000, needsImprovement: 2000 },
  'long-task': { good: 50, needsImprovement: 100 },
};

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';
    const body = await request.json();
    
    // Validate the metric data
    if (!body.name || typeof body.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      );
    }
    
    // Enrich the metric with additional data
    const metric: PerformanceMetric = {
      name: body.name,
      value: body.value,
      rating: calculateRating(body.name, body.value),
      timestamp: body.timestamp || Date.now(),
      url: body.url || 'unknown',
      userAgent,
      sessionId: body.sessionId,
      userId: body.userId,
      deviceType: detectDeviceType(userAgent),
      connectionType: body.connectionType,
      viewport: body.viewport,
    };
    
    // Store the metric
    performanceMetrics.push(metric);
    
    // Limit memory usage
    if (performanceMetrics.length > MAX_METRICS) {
      performanceMetrics.splice(0, performanceMetrics.length - MAX_METRICS);
    }
    
    // Log critical performance issues
    if (metric.rating === 'poor') {
      console.warn(`Poor performance detected: ${metric.name} = ${metric.value}ms on ${metric.url}`);
    }
    
    // Send to external analytics (if configured)
    await sendToExternalAnalytics(metric);
    
    return NextResponse.json({ success: true, metric });
  } catch (error) {
    console.error('Performance metric collection failed:', error);
    return NextResponse.json(
      { error: 'Failed to collect performance metric' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '24h';
    const metricName = searchParams.get('metric');
    const url = searchParams.get('url');
    const deviceType = searchParams.get('deviceType');
    
    // Calculate time filter
    const now = Date.now();
    const timeRangeMs = parseTimeRange(timeRange);
    const startTime = now - timeRangeMs;
    
    // Filter metrics
    let filteredMetrics = performanceMetrics.filter(metric => 
      metric.timestamp >= startTime
    );
    
    if (metricName) {
      filteredMetrics = filteredMetrics.filter(metric => 
        metric.name === metricName
      );
    }
    
    if (url) {
      filteredMetrics = filteredMetrics.filter(metric => 
        metric.url.includes(url)
      );
    }
    
    if (deviceType) {
      filteredMetrics = filteredMetrics.filter(metric => 
        metric.deviceType === deviceType
      );
    }
    
    // Generate report
    const report = generatePerformanceReport(filteredMetrics);
    
    return NextResponse.json(report);
  } catch (error) {
    console.error('Performance report generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate performance report' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'clear') {
      performanceMetrics.length = 0;
      return NextResponse.json({ success: true, message: 'Metrics cleared' });
    }
    
    if (action === 'cleanup') {
      const now = Date.now();
      const cutoff = now - (7 * 24 * 60 * 60 * 1000); // 7 days
      
      const initialLength = performanceMetrics.length;
      for (let i = performanceMetrics.length - 1; i >= 0; i--) {
        if (performanceMetrics[i].timestamp < cutoff) {
          performanceMetrics.splice(i, 1);
        }
      }
      
      const removed = initialLength - performanceMetrics.length;
      return NextResponse.json({ 
        success: true, 
        message: `Removed ${removed} old metrics` 
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Performance metrics cleanup failed:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup metrics' },
      { status: 500 }
    );
  }
}

function calculateRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS];
  
  if (!threshold) {
    return 'good'; // Default for unknown metrics
  }
  
  if (value <= threshold.good) {
    return 'good';
  } else if (value <= threshold.needsImprovement) {
    return 'needs-improvement';
  } else {
    return 'poor';
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
    '30d': 30 * 24 * 60 * 60 * 1000,
  };
  
  return ranges[timeRange] || ranges['24h'];
}

function generatePerformanceReport(metrics: PerformanceMetric[]): PerformanceReport {
  const summary = {
    totalMetrics: metrics.length,
    averageValues: {} as Record<string, number>,
    ratingDistribution: {} as Record<string, Record<string, number>>,
  };
  
  // Group metrics by name
  const metricGroups: Record<string, PerformanceMetric[]> = {};
  
  for (const metric of metrics) {
    if (!metricGroups[metric.name]) {
      metricGroups[metric.name] = [];
    }
    metricGroups[metric.name].push(metric);
  }
  
  // Calculate averages and rating distributions
  for (const [name, groupMetrics] of Object.entries(metricGroups)) {
    // Average value
    const sum = groupMetrics.reduce((acc, metric) => acc + metric.value, 0);
    summary.averageValues[name] = sum / groupMetrics.length;
    
    // Rating distribution
    const ratings = { good: 0, 'needs-improvement': 0, poor: 0 };
    for (const metric of groupMetrics) {
      if (metric.rating) {
        ratings[metric.rating]++;
      }
    }
    summary.ratingDistribution[name] = ratings;
  }
  
  return {
    metrics,
    summary,
    timestamp: Date.now(),
  };
}

async function sendToExternalAnalytics(metric: PerformanceMetric): Promise<void> {
  try {
    // Send to Google Analytics 4 (if configured)
    if (process.env.GA_MEASUREMENT_ID) {
      await sendToGA4(metric);
    }
    
    // Send to custom analytics endpoint (if configured)
    if (process.env.CUSTOM_ANALYTICS_ENDPOINT) {
      await sendToCustomAnalytics(metric);
    }
  } catch (error) {
    console.warn('Failed to send to external analytics:', error);
  }
}

async function sendToGA4(metric: PerformanceMetric): Promise<void> {
  try {
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: metric.sessionId || 'anonymous',
          events: [
            {
              name: 'web_vitals',
              params: {
                metric_name: metric.name,
                metric_value: metric.value,
                metric_rating: metric.rating,
                page_location: metric.url,
                device_type: metric.deviceType,
              },
            },
          ],
        }),
      }
    );
    
    if (!response.ok) {
      throw new Error(`GA4 request failed: ${response.status}`);
    }
  } catch (error) {
    console.warn('Failed to send to GA4:', error);
  }
}

async function sendToCustomAnalytics(metric: PerformanceMetric): Promise<void> {
  try {
    const response = await fetch(process.env.CUSTOM_ANALYTICS_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CUSTOM_ANALYTICS_TOKEN}`,
      },
      body: JSON.stringify(metric),
    });
    
    if (!response.ok) {
      throw new Error(`Custom analytics request failed: ${response.status}`);
    }
  } catch (error) {
    console.warn('Failed to send to custom analytics:', error);
  }
}