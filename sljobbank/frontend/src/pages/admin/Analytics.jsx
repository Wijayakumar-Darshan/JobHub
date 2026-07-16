import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { analyticsApi } from '@/api';
import { TrendingUp, Users, Briefcase, Award, Download } from 'lucide-react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [yearlyReport, setYearlyReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, yearlyRes] = await Promise.all([
          analyticsApi.getDashboard(),
          analyticsApi.getYearlyReport(new Date().getFullYear())
        ]);
        
        setStats(dashboardRes.data.data);
        setYearlyReport(yearlyRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2E1C] mx-auto" />
          <p className="mt-4 text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            📊 Platform Analytics
          </h1>
          <p className="text-gray-600 mt-1">Real-time insights into platform usage and performance</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0A2E1C] text-white px-5 py-3 rounded-2xl hover:bg-[#1A6B50]">
          <Download className="w-5 h-5" /> Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats && [
          { label: "Total Users", value: stats.totalUsers, icon: Users, color: "#0A2E1C" },
          { label: "Total Jobs", value: stats.totalJobs, icon: Briefcase, color: "#E8A200" },
          { label: "Career Clusters", value: stats.totalClusters, icon: Award, color: "#2563EB" },
          { label: "Revenue", value: `LKR ${stats.totalRevenue?.toLocaleString()}`, icon: TrendingUp, color: "#059669" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{item.label}</p>
                <p className="text-4xl font-bold text-gray-900 mt-2 tracking-tight">{item.value}</p>
              </div>
              <div style={{ color: item.color }} className="opacity-80">
                <item.icon className="w-10 h-10" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Activity */}
      {yearlyReport && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10">
          <h2 className="text-xl font-semibold mb-6">Monthly Active Students</h2>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={yearlyReport.monthlyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="activeStudents" fill="#0A2E1C" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Most Popular Jobs */}
        {yearlyReport && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              🔥 Most Searched Jobs
            </h2>
            <div className="space-y-4">
              {yearlyReport.mostSearchedJobs?.slice(0, 5).map((job, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="font-medium">{job.title}</span>
                  <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-medium">
                    {job.viewCount} views
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Platform Health</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Student Engagement</span>
                <span className="font-medium text-emerald-600">High</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-2 bg-emerald-600 rounded-full w-[87%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Job Matching Success</span>
                <span className="font-medium text-emerald-600">Good</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-2 bg-emerald-600 rounded-full w-[76%]" />
              </div>
            </div>
          </div>

          {yearlyReport && (
            <div className="mt-8 pt-6 border-t text-sm">
              <p className="font-medium text-gray-700">Usefulness Summary</p>
              <p className="text-gray-600 mt-2 leading-relaxed">
                {yearlyReport.usefulnessSummary || "Platform continues to show strong engagement among students."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}