// src/pages/student/Clusters.jsx
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { clusterApi, jobApi } from '@/api'; // added jobApi
import {
  Compass,
  Search,
  ArrowRight,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function StudentClusters() {
  const navigate = useNavigate();
  const [clusters, setClusters] = useState([]);
  const [jobCounts, setJobCounts] = useState({}); // clusterId -> count
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch clusters and jobs in parallel
        const [clustersRes, jobsRes] = await Promise.all([
          clusterApi.getAll(),
          jobApi.getAll({ size: 1000 }), // fetch enough jobs
        ]);

        const clustersData = clustersRes.data.data || [];
        setClusters(clustersData);

        // Compute job count per cluster
        const jobs = jobsRes.data.data?.content || jobsRes.data.data || [];
        const counts = {};
        jobs.forEach(job => {
          const clusterId = job.clusterId || job.cluster?.id;
          if (clusterId) {
            counts[clusterId] = (counts[clusterId] || 0) + 1;
          }
        });
        setJobCounts(counts);

        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter clusters by name or description
  const filteredClusters = useMemo(() => {
    if (!searchQuery.trim()) return clusters;
    const q = searchQuery.toLowerCase().trim();
    return clusters.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [clusters, searchQuery]);

  const handleClusterClick = (clusterId) => {
    navigate(`/student/jobs?clusterId=${clusterId}`);
  };

  // Skeleton loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-40 bg-gray-200 rounded-2xl" />
            <div className="grid md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-56 bg-gray-200 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800">Something went wrong</h2>
          <p className="text-gray-500 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-[#1A6B50] text-white rounded-xl hover:bg-[#145A42] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] px-4 py-6 md:px-8 md:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A2E1C] to-[#1A5C3A] p-6 md:p-10 mb-8 shadow-lg shadow-[#0A2E1C]/20">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cGF0aCBkPSJNMjAgMjBoNDB2NDBIMjB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+')] bg-repeat" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <Compass className="w-7 h-7 text-white/80" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">Career Clusters</h1>
              </div>
              <p className="text-white/70 text-sm md:text-base mt-1 max-w-xl">
                Explore career paths grouped by interest areas. Click any cluster to discover relevant jobs.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <Sparkles className="w-4 h-4 text-white/60" />
              <span className="text-white/80 text-sm font-medium">
                {clusters.length} clusters available
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clusters by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B50]/30 focus:border-[#1A6B50] transition-shadow"
            />
          </div>
        </div>

        {/* Cluster Grid */}
        {filteredClusters.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-9 h-9 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No clusters found</h3>
            <p className="text-sm text-gray-400 mt-1">
              {searchQuery.trim()
                ? `We couldn't find any cluster matching "${searchQuery}". Try a different term.`
                : 'No career clusters have been added yet.'}
            </p>
            {searchQuery.trim() && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-sm text-[#1A6B50] font-medium hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClusters.map((cluster) => {
              const jobCount = jobCounts[cluster.id] || 0;
              return (
                <div
                  key={cluster.id}
                  onClick={() => handleClusterClick(cluster.id)}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden hover:shadow-xl hover:border-[#1A6B50] transition-all duration-300 cursor-pointer hover:-translate-y-1"
                >
                  {/* Card header with emoji/icon and job count */}
                  <div className="px-5 pt-5 pb-3 flex items-start justify-between">
                    <div
                      className="h-14 w-14 rounded-xl flex items-center justify-center text-3xl shadow-sm"
                      style={{ backgroundColor: cluster.color || '#e5e7eb' }}
                    >
                      {cluster.emoji || '📁'}
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full text-xs font-medium text-gray-600 border border-gray-100">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{jobCount} {jobCount === 1 ? 'job' : 'jobs'}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-5 pb-5">
                    <h3 className="text-base font-extrabold text-gray-900 group-hover:text-[#1A6B50] transition-colors">
                      {cluster.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {cluster.description || 'No description provided.'}
                    </p>
                    {cluster.image && (
                      <div className="mt-3 rounded-lg overflow-hidden h-24">
                        <img
                          src={cluster.image}
                          alt={cluster.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="mt-4 flex items-center text-sm font-semibold text-[#1A6B50] group-hover:gap-2 transition-all">
                      Explore Jobs
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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

