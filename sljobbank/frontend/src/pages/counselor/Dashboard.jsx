import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsApi, careerTestResultApi } from '@/api';
import useAuthStore from '/src/store/authStore';
import {
  Users,
  Briefcase,
  Award,
  MessageCircle,
  ChevronRight,
  Sparkles,
  Clock,
} from 'lucide-react';

export default function CounselorDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [pendingResults, setPendingResults] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dashboardRes, resultsRes] = await Promise.all([
          analyticsApi.getDashboard().catch(() => ({})),
          careerTestResultApi.getAll().catch(() => ({})),
        ]);

        setDashboard(dashboardRes.data?.data || {});
        
        const results = resultsRes.data?.data || [];
        setPendingResults(
          results.filter(r => r.studentDownloadedAt && !r.counselorDownloadEnabled).length
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const firstName = user?.fullName?.split(' ')[0] || 'Counselor';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-20 bg-gray-200 rounded-3xl w-3/4" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-gray-200 rounded-3xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0A2E1C] flex items-center justify-center text-white text-4xl font-bold shadow-inner">
            {firstName[0]}
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your students today.</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Total Students"
          value={dashboard?.totalUsers ?? 0}
          color="#0A2E1C"
        />
        <StatCard
          icon={<Briefcase className="w-6 h-6" />}
          label="Active Jobs"
          value={dashboard?.totalJobs ?? 0}
          color="#E8A200"
        />
        <StatCard
          icon={<Award className="w-6 h-6" />}
          label="Career Tests"
          value={dashboard?.careerTestsCompleted ?? 0}
          color="#2563EB"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Pending Results"
          value={pendingResults}
          color="#EF4444"
          highlight={pendingResults > 0}
          onClick={() => navigate('/counselor/career-results')}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
          ⚡ Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard
            icon="💼"
            title="Manage Jobs"
            desc="Create and update job listings"
            onClick={() => navigate('/counselor/jobs')}
          />
          <ActionCard
            icon="🧭"
            title="Career Results"
            desc="Review & enable student tests"
            onClick={() => navigate('/counselor/career-results')}
            badge={pendingResults > 0 ? pendingResults : null}
          />
          <ActionCard
            icon="💬"
            title="Community Chat"
            desc="Engage with students"
            onClick={() => navigate('/counselor/chat')}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          🕒 Recent Activity
        </h2>
        <div className="space-y-4 text-sm">
          {dashboard ? (
            <>
              <div className="flex items-center gap-4 py-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span><strong>{dashboard.totalJobs}</strong> jobs are currently active on the platform</span>
              </div>
              <div className="flex items-center gap-4 py-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span><strong>{dashboard.totalClusters}</strong> career clusters available for students</span>
              </div>
              {pendingResults > 0 && (
                <div className="flex items-center gap-4 py-2 text-amber-600">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span><strong>{pendingResults}</strong> student career test results are waiting for your review</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-400">No recent activity to show.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Reusable Components ─── */

function StatCard({ icon, label, value, color, highlight = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-lg transition-all cursor-pointer ${highlight ? 'ring-2 ring-offset-2 ring-red-200' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-4xl font-bold text-gray-900 tracking-tighter">{value}</div>
          <div className="text-sm text-gray-500 mt-2">{label}</div>
        </div>
        <div className="p-3 rounded-2xl" style={{ backgroundColor: `${color}15` }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, desc, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-3xl p-6 text-left hover:shadow-xl hover:-translate-y-0.5 transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl opacity-80 group-hover:scale-110 transition-transform">{icon}</div>
        <div className="flex-1">
          <div className="font-semibold text-lg text-gray-900">{title}</div>
          <div className="text-sm text-gray-500 mt-1">{desc}</div>
        </div>
        {badge && (
          <div className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full self-start">
            {badge}
          </div>
        )}
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 mt-1 transition" />
      </div>
    </button>
  );
}


