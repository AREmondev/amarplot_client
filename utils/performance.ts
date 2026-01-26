// Import web-vitals types and functions
type WebVitalsMetric = {
  name: string;
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
};

// Declare web-vitals functions
declare function getCLS(callback: (metric: WebVitalsMetric) => void): void;
declare function getFID(callback: (metric: WebVitalsMetric) => void): void;
declare function getFCP(callback: (metric: WebVitalsMetric) => void): void;
declare function getLCP(callback: (metric: WebVitalsMetric) => void): void;
declare function getTTFB(callback: (metric: WebVitalsMetric) => void): void;

// Performance thresholds based on Core Web Vitals
export const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

// Performance metric types
export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
  userAgent: string;
}

// Performance observer for custom metrics
export class PerformanceObserver {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeWebVitals();
    this.initializeCustomMetrics();
  }

  private initializeWebVitals() {
    if (typeof window === 'undefined') return;

    getCLS(this.handleMetric.bind(this));
    getFID(this.handleMetric.bind(this));
    getFCP(this.handleMetric.bind(this));
    getLCP(this.handleMetric.bind(this));
    getTTFB(this.handleMetric.bind(this));
  }

  private initializeCustomMetrics() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    // Observe navigation timing
    const navObserver = new window.PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          this.trackNavigationTiming(entry as PerformanceNavigationTiming);
        }
      }
    });
    navObserver.observe({ entryTypes: ['navigation'] });

    // Observe resource timing
    const resourceObserver = new window.PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          this.trackResourceTiming(entry as PerformanceResourceTiming);
        }
      }
    });
    resourceObserver.observe({ entryTypes: ['resource'] });

    // Observe long tasks
    try {
      const longTaskObserver = new window.PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackLongTask(entry as PerformanceEntry);
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      // Long task timing not supported
    }
  }

  private handleMetric(metric: any) {
    const threshold = PERFORMANCE_THRESHOLDS[metric.name as keyof typeof PERFORMANCE_THRESHOLDS];
    let rating: 'good' | 'needs-improvement' | 'poor' = 'good';

    if (threshold) {
      if (metric.value > threshold.needsImprovement) {
        rating = 'poor';
      } else if (metric.value > threshold.good) {
        rating = 'needs-improvement';
      }
    }

    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.metrics.push(performanceMetric);
    this.sendMetricToAnalytics(performanceMetric);
  }

  private trackNavigationTiming(entry: PerformanceNavigationTiming) {
    const metrics = {
      'dns-lookup': entry.domainLookupEnd - entry.domainLookupStart,
      'tcp-connect': entry.connectEnd - entry.connectStart,
      'ssl-negotiation': entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
      'request-response': entry.responseEnd - entry.requestStart,
      'dom-processing': entry.domComplete - entry.domContentLoadedEventStart,
      'load-complete': entry.loadEventEnd - entry.loadEventStart,
    };

    Object.entries(metrics).forEach(([name, value]) => {
      if (value > 0) {
        this.handleMetric({ name, value });
      }
    });
  }

  private trackResourceTiming(entry: PerformanceResourceTiming) {
    // Track slow resources (> 1s)
    if (entry.duration > 1000) {
      this.handleMetric({
        name: 'slow-resource',
        value: entry.duration,
        resource: entry.name,
      });
    }

    // Track large resources (> 1MB)
    if (entry.transferSize > 1024 * 1024) {
      this.handleMetric({
        name: 'large-resource',
        value: entry.transferSize,
        resource: entry.name,
      });
    }
  }

  private trackLongTask(entry: PerformanceEntry) {
    this.handleMetric({
      name: 'long-task',
      value: entry.duration,
    });
  }

  private async sendMetricToAnalytics(metric: PerformanceMetric) {
    try {
      // Send to custom analytics endpoint
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      console.warn('Failed to send performance metric:', error);
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.name === name);
  }

  public getAverageMetric(name: string): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length;
  }

  public clearMetrics(): void {
    this.metrics = [];
  }
}

// Bundle size analyzer
export class BundleAnalyzer {
  public static async analyzeBundleSize(): Promise<{
    totalSize: number;
    gzippedSize: number;
    chunks: Array<{ name: string; size: number }>;
  }> {
    if (typeof window === 'undefined') {
      return { totalSize: 0, gzippedSize: 0, chunks: [] };
    }

    try {
      const response = await fetch('/api/bundle-analysis');
      return await response.json();
    } catch (error) {
      console.warn('Failed to analyze bundle size:', error);
      return { totalSize: 0, gzippedSize: 0, chunks: [] };
    }
  }

  public static trackBundleMetrics(): void {
    if (typeof window === 'undefined') return;

    // Track script loading performance
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach((script) => {
      const src = script.getAttribute('src');
      if (src && src.includes('/_next/static/')) {
        try {
          const observer = new window.PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.name === src) {
                console.log(`Bundle ${src} loaded in ${entry.duration}ms`);
              }
            }
          });
          observer.observe({ entryTypes: ['resource'] });
        } catch (error) {
          // Performance observer not supported
        }
      }
    });
  }
}

// Memory usage tracker
export class MemoryTracker {
  private static instance: MemoryTracker;
  private intervalId: NodeJS.Timeout | null = null;

  public static getInstance(): MemoryTracker {
    if (!MemoryTracker.instance) {
      MemoryTracker.instance = new MemoryTracker();
    }
    return MemoryTracker.instance;
  }

  public startTracking(intervalMs: number = 30000): void {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    this.intervalId = setInterval(() => {
      const memory = (performance as any).memory;
      const memoryInfo = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        timestamp: Date.now(),
      };

      // Log memory usage if it's high
      const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      if (usagePercentage > 80) {
        console.warn('High memory usage detected:', memoryInfo);
      }

      // Send to analytics
      this.sendMemoryMetrics(memoryInfo);
    }, intervalMs);
  }

  public stopTracking(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async sendMemoryMetrics(memoryInfo: any): Promise<void> {
    try {
      await fetch('/api/analytics/memory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memoryInfo),
      });
    } catch (error) {
      console.warn('Failed to send memory metrics:', error);
    }
  }
}

// Performance optimization utilities
export const performanceUtils = {
  // Preload critical resources
  preloadResource(href: string, as: string, crossorigin?: string): void {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (crossorigin) link.crossOrigin = crossorigin;
    document.head.appendChild(link);
  },

  // Prefetch next page resources
  prefetchPage(href: string): void {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  },

  // Lazy load images with intersection observer
  lazyLoadImages(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  },

  // Optimize font loading
  optimizeFontLoading(): void {
    if (typeof document === 'undefined') return;

    // Add font-display: swap to all font faces
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  },

  // Critical CSS inlining
  inlineCriticalCSS(css: string): void {
    if (typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.textContent = css;
    style.setAttribute('data-critical', 'true');
    document.head.appendChild(style);
  },
};

// Initialize performance monitoring
export function initializePerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;

  // Initialize performance observer
  new PerformanceObserver();

  // Start memory tracking
  MemoryTracker.getInstance().startTracking();

  // Track bundle metrics
  BundleAnalyzer.trackBundleMetrics();

  // Optimize font loading
  performanceUtils.optimizeFontLoading();

  // Lazy load images
  performanceUtils.lazyLoadImages();
}

// Export singleton instance
export const performanceMonitor = new PerformanceObserver();