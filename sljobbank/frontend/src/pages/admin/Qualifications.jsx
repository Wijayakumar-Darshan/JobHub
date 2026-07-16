import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { qualificationApi, clusterApi } from '@/api';
import { Plus, Edit, Trash2, Award, Filter } from 'lucide-react';

const EMPTY = { name: '', level: 'AL', field: '', description: '', clusterId: '' };
const LEVELS = ['OL', 'AL', 'CERTIFICATE', 'DIPLOMA', 'HND', 'DEGREE', 'POSTGRADUATE', 'PROFESSIONAL'];

export default function Qualifications() {
  const [items, setItems] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [filterCluster, setFilterCluster] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clusterApi.getAll().then(res => setClusters(res.data.data || []));
  }, []);

  const load = async (clusterId) => {
    setLoading(true);
    try {
      const res = await qualificationApi.getAll(clusterId || undefined);
      setItems(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load qualifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(filterCluster);
  }, [filterCluster]);

  const openCreate = () => {
    setForm({ ...EMPTY, clusterId: filterCluster || '' });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (q) => {
    setForm({
      ...q,
      clusterId: q.clusterId || q.cluster?.id || ''
    });
    setEditingId(q.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(EMPTY);
    setEditingId(null);
  };

  async function save(e) {
    e.preventDefault();
    if (!form.clusterId) return toast.error('Please select a career cluster.');

    try {
      if (editingId) {
        await qualificationApi.update(editingId, form);
        toast.success('Qualification updated');
      } else {
        await qualificationApi.create(form);
        toast.success('Qualification created');
      }
      closeForm();
      load(filterCluster);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  }

  async function remove(id) {
    if (!window.confirm('Deactivate this qualification?')) return;
    try {
      await qualificationApi.delete(id);
      toast.success('Qualification deactivated');
      load(filterCluster);
    } catch {
      toast.error('Failed to deactivate');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Award className="w-8 h-8 text-[#0A2E1C]" />
            Qualifications
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Define academic and professional qualifications. These appear in job creation forms and institute offering lists.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#0A2E1C] text-white px-6 py-3 rounded-2xl font-medium hover:bg-[#1A6B50] transition"
        >
          <Plus className="w-5 h-5" /> New Qualification
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-5 py-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterCluster}
            onChange={(e) => setFilterCluster(e.target.value)}
            className="bg-transparent focus:outline-none text-sm font-medium min-w-[240px]"
          >
            <option value="">All Career Clusters</option>
            {clusters.map(c => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">Loading qualifications...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-gray-700">No qualifications found</h3>
            <p className="text-gray-500 mt-2">Create your first qualification using the button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Qualification</th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cluster</th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Field</th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map(q => (
                  <tr key={q.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-5">
                      <div className="font-semibold text-gray-900">{q.name}</div>
                      {q.description && (
                        <div className="text-sm text-gray-500 line-clamp-1 mt-0.5">{q.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      {q.cluster ? (
                        <span className="inline-flex items-center gap-1.5 text-sm">
                          <span>{q.cluster.emoji}</span>
                          <span className="font-medium">{q.cluster.name}</span>
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-block px-4 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">
                        {q.level}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-600">{q.field || '—'}</td>
                    <td className="px-6 py-5">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEdit(q)}
                          className="flex items-center gap-1.5 text-[#0A2E1C] hover:text-[#1A6B50] font-medium text-sm"
                        >
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => remove(q.id)}
                          className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          <Trash2 className="w-4 h-4" /> Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                {editingId ? 'Edit Qualification' : 'New Qualification'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">Belongs to a career cluster</p>

              <form onSubmit={save} className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Career Cluster *</label>
                  <select
                    value={form.clusterId}
                    onChange={e => setForm({ ...form, clusterId: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0A2E1C]"
                  >
                    <option value="">Select cluster...</option>
                    {clusters.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Qualification Name *</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0A2E1C]"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0A2E1C]"
                      value={form.level}
                      onChange={e => setForm({ ...form, level: e.target.value })}
                    >
                      {LEVELS.map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Field</label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0A2E1C]"
                      value={form.field || ''}
                      onChange={e => setForm({ ...form, field: e.target.value })}
                      placeholder="e.g. Science"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0A2E1C] resize-y"
                    value={form.description || ''}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief description of this qualification..."
                  />
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 py-3.5 border font-medium rounded-2xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-[#0A2E1C] text-white font-semibold rounded-2xl hover:bg-[#1A6B50] transition"
                  >
                    {editingId ? 'Update Qualification' : 'Create Qualification'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}