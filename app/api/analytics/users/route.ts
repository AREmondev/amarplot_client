import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// User analytics data structures
interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  pageViews: PageView[];
  events: UserEvent[];
  deviceInfo: DeviceInfo;
  location?: {
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
  };
  referrer?: string;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  isActive: boolean;
  lastActivity: number;
}

interface PageView {
  url: string;
  title?: string;
  timestamp: number;
  duration?: number;
  scrollDepth?: number;
  exitPage?: boolean;
  bounced?: boolean;
}

interface UserEvent {
  type: 'click' | 'scroll' | 'form_submit' | 'search' | 'download' | 'custom';
  element?: string;
  value?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os?: string;
  browser?: string;
  version?: string;
  viewport: { width: number; height: number };
  screenResolution: { width: number; height: number };
  colorDepth?: number;
  language?: string;
  cookieEnabled?: boolean;
  doNotTrack?: boolean;
}

interface UserProfile {
  userId: string;
  firstSeen: number;
  lastSeen: number;
  totalSessions: number;
  totalPageViews: number;
  totalEvents: number;
  averageSessionDuration: number;
  bounceRate: number;
  conversionEvents: string[];
  segments: string[];
  customProperties: Record<string, any>;
}

interface UserAnalyticsReport {
  summary: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    returningUsers: number;
    totalSessions: number;
    averageSessionDuration: number;
    bounceRate: number;
    pageViewsPerSession: number;
    topPages: Array<{ url: string; views: number; avgDuration: number }>;
    topEvents: Array<{ type: string; count: number }>;
    deviceBreakdown: Record<string, number>;
    browserBreakdown: Record<string, number>;
    locationBreakdown: Record<string, number>;
    trafficSources: Record<string, number>;
  };
  trends: {
    hourly: Array<{ hour: number; users: number; sessions: number }>;
    daily: Array<{ day: string; users: number; sessions: number }>;
    weekly: Array<{ week: string; users: number; sessions: number }>;
  };
  cohorts: {
    retention: Array<{
      cohort: string;
      day0: number;
      day1: number;
      day7: number;
      day30: number;
    }>;
  };
  funnels: Array<{
    name: string;
    steps: Array<{ step: string; users: number; conversionRate: number }>;
  }>;
  timestamp: number;
}

// In-memory storage for demo (use database in production)
const userSessions: Map<string, UserSession> = new Map();
const userProfiles: Map<string, UserProfile> = new Map();
const MAX_SESSIONS = 10000;

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';
    const body = await request.json();
    
    const { action, sessionId, userId, data } = body;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    switch (action) {
      case 'start_session':
        return handleStartSession(sessionId, userId, data, userAgent);
      
      case 'end_session':
        return handleEndSession(sessionId);
      
      case 'page_view':
        return handlePageView(sessionId, data);
      
      case 'event':
        return handleEvent(sessionId, data);
      
      case 'heartbeat':
        return handleHeartbeat(sessionId);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('User analytics tracking failed:', error);
    return NextResponse.json(
      { error: 'Failed to track user analytics' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '24h';
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');
    const segment = searchParams.get('segment');
    const reportType = searchParams.get('type') || 'summary';
    
    // Calculate time filter
    const now = Date.now();
    const timeRangeMs = parseTimeRange(timeRange);
    const startTime = now - timeRangeMs;
    
    // Filter sessions
    let filteredSessions = Array.from(userSessions.values()).filter(session => 
      session.startTime >= startTime
    );
    
    if (userId) {
      filteredSessions = filteredSessions.filter(session => 
        session.userId === userId
      );
    }
    
    if (sessionId) {
      filteredSessions = filteredSessions.filter(session => 
        session.sessionId === sessionId
      );
    }
    
    if (segment) {
      filteredSessions = filteredSessions.filter(session => {
        if (!session.userId) return false;
        const profile = userProfiles.get(session.userId);
        return profile?.segments.includes(segment);
      });
    }
    
    // Generate different types of reports
    switch (reportType) {
      case 'summary':
        const report = generateUserAnalyticsReport(filteredSessions);
        return NextResponse.json(report);
      
      case 'sessions':
        return NextResponse.json({ sessions: filteredSessions });
      
      case 'profiles':
        const profiles = Array.from(userProfiles.values());
        return NextResponse.json({ profiles });
      
      case 'realtime':
        const realtimeData = generateRealtimeReport();
        return NextResponse.json(realtimeData);
      
      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('User analytics report generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate user analytics report' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, properties, segments } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const profile = userProfiles.get(userId);
    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }
    
    // Update custom properties
    if (properties) {
      profile.customProperties = { ...profile.customProperties, ...properties };
    }
    
    // Update segments
    if (segments) {
      profile.segments = [...new Set([...profile.segments, ...segments])];
    }
    
    return NextResponse.json({ 
      success: true, 
      userId,
      profile 
    });
  } catch (error) {
    console.error('User profile update failed:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');
    
    if (action === 'clear') {
      userSessions.clear();
      userProfiles.clear();
      return NextResponse.json({ success: true, message: 'All user data cleared' });
    }
    
    if (action === 'cleanup') {
      const now = Date.now();
      const cutoff = now - (30 * 24 * 60 * 60 * 1000); // 30 days
      
      let removedSessions = 0;
      for (const [id, session] of userSessions.entries()) {
        if (session.startTime < cutoff) {
          userSessions.delete(id);
          removedSessions++;
        }
      }
      
      return NextResponse.json({ 
        success: true, 
        message: `Removed ${removedSessions} old sessions` 
      });
    }
    
    if (action === 'delete_user' && userId) {
      // Remove user profile
      userProfiles.delete(userId);
      
      // Remove user sessions
      let removedSessions = 0;
      for (const [id, session] of userSessions.entries()) {
        if (session.userId === userId) {
          userSessions.delete(id);
          removedSessions++;
        }
      }
      
      return NextResponse.json({ 
        success: true, 
        message: `Deleted user ${userId} and ${removedSessions} sessions` 
      });
    }
    
    if (action === 'delete_session' && sessionId) {
      const deleted = userSessions.delete(sessionId);
      if (deleted) {
        return NextResponse.json({ 
          success: true, 
          message: `Deleted session ${sessionId}` 
        });
      } else {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('User data cleanup failed:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup user data' },
      { status: 500 }
    );
  }
}

function handleStartSession(
  sessionId: string, 
  userId: string | undefined, 
  data: any, 
  userAgent: string
): NextResponse {
  const now = Date.now();
  
  const session: UserSession = {
    sessionId,
    userId,
    startTime: now,
    pageViews: [],
    events: [],
    deviceInfo: parseDeviceInfo(userAgent, data.deviceInfo),
    location: data.location,
    referrer: data.referrer,
    utmParams: data.utmParams,
    isActive: true,
    lastActivity: now,
  };
  
  userSessions.set(sessionId, session);
  
  // Update or create user profile
  if (userId) {
    updateUserProfile(userId, session);
  }
  
  // Limit memory usage
  if (userSessions.size > MAX_SESSIONS) {
    const oldestSession = Array.from(userSessions.entries())
      .sort(([, a], [, b]) => a.startTime - b.startTime)[0];
    userSessions.delete(oldestSession[0]);
  }
  
  return NextResponse.json({ 
    success: true, 
    sessionId,
    userId 
  });
}

function handleEndSession(sessionId: string): NextResponse {
  const session = userSessions.get(sessionId);
  if (!session) {
    return NextResponse.json(
      { error: 'Session not found' },
      { status: 404 }
    );
  }
  
  const now = Date.now();
  session.endTime = now;
  session.duration = now - session.startTime;
  session.isActive = false;
  
  // Mark last page as exit page
  if (session.pageViews.length > 0) {
    const lastPageView = session.pageViews[session.pageViews.length - 1];
    lastPageView.exitPage = true;
    if (!lastPageView.duration) {
      lastPageView.duration = now - lastPageView.timestamp;
    }
  }
  
  // Update user profile
  if (session.userId) {
    updateUserProfile(session.userId, session);
  }
  
  return NextResponse.json({ 
    success: true, 
    sessionId,
    duration: session.duration 
  });
}

function handlePageView(sessionId: string, data: any): NextResponse {
  const session = userSessions.get(sessionId);
  if (!session) {
    return NextResponse.json(
      { error: 'Session not found' },
      { status: 404 }
    );
  }
  
  const now = Date.now();
  
  // End previous page view
  if (session.pageViews.length > 0) {
    const lastPageView = session.pageViews[session.pageViews.length - 1];
    if (!lastPageView.duration) {
      lastPageView.duration = now - lastPageView.timestamp;
    }
  }
  
  const pageView: PageView = {
    url: data.url,
    title: data.title,
    timestamp: now,
    scrollDepth: data.scrollDepth,
  };
  
  session.pageViews.push(pageView);
  session.lastActivity = now;
  
  // Check for bounce (single page view with short duration)
  if (session.pageViews.length === 1) {
    setTimeout(() => {
      const currentSession = userSessions.get(sessionId);
      if (currentSession && currentSession.pageViews.length === 1) {
        const duration = Date.now() - pageView.timestamp;
        if (duration < 30000) { // Less than 30 seconds
          pageView.bounced = true;
        }
      }
    }, 30000);
  }
  
  return NextResponse.json({ 
    success: true, 
    sessionId,
    pageView 
  });
}

function handleEvent(sessionId: string, data: any): NextResponse {
  const session = userSessions.get(sessionId);
  if (!session) {
    return NextResponse.json(
      { error: 'Session not found' },
      { status: 404 }
    );
  }
  
  const event: UserEvent = {
    type: data.type,
    element: data.element,
    value: data.value,
    timestamp: Date.now(),
    metadata: data.metadata,
  };
  
  session.events.push(event);
  session.lastActivity = Date.now();
  
  return NextResponse.json({ 
    success: true, 
    sessionId,
    event 
  });
}

function handleHeartbeat(sessionId: string): NextResponse {
  const session = userSessions.get(sessionId);
  if (!session) {
    return NextResponse.json(
      { error: 'Session not found' },
      { status: 404 }
    );
  }
  
  session.lastActivity = Date.now();
  
  return NextResponse.json({ 
    success: true, 
    sessionId,
    lastActivity: session.lastActivity 
  });
}

function parseDeviceInfo(userAgent: string, providedInfo?: any): DeviceInfo {
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
    viewport: providedInfo?.viewport || { width: 0, height: 0 },
    screenResolution: providedInfo?.screenResolution || { width: 0, height: 0 },
    colorDepth: providedInfo?.colorDepth,
    language: providedInfo?.language,
    cookieEnabled: providedInfo?.cookieEnabled,
    doNotTrack: providedInfo?.doNotTrack,
  };
}

function updateUserProfile(userId: string, session: UserSession): void {
  const existing = userProfiles.get(userId);
  const now = Date.now();
  
  if (existing) {
    existing.lastSeen = now;
    existing.totalSessions++;
    existing.totalPageViews += session.pageViews.length;
    existing.totalEvents += session.events.length;
    
    // Recalculate average session duration
    if (session.duration) {
      const totalDuration = existing.averageSessionDuration * (existing.totalSessions - 1) + session.duration;
      existing.averageSessionDuration = totalDuration / existing.totalSessions;
    }
    
    // Update bounce rate
    const bouncedSessions = session.pageViews.some(pv => pv.bounced) ? 1 : 0;
    const totalBounces = existing.bounceRate * (existing.totalSessions - 1) + bouncedSessions;
    existing.bounceRate = totalBounces / existing.totalSessions;
  } else {
    const newProfile: UserProfile = {
      userId,
      firstSeen: session.startTime,
      lastSeen: now,
      totalSessions: 1,
      totalPageViews: session.pageViews.length,
      totalEvents: session.events.length,
      averageSessionDuration: session.duration || 0,
      bounceRate: session.pageViews.some(pv => pv.bounced) ? 1 : 0,
      conversionEvents: [],
      segments: ['new_user'],
      customProperties: {},
    };
    
    userProfiles.set(userId, newProfile);
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

function generateUserAnalyticsReport(sessions: UserSession[]): UserAnalyticsReport {
  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  
  // Basic metrics
  const totalUsers = new Set(sessions.map(s => s.userId).filter(Boolean)).size;
  const activeUsers = sessions.filter(s => s.lastActivity > dayAgo).length;
  const newUsers = sessions.filter(s => {
    if (!s.userId) return false;
    const profile = userProfiles.get(s.userId);
    return profile && profile.firstSeen > dayAgo;
  }).length;
  const returningUsers = totalUsers - newUsers;
  
  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const averageSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;
  
  const totalPageViews = sessions.reduce((sum, s) => sum + s.pageViews.length, 0);
  const pageViewsPerSession = totalSessions > 0 ? totalPageViews / totalSessions : 0;
  
  const bouncedSessions = sessions.filter(s => s.pageViews.some(pv => pv.bounced)).length;
  const bounceRate = totalSessions > 0 ? bouncedSessions / totalSessions : 0;
  
  // Top pages
  const pageViews: Record<string, { count: number; totalDuration: number }> = {};
  sessions.forEach(session => {
    session.pageViews.forEach(pv => {
      if (!pageViews[pv.url]) {
        pageViews[pv.url] = { count: 0, totalDuration: 0 };
      }
      pageViews[pv.url].count++;
      pageViews[pv.url].totalDuration += pv.duration || 0;
    });
  });
  
  const topPages = Object.entries(pageViews)
    .map(([url, data]) => ({
      url,
      views: data.count,
      avgDuration: data.count > 0 ? data.totalDuration / data.count : 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
  
  // Top events
  const events: Record<string, number> = {};
  sessions.forEach(session => {
    session.events.forEach(event => {
      events[event.type] = (events[event.type] || 0) + 1;
    });
  });
  
  const topEvents = Object.entries(events)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Device breakdown
  const deviceBreakdown: Record<string, number> = {};
  sessions.forEach(session => {
    const device = session.deviceInfo.type;
    deviceBreakdown[device] = (deviceBreakdown[device] || 0) + 1;
  });
  
  // Browser breakdown
  const browserBreakdown: Record<string, number> = {};
  sessions.forEach(session => {
    const browser = session.deviceInfo.browser || 'unknown';
    browserBreakdown[browser] = (browserBreakdown[browser] || 0) + 1;
  });
  
  // Location breakdown
  const locationBreakdown: Record<string, number> = {};
  sessions.forEach(session => {
    const country = session.location?.country || 'unknown';
    locationBreakdown[country] = (locationBreakdown[country] || 0) + 1;
  });
  
  // Traffic sources
  const trafficSources: Record<string, number> = {};
  sessions.forEach(session => {
    const source = session.utmParams?.source || session.referrer || 'direct';
    trafficSources[source] = (trafficSources[source] || 0) + 1;
  });
  
  // Trends
  const hourly = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now - (23 - i) * 60 * 60 * 1000).getHours();
    const hourStart = now - (23 - i) * 60 * 60 * 1000;
    const hourEnd = hourStart + 60 * 60 * 1000;
    const hourSessions = sessions.filter(s => s.startTime >= hourStart && s.startTime < hourEnd);
    const users = new Set(hourSessions.map(s => s.userId).filter(Boolean)).size;
    return { hour, users, sessions: hourSessions.length };
  });
  
  const daily = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now - (6 - i) * 24 * 60 * 60 * 1000);
    const day = date.toISOString().split('T')[0];
    const dayStart = date.setHours(0, 0, 0, 0);
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const daySessions = sessions.filter(s => s.startTime >= dayStart && s.startTime < dayEnd);
    const users = new Set(daySessions.map(s => s.userId).filter(Boolean)).size;
    return { day, users, sessions: daySessions.length };
  });
  
  const weekly = Array.from({ length: 4 }, (_, i) => {
    const weekStart = now - (3 - i) * 7 * 24 * 60 * 60 * 1000;
    const weekEnd = weekStart + 7 * 24 * 60 * 60 * 1000;
    const week = new Date(weekStart).toISOString().split('T')[0];
    const weekSessions = sessions.filter(s => s.startTime >= weekStart && s.startTime < weekEnd);
    const users = new Set(weekSessions.map(s => s.userId).filter(Boolean)).size;
    return { week, users, sessions: weekSessions.length };
  });
  
  return {
    summary: {
      totalUsers,
      activeUsers,
      newUsers,
      returningUsers,
      totalSessions,
      averageSessionDuration,
      bounceRate,
      pageViewsPerSession,
      topPages,
      topEvents,
      deviceBreakdown,
      browserBreakdown,
      locationBreakdown,
      trafficSources,
    },
    trends: {
      hourly,
      daily,
      weekly,
    },
    cohorts: {
      retention: [], // Would need more complex logic for cohort analysis
    },
    funnels: [], // Would need funnel definitions
    timestamp: now,
  };
}

function generateRealtimeReport() {
  const now = Date.now();
  const fiveMinutesAgo = now - 5 * 60 * 1000;
  
  const activeSessions = Array.from(userSessions.values())
    .filter(session => session.isActive && session.lastActivity > fiveMinutesAgo);
  
  const currentPageViews: Record<string, number> = {};
  activeSessions.forEach(session => {
    const lastPageView = session.pageViews[session.pageViews.length - 1];
    if (lastPageView) {
      currentPageViews[lastPageView.url] = (currentPageViews[lastPageView.url] || 0) + 1;
    }
  });
  
  const topCurrentPages = Object.entries(currentPageViews)
    .map(([url, count]) => ({ url, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return {
    activeUsers: activeSessions.length,
    topCurrentPages,
    recentEvents: activeSessions
      .flatMap(session => session.events)
      .filter(event => event.timestamp > fiveMinutesAgo)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20),
    timestamp: now,
  };
}