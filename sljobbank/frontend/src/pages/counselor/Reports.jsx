import toast from 'react-hot-toast'
import { reportApi } from '@/api'

const REPORTS = [
  { type: 'users', label: 'Student Report', desc: 'Full listing of registered students', formats: ['pdf','excel'] },
  { type: 'jobs',  label: 'Job Analytics Report', desc: 'Job listings, demand, and cluster breakdown', formats: ['pdf'] },
]

export default function ReportsPage() {
  async function download(type, format) {
    try {
      const res = await reportApi.generate(type, format)
      const ext = format === 'excel' ? 'xlsx' : 'pdf'
      const mime = format === 'excel'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'application/pdf'
      const url = window.URL.createObjectURL(new Blob([res.data], { type: mime }))
      const a = document.createElement('a')
      a.href = url; a.download = `${type}_report.${ext}`; a.click()
    } catch { toast.error('Report generation failed.') }
  }

  return (
    <div>
      <h1 className="page-title">Reports</h1>
      <p className="page-sub">Generate downloadable reports.</p>

      <div className="grid md:grid-cols-2 gap-4">
        {REPORTS.map(r => (
          <div key={r.type} className="card">
            <div className="text-[15px] font-extrabold text-gray-900 mb-1">{r.label}</div>
            <p className="text-[12.5px] text-gray-500 mb-4">{r.desc}</p>
            <div className="flex gap-2">
              {r.formats.map(f => (
                <button key={f} onClick={() => download(r.type, f)} className="btn-ghost">
                  📥 {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


