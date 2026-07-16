import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsApi } from '@/api';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.getDashboard().then(res => setDashboard(res.data.data)),
      analyticsApi.getMonthly().then(res => setMonthly(res.data.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const STATS = [
    { label: 'Total Users', value: dashboard?.totalUsers, icon: '👥', color: 'from-blue-500 to-cyan-600', textColor: 'text-blue-600' },
    { label: 'Total Jobs', value: dashboard?.totalJobs, icon: '💼', color: 'from-amber-500 to-orange-600', textColor: 'text-amber-600' },
    { label: 'Total Clusters', value: dashboard?.totalClusters, icon: '🗂️', color: 'from-indigo-500 to-violet-600', textColor: 'text-indigo-600' },
    { label: 'Revenue (LKR)', value: dashboard?.totalRevenue?.toLocaleString(), icon: '💰', color: 'from-emerald-500 to-teal-600', textColor: 'text-emerald-600' },
  ];

  const QUICK_LINKS = [
    { path: '/admin/clusters', icon: '🗂️', label: 'Career Clusters', description: 'Manage clusters & paths' },
    { path: '/admin/jobs', icon: '💼', label: 'Job Management', description: 'Create & edit listings' },
    { path: '/admin/qualifications', icon: '🎓', label: 'Qualifications', description: 'Levels & requirements' },
    { path: '/admin/institutes', icon: '🏫', label: 'Institutes', description: 'Universities & partners' },
    { path: '/admin/career-results', icon: '🧭', label: 'Career Results', description: 'Student outcomes' },
    { path: '/admin/users', icon: '👥', label: 'User Management', description: 'Platform users' },
    { path: '/admin/security', icon: '🔐', label: 'Security', description: 'Admin settings' },
    { path: '/admin/analytics', icon: '📊', label: 'Analytics', description: 'Deep insights' },
  ];

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const firstName = user?.fullName?.split(' ')[0] || 'Admin';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-20 bg-gray-200 rounded-3xl w-3/4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2E1C] to-[#1A6B50] p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner border border-white/20">
              {getInitials(user?.fullName)}
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">Welcome back, {firstName} 👋</h1>
              <p className="text-emerald-100 mt-1 text-lg">Here's what's happening across the platform today.</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm opacity-75">Today</div>
            <div className="text-xl font-medium">
              {new Date().toLocaleDateString('en-LK', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, index) => (
          <div
            key={index}
            className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-3xl text-white shadow-md`}>
                {stat.icon}
              </div>
              <div className={`text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600`}>
                {stat.label}
              </div>
            </div>

            <div className="mt-8">
              <div className="text-4xl font-bold text-gray-900 tracking-tighter">
                {stat.value ?? '—'}
              </div>
              <div className="text-sm text-gray-500 mt-1">Total</div>
            </div>

            {/* Optional trend */}
            <div className="mt-4 text-xs flex items-center gap-1 text-emerald-600">
              <span>↑ 12%</span>
              <span className="text-gray-400">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Activity */}
      {monthly && (
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="uppercase text-xs tracking-[2px] font-semibold text-[#0A2E1C]">This Month</span>
              <h3 className="text-2xl font-semibold text-gray-800 mt-1">Platform Activity</h3>
            </div>
            <div className="text-emerald-600 text-sm font-medium">📅 Live</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-semibold text-[#0A2E1C]">{monthly.activeStudents}</div>
              <div className="text-gray-500 mt-2">Active Students</div>
            </div>
            <div>
              <div className="text-5xl font-semibold text-[#0A2E1C]">{monthly.totalStudentLogins}</div>
              <div className="text-gray-500 mt-2">Total Logins</div>
            </div>
            <div>
              <div className="text-5xl font-semibold text-[#0A2E1C]">{monthly.newStudentRegistrations}</div>
              <div className="text-gray-500 mt-2">New Registrations</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Access */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          ⚡ Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {QUICK_LINKS.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="group bg-white border border-gray-100 hover:border-emerald-200 rounded-3xl p-6 text-left transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.985]"
            >
              <div className="text-4xl mb-6 transition-transform group-hover:scale-110">{link.icon}</div>
              <div className="font-semibold text-lg text-gray-800 mb-1">{link.label}</div>
              <div className="text-sm text-gray-500 line-clamp-2">{link.description}</div>
              <div className="mt-6 text-emerald-600 text-xl opacity-0 group-hover:opacity-100 transition-all">→</div>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 pt-8">
        Last updated: {new Date().toLocaleString('en-LK')}
      </div>
    </div>
  );
}