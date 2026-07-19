// src/pages/student/JobDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jobApi, favoriteApi } from '@/api';
import {
  ArrowLeft,
  Heart,
  HeartOff,
  Briefcase,
  MapPin,
  Clock,
  GraduationCap,
  BookOpen,
  DollarSign,
  CheckCircle,
  XCircle,
  Sparkles,
  TrendingUp,
  Building,
  Award,
} from 'lucide-react';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobRes, qualRes, favRes] = await Promise.all([
          jobApi.getById(id),
          jobApi.getQualifications(id).catch(() => ({ data: { data: [] } })),
          favoriteApi.getMyFavorites().catch(() => ({ data: { data: [] } })),
        ]);
        setJob(jobRes.data.data);
        setQualifications(qualRes.data.data || []);
        setIsFavorite(
          (favRes.data.data || []).some((f) => f.job.id === id)
        );
        // Track view (non-blocking)
        jobApi.trackView(id).catch(() => {});
      } catch (error) {
        toast.error('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await favoriteApi.remove(id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await favoriteApi.add(id);
        setIsFavorite(true);
        toast.success('Added to favorites ❤️');
      }
    } catch {
      toast.error('Could not update favorites.');
    }
  };

  // ─── Skeleton ───
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-4xl mx-auto animate-pulse space-y-6">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
          <div className="h-32 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-800">Job not found</h2>
          <p className="text-gray-500 mt-2">The job you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-[#1A6B50] text-white rounded-xl hover:bg-[#145A42] transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] px-4 py-6 md:px-8 md:py-8">
      <div className="max-w-4xl mx-auto">
        {/* ─── BACK NAV ─── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1A6B50] transition-colors mb-5 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* ─── JOB HERO CARD ─── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden mb-6">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{job.clusterEmoji || '💼'}</span>
                  <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    {job.clusterName || 'General'}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                  {job.sector && (
                    <span className="flex items-center gap-1.5">
                      <Building className="w-4 h-4" />
                      {job.sector}
                    </span>
                  )}
                  {job.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                  )}
                  {job.postedAt && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {new Date(job.postedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {(job.salaryMin || job.salaryMax) && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-400">Salary</div>
                    <div className="text-lg font-bold text-[#1A6B50]">
                      LKR {job.salaryMin?.toLocaleString()} – {job.salaryMax?.toLocaleString()}
                      <span className="text-sm font-normal text-gray-400"> / month</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={toggleFavorite}
                  className="h-12 w-12 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors border border-gray-200 hover:border-[#1A6B50]"
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFavorite ? (
                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  ) : (
                    <HeartOff className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Badge row */}
            <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-gray-100">
              {job.alStream && (
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  <GraduationCap className="w-3.5 h-3.5" />
                  A/L: {job.alStream}
                </span>
              )}
              {job.industryDemand && (
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {job.industryDemand} Demand
                </span>
              )}
              {job.remoteAvailable && (
                <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  Remote Available
                </span>
              )}
              {job.employmentType && (
                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  <Briefcase className="w-3.5 h-3.5" />
                  {job.employmentType}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#1A6B50]" />
                Description
              </h2>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            {/* Career Pathway */}
            {job.careerPathway && (
              <div className="mt-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#1A6B50]" />
                  Career Pathway
                </h2>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {job.careerPathway}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ─── QUALIFICATIONS ─── */}
        {qualifications.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#1A6B50]" />
                Qualifications ({qualifications.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {qualifications.map((q) => (
                <div key={q.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{q.qualification.name}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{q.qualification.level}</span>
                      {q.institute && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span>📍 {q.institute.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
                      q.required
                        ? 'bg-red-50 text-red-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {q.required ? (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        Required
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Preferred
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── RELATED COURSES ─── */}
        {job.courses?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#1A6B50]" />
                Related Courses
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {job.courses.map((course) => (
                <div key={course.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{course.name}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{course.instituteName}</span>
                      {course.duration && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span>⏱ {course.duration}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {course.fee && (
                      <span className="text-sm font-bold text-[#1A6B50]">
                        LKR {course.fee.toLocaleString()}
                      </span>
                    )}
                    <button
                      onClick={() => navigate(`/student/courses/${course.id}`)}
                      className="text-sm font-medium text-[#1A6B50] hover:underline"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── APPLY / ACTION BUTTON ─── */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {job.applicationUrl && (
            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1A6B50] text-white rounded-xl font-semibold hover:bg-[#145A42] transition shadow-md shadow-[#1A6B50]/20"
            >
              <Briefcase className="w-5 h-5" />
              Apply Now
            </a>
          )}
          <button
            onClick={() => navigate('/student/jobs')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-[#1A6B50] hover:text-[#1A6B50] transition"
          >
            Browse More Jobs
          </button>
        </div>
      </div>
    </div>
  );
}

