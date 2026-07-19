import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { jobApi, clusterApi, qualificationApi, instituteApi } from '@/api'

const EMPTY_JOB = {
  clusterId: '', title: '', description: '', responsibilities: '', skills: '',
  alStream: '', alSubjects: '', salaryMin: '', salaryMax: '', industryDemand: 'MEDIUM',
  sector: '', remoteAvailable: false, internshipAvailable: false,
}

export default function ManageJobsPage() {
  const [clusters, setClusters] = useState([])
  const [qualifications, setQualifications] = useState([])
  const [institutes, setInstitutes] = useState([])
  const [institutesByQual, setInstitutesByQual] = useState({})
  const [jobs, setJobs] = useState([])
  const [selectedCluster, setSelectedCluster] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_JOB)
  const [editingId, setEditingId] = useState(null)
  const [qualLinks, setQualLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    clusterApi.getAll().then(res => setClusters(res.data.data || []))
    qualificationApi.getAll().then(res => setQualifications(res.data.data || []))
    instituteApi.getAll().then(res => setInstitutes(res.data.data || []))
    loadJobs()
  }, [])

  function loadJobs(clusterId) {
    jobApi.getAll({ clusterId: clusterId || undefined, size: 100 }).then(res => setJobs(res.data.data?.content || []))
  }

  async function ensureInstitutesForQual(qualificationId) {
    if (!qualificationId || institutesByQual[qualificationId]) return
    const res = await instituteApi.getAll(undefined, qualificationId)
    setInstitutesByQual(prev => ({ ...prev, [qualificationId]: res.data.data || [] }))
  }

  function openCreate() {
    setForm({ ...EMPTY_JOB, clusterId: selectedCluster || '' })
    setQualLinks([])
    setEditingId(null)
    setShowForm(true)
  }

  async function openEdit(job) {
    setForm({
      clusterId: job.clusterId, title: job.title, description: job.description || '',
      responsibilities: job.responsibilities || '', skills: job.skills || '',
      alStream: job.alStream || '', alSubjects: job.alSubjects || '',
      salaryMin: job.salaryMin || '', salaryMax: job.salaryMax || '',
      industryDemand: job.industryDemand || 'MEDIUM', sector: job.sector || '',
      remoteAvailable: !!job.remoteAvailable, internshipAvailable: !!job.internshipAvailable,
    })
    setEditingId(job.id)
    setShowForm(true)
    try {
      const res = await jobApi.getQualifications(job.id)
      const links = (res.data.data || []).map(l => ({
        qualificationId: l.qualification.id, instituteId: l.institute?.id || '', required: l.required,
      }))
      setQualLinks(links)
      links.forEach(l => ensureInstitutesForQual(l.qualificationId))
    } catch { setQualLinks([]) }
  }

  function addQualLink() {
    setQualLinks([...qualLinks, { qualificationId: '', instituteId: '', required: true }])
  }
  function updateQualLink(i, patch) {
    setQualLinks(qualLinks.map((l, idx) => idx === i ? { ...l, ...patch } : l))
    if (patch.qualificationId) ensureInstitutesForQual(patch.qualificationId)
  }
  function removeQualLink(i) {
    setQualLinks(qualLinks.filter((_, idx) => idx !== i))
  }

  async function save(e) {
    e.preventDefault()
    if (!form.clusterId) return toast.error('Select which cluster this job belongs to.')
    setLoading(true)
    try {
      const payload = { ...form, salaryMin: Number(form.salaryMin) || null, salaryMax: Number(form.salaryMax) || null }
      let jobId = editingId
      if (editingId) await jobApi.update(editingId, payload)
      else { const res = await jobApi.create(payload); jobId = res.data.data.id }

      const validLinks = qualLinks.filter(l => l.qualificationId)
      await jobApi.setQualifications(jobId, validLinks.map(l => ({
        qualificationId: l.qualificationId, instituteId: l.instituteId || null, required: l.required,
      })))

      toast.success(editingId ? 'Job updated' : 'Job created inside the cluster')
      setShowForm(false)
      loadJobs(selectedCluster)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.')
    } finally { setLoading(false) }
  }

  async function remove(id) {
    if (!window.confirm('Delete this job?')) return
    try { await jobApi.delete(id); toast.success('Deleted'); loadJobs(selectedCluster) }
    catch { toast.error('Delete failed.') }
  }

  const sortedQualifications = form.clusterId
    ? [...qualifications].sort((a, b) => {
        const aMatch = (a.clusterId || a.cluster?.id) === form.clusterId
        const bMatch = (b.clusterId || b.cluster?.id) === form.clusterId
        return aMatch === bMatch ? 0 : aMatch ? -1 : 1
      })
    : qualifications

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    (job.clusterName && job.clusterName.toLowerCase().includes(search.toLowerCase())) ||
    (job.alStream && job.alStream.toLowerCase().includes(search.toLowerCase()))
  )

  const totalJobs = jobs.length

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>💼</span> Manage Jobs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Add jobs inside career clusters and link the qualifications (and where to get them) that each job requires.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <span>➕</span> Add Job
        </button>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-100">
          <span className="text-gray-500">Total Jobs</span>
          <span className="ml-2 font-bold text-gray-800">{totalJobs}</span>
        </div>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Cluster:</label>
          <select
            className="form-input max-w-xs px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20"
            value={selectedCluster}
            onChange={e => { setSelectedCluster(e.target.value); loadJobs(e.target.value) }}
          >
            <option value="">All Clusters</option>
            {clusters.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search jobs by title, cluster, stream..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2E1C]/20 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Form (inline) */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 transition-all">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>{editingId ? '✏️' : '➕'}</span> {editingId ? 'Edit Job' : 'Add New Job'}
          </h2>
          <form onSubmit={save} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Career Cluster *</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20"
                  value={form.clusterId}
                  onChange={e => setForm({ ...form, clusterId: e.target.value })}
                  required
                >
                  <option value="">Select cluster…</option>
                  {clusters.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                <input
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 resize-none"
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">A/L Stream</label>
                <input
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20"
                  value={form.alStream}
                  onChange={e => setForm({ ...form, alStream: e.target.value })}
                  placeholder="e.g. Physical Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry Demand</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20"
                  value={form.industryDemand}
                  onChange={e => setForm({ ...form, industryDemand: e.target.value })}
                >
                  <option value="HIGH">🔥 High Demand</option>
                  <option value="MEDIUM">⚡ Medium Demand</option>
                  <option value="LOW">❄️ Low Demand</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Min (LKR)</label>
                <input
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20"
                  type="number"
                  value={form.salaryMin}
                  onChange={e => setForm({ ...form, salaryMin: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Max (LKR)</label>
                <input
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20"
                  type="number"
                  value={form.salaryMax}
                  onChange={e => setForm({ ...form, salaryMax: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={form.remoteAvailable}
                    onChange={e => setForm({ ...form, remoteAvailable: e.target.checked })}
                  />
                  Remote Available
                </label>
                <label className="flex items-center gap-1 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={form.internshipAvailable}
                    onChange={e => setForm({ ...form, internshipAvailable: e.target.checked })}
                  />
                  Internship Available
                </label>
              </div>
            </div>

            {/* Qualification links */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Qualifications Needed</label>
                <button type="button" onClick={addQualLink} className="text-sm font-medium text-[#1A6B50] hover:text-[#0A2E1C]">
                  + Add Qualification
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Select a qualification, then the institute dropdown automatically shows only institutions that offer it.
              </p>
              {qualLinks.map((link, i) => {
                const relevantInstitutes = institutesByQual[link.qualificationId]
                return (
                  <div key={i} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex-1 w-full">
                      <select
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 text-sm"
                        value={link.qualificationId}
                        onChange={e => updateQualLink(i, { qualificationId: e.target.value, instituteId: '' })}
                      >
                        <option value="">Select qualification…</option>
                        {sortedQualifications.map(q => (
                          <option key={q.id} value={q.id}>
                            {q.name} ({q.level}){q.cluster ? ` · ${q.cluster.name}` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1 w-full">
                      <select
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 text-sm"
                        value={link.instituteId}
                        disabled={!link.qualificationId}
                        onChange={e => updateQualLink(i, { instituteId: e.target.value })}
                      >
                        <option value="">
                          {!link.qualificationId ? 'Pick a qualification first…'
                            : relevantInstitutes && relevantInstitutes.length === 0 ? 'No institute offers this yet'
                            : 'Where to get it…'}
                        </option>
                        {(relevantInstitutes || institutes).map(inst => (
                          <option key={inst.id} value={inst.id}>{inst.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-sm text-gray-500 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={link.required}
                          onChange={e => updateQualLink(i, { required: e.target.checked })}
                        />
                        Required
                      </label>
                      <button
                        type="button"
                        onClick={() => removeQualLink(i)}
                        className="text-red-400 hover:text-red-600 text-lg font-bold px-2"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )
              })}
              {qualLinks.length === 0 && (
                <p className="text-sm text-gray-400">No qualifications added yet. Click the button above to add one.</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary px-6">
                {loading ? 'Saving…' : (editingId ? 'Update' : 'Create')}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-400 text-lg">No jobs found</p>
          <p className="text-sm text-gray-300 mt-1">
            {search || selectedCluster ? 'Try adjusting your filters.' : 'Create your first job by clicking the "Add Job" button.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => {
            // Demand badge colors: HIGH = green, MEDIUM = amber, LOW = red
            const demandColors = {
              HIGH: 'bg-green-100 text-green-700 border-green-200',
              MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
              LOW: 'bg-red-100 text-red-700 border-red-200'
            }
            const demandEmojis = {
              HIGH: '🔥',
              MEDIUM: '⚡',
              LOW: '❄️'
            }
            const demandColor = demandColors[job.industryDemand] || 'bg-gray-100 text-gray-600'
            const demandEmoji = demandEmojis[job.industryDemand] || ''

            return (
              <div
                key={job.id}
                className={`bg-white rounded-2xl shadow-sm border ${
                  job.industryDemand === 'HIGH' ? 'border-green-300 ring-1 ring-green-200' : 'border-gray-100'
                } hover:shadow-lg transition-shadow duration-200 overflow-hidden`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center text-sm text-gray-500">
                          {job.clusterEmoji} {job.clusterName}
                        </span>
                        {job.alStream && (
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            📚 {job.alStream}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <button
                        onClick={() => openEdit(job)}
                        className="text-[#1A6B50] hover:text-[#0A2E1C] font-medium"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => remove(job.id)}
                        className="text-red-400 hover:text-red-600 font-medium"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {job.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    {job.salaryMin && job.salaryMax && (
                      <span className="text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full">
                        💰 {Number(job.salaryMin).toLocaleString()} – {Number(job.salaryMax).toLocaleString()} LKR
                      </span>
                    )}
                    {job.remoteAvailable && (
                      <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full">🏠 Remote</span>
                    )}
                    {job.internshipAvailable && (
                      <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">🎓 Internship</span>
                    )}
                    {job.industryDemand && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${demandColor}`}>
                        {demandEmoji} {job.industryDemand} demand
                      </span>
                    )}
                  </div>

                  <div className="mt-3 text-xs text-gray-400 border-t border-gray-100 pt-2">
                    {job.qualificationsCount !== undefined ? (
                      <span>{job.qualificationsCount} qualification(s) linked</span>
                    ) : (
                      <span>Qualification details available on edit</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

