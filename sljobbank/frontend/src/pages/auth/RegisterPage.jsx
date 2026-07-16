import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { authApi, studentProfileApi } from '@/api'
import { useAuthStore } from '@/store/authStore'

const GRADES = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12 (A/L)', 'Grade 13 (A/L)', 'Completed A/L', 'Undergraduate']
const AL_STREAMS = ['Physical Science', 'Biological Science', 'Commerce', 'Arts', 'Technology', 'N/A - below A/L']
const INTERESTS = [
  'Technology', 'Numbers & Finance', 'Helping People', 'Design & Creativity',
  'Building & Fixing Things', 'Leading & Business', 'Science & Research',
  'Organizing & Planning', 'Nature & Outdoors', 'Writing & Communication',
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [grade, setGrade] = useState('')
  const [alStream, setAlStream] = useState('')
  const [interests, setInterests] = useState([])

  async function onCreateAccount(data) {
    setLoading(true)
    try {
      const res = await authApi.register({ fullName: data.fullName, email: data.email, password: data.password })
      const { user, token } = res.data
      setAuth(user, token)
      toast.success('Account created! One more step 🎉')
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  function toggleInterest(tag) {
    setInterests((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  async function finishOnboarding() {
    setLoading(true)
    try {
      await studentProfileApi.onboarding({ grade, alStream, interestTags: interests })
      toast.success('Thanks! We\'ve personalized your dashboard.')
      navigate('/student/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save your preferences - you can update this later in Profile.')
      navigate('/student/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0A2E1C] via-[#1A5C3A] to-[#0D4A2E] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>

      <div className="w-[460px] max-w-full relative z-10">
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
          <p className="text-sm text-white/80 mt-1">Start your career journey</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-white/10">
          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2 flex-1">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 1 ? 'bg-[#0A2E1C] text-white' : 'bg-green-100 text-green-700'}`}>
                {step === 1 ? '1' : '✓'}
              </span>
              <span className={`text-sm font-medium ${step === 1 ? 'text-gray-900' : 'text-gray-400'}`}>Account</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 relative">
              <div className={`h-0.5 bg-[#0A2E1C] transition-all duration-300 ${step === 2 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 2 ? 'bg-[#0A2E1C] text-white' : 'bg-gray-200 text-gray-400'}`}>
                2
              </span>
              <span className={`text-sm font-medium ${step === 2 ? 'text-gray-900' : 'text-gray-400'}`}>Profile</span>
            </div>
          </div>

          {step === 1 ? (
            <>
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                <Link to="/login" className="flex-1 py-2.5 text-center text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
                  Sign In
                </Link>
                <div className="flex-1 py-2.5 text-center text-sm font-bold bg-white rounded-lg shadow-sm text-[#0A2E1C]">
                  Register
                </div>
              </div>

              <form onSubmit={handleSubmit(onCreateAccount)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">👤</span>
                    <input
                      type="text"
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 focus:border-transparent transition"
                      placeholder="Your full name"
                      {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Name too short' } })}
                    />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">📧</span>
                    <input
                      type="email"
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 focus:border-transparent transition"
                      placeholder="your@email.com"
                      {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔒</span>
                    <input
                      type="password"
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 focus:border-transparent transition"
                      placeholder="Create a strong password"
                      {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })}
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">✓</span>
                    <input
                      type="password"
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 focus:border-transparent transition"
                      placeholder="Re-enter password"
                      {...register('confirm', { validate: v => v === watch('password') || 'Passwords do not match' })}
                    />
                  </div>
                  {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>}
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
                      Creating account…
                    </span>
                  ) : (
                    'Continue →'
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account? <Link to="/login" className="font-bold text-[#0A2E1C] hover:underline">Sign In</Link>
              </p>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="text-xs font-semibold text-[#1A6B50] uppercase tracking-wider">Step 2 of 2</div>
                <h2 className="text-xl font-bold text-gray-900 mt-1">Tell us about yourself</h2>
                <p className="text-sm text-gray-500 mt-1">
                  This takes 30 seconds and helps us personalise your dashboard.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What grade are you in?</label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 focus:border-transparent bg-white"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  >
                    <option value="">Select your grade</option>
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">A/L stream (if applicable)</label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 focus:border-transparent bg-white"
                    value={alStream}
                    onChange={(e) => setAlStream(e.target.value)}
                  >
                    <option value="">Select your stream</option>
                    {AL_STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What interests you? (pick a few)</label>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map(tag => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleInterest(tag)}
                        className={`text-sm px-4 py-1.5 rounded-full border transition-all ${
                          interests.includes(tag)
                            ? 'bg-[#0A2E1C] text-white border-[#0A2E1C] shadow-md scale-105'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-[#1A6B50] hover:shadow-sm'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    {interests.length} selected
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={finishOnboarding}
                  disabled={loading}
                  className="w-full bg-[#0A2E1C] hover:bg-[#1A5C3A] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving…
                    </span>
                  ) : (
                    'Finish & Go to My Dashboard →'
                  )}
                </button>
                <button
                  onClick={() => navigate('/student/dashboard')}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-white/40 mt-6">
          Secure registration • Powered by SL Job Bank
        </p>
      </div>
    </div>
  )
}