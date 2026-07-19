import toast from 'react-hot-toast';
import { reportApi } from '@/api';
import { FileText, Users, BarChart3, DollarSign, Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

const REPORTS = [
  { 
    type: 'users', 
    label: 'Student Report', 
    desc: 'Complete list of registered students with details and activity', 
    formats: ['pdf', 'excel'],
    icon: Users,
    color: 'from-blue-500 to-cyan-600'
  },
  { 
    type: 'jobs',  
    label: 'Job Analytics Report', 
    desc: 'Job listings, demand trends, and career cluster breakdown', 
    formats: ['pdf'],
    icon: BarChart3,
    color: 'from-violet-500 to-purple-600'
  },
  { 
    type: 'revenue', 
    label: 'Revenue Report', 
    desc: 'Subscription payments, trends, and financial summary', 
    formats: ['pdf'],
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-600'
  },
];

export default function ReportsPage() {
  const [downloading, setDownloading] = useState(null);

  async function download(type, format) {
    setDownloading(`${type}-${format}`);
    
    try {
      const res = await reportApi.generate(type, format);
      
      const ext = format === 'excel' ? 'xlsx' : 'pdf';
      const mime = format === 'excel' 
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        : 'application/pdf';
      
      const url = window.URL.createObjectURL(new Blob([res.data], { type: mime }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(`${format.toUpperCase()} report downloaded successfully`);
    } catch (err) {
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#0A2E1C] to-[#1A6B50] rounded-2xl flex items-center justify-center">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-1">Generate and download platform insights and data exports</p>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPORTS.map((report) => {
          const Icon = report.icon;
          
          return (
            <div
              key={report.type}
              className="group bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${report.color} flex items-center justify-center mb-6 text-white`}>
                <Icon className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">{report.label}</h3>
              <p className="text-gray-600 text-[15px] leading-relaxed mb-8 min-h-[60px]">
                {report.desc}
              </p>

              <div className="flex flex-wrap gap-3">
                {report.formats.map((format) => {
                  const isDownloading = downloading === `${report.type}-${format}`;
                  
                  return (
                    <button
                      key={format}
                      onClick={() => download(report.type, format)}
                      disabled={isDownloading}
                      className="flex items-center gap-2 px-5 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl text-sm font-medium transition-all active:scale-95 disabled:opacity-70"
                    >
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {format.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Footer */}
      <div className="mt-16 text-center text-sm text-gray-400">
        Reports are generated in real-time based on current platform data.<br />
        Large reports may take a few moments to prepare.
      </div>
    </div>
  );
}

