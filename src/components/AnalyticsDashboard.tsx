import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analytics } from "@/utils/analytics";
import { Eye, Users, Clock, TrendingUp } from "lucide-react";

interface AnalyticsData {
  pageViews: any[];
  dailyVisitors: Record<string, string[]>;
  performanceHistory: any[];
  customEvents: any[];
}

export const AnalyticsDashboard = () => {
  const [data, setData] = useState<AnalyticsData>({
    pageViews: [],
    dailyVisitors: {},
    performanceHistory: [],
    customEvents: []
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateData = () => {
      setData(analytics.getAnalyticsData());
    };

    updateData();
    const interval = setInterval(updateData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getTodayVisitors = () => {
    const today = new Date().toDateString();
    return analytics.getDailyVisitorCount(today);
  };

  const getWeeklyVisitors = () => {
    const weekDates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      weekDates.push(date.toDateString());
    }
    
    return weekDates.reduce((total, date) => {
      return total + analytics.getDailyVisitorCount(date);
    }, 0);
  };

  const getAverageLoadTime = () => {
    if (data.performanceHistory.length === 0) return 0;
    const total = data.performanceHistory.reduce((sum, perf) => sum + perf.loadTime, 0);
    return Math.round(total / data.performanceHistory.length);
  };

  const getTotalPageViews = () => {
    return data.pageViews.length;
  };

  // Secret key combination to show dashboard
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Press Ctrl+Shift+A to toggle dashboard
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  if (!isVisible) {
    return (null
      // <div className="fixed bottom-4 right-4 text-xs text-slate-500">
      //   Press Ctrl+Shift+A for analytics
      // </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-400">Analytics Dashboard</h2>
          <Button
            onClick={() => setIsVisible(false)}
            variant="outline"
            size="sm"
          >
            Close
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Today's Visitors
              </CardTitle>
              <Users className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{getTodayVisitors()}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Weekly Visitors
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{getWeeklyVisitors()}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total Page Views
              </CardTitle>
              <Eye className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{getTotalPageViews()}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Avg Load Time
              </CardTitle>
              <Clock className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{getAverageLoadTime()}ms</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-cyan-400">Recent Page Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {data.pageViews.slice(-10).reverse().map((view, index) => (
                  <div key={index} className="text-sm text-slate-300 border-b border-slate-700 pb-2">
                    <div>{new Date(view.timestamp).toLocaleString()}</div>
                    <div className="text-xs text-slate-500">{view.language} | {view.screenResolution}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-cyan-400">Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {data.customEvents.slice(-10).reverse().map((event, index) => (
                  <div key={index} className="text-sm text-slate-300 border-b border-slate-700 pb-2">
                    <div className="font-medium">{event.event}</div>
                    <div className="text-xs text-slate-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                    {event.properties && (
                      <div className="text-xs text-slate-400">
                        {JSON.stringify(event.properties)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-sm text-slate-400">
          <p>Analytics data is stored locally in your browser. This is a privacy-focused solution that doesn't send data to external servers.</p>
          <p className="mt-2">For production use, consider integrating with Google Analytics, Plausible, or other analytics platforms.</p>
        </div>
      </div>
    </div>
  );
};