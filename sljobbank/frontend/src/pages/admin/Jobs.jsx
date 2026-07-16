// src/pages/admin/Jobs.jsx
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { jobApi, qualificationApi, instituteApi } from '@/api';
import {
  Plus, Trash2, Edit, Save, X, Upload, Briefcase,
  Search, Sparkles, Building2, DollarSign
} from 'lucide-react';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsibilities: '',
    qualifications: '',
    skills: '',
    alStream: '',
    alSubjects: '',
    salaryMin: '',
    salaryMax: '',
    careerPathway: '',
    employmentGrowth: '',
    sector: '',
    remoteAvailable: false,
    internshipAvailable: false,
    image: null,
    imagePreview: null,
    jobQualifications: [],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsRes, qualsRes, instRes] = await Promise.all([
        jobApi.getAll({ size: 100 }),
        qualificationApi.getAll(),
        instituteApi.getAll(),
      ]);
      setJobs(jobsRes.data.data?.content || jobsRes.data.data || []);
      setQualifications(qualsRes.data.data || []);
      setInstitutes(instRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (job) => {
    setFormData({
      title: job.title || '',
      description: job.description || '',
      responsibilities: job.responsibilities || '',
      qualifications: job.qualifications || '',
      skills: job.skills || '',
      alStream: job.alStream || '',
      alSubjects: job.alSubjects || '',
      salaryMin: job.salaryMin || '',
      salaryMax: job.salaryMax || '',
      careerPathway: job.careerPathway || '',
      employmentGrowth: job.employmentGrowth || '',
      sector: job.sector || '',
      remoteAvailable: job.remoteAvailable || false,
      internshipAvailable: job.internshipAvailable || false,
      image: null,
      imagePreview: job.image || null,
      jobQualifications: job.jobQualifications || [],
    });
    setEditingId(job.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', responsibilities: '', qualifications: '', skills: '',
      alStream: '', alSubjects: '', salaryMin: '', salaryMax: '', careerPathway: '',
      employmentGrowth: '', sector: '', remoteAvailable: false, internshipAvailable: false,
      image: null, imagePreview: null, jobQualifications: [],
    });
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  // Qualification handlers (unchanged)
  const addQualification = () => {
    setFormData(prev => ({
      ...prev,
      jobQualifications: [...prev.jobQualifications, { qualificationId: '', instituteIds: [] }],
    }));
  };

  const removeQualification = (index) => {
    setFormData(prev => ({
      ...prev,
      jobQualifications: prev.jobQualifications.filter((_, i) => i !== index),
    }));
  };

  const updateQualification = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.jobQualifications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, jobQualifications: updated };
    });
  };

  const toggleInstitute = (qIndex, instId) => {
    setFormData(prev => {
      const updated = [...prev.jobQualifications];
      const current = updated[qIndex].instituteIds;
      const idx = current.indexOf(instId);
      if (idx > -1) current.splice(idx, 1);
      else current.push(instId);
      updated[qIndex] = { ...updated[qIndex], instituteIds: current };
      return { ...prev, jobQualifications: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        salaryMin: parseFloat(formData.salaryMin) || 0,
        salaryMax: parseFloat(formData.salaryMax) || 0,
        jobQualifications: formData.jobQualifications,
      };

      if (editingId) {
        await jobApi.update(editingId, payload);
        toast.success('Job updated successfully');
      } else {
        await jobApi.create(payload);
        toast.success('Job created successfully');
      }
      closeForm();
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job permanently?')) return;
    try {
      await jobApi.delete(id);
      toast.success('Job deleted');
      loadData();
    } catch {
      toast.error('Delete failed');
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.sector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-64 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-48 bg-gray-200 rounded-3xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#0A2E1C]" />
            Manage Jobs
          </h1>
          <p className="text-gray-600 mt-1">Create and manage career opportunities for students</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-2xl px-6 py-3 shadow-sm border border-gray-100 flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-[#0A2E1C]" />
            <div>
              <div className="text-sm text-gray-500">Total Jobs</div>
              <div className="text-2xl font-semibold text-gray-900">{jobs.length}</div>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#0A2E1C] text-white px-6 py-3 rounded-2xl font-medium hover:bg-[#1A6B50] transition"
          >
            <Plus className="w-5 h-5" /> New Job
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by title, sector, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A2E1C]/30"
        />
      </div>

      {/* Job Grid */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <div className="text-7xl mb-6">💼</div>
          <h3 className="text-xl font-semibold text-gray-700">No jobs found</h3>
          <p className="text-gray-500 mt-2">
            {searchTerm ? 'Try different search terms.' : 'Start by creating your first job posting.'}
          </p>
          {!searchTerm && (
            <button onClick={openCreate} className="btn-primary mt-6">
              Create First Job
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => {
            const demandColors = { HIGH: 'bg-emerald-100 text-emerald-700', MEDIUM: 'bg-amber-100 text-amber-700', LOW: 'bg-red-100 text-red-700' };
            return (
              <div key={job.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="h-2 bg-gradient-to-r from-[#0A2E1C] to-[#1A6B50]" />

                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {job.image ? (
                      <img src={job.image} alt={job.title} className="w-16 h-16 rounded-2xl object-cover" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <Briefcase className="w-8 h-8 text-gray-400" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 pr-2">{job.title}</h3>
                        {job.industryDemand && (
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${demandColors[job.industryDemand] || ''}`}>
                            {job.industryDemand}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-3 mt-2">{job.description}</p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.sector && (
                          <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                            <Building2 className="w-3 h-3" /> {job.sector}
                          </span>
                        )}
                        {(job.salaryMin || job.salaryMax) && (
                          <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                            <DollarSign className="w-3 h-3" />
                            {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6 pt-6 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => openEdit(job)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[#0A2E1C] border border-gray-200 hover:bg-gray-50 rounded-2xl transition"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-red-600 border border-gray-200 hover:bg-red-50 rounded-2xl transition"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Job Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                {editingId ? 'Edit Job' : 'Create New Job'}
              </h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-8 space-y-8">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Job Title <span className="text-red-500">*</span></label>
                  <input name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-[#0A2E1C]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Sector</label>
                  <input name="sector" value={formData.sector} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-[#0A2E1C]" placeholder="e.g. Technology" />
                </div>
                {/* Add other basic fields similarly... */}
              </div>

              {/* Description & Details */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-[#0A2E1C]" />
                </div>
                {/* Add other textareas similarly */}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Job Image</label>
                <div className="flex items-center gap-6">
                  <label className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#0A2E1C] rounded-2xl px-8 py-6 transition">
                    <Upload className="mx-auto mb-2" />
                    <span className="text-sm">Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>

                  {formData.imagePreview && (
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden border">
                      <img src={formData.imagePreview} alt="preview" className="object-cover w-full h-full" />
                      <button type="button" onClick={() => setFormData(p => ({...p, image: null, imagePreview: null}))} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Structured Qualifications */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium">Required Qualifications</label>
                  <button type="button" onClick={addQualification} className="text-[#0A2E1C] text-sm font-medium flex items-center gap-1">
                    + Add Qualification
                  </button>
                </div>
                {/* ... keep your existing qualification mapping logic ... */}
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <button type="button" onClick={closeForm} className="flex-1 py-3.5 rounded-2xl border font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-3.5 bg-[#0A2E1C] text-white rounded-2xl font-semibold hover:bg-[#1A6B50]">
                  {editingId ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}