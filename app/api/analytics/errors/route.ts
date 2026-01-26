import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Error data structures
interface ErrorMetric {
  id: string;
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  timestamp: number;
  url: string;
  userAgent: string;
  userId?: string;
  sessionId?: string;
  errorType: 'javascript' | 'unhandled-rejection' | 'resource' | 'network' | 'custom';
  severity: 'low' | 'medium' | 'high' | 'critical';
  fingerprint: string; // For grouping similar errors
  context?: {
    component?: string;
    action?: string;
    props?: Record<string, any>;
    state?: Record<string, any>;
    breadcrumbs?: Breadcrumb[];
  };
  deviceInfo: {
    type: 'mobile' | 'tablet' | 'desktop';
    os?: string;
    browser?: string;
    version?: string;
    viewport?: { width: number; height: number };
  };
  performance?: {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
    timing?: {
      loadTime: number;
      domReady: number;
    };
  };
}

interface Breadcrumb {
  timestamp: number;
  category: 'navigation' | 'user' | 'console' | 'network' | 'dom';
  message: string;
  level: 'info' | 'warning' | 'error';
  data?: Record<string, any>;
}

interface ErrorGroup {
  fingerprint: string;
  message: string;
  count: number;
  firstSeen: number;
  lastSeen: number;
  affectedUsers: Set<string>;
  affectedSessions: Set<string>;
  urls: Set<string>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'acknowledged' | 'resolved' | 'ignored';
  errors: ErrorMetric[];
}

interface ErrorReport {
  summary: {
    totalErrors: number;
    uniqueErrors: number;
    affectedUsers: number;
    affectedSessions: number;
    errorRate: number; // errors per session
    topErrors: Array<{
      fingerprint: string;
      message: string;
      count: number;
      severity: string;
    }>;
    severityDistribution: Record<string, number>;
    typeDistribution: Record<string, number>;
    trends: {
      hourly: Array<{ hour: number; count: number }>;
      daily: Array<{ day: string; count: number }>;
    };
  };
  groups: ErrorGroup[];
  timestamp: number;
}

// In-memory storage for demo (use database in production)
const errorMetrics: ErrorMetric[] = [];
const errorGroups: Map<string, ErrorGroup> = new Map();
const MAX_ERRORS = 10000;

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';
    const body = await request.json();
    
    // Validate error data
    if (!body.message) {
      return NextResponse.json(
        { error: 'Error message is required' },
        { status: 400 }
      );
    }
    
    // Generate error fingerprint for grouping
    const fingerprint = generateErrorFingerprint(body);
    
    // Create error metric
    const errorMetric: ErrorMetric = {
      id: generateErrorId(),
      message: body.message,
      stack: body.stack,
      filename: body.filename,
      lineno: body.lineno,
      colno: body.colno,
      timestamp: body.timestamp || Date.now(),
      url: body.url || 'unknown',
      userAgent,
      userId: body.userId,
      sessionId: body.sessionId,
      errorType: body.errorType || 'javascript',
      severity: calculateErrorSeverity(body),
      fingerprint,
      context: body.context,
      deviceInfo: parseDeviceInfo(userAgent, body.deviceInfo),
      performance: body.performance,
    };
    
    // Store the error
    errorMetrics.push(errorMetric);
    
    // Update error group
    updateErrorGroup(errorMetric);
    
    // Limit memory usage
    if (errorMetrics.length > MAX_ERRORS) {
      const removedError = errorMetrics.shift();
      if (removedError) {
        removeFromErrorGroup(removedError);
      }
    }
    
    // Log critical errors
    if (errorMetric.severity === 'critical') {
      console.error(`Critical error detected:`, {
        message: errorMetric.message,
        url: errorMetric.url,
        fingerprint: errorMetric.fingerprint,
        userId: errorMetric.userId,
      });
    }
    
    // Send alerts for new critical errors
    const group = errorGroups.get(fingerprint);
    if (group && group.severity === 'critical' && group.count === 1) {
      await sendErrorAlert(errorMetric, group);
    }
    
    return NextResponse.json({ 
      success: true, 
      errorId: errorMetric.id,
      fingerprint,
      severity: errorMetric.severity 
    });
  } catch (error) {
    console.error('Error tracking failed:', error);
    return NextResponse.json(
      { error: 'Failed to track error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '24h';
    const severity = searchParams.get('severity');
    const errorType = searchParams.get('errorType');
    const status = searchParams.get('status');
    const fingerprint = searchParams.get('fingerprint');
    const userId = searchParams.get('userId');
    
    // Calculate time filter
    const now = Date.now();
    const timeRangeMs = parseTimeRange(timeRange);
    const startTime = now - timeRangeMs;
    
    // Filter errors
    let filteredErrors = errorMetrics.filter(error => 
      error.timestamp >= startTime
    );
    
    if (severity) {
      filteredErrors = filteredErrors.filter(error => 
        error.severity === severity
      );
    }
    
    if (errorType) {
      filteredErrors = filteredErrors.filter(error => 
        error.errorType === errorType
      );
    }
    
    if (fingerprint) {
      filteredErrors = filteredErrors.filter(error => 
        error.fingerprint === fingerprint
      );
    }
    
    if (userId) {
      filteredErrors = filteredErrors.filter(error => 
        error.userId === userId
      );
    }
    
    // Filter error groups
    let filteredGroups = Array.from(errorGroups.values());
    
    if (status) {
      filteredGroups = filteredGroups.filter(group => 
        group.status === status
      );
    }
    
    // Generate report
    const report = generateErrorReport(filteredErrors, filteredGroups);
    
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error report generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate error report' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { fingerprint, status, assignee } = body;
    
    if (!fingerprint || !status) {
      return NextResponse.json(
        { error: 'Fingerprint and status are required' },
        { status: 400 }
      );
    }
    
    const group = errorGroups.get(fingerprint);
    if (!group) {
      return NextResponse.json(
        { error: 'Error group not found' },
        { status: 404 }
      );
    }
    
    // Update group status
    group.status = status;
    
    return NextResponse.json({ 
      success: true, 
      fingerprint,
      status: group.status 
    });
  } catch (error) {
    console.error('Error group update failed:', error);
    return NextResponse.json(
      { error: 'Failed to update error group' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const fingerprint = searchParams.get('fingerprint');
    
    if (action === 'clear') {
      errorMetrics.length = 0;
      errorGroups.clear();
      return NextResponse.json({ success: true, message: 'All errors cleared' });
    }
    
    if (action === 'cleanup') {
      const now = Date.now();
      const cutoff = now - (7 * 24 * 60 * 60 * 1000); // 7 days
      
      const initialLength = errorMetrics.length;
      for (let i = errorMetrics.length - 1; i >= 0; i--) {
        if (errorMetrics[i].timestamp < cutoff) {
          const removedError = errorMetrics.splice(i, 1)[0];
          removeFromErrorGroup(removedError);
        }
      }
      
      const removed = initialLength - errorMetrics.length;
      return NextResponse.json({ 
        success: true, 
        message: `Removed ${removed} old errors` 
      });
    }
    
    if (action === 'delete' && fingerprint) {
      // Delete specific error group
      const group = errorGroups.get(fingerprint);
      if (group) {
        // Remove all errors with this fingerprint
        for (let i = errorMetrics.length - 1; i >= 0; i--) {
          if (errorMetrics[i].fingerprint === fingerprint) {
            errorMetrics.splice(i, 1);
          }
        }
        
        errorGroups.delete(fingerprint);
        
        return NextResponse.json({ 
          success: true, 
          message: `Deleted error group ${fingerprint}` 
        });
      } else {
        return NextResponse.json(
          { error: 'Error group not found' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error cleanup failed:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup errors' },
      { status: 500 }
    );
  }
}

function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateErrorFingerprint(errorData: any): string {
  // Create a fingerprint based on error message, filename, and line number
  const components = [
    errorData.message?.replace(/\d+/g, 'N'), // Replace numbers with N
    errorData.filename?.split('/').pop(), // Just the filename
    errorData.lineno?.toString(),
  ].filter(Boolean);
  
  return btoa(components.join('|')).replace(/[^a-zA-Z0-9]/g, '').substr(0, 16);
}

function calculateErrorSeverity(errorData: any): 'low' | 'medium' | 'high' | 'critical' {
  // Custom severity if provided
  if (errorData.severity) {
    return errorData.severity;
  }
  
  const message = errorData.message?.toLowerCase() || '';
  const stack = errorData.stack?.toLowerCase() || '';
  
  // Critical errors
  if (
    message.includes('out of memory') ||
    message.includes('maximum call stack') ||
    message.includes('script error') ||
    errorData.errorType === 'unhandled-rejection'
  ) {
    return 'critical';
  }
  
  // High severity errors
  if (
    message.includes('network error') ||
    message.includes('failed to fetch') ||
    message.includes('permission denied') ||
    stack.includes('react') ||
    errorData.errorType === 'network'
  ) {
    return 'high';
  }
  
  // Medium severity errors
  if (
    message.includes('warning') ||
    message.includes('deprecated') ||
    errorData.errorType === 'resource'
  ) {
    return 'medium';
  }
  
  return 'low';
}

function parseDeviceInfo(userAgent: string, providedInfo?: any): ErrorMetric['deviceInfo'] {
  const ua = userAgent.toLowerCase();
  
  // Device type
  let type: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (/mobile|android|iphone|ipod|blackberry|windows phone/.test(ua)) {
    type = 'mobile';
  } else if (/tablet|ipad|kindle|silk/.test(ua)) {
    type = 'tablet';
  }
  
  // OS detection
  let os = 'unknown';
  if (/windows/.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/.test(ua)) os = 'macOS';
  else if (/linux/.test(ua)) os = 'Linux';
  else if (/android/.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/.test(ua)) os = 'iOS';
  
  // Browser detection
  let browser = 'unknown';
  if (/chrome/.test(ua) && !/edge/.test(ua)) browser = 'Chrome';
  else if (/firefox/.test(ua)) browser = 'Firefox';
  else if (/safari/.test(ua) && !/chrome/.test(ua)) browser = 'Safari';
  else if (/edge/.test(ua)) browser = 'Edge';
  
  return {
    type,
    os,
    browser,
    version: providedInfo?.version,
    viewport: providedInfo?.viewport,
  };
}

function updateErrorGroup(error: ErrorMetric): void {
  const existing = errorGroups.get(error.fingerprint);
  
  if (existing) {
    existing.count++;
    existing.lastSeen = error.timestamp;
    existing.errors.push(error);
    
    if (error.userId) {
      existing.affectedUsers.add(error.userId);
    }
    if (error.sessionId) {
      existing.affectedSessions.add(error.sessionId);
    }
    existing.urls.add(error.url);
    
    // Update severity to highest
    const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
    if (severityOrder[error.severity] > severityOrder[existing.severity]) {
      existing.severity = error.severity;
    }
  } else {
    const newGroup: ErrorGroup = {
      fingerprint: error.fingerprint,
      message: error.message,
      count: 1,
      firstSeen: error.timestamp,
      lastSeen: error.timestamp,
      affectedUsers: new Set(error.userId ? [error.userId] : []),
      affectedSessions: new Set(error.sessionId ? [error.sessionId] : []),
      urls: new Set([error.url]),
      severity: error.severity,
      status: 'new',
      errors: [error],
    };
    
    errorGroups.set(error.fingerprint, newGroup);
  }
}

function removeFromErrorGroup(error: ErrorMetric): void {
  const group = errorGroups.get(error.fingerprint);
  if (group) {
    group.count--;
    group.errors = group.errors.filter(e => e.id !== error.id);
    
    if (group.count === 0) {
      errorGroups.delete(error.fingerprint);
    }
  }
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

function generateErrorReport(errors: ErrorMetric[], groups: ErrorGroup[]): ErrorReport {
  const totalErrors = errors.length;
  const uniqueErrors = groups.length;
  const affectedUsers = new Set(errors.map(e => e.userId).filter(Boolean)).size;
  const affectedSessions = new Set(errors.map(e => e.sessionId).filter(Boolean)).size;
  const errorRate = affectedSessions > 0 ? totalErrors / affectedSessions : 0;
  
  // Top errors by count
  const topErrors = groups
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(group => ({
      fingerprint: group.fingerprint,
      message: group.message,
      count: group.count,
      severity: group.severity,
    }));
  
  // Severity distribution
  const severityDistribution = { low: 0, medium: 0, high: 0, critical: 0 };
  errors.forEach(error => {
    severityDistribution[error.severity]++;
  });
  
  // Type distribution
  const typeDistribution: Record<string, number> = {};
  errors.forEach(error => {
    typeDistribution[error.errorType] = (typeDistribution[error.errorType] || 0) + 1;
  });
  
  // Trends
  const now = Date.now();
  const hourly = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now - (23 - i) * 60 * 60 * 1000).getHours();
    const hourStart = now - (23 - i) * 60 * 60 * 1000;
    const hourEnd = hourStart + 60 * 60 * 1000;
    const count = errors.filter(e => e.timestamp >= hourStart && e.timestamp < hourEnd).length;
    return { hour, count };
  });
  
  const daily = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now - (6 - i) * 24 * 60 * 60 * 1000);
    const day = date.toISOString().split('T')[0];
    const dayStart = date.setHours(0, 0, 0, 0);
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const count = errors.filter(e => e.timestamp >= dayStart && e.timestamp < dayEnd).length;
    return { day, count };
  });
  
  return {
    summary: {
      totalErrors,
      uniqueErrors,
      affectedUsers,
      affectedSessions,
      errorRate,
      topErrors,
      severityDistribution,
      typeDistribution,
      trends: { hourly, daily },
    },
    groups,
    timestamp: Date.now(),
  };
}

async function sendErrorAlert(error: ErrorMetric, group: ErrorGroup): Promise<void> {
  // In production, integrate with alerting services like:
  // - Slack webhooks
  // - Email notifications
  // - PagerDuty
  // - Discord webhooks
  
  console.log('🚨 Critical Error Alert:', {
    message: error.message,
    url: error.url,
    fingerprint: error.fingerprint,
    userId: error.userId,
    timestamp: new Date(error.timestamp).toISOString(),
  });
  
  // Example: Send to external service
  // await fetch('https://hooks.slack.com/services/...', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     text: `🚨 Critical Error: ${error.message}`,
  //     attachments: [{
  //       color: 'danger',
  //       fields: [
  //         { title: 'URL', value: error.url, short: true },
  //         { title: 'User ID', value: error.userId || 'Anonymous', short: true },
  //         { title: 'Fingerprint', value: error.fingerprint, short: true },
  //         { title: 'Count', value: group.count.toString(), short: true },
  //       ]
  //     }]
  //   })
  // });
}