import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { authApi } from '@/api'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  async function onSubmit({ email }) {
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      setSent(true)
      toast.success('Reset link sent!')
    } catch {
      toast.error('Could not send reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0A2E1C] via-[#1A5C3A] to-[#0D4A2E] relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>

      <div className="w-[440px] max-w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <span className="text-4xl">🔑</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Forgot Password</h1>
          <p className="text-sm text-white/70 mt-1 max-w-xs mx-auto">
            Enter your email address and we’ll send you a reset link.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {sent ? (
            // Success state
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
                <span className="text-4xl">📧</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Check Your Inbox</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                We’ve sent a password reset link to your email address. It will expire in 15 minutes.
              </p>
              <div className="mt-6 space-y-3">
                <Link
                  to="/login"
                  className="inline-block w-full bg-[#0A2E1C] hover:bg-[#1A5C3A] text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  Back to Login
                </Link>
                <button
                  onClick={() => setSent(false)}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Resend email
                </button>
              </div>
            </div>
          ) : (
            // Form state
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
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.email.message}
                  </p>
                )}
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
                    Sending…
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-1"
                >
                  <span>←</span> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-white/40 mt-6">
          If you don’t receive the email, check your spam folder or try again.
        </p>
      </div>
    </div>
  )
}

