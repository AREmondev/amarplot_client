"use client";

import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

// Web Vitals reporting
export function reportWebVitals(metric: any) {
  // Send to analytics service
  if (typeof window !== "undefined") {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag("event", metric.name, {
        event_category: "Web Vitals",
        event_label: metric.id,
        value: Math.round(
          metric.name === "CLS" ? metric.value * 1000 : metric.value,
        ),
        non_interaction: true,
      });
    }

    // Vercel Analytics
    if (window.va) {
      window.va("track", "Web Vitals", {
        name: metric.name,
        value: metric.value,
        id: metric.id,
        delta: metric.delta,
        rating: metric.rating,
      });
    }

    // Custom analytics endpoint
    fetch("/api/analytics/web-vitals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        delta: metric.delta,
        rating: metric.rating,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    }).catch(console.error);
  }
}

// Initialize web vitals tracking
export function initWebVitals() {
  if (typeof window !== "undefined") {
    getCLS(reportWebVitals);
    getFID(reportWebVitals);
    getFCP(reportWebVitals);
    getLCP(reportWebVitals);
    getTTFB(reportWebVitals);
  }
}

// Performance observer for custom metrics
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  init() {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
      return;
    }

    // Monitor navigation timing
    this.observeNavigation();

    // Monitor resource loading
    this.observeResources();

    // Monitor long tasks
    this.observeLongTasks();

    // Monitor layout shifts
    this.observeLayoutShifts();
  }

  private observeNavigation() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "navigation") {
            const navEntry = entry as PerformanceNavigationTiming;
            this.reportMetric("navigation", {
              domContentLoaded:
                navEntry.domContentLoadedEventEnd -
                navEntry.domContentLoadedEventStart,
              loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
              firstByte: navEntry.responseStart - navEntry.requestStart,
              domInteractive: navEntry.domInteractive - navEntry.fetchStart,
            });
          }
        }
      });

      observer.observe({ entryTypes: ["navigation"] });
      this.observers.push(observer);
    } catch (error) {
      console.warn("Navigation timing observer not supported:", error);
    }
  }

  private observeResources() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "resource") {
            const resourceEntry = entry as PerformanceResourceTiming;

            // Track slow resources (>1s)
            if (resourceEntry.duration > 1000) {
              this.reportMetric("slow-resource", {
                name: resourceEntry.name,
                duration: resourceEntry.duration,
                size: resourceEntry.transferSize,
                type: this.getResourceType(resourceEntry.name),
              });
            }
          }
        }
      });

      observer.observe({ entryTypes: ["resource"] });
      this.observers.push(observer);
    } catch (error) {
      console.warn("Resource timing observer not supported:", error);
    }
  }

  private observeLongTasks() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "longtask") {
            this.reportMetric("long-task", {
              duration: entry.duration,
              startTime: entry.startTime,
            });
          }
        }
      });

      observer.observe({ entryTypes: ["longtask"] });
      this.observers.push(observer);
    } catch (error) {
      console.warn("Long task observer not supported:", error);
    }
  }

  private observeLayoutShifts() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (
            entry.entryType === "layout-shift" &&
            !(entry as any).hadRecentInput
          ) {
            this.reportMetric("layout-shift", {
              value: (entry as any).value,
              startTime: entry.startTime,
            });
          }
        }
      });

      observer.observe({ entryTypes: ["layout-shift"] });
      this.observers.push(observer);
    } catch (error) {
      console.warn("Layout shift observer not supported:", error);
    }
  }

  private getResourceType(url: string): string {
    if (url.includes(".js")) return "script";
    if (url.includes(".css")) return "stylesheet";
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return "image";
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) return "font";
    return "other";
  }

  private reportMetric(name: string, data: any) {
    // Send to analytics
    fetch("/api/analytics/performance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metric: name,
        data,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    }).catch(console.error);
  }

  disconnect() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Error tracking
export function trackError(error: Error, context?: Record<string, any>) {
  if (typeof window === "undefined") return;

  const errorData = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    context,
  };

  // Send to error tracking service
  fetch("/api/analytics/errors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(errorData),
  }).catch(console.error);

  // Also log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("Tracked error:", errorData);
  }
}

// User interaction tracking
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>,
) {
  if (typeof window === "undefined") return;

  // Google Analytics
  if (window.gtag) {
    window.gtag("event", eventName, properties);
  }

  // Custom analytics
  fetch("/api/analytics/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event: eventName,
      properties,
      timestamp: Date.now(),
      url: window.location.href,
    }),
  }).catch(console.error);
}

// Page view tracking
export function trackPageView(url: string, title?: string) {
  if (typeof window === "undefined") return;

  // Google Analytics
  if (window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
      page_title: title,
      page_location: url,
    });
  }

  // Custom analytics
  fetch("/api/analytics/pageviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      title,
      timestamp: Date.now(),
      referrer: document.referrer,
    }),
  }).catch(console.error);
}

// Declare global types for analytics
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    va: (...args: any[]) => void;
  }
}
