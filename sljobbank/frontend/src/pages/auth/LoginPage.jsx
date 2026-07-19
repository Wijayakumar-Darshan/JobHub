import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { authApi } from '@/api'
import useAuthStore from '/src/store/authStore'
import { useSettingsStore } from '@/store/settingsStore'

const ROLE_ROUTES = {
  STUDENT:     '/student/dashboard',
  COUNSELOR:   '/counselor/dashboard',
  SUPER_ADMIN: '/admin/dashboard',
}

const DEMO_CREDENTIALS = {
  student: { email: 'student@example.com', password: 'password123' },
  counselor: { email: 'counselor@example.com', password: 'password123' },
  admin: { email: 'admin@example.com', password: 'password123' },
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const { setSettings } = useSettingsStore()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  async function onSubmit(data) {
    setLoading(true)
    try {
      const res = await authApi.login(data)
      const { user, token } = res.data.data
      setAuth(user, token)
      toast.success(`Welcome back, ${user.fullName.split(' ')[0]}! 👋`)

      if (user.role === 'STUDENT' && user.subscriptionType !== 'PAID') {
        navigate('/student/subscription')
      } else {
        navigate(ROLE_ROUTES[user.role] || '/student/dashboard')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  function fillDemo(role) {
    const creds = DEMO_CREDENTIALS[role]
    if (creds) {
      setValue('email', creds.email)
      setValue('password', creds.password)
      toast.success(`Demo credentials filled for ${role.charAt(0).toUpperCase() + role.slice(1)}!`, { duration: 2000 })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0A2E1C] via-[#1A5C3A] to-[#0D4A2E] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>

      <div className="w-[440px] max-w-full relative z-10">
        {/* Brand Header with Illustration */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-lg"
            >
              <circle cx="40" cy="40" r="40" fill="rgba(255,255,255,0.1)" />
              <circle cx="40" cy="40" r="36" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              {/* Graduation cap */}
              <path
                d="M29 42L40 36L51 42L40 48L29 42Z"
                fill="#FFD700"
                stroke="#FFD700"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M29 42V49C29 49 33 52 40 52C47 52 51 49 51 49V42"
                stroke="#FFD700"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M40 28V36"
                stroke="#FFD700"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Book */}
              <path
                d="M33 55L47 55"
                stroke="#90EE90"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M33 58L47 58"
                stroke="#90EE90"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect x="35" y="55" width="10" height="6" rx="1" fill="#90EE90" opacity="0.3" />
              {/* Stars */}
              <circle cx="20" cy="30" r="2" fill="#FFD700" opacity="0.6" />
              <circle cx="60" cy="28" r="1.5" fill="#FFD700" opacity="0.4" />
              <circle cx="62" cy="38" r="1" fill="#FFD700" opacity="0.5" />
              <circle cx="18" cy="42" r="1.5" fill="#FFD700" opacity="0.3" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">SL Job Bank</h1>
          <p className="text-sm text-white/80 mt-1">Discover your career path</p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="text-xs bg-white/10 text-white/70 px-3 py-1 rounded-full">Students</span>
            <span className="text-xs bg-white/10 text-white/70 px-3 py-1 rounded-full">Counselors</span>
            <span className="text-xs bg-white/10 text-white/70 px-3 py-1 rounded-full">Admins</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-white/10">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <div className="flex-1 py-2.5 text-center text-sm font-bold bg-white rounded-lg shadow-sm text-[#0A2E1C]">
              Sign In
            </div>
            <Link
              to="/register"
              className="flex-1 py-2.5 text-center text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Register
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">📧</span>
                <input
                  type="email"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 focus:border-transparent transition"
                  placeholder="your@email.com"
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-[#1A6B50] hover:text-[#0A2E1C]">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔒</span>
                <input
                  type="password"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 focus:border-transparent transition"
                  placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
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
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo quick login buttons */}
          <div className="mt-6">
            <p className="text-xs text-gray-400 text-center mb-3">Try a demo account:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-3 py-1.5 rounded-full transition-colors"
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => fillDemo('counselor')}
                className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium px-3 py-1.5 rounded-full transition-colors"
              >
                🧑‍🏫 Counselor
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium px-3 py-1.5 rounded-full transition-colors"
              >
                ⚙️ Admin
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Don't have an account? <span className="font-bold text-[#0A2E1C]">Register</span>
            </Link>
          </div>

          <p className="text-center text-[11px] text-gray-400 mt-4 border-t border-gray-100 pt-4">
            <Link to="/admin/setup" className="hover:text-gray-600 underline decoration-dotted">
              First time deploying? Set up the admin account →
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-white/40 mt-6">
          Secure login • Powered by SL Job Bank
        </p>
      </div>
    </div>
  )
}


