// src/pages/student/FavoritesPage.jsx
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { favoriteApi, clusterApi } from '@/api';
import {
  Heart,
  Briefcase,
  MapPin,
  DollarSign,
  TrendingUp,
  Sparkles,
  Compass,
  Bookmark,
  ArrowRight,
} from 'lucide-react';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load clusters once
  useEffect(() => {
    clusterApi.getAll()
      .then(res => setClusters(res.data.data || []))
      .catch(() => {});
  }, []);

  // Build a quick lookup map for cluster emoji/name
  const clusterMap = useMemo(() => {
    const map = {};
    clusters.forEach(c => {
      map[c.id] = { emoji: c.emoji || '📁', name: c.name || 'Unknown Cluster' };
    });
    return map;
  }, [clusters]);

  // Load favorites
  function loadFavorites() {
    setLoading(true);
    favoriteApi.getMyFavorites()
      .then((res) => setFavorites(res.data.data || []))
      .catch(() => toast.error('Failed to load favorites'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  async function removeFavorite(jobId, e) {
    e.stopPropagation();
    try {
      await favoriteApi.remove(jobId);
      toast.success('Removed from favorites');
      loadFavorites();
    } catch {
      toast.error('Could not remove.');
    }
  }

  // Helper to get cluster info from job
  function getClusterInfo(job) {
    // If job has direct fields, use them
    if (job.clusterEmoji && job.clusterName) {
      return { emoji: job.clusterEmoji, name: job.clusterName };
    }
    // Otherwise use clusterId mapping
    if (job.clusterId && clusterMap[job.clusterId]) {
      return clusterMap[job.clusterId];
    }
    // Fallback
    return { emoji: '📁', name: 'Unknown Cluster' };
  }

  // Skeleton loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto animate-pulse space-y-6">
          <div className="h-40 bg-gray-200 rounded-2xl" />
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
        {/* ─── HERO SECTION ─── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A2E1C] to-[#1A5C3A] p-6 md:p-10 mb-6 shadow-lg shadow-[#0A2E1C]/20">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cGF0aCBkPSJNMjAgMjBoNDB2NDBIMjB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+')] bg-repeat" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <Heart className="w-7 h-7 text-white/80 fill-white/20" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">Saved Jobs</h1>
              </div>
              <p className="text-white/70 text-sm md:text-base mt-1 max-w-xl">
                Jobs you've bookmarked for later. Review and apply when you're ready.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <Bookmark className="w-4 h-4 text-white/60" />
              <span className="text-white/80 text-sm font-medium">
                {favorites.length} {favorites.length === 1 ? 'job' : 'jobs'} saved
              </span>
            </div>
          </div>
        </div>

        {/* ─── EMPTY STATE ─── */}
        {favorites.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100/80">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-9 h-9 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No saved jobs yet</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
              Browse jobs and tap the heart icon to save them here for easy access later.
            </p>
            <button
              onClick={() => navigate('/student/jobs')}
              className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-[#1A6B50] text-white rounded-xl font-semibold hover:bg-[#145A42] transition shadow-md"
            >
              Browse Jobs
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* ─── FAVORITES GRID ─── */
          <div className="grid md:grid-cols-2 gap-5">
            {favorites.map((fav) => {
              const job = fav.job;
              const clusterInfo = getClusterInfo(job);

              // Demand badge color
              let demandColor = 'bg-gray-100 text-gray-600';
              if (job.industryDemand === 'HIGH') demandColor = 'bg-green-100 text-green-800';
              else if (job.industryDemand === 'MEDIUM') demandColor = 'bg-yellow-100 text-yellow-800';
              else if (job.industryDemand === 'LOW') demandColor = 'bg-red-100 text-red-800';

              return (
                <div
                  key={fav.id}
                  onClick={() => navigate(`/student/jobs/${job.id}`)}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden hover:shadow-xl hover:border-[#1A6B50] transition-all duration-300 cursor-pointer hover:-translate-y-1 relative"
                >
                  {/* Remove button (filled heart) */}
                  <button
                    onClick={(e) => removeFavorite(job.id, e)}
                    className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm border border-gray-100 hover:bg-red-50 hover:border-red-200 transition-colors group/remove"
                    aria-label="Remove from favorites"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500 group-hover/remove:scale-110 transition-transform" />
                  </button>

                  <div className="p-5">
                    {/* Cluster & demand */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{clusterInfo.emoji}</span>
                        <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full">
                          {clusterInfo.name}
                        </span>
                      </div>
                      {job.industryDemand && (
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${demandColor}`}>
                          {job.industryDemand} Demand
                        </span>
                      )}
                    </div>

                    {/* Job title */}
                    <h3 className="text-base font-extrabold text-gray-900 group-hover:text-[#1A6B50] transition-colors pr-8 line-clamp-1">
                      {job.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">
                      {job.description || 'No description available.'}
                    </p>

                    {/* Salary */}
                    {(job.salaryMin || job.salaryMax) && (
                      <div className="flex items-center gap-1.5 mt-3 text-sm font-semibold text-[#1A6B50]">
                        <DollarSign className="w-4 h-4" />
                        LKR {job.salaryMin?.toLocaleString()} – {job.salaryMax?.toLocaleString()}
                        <span className="text-xs font-normal text-gray-400">/ month</span>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                      {job.alStream && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                          <Compass className="w-3 h-3" />
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
      </div>
    </div>
  );
}