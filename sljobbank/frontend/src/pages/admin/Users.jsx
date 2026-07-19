import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { userApi } from '@/api';
import { Plus, Edit, Trash2, UserCheck, Shield } from 'lucide-react';

const EMPTY = { fullName: '', email: '', password: '', role: 'COUNSELOR' };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = () => {
    userApi.getAll().then(res => setUsers(res.data.data || []));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreate = () => {
    setForm(EMPTY);
    setShowForm(true);
  };

  const createUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await userApi.create(form);
      toast.success(`${form.role === 'COUNSELOR' ? 'Counselor' : 'Student'} account created successfully`);
      setShowForm(false);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (id) => {
    try {
      await userApi.toggleActive(id);
      toast.success('User status updated');
      loadUsers();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently? This action cannot be undone.')) return;
    try {
      await userApi.delete(id);
      toast.success('User deleted');
      loadUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch = 
      u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            👥 User Management
          </h1>
          <p className="text-gray-600 mt-2 max-w-md">
            Manage students, counselors, and admins. Students can self-register, but counselors must be created here.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#0A2E1C] text-white px-6 py-3 rounded-2xl font-medium hover:bg-[#1A6B50] transition"
        >
          <Plus className="w-5 h-5" />
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A2E1C]"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0A2E1C]"
        >
          <option value="ALL">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="COUNSELOR">Counselors</option>
          <option value="SUPER_ADMIN">Super Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscription</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-5 font-medium text-gray-900">{u.fullName}</td>
                  <td className="px-6 py-5 text-gray-600">{u.email}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      u.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'COUNSELOR' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {u.subscriptionType === 'PAID' ? (
                      <span className="inline-flex px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">Paid</span>
                    ) : (
                      <span className="inline-flex px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">Free</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {u.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {u.role !== 'SUPER_ADMIN' && (
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleActive(u.id)}
                          className="text-sm text-[#0A2E1C] hover:text-[#1A6B50] font-medium flex items-center gap-1"
                        >
                          {u.isActive ? 'Suspend' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900">Create New User</h2>
              <p className="text-gray-500 text-sm mt-1">Counselors or Students</p>

              <form onSubmit={createUser} className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A2E1C]"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Role</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A2E1C]"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="COUNSELOR">Counselor</option>
                      <option value="STUDENT">Student</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A2E1C]"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Temporary Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A2E1C]"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    minLength={6}
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">User will be asked to change it on first login</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3.5 border rounded-2xl font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-[#0A2E1C] text-white font-semibold rounded-2xl hover:bg-[#1A6B50] disabled:opacity-70"
                  >
                    {submitting ? 'Creating Account...' : 'Create Account'}
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

