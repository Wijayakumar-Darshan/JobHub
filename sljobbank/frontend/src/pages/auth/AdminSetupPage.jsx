import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '@/api'
import { useAuthStore } from '/src/store/authStore'

// One-time setup: creates the single SUPER_ADMIN account. The backend refuses
// this (409) if an admin already exists, so it's safe to leave this page
// reachable - it just won't do anything once you've set your admin up.
export default function AdminSetupPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.bootstrapAdmin(form)
      toast.success('Admin account created — signing you in…')
      const res = await authApi.login({ email: form.email, password: form.password })
      setAuth(res.data.data.user, res.data.data.token)
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create the admin account.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0A2E1C] via-[#1A5C3A] to-[#0D4A2E] relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>

      <div className="w-[440px] max-w-full relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <span className="text-4xl">🛠️</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Setup</h1>
          <p className="text-sm text-white/70 mt-1 max-w-xs mx-auto">
            Create the initial admin account. This works only if no admin exists yet.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={submit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">👤</span>
                <input
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 focus:border-transparent transition"
                  placeholder="e.g. John Doe"
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">📧</span>
                <input
                  type="email"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 focus:border-transparent transition"
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔒</span>
                <input
                  type="password"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 focus:border-transparent transition"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  minLength={6}
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">At least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A2E1C] hover:bg-[#1A5C3A] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating…
                </span>
              ) : (
                'Create Admin Account & Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-1"
            >
              <span>←</span> Back to sign in
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-white/40 mt-6">
          This is a one‑time setup page. If an admin already exists, this action will fail.
        </p>
      </div>
    </div>
  )
}

