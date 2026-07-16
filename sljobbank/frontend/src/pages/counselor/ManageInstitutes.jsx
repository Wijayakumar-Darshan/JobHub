import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { instituteApi, qualificationApi } from '@/api'

const EMPTY = { name: '', type: 'GOVERNMENT', location: '', website: '', description: '' }
const TABS = [
  { key: 'ALL', label: 'All', icon: '🏛️' },
  { key: 'GOVERNMENT', label: 'Government', icon: '🏢' },
  { key: 'PRIVATE', label: 'Private', icon: '🏬' },
  { key: 'PROFESSIONAL', label: 'Professional Body', icon: '📜' },
  { key: 'UNIVERSITY', label: 'Universities', icon: '🎓' },
]

export default function ManageInstitutesPage() {
  const [tab, setTab] = useState('ALL')
  const [items, setItems] = useState([])
  const [allQualifications, setAllQualifications] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [selectedQualIds, setSelectedQualIds] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  function load() {
    instituteApi.getAll(tab === 'ALL' ? undefined : tab).then(res => setItems(res.data.data || []))
  }
  useEffect(() => { load() }, [tab])
  useEffect(() => { qualificationApi.getAll().then(res => setAllQualifications(res.data.data || [])) }, [])

  function openCreate() { setForm(EMPTY); setSelectedQualIds([]); setEditingId(null); setShowForm(true) }
  function openEdit(item) {
    setForm(item)
    setSelectedQualIds((item.qualificationsOffered || []).map(q => q.id))
    setEditingId(item.id)
    setShowForm(true)
  }

  function toggleQual(id) {
    setSelectedQualIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function save(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, qualificationIds: selectedQualIds }
      if (editingId) await instituteApi.update(editingId, payload)
      else await instituteApi.create(payload)
      toast.success(editingId ? 'Institute updated' : 'Institute created')
      setShowForm(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.')
    } finally { setLoading(false) }
  }

  async function remove(id) {
    if (!window.confirm('Delete this institute/university? This cannot be undone.')) return
    try { await instituteApi.delete(id); toast.success('Deleted'); load() }
    catch { toast.error('Delete failed.') }
  }

  // Group qualifications by cluster for a nicer picker
  const groupedQualifications = allQualifications.reduce((acc, q) => {
    const key = q.cluster?.name || 'Uncategorized'
    acc[key] = acc[key] || []
    acc[key].push(q)
    return acc
  }, {})

  // Filter items by search
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.location && item.location.toLowerCase().includes(search.toLowerCase()))
  )

  // Counts per type for stats
  const counts = items.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1
    return acc
  }, {})

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>🏫</span> Institutes & Universities
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage where students can earn qualifications. Connect each institute to the qualifications it offers.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <span>➕</span> Add New
        </button>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-100">
          <span className="text-gray-500">Total</span>
          <span className="ml-2 font-bold text-gray-800">{items.length}</span>
        </div>
        {Object.entries(counts).map(([type, count]) => (
          <div key={type} className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-100">
            <span className="text-gray-500 capitalize">{type.toLowerCase()}</span>
            <span className="ml-2 font-bold text-gray-800">{count}</span>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full font-medium transition-colors ${
                tab === t.key
                  ? 'bg-[#0A2E1C] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1A6B50] hover:text-[#1A6B50]'
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search institutes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2E1C]/20 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Form (inline) */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 transition-all">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>{editingId ? '✏️' : '➕'}</span> {editingId ? 'Edit' : 'Add New'} Institute
          </h2>
          <form onSubmit={save} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 focus:border-transparent"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  <option value="GOVERNMENT">Government Institute</option>
                  <option value="PRIVATE">Private Institute</option>
                  <option value="PROFESSIONAL">Professional Body</option>
                  <option value="UNIVERSITY">University</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20"
                  value={form.location || ''}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20"
                  value={form.website || ''}
                  onChange={e => setForm({ ...form, website: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 resize-none"
                  rows={3}
                  value={form.description || ''}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            {/* Qualifications picker */}
            <div className="border-t border-gray-100 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications Offered</label>
              <p className="text-xs text-gray-400 mb-3">
                Select all qualifications a student can earn at this institute. This powers the “Where to get it” dropdown in job posts.
              </p>
              <div className="max-h-60 overflow-y-auto bg-gray-50 rounded-lg p-3 border border-gray-100">
                {Object.entries(groupedQualifications).length === 0 ? (
                  <p className="text-sm text-gray-400">No qualifications yet. Create some under Qualifications first.</p>
                ) : (
                  Object.entries(groupedQualifications).map(([clusterName, quals]) => (
                    <div key={clusterName} className="mb-3 last:mb-0">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{clusterName}</div>
                      <div className="flex flex-wrap gap-2">
                        {quals.map(q => (
                          <button
                            type="button"
                            key={q.id}
                            onClick={() => toggleQual(q.id)}
                            className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
                              selectedQualIds.includes(q.id)
                                ? 'bg-[#0A2E1C] text-white border-[#0A2E1C] shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-[#1A6B50] hover:shadow-sm'
                            }`}
                          >
                            {q.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
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

      {/* Card Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">🏫</div>
          <p className="text-gray-400 text-lg">No institutes found</p>
          <p className="text-sm text-gray-300 mt-1">Try adjusting your filters or add a new one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const quals = item.qualificationsOffered || []
            const visibleQuals = quals.slice(0, 3)
            const extraCount = quals.length - 3

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                      <span className={`inline-block mt-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        item.type === 'UNIVERSITY' ? 'bg-purple-100 text-purple-700' :
                        item.type === 'GOVERNMENT' ? 'bg-blue-100 text-blue-700' :
                        item.type === 'PRIVATE' ? 'bg-green-100 text-green-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {item.type.charAt(0) + item.type.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <button
                        onClick={() => openEdit(item)}
                        className="text-[#1A6B50] hover:text-[#0A2E1C] font-medium"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-red-400 hover:text-red-600 font-medium"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {item.location && (
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                      <span>📍</span> {item.location}
                    </p>
                  )}
                  {item.website && (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline block truncate mt-1"
                    >
                      🌐 {item.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {visibleQuals.map(q => (
                      <span key={q.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {q.name}
                      </span>
                    ))}
                    {extraCount > 0 && (
                      <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                        +{extraCount} more
                      </span>
                    )}
                    {quals.length === 0 && (
                      <span className="text-xs text-gray-300">No qualifications set</span>
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