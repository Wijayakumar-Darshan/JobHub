import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { analyticsApi } from '@/api'

export default function AnalyticsPage() {
  const [dashboard, setDashboard] = useState(null)
  const [topJobs, setTopJobs] = useState([])
  const [monthly, setMonthly] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      analyticsApi.getDashboard().then(res => setDashboard(res.data.data)),
      analyticsApi.getTopJobs().then(res => setTopJobs(res.data.data || [])),
      analyticsApi.getMonthly().then(res => setMonthly(res.data.data)).catch(() => {})
    ]).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2E1C] mx-auto"></div>
          <p className="text-sm text-gray-400 mt-3">Loading analytics…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span>📊</span> Analytics
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Platform activity overview and job performance metrics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon="👥"
          label="Total Users"
          value={dashboard?.totalUsers ?? '-'}
          gradient="from-blue-50 to-blue-100"
          textColor="text-blue-700"
        />
        <StatCard
          icon="💼"
          label="Total Jobs"
          value={dashboard?.totalJobs ?? '-'}
          gradient="from-amber-50 to-amber-100"
          textColor="text-amber-700"
        />
        <StatCard
          icon="📈"
          label="Active This Month"
          value={monthly?.activeStudents ?? '-'}
          gradient="from-emerald-50 to-emerald-100"
          textColor="text-emerald-700"
        />
        <StatCard
          icon="🔑"
          label="Logins This Month"
          value={monthly?.totalStudentLogins ?? '-'}
          gradient="from-purple-50 to-purple-100"
          textColor="text-purple-700"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span>🏆</span> Top Viewed Jobs
          </h2>
          <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
            By view count
          </span>
        </div>
        {topJobs.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            No job view data available yet.
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topJobs}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 50, bottom: 10 }}
                barSize={14}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="title"
                  tick={{ fontSize: 11, fill: '#4B5563' }}
                  width={130}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '12px',
                    padding: '8px 12px'
                  }}
                  formatter={(value) => [`${value} views`, '']}
                  labelStyle={{ fontWeight: 600, color: '#1F2937' }}
                />
                <Bar
                  dataKey="viewCount"
                  fill="#0A2E1C"
                  radius={[0, 4, 4, 0]}
                  background={{ fill: '#F3F4F6' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Extra Info (optional) */}
      <div className="mt-6 text-xs text-gray-400 text-center">
        Data updates in real‑time. Last refreshed: {new Date().toLocaleString()}
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ icon, label, value, gradient, textColor }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div className="text-3xl">{icon}</div>
        <div className={`text-xs font-semibold ${textColor} bg-white/60 px-2.5 py-0.5 rounded-full`}>
          {label}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-400 mt-0.5">Total</div>
      </div>
    </div>
  )
}

