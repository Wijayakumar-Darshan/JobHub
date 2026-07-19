import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentProfileApi, jobApi } from '@/api';
import { useAuthStore } from '/src/store/authStore';
import {
  Briefcase,
  ChevronRight,
  Compass,
  MessageCircle,
  Sparkles,
  User,
  FileText,
  Clock,
  TrendingUp,
  Award,
  Zap,
  ArrowUpRight,
  GraduationCap,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, jobsRes] = await Promise.all([
          studentProfileApi.me().catch(() => ({ data: { data: null } })),
          jobApi.getRecommended(6).catch(() => ({ data: { data: [] } })),
        ]);
        setProfile(profileRes?.data?.data || null);
        setRecommended(jobsRes?.data?.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const firstName = user?.fullName?.split(' ')[0] || 'Student';
  const hasProfile = !!profile?.topCluster;

  const stats = [
    { label: 'Applied Jobs', value: profile?.applicationsCount || 0, icon: FileText, color: '#1A6B50' },
    { label: 'Saved Jobs', value: profile?.savedJobsCount || 0, icon: Clock, color: '#2563EB' },
    { label: 'Profile Views', value: profile?.profileViews || 0, icon: TrendingUp, color: '#7C3AED' },
    { label: 'Career Matches', value: profile?.matchesCount || 0, icon: Award, color: '#D97706' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFB] px-4 py-6 md:px-8 md:py-8">
      <div className="max-w-7xl mx-auto">

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2E1C] to-[#1A5C3A] p-8 md:p-12 mb-10 shadow-xl shadow-[#0A2E1C]/30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cGF0aCBkPSJNMjAgMjBoNDB2NDBIMjB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+')] opacity-5 bg-repeat" />
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner border border-white/20">
                👋
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Welcome back, {firstName}
                </h1>
                <p className="text-white/70 mt-1">Let's find your next great opportunity</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/student/profile')}
                className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 text-white rounded-2xl transition-all"
              >
                <User className="w-4 h-4" />
                My Profile
              </button>
              <button
                onClick={() => navigate('/student/jobs')}
                className="flex items-center gap-2 px-6 py-3 bg-white text-[#0A2E1C] font-semibold rounded-2xl hover:bg-white/90 transition-all shadow-md"
              >
                <Briefcase className="w-4 h-4" />
                Browse Jobs
              </button>
            </div>
          </div>
        </div>

        {/* Profile Completion Banner */}
        {!hasProfile && (
          <div className="mb-10 bg-gradient-to-r from-amber-50 to-white border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Compass className="w-6 h-6 text-amber-600" />
                <h3 className="font-semibold text-amber-800">Complete Your Career Profile</h3>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                Help us match you with the right opportunities by telling us about your skills and interests.
              </p>
            </div>
            <button
              onClick={() => navigate('/student/profile')}
              className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition whitespace-nowrap"
            >
              Complete Profile →
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1 tracking-wide">{stat.label}</div>
                </div>
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Recommended Jobs */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-[#1A6B50]" />
                <h2 className="font-bold text-lg">Recommended For You</h2>
              </div>
              <button
                onClick={() => navigate('/student/jobs')}
                className="text-sm text-[#1A6B50] font-medium flex items-center gap-1 hover:gap-1.5 transition-all"
              >
                View All <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-6 animate-pulse">
                    <div className="h-5 w-3/4 bg-gray-200 rounded" />
                    <div className="h-3 w-1/2 bg-gray-100 mt-3 rounded" />
                  </div>
                ))
              ) : recommended.length > 0 ? (
                recommended.map(job => (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/student/jobs/${job.id}`)}
                    className="p-6 hover:bg-[#F8FAFB] cursor-pointer group transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#1A6B50] transition-colors">
                          {job.title}
                        </h3>
                        <div className="text-sm text-gray-500 mt-1">
                          {job.cluster?.name} • {job.location || 'Remote'}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#1A6B50] transition-colors mt-1" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-400">
                  Complete your profile to get personalized job recommendations.
                </div>
              )}
            </div>
          </div>

          {/* Side Cards */}
          <div className="space-y-6">

            {/* Career Test Card */}
            <div className="bg-gradient-to-br from-[#0A2E1C] to-[#1A5C3A] rounded-3xl p-7 text-white relative overflow-hidden shadow-lg">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
              <Compass className="w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold">Discover Your Career Path</h3>
              <p className="text-white/70 mt-2 text-[15px]">
                Take the Career Key Test — a quick way to understand your strengths and ideal career directions.
              </p>
              <button
                onClick={() => navigate('/student/career-test')}
                className="mt-6 w-full py-3 bg-white text-[#0A2E1C] font-semibold rounded-2xl hover:bg-white/90 transition"
              >
                Start Career Key Test
              </button>
            </div>

            {/* Community Card */}
            <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-[#1A6B50]/10 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-[#1A6B50]" />
                </div>
                <div>
                  <h3 className="font-bold">Join the Community</h3>
                  <p className="text-xs text-gray-400">Talk with counselors &amp; peers</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/student/chat')}
                className="mt-6 w-full py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-2xl font-medium transition"
              >
                Open Community Chat
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

