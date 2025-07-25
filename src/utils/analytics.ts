// Simple analytics tracking utility
class Analytics {
  private static instance: Analytics;
  private visitors: Set<string> = new Set();
  
  private constructor() {
    this.initializeTracking();
  }
  
  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }
  
  private initializeTracking() {
    // Track page view
    this.trackPageView();
    
    // Track visitor (using session storage for simplicity)
    this.trackVisitor();
    
    // Track performance metrics
    this.trackPerformance();
  }
  
  private trackPageView() {
    const data = {
      url: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
    };
    
    // Store in localStorage for persistence
    const views = JSON.parse(localStorage.getItem('page_views') || '[]');
    views.push(data);
    
    // Keep only last 100 views to prevent storage overflow
    if (views.length > 100) {
      views.splice(0, views.length - 100);
    }
    
    localStorage.setItem('page_views', JSON.stringify(views));
    
    // Log for development
    console.log('Page view tracked:', data);
  }
  
  private trackVisitor() {
    const sessionId = this.getOrCreateSessionId();
    const visitorData = {
      sessionId,
      firstVisit: !localStorage.getItem('first_visit'),
      timestamp: new Date().toISOString(),
    };
    
    if (visitorData.firstVisit) {
      localStorage.setItem('first_visit', new Date().toISOString());
    }
    
    // Track daily unique visitors
    const today = new Date().toDateString();
    const dailyVisitors = JSON.parse(localStorage.getItem('daily_visitors') || '{}');
    
    if (!dailyVisitors[today]) {
      dailyVisitors[today] = new Set();
    } else {
      dailyVisitors[today] = new Set(dailyVisitors[today]);
    }
    
    dailyVisitors[today].add(sessionId);
    
    // Convert Set to Array for storage
    const storageData: Record<string, string[]> = {};
    Object.keys(dailyVisitors).forEach(date => {
      storageData[date] = Array.from(dailyVisitors[date]);
    });
    
    localStorage.setItem('daily_visitors', JSON.stringify(storageData));
  }
  
  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }
  
  private trackPerformance() {
    // Track page load performance
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const performanceData = {
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            firstPaint: this.getFirstPaint(),
            timestamp: new Date().toISOString(),
          };
          
          console.log('Performance metrics:', performanceData);
          
          // Store performance data
          const perfHistory = JSON.parse(localStorage.getItem('performance_history') || '[]');
          perfHistory.push(performanceData);
          
          // Keep only last 50 entries
          if (perfHistory.length > 50) {
            perfHistory.splice(0, perfHistory.length - 50);
          }
          
          localStorage.setItem('performance_history', JSON.stringify(perfHistory));
        }, 0);
      });
    }
  }
  
  private getFirstPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }
  
  // Public methods for tracking custom events
  public trackEvent(eventName: string, properties?: Record<string, any>) {
    const eventData = {
      event: eventName,
      properties,
      timestamp: new Date().toISOString(),
      sessionId: this.getOrCreateSessionId(),
    };
    
    const events = JSON.parse(localStorage.getItem('custom_events') || '[]');
    events.push(eventData);
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('custom_events', JSON.stringify(events));
    console.log('Event tracked:', eventData);
  }
  
  // Get analytics data
  public getAnalyticsData() {
    return {
      pageViews: JSON.parse(localStorage.getItem('page_views') || '[]'),
      dailyVisitors: JSON.parse(localStorage.getItem('daily_visitors') || '{}'),
      performanceHistory: JSON.parse(localStorage.getItem('performance_history') || '[]'),
      customEvents: JSON.parse(localStorage.getItem('custom_events') || '[]'),
    };
  }
  
  // Get daily visitor count
  public getDailyVisitorCount(date: string = new Date().toDateString()): number {
    const dailyVisitors = JSON.parse(localStorage.getItem('daily_visitors') || '{}');
    return dailyVisitors[date] ? dailyVisitors[date].length : 0;
  }
}

export const analytics = Analytics.getInstance();
