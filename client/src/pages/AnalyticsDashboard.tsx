import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, Eye, Clock, TrendingUp, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Design Philosophy: Analytics Dashboard
 * - Real-time visitor data visualization
 * - Page performance metrics
 * - Scroll depth analysis
 * - Time spent tracking
 * - Admin-only access
 */

interface AnalyticsSummary {
  totalVisitors: number;
  totalPageViews: number;
  averageTimeSpent: number;
  averageScrollDepth: number;
  topPages: Array<{ page: string; views: number; avgTime: number }>;
}

export default function AnalyticsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

  const { data: analyticsData, refetch } = trpc.analytics.getSummary.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  useEffect(() => {
    if (analyticsData) {
      setSummary(analyticsData as AnalyticsSummary);
    }
  }, [analyticsData]);

  const handleLogin = () => {
    if (!password) {
      toast.error("Please enter password");
      return;
    }

    setIsLoading(true);
    const correctPassword = "bayezid@2024";
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      toast.success("Analytics access granted!");
      setPassword("");
      refetch();
    } else {
      toast.error("Incorrect password");
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setSummary(null);
    toast.success("Logged out");
  };

  const handleExportData = () => {
    if (!summary) return;
    
    const csvContent = [
      ["Analytics Report"],
      ["Generated:", new Date().toLocaleString()],
      [""],
      ["Summary Metrics"],
      ["Total Visitors", summary.totalVisitors],
      ["Total Page Views", summary.totalPageViews],
      ["Average Time Spent (seconds)", summary.averageTimeSpent],
      ["Average Scroll Depth (%)", summary.averageScrollDepth],
      [""],
      ["Top Pages"],
      ["Page", "Views", "Average Time (seconds)"],
      ...summary.topPages.map(p => [p.page, p.views, p.avgTime])
    ];

    const csv = csvContent.map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Analytics exported!");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-2">Analytics Dashboard</h1>
          <p className="text-slate-400 text-center mb-8">Enter your password to view visitor analytics</p>

          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Access Analytics
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-slate-400">Real-time visitor analytics and page performance</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-300 font-bold rounded-lg hover:bg-green-500/30 transition-all"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-300 font-bold rounded-lg hover:bg-red-500/30 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {summary && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 font-semibold">Total Visitors</h3>
                  <Users className="w-6 h-6 text-indigo-400" />
                </div>
                <p className="text-4xl font-bold text-white">{summary.totalVisitors}</p>
                <p className="text-slate-400 text-sm mt-2">Unique sessions</p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 font-semibold">Page Views</h3>
                  <Eye className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-4xl font-bold text-white">{summary.totalPageViews}</p>
                <p className="text-slate-400 text-sm mt-2">Total page visits</p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 font-semibold">Avg. Time Spent</h3>
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <p className="text-4xl font-bold text-white">{summary.averageTimeSpent}s</p>
                <p className="text-slate-400 text-sm mt-2">Per page visit</p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 font-semibold">Avg. Scroll Depth</h3>
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-4xl font-bold text-white">{summary.averageScrollDepth}%</p>
                <p className="text-slate-400 text-sm mt-2">Page engagement</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* Top Pages Bar Chart */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Top Pages by Views</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={summary.topPages}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="page" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="views" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Average Time Spent Chart */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Average Time Spent by Page</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={summary.topPages}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="page" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)" }} />
                    <Line type="monotone" dataKey="avgTime" stroke="#a855f7" strokeWidth={2} dot={{ fill: "#a855f7" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Pages Table */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Detailed Page Performance</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-slate-400 font-semibold">Page</th>
                      <th className="px-6 py-4 text-left text-slate-400 font-semibold">Views</th>
                      <th className="px-6 py-4 text-left text-slate-400 font-semibold">Avg. Time (seconds)</th>
                      <th className="px-6 py-4 text-left text-slate-400 font-semibold">Engagement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.topPages.map((page, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white font-medium">{page.page}</td>
                        <td className="px-6 py-4 text-indigo-400 font-bold">{page.views}</td>
                        <td className="px-6 py-4 text-purple-400 font-bold">{page.avgTime}s</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                                style={{ width: `${Math.min((page.avgTime / 60) * 100, 100)}%` }}
                              />
                            </div>
                            <span className="text-slate-400 text-sm">{Math.min((page.avgTime / 60) * 100, 100).toFixed(0)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
