import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { clusterApi } from '@/api';

const EMPTY = { name: '', emoji: '📁', color: '#0A2E1C', description: '' };

export default function Clusters() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    clusterApi.getAll().then(res => setItems(res.data.data || []));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (c) => {
    setForm(c);
    setEditingId(c.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(EMPTY);
    setEditingId(null);
  };

  async function save(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await clusterApi.update(editingId, form);
        toast.success('Cluster updated successfully');
      } else {
        await clusterApi.create(form);
        toast.success('Cluster created successfully');
      }
      closeForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this cluster? This action cannot be undone and may affect associated jobs.')) return;
    
    setDeletingId(id);
    try {
      await clusterApi.delete(id);
      toast.success('Cluster deleted');
      load();
    } catch {
      toast.error('Could not delete. This cluster may still contain jobs.');
    } finally {
      setDeletingId(null);
    }
  }

  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-4xl">🗂️</span>
            Career Clusters
          </h1>
          <p className="text-gray-600 mt-2 max-w-md">
            Organize jobs into meaningful career clusters. Each cluster helps students discover related opportunities.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="btn-primary flex items-center gap-2 px-6 py-3 text-base font-medium"
        >
          <span className="text-lg">➕</span> New Cluster
        </button>
      </div>

      {/* Stats & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="text-3xl">🗂️</div>
          <div>
            <div className="text-sm text-gray-500">Total Clusters</div>
            <div className="text-3xl font-semibold text-gray-900">{items.length}</div>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search clusters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A2E1C]/30 text-sm"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
        </div>
      </div>

      {/* Cluster Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <div className="text-7xl mb-6">🗂️</div>
          <h3 className="text-xl font-semibold text-gray-700">No clusters found</h3>
          <p className="text-gray-500 mt-2 max-w-xs mx-auto">
            {search 
              ? "We couldn't find any clusters matching your search." 
              : "Get started by creating your first career cluster."}
          </p>
          {!search && (
            <button onClick={openCreate} className="btn-primary mt-6">
              Create First Cluster
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((c) => (
            <div
              key={c.id}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Accent Bar */}
              <div
                className="h-2 w-full"
                style={{ backgroundColor: c.color || '#0A2E1C' }}
              />

              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="text-5xl transition-transform group-hover:scale-110 duration-200">
                    {c.emoji || '📁'}
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(c)}
                      className="p-2 text-[#1A6B50] hover:bg-green-50 rounded-xl transition"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => remove(c.id)}
                      disabled={deletingId === c.id}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition"
                      title="Delete"
                    >
                      {deletingId === c.id ? '⋯' : '🗑️'}
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-xl text-gray-900 mt-6 line-clamp-2">{c.name}</h3>
                
                {c.description && (
                  <p className="text-gray-600 text-sm mt-3 line-clamp-3 leading-relaxed">
                    {c.description}
                  </p>
                )}

                <div className="mt-6 pt-6 border-t border-gray-100 text-xs flex justify-between items-center text-gray-500">
                  <span>{c.jobsCount !== undefined ? `${c.jobsCount} jobs` : 'No jobs yet'}</span>
                  <span className="text-[10px] uppercase tracking-widest">Cluster</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                {editingId ? '✏️ Edit Cluster' : '➕ New Career Cluster'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {editingId ? 'Update cluster details' : 'Create a new grouping for related jobs'}
              </p>

              <form onSubmit={save} className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cluster Name *</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A2E1C]"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Emoji</label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A2E1C] text-2xl"
                      value={form.emoji || ''}
                      onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                      placeholder="📁"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Accent Color</label>
                    <div className="flex gap-3 items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2">
                      <input
                        type="color"
                        className="w-12 h-12 p-1 rounded-xl cursor-pointer bg-transparent"
                        value={form.color || '#0A2E1C'}
                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                      />
                      <span className="font-mono text-sm text-gray-500">{form.color}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A2E1C] resize-y"
                    value={form.description || ''}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief description of this career cluster..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 py-3.5 font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-2xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3.5 font-semibold bg-[#0A2E1C] text-white rounded-2xl hover:bg-[#1A6B50] transition disabled:opacity-70"
                  >
                    {loading ? 'Saving...' : editingId ? 'Update Cluster' : 'Create Cluster'}
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

