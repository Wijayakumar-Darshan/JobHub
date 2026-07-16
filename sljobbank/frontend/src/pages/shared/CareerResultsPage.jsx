import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { careerTestResultApi } from '@/api'
import { useAuthStore } from '@/store/authStore'

export default function CareerResultsPage() {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'SUPER_ADMIN'
  const [attempts, setAttempts] = useState([])
  const [selected, setSelected] = useState(null)

  function load() {
    careerTestResultApi.getAll().then(res => setAttempts(res.data.data || []))
  }
  useEffect(() => { load() }, [])

  async function enableDownload(id) {
    try {
      await careerTestResultApi.enableCounselorDownload(id)
      toast.success('Download enabled for this result.')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'The student needs to download their result first.')
    }
  }

  async function download(id) {
    try {
      const res = await careerTestResultApi.download(id)
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url; a.download = 'career-key-result.pdf'; a.click()
    } catch {
      toast.error('Download not available for this result yet.')
    }
  }

  return (
    <div>
      <h1 className="page-title">Career Key Results</h1>
      <p className="page-sub">
        {isAdmin
          ? 'You can view and download every result at any time, no restrictions.'
          : "You can view every result. Downloading unlocks after the student has downloaded their own result first."}
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card md:col-span-1" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {attempts.map(a => (
            <div key={a.id} onClick={() => setSelected(a)}
              className={`p-3 rounded-lg cursor-pointer mb-2 border ${selected?.id === a.id ? 'border-[#0A2E1C] bg-emerald-50' : 'border-gray-100 hover:bg-gray-50'}`}>
              <div className="text-[13px] font-bold text-gray-800">{a.user?.fullName}</div>
              <div className="text-[11px] text-gray-400">{a.hollandCode} • {new Date(a.completedAt).toLocaleDateString()}</div>
              <div className="flex gap-1 mt-1">
                {a.studentDownloadedAt && <span className="badge badge-success" style={{fontSize:9}}>Student ✓</span>}
                {a.counselorDownloadEnabled && <span className="badge badge-info" style={{fontSize:9}}>Counselor ✓</span>}
              </div>
            </div>
          ))}
          {attempts.length === 0 && <p className="text-[13px] text-gray-400 text-center py-6">No completed tests yet.</p>}
        </div>

        <div className="card md:col-span-2">
          {!selected ? (
            <p className="text-[13px] text-gray-400 text-center py-16">Select a result to view details.</p>
          ) : (
            <>
              <div className="text-[18px] font-black text-gray-900 mb-1">{selected.user?.fullName}</div>
              <div className="text-[12px] text-gray-400 mb-4">Completed {new Date(selected.completedAt).toLocaleString()}</div>
              <div className="badge badge-info mb-4">Holland Code: {selected.hollandCode}</div>

              <div className="section-title">Guidance</div>
              <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-line mb-5">{selected.guidanceText}</p>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                {isAdmin ? (
                  <button onClick={() => download(selected.id)} className="btn-primary">📥 Download (Admin - always available)</button>
                ) : selected.counselorDownloadEnabled ? (
                  <button onClick={() => download(selected.id)} className="btn-primary">📥 Download Result</button>
                ) : (
                  <button onClick={() => enableDownload(selected.id)}
                    disabled={!selected.studentDownloadedAt}
                    className="btn-accent disabled:opacity-40 disabled:cursor-not-allowed">
                    {selected.studentDownloadedAt ? '🔓 Enable My Download' : '🔒 Waiting for Student to Download First'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
