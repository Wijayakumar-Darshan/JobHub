import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { analyticsApi } from '@/api';
import { Download, TrendingUp, Users, Calendar, Award } from 'lucide-react';

export default function UsageAnalytics() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    analyticsApi.getYearlyReport(year).then(res => setReport(res.data.data));
  }, [year]);

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const res = await analyticsApi.downloadYearlyReportPdf(year);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `sl-job-bank-yearly-report-${year}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      // toast.success('Report downloaded'); // Uncomment if you have toast
    } catch (err) {
      console.error(err);
      // toast.error('Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  if (!report) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2E1C] mx-auto" />
          <p className="text-gray-500 mt-4">Generating yearly report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-[#0A2E1C]" />
            Usage Analytics
          </h1>
          <p className="text-gray-600 mt-2">Platform engagement and student activity for {year}</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0A2E1C]"
          >
            {[0, 1, 2, 3].map(i => {
              const y = new Date().getFullYear() - i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>

          <button
            onClick={downloadPdf}
            disabled={downloading}
            className="flex items-center gap-2 bg-[#0A2E1C] text-white px-6 py-3 rounded-2xl hover:bg-[#1A6B50] transition disabled:opacity-70"
          >
            <Download className="w-5 h-5" />
            {downloading ? 'Downloading...' : 'Download PDF Report'}
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Active Students', value: report.uniqueActiveStudents, icon: Users, color: '#0A2E1C' },
          { label: 'Total Logins', value: report.totalStudentLogins, icon: TrendingUp, color: '#E8A200' },
          { label: 'New Registrations', value: report.newStudentRegistrations, icon: Award, color: '#2563EB' },
          { label: 'Career Tests', value: report.careerTestsCompleted, icon: Award, color: '#059669' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">{stat.label}</div>
                <div className="text-4xl font-bold text-gray-900 mt-3 tracking-tighter">
                  {stat.value.toLocaleString()}
                </div>
              </div>
              <div style={{ color: stat.color }} className="opacity-80">
                <stat.icon className="w-9 h-9" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Usefulness Summary */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">💡 Usefulness Summary</h2>
        <p className="text-gray-700 leading-relaxed text-[15.5px]">
          {report.usefulnessSummary}
        </p>
      </div>

      {/* Monthly Active Students Chart */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          📅 Monthly Active Students
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={report.monthlyBreakdown}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 13, fill: '#6b7280' }} />
            <Tooltip cursor={{ fill: 'rgba(10, 46, 28, 0.08)' }} />
            <Bar dataKey="activeStudents" fill="#0A2E1C" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Job Search Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            🔥 Most Searched Jobs
          </h2>
          <div className="space-y-4">
            {report.mostSearchedJobs.map((j, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                <div className="font-medium text-gray-800">{j.title}</div>
                <div className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-4 py-1.5 rounded-full">
                  {j.viewCount} views
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            ❄️ Least Searched Jobs
          </h2>
          <div className="space-y-4">
            {report.leastSearchedJobs.map((j, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                <div className="font-medium text-gray-800">{j.title}</div>
                <div className="bg-gray-100 text-gray-600 text-xs font-semibold px-4 py-1.5 rounded-full">
                  {j.viewCount} views
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}