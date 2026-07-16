// ============================================================
// 1. UPDATED JobsPage (src/pages/student/JobsPage.jsx)
// ============================================================

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jobApi, clusterApi, favoriteApi } from '@/api';
import toast from 'react-hot-toast';
import {
  Search,
  X,
  Heart,
  HeartOff,
  Briefcase,
  MapPin,
  DollarSign,
  TrendingUp,
  GraduationCap,
  Sparkles,
  Filter,
  Layers,
  Minus,
  TrendingDown,
  Info,
} from 'lucide-react';

// ─── Demand helper ─────────────────────────────────────────────
function getDemandMeta(demand) {
  if (!demand) return null;
  const lower = demand.toLowerCase();
  if (lower.includes('high')) {
    return {
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: TrendingUp,
      label: 'High Demand',
      progress: 85,
      tooltip: 'Many job openings available; strong career growth.',
    };
  }
  if (lower.includes('average') || lower.includes('medium')) {
    return {
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: Minus,
      label: 'Average Demand',
      progress: 50,
      tooltip: 'Moderate job openings; steady opportunities.',
    };
  }
  if (lower.includes('low')) {
    return {
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: TrendingDown,
      label: 'Low Demand',
      progress: 20,
      tooltip: 'Fewer openings; may require extra skills or patience.',
    };
  }
  return null;
}

export default function JobsPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [clusters, setClusters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [q, setQ] = useState(params.get('q') || '');
  const [clusterId, setClusterId] = useState(params.get('clusterId') || '');
  const [loading, setLoading] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    clusterApi.getAll()
      .then(res => setClusters(res.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    favoriteApi.getMyFavorites()
      .then(res => setFavoriteIds(new Set((res.data.data || []).map(f => f.job.id))))
      .catch(() => {});
  }, []);

  function search() {
    setLoading(true);
    jobApi.getAll({
      q: q || undefined,
      clusterId: clusterId || undefined,
      size: 50,
    })
      .then(res => {
        const content = res.data.data?.content || [];
        setJobs(content);
        setTotalJobs(res.data.data?.totalElements || content.length);
      })
      .catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clusterId]);

  const toggleFavorite = async (e, jobId) => {
    e.stopPropagation();
    try {
      if (favoriteIds.has(jobId)) {
        await favoriteApi.remove(jobId);
        setFavoriteIds(prev => {
          const s = new Set(prev);
          s.delete(jobId);
          return s;
        });
        toast.success('Removed from favorites');
      } else {
        await favoriteApi.add(jobId);
        setFavoriteIds(prev => new Set(prev).add(jobId));
        toast.success('Added to favorites ❤️');
      }
    } catch {
      toast.error('Could not update favorites.');
    }
  };

  const clearFilters = () => {
    setQ('');
    setClusterId('');
    setTimeout(search, 0);
  };

  // ─── Skeleton ────────────────────────────────────────────────
  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-2xl" />
          <div className="h-12 bg-gray-200 rounded-xl" />
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-56 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] px-4 py-6 md:px-8 md:py-8">
      <div className="max-w-7xl mx-auto">
        {/* ─── HERO ─── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A2E1C] to-[#1A5C3A] p-6 md:p-10 mb-6 shadow-lg shadow-[#0A2E1C]/20">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cGF0aCBkPSJNMjAgMjBoNDB2NDBIMjB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+')] bg-repeat" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-7 h-7 text-white/80" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">Browse Jobs</h1>
              </div>
              <p className="text-white/70 text-sm md:text-base mt-1 max-w-xl">
                Explore careers across every cluster, or search for something specific.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <Sparkles className="w-4 h-4 text-white/60" />
              <span className="text-white/80 text-sm font-medium">
                {totalJobs} jobs found
              </span>
            </div>
          </div>
        </div>

        {/* ─── SEARCH BAR ─── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search job titles, keywords..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && search()}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B50]/30 focus:border-[#1A6B50] transition-shadow"
              />
            </div>
            <div className="relative md:w-56">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={clusterId}
                onChange={(e) => setClusterId(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B50]/30 focus:border-[#1A6B50] transition-shadow appearance-none"
              >
                <option value="">All Clusters</option>
                {clusters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={search}
                className="px-6 py-2.5 bg-[#1A6B50] text-white rounded-xl font-semibold hover:bg-[#145A42] transition shadow-md shadow-[#1A6B50]/20 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
              {(q || clusterId) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── JOB GRID ─── */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-5 animate-pulse">
                <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-3" />
                <div className="h-4 w-full bg-gray-100 rounded mb-2" />
                <div className="h-4 w-2/3 bg-gray-100 rounded mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-200 rounded-full" />
                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100/80">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-9 h-9 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No jobs found</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
              {q || clusterId
                ? `We couldn't find any jobs matching your criteria. Try adjusting your search or clear filters.`
                : 'No jobs are available at the moment. Check back soon!'}
            </p>
            {(q || clusterId) && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-[#1A6B50] font-medium hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {jobs.map((job) => {
              const demandMeta = getDemandMeta(job.industryDemand);
              const DemandIcon = demandMeta?.icon || TrendingUp;

              return (
                <div
                  key={job.id}
                  onClick={() => navigate(`/student/jobs/${job.id}`)}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden hover:shadow-xl hover:border-[#1A6B50] transition-all duration-300 cursor-pointer hover:-translate-y-1 relative"
                >
                  {/* Favorite button */}
                  <button
                    onClick={(e) => toggleFavorite(e, job.id)}
                    className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm border border-gray-100 hover:bg-white transition-colors"
                    aria-label={favoriteIds.has(job.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {favoriteIds.has(job.id) ? (
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    ) : (
                      <HeartOff className="w-5 h-5 text-gray-400 group-hover:text-[#1A6B50] transition-colors" />
                    )}
                  </button>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{job.clusterEmoji || '💼'}</span>
                        <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full">
                          {job.clusterName || 'General'}
                        </span>
                      </div>
                      {/* ─── DEMAND INDICATOR ─── */}
                      {demandMeta && (
                        <div
                          className="group/tip relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                          style={{ backgroundColor: demandMeta.color.split(' ')[0], color: demandMeta.color.split(' ')[2] }}
                        >
                          <DemandIcon className="w-3.5 h-3.5" />
                          <span>{demandMeta.label}</span>
                          {/* Tooltip */}
                          <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tip:block bg-gray-800 text-white text-xs rounded-lg px-3 py-2 w-48 shadow-lg z-20">
                            {demandMeta.tooltip}
                            <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-800" />
                          </div>
                        </div>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-gray-900 group-hover:text-[#1A6B50] transition-colors pr-8 line-clamp-1">
                      {job.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">
                      {job.description}
                    </p>

                    {(job.salaryMin || job.salaryMax) && (
                      <div className="flex items-center gap-1.5 mt-3 text-sm font-semibold text-[#1A6B50]">
                        <DollarSign className="w-4 h-4" />
                        LKR {job.salaryMin?.toLocaleString()} – {job.salaryMax?.toLocaleString()}
                        <span className="text-xs font-normal text-gray-400">/ month</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                      {job.alStream && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                          <GraduationCap className="w-3 h-3" />
                          {job.alStream}
                        </span>
                      )}
                      {job.remoteAvailable && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">
                          <Sparkles className="w-3 h-3" />
                          Remote
                        </span>
                      )}
                      {job.location && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* View link */}
                  <div className="px-5 pb-4 pt-0">
                    <div className="text-sm font-semibold text-[#1A6B50] group-hover:gap-2 transition-all flex items-center">
                      View Details
                      <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── LOAD MORE ─── */}
        {!loading && jobs.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              Showing {jobs.length} of {totalJobs} jobs
            </p>
            {totalJobs > jobs.length && (
              <button
                onClick={() => toast('Load more functionality can be added with pagination.')}
                className="mt-3 px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:border-[#1A6B50] hover:text-[#1A6B50] transition"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}