import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { studentProfileApi } from '@/api'
import useAuthStore from '/src/store/authStore'

const GRADES = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12 (A/L)', 'Grade 13 (A/L)', 'Completed A/L', 'Undergraduate']
const AL_STREAMS = ['Physical Science', 'Biological Science', 'Commerce', 'Arts', 'Technology', 'N/A - below A/L']
const INTERESTS = [
  'Technology', 'Numbers & Finance', 'Helping People', 'Design & Creativity',
  'Building & Fixing Things', 'Leading & Business', 'Science & Research',
  'Organizing & Planning', 'Nature & Outdoors', 'Writing & Communication',
]

export default function ProfilePage() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [grade, setGrade] = useState('')
  const [alStream, setAlStream] = useState('')
  const [interests, setInterests] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    studentProfileApi.me().then(res => {
      const p = res.data.data
      if (p) {
        setProfile(p)
        setGrade(p.grade || '')
        setAlStream(p.alStream || '')
        setInterests(p.interestTags ? p.interestTags.split(',').filter(Boolean) : [])
      }
    }).catch(() => {})
  }, [])

  function toggleInterest(tag) {
    setInterests(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  async function save() {
    setLoading(true)
    try {
      const res = await studentProfileApi.onboarding({ grade, alStream, interestTags: interests })
      setProfile(res.data.data)
      toast.success('Profile updated — your recommendations will reflect this.')
    } catch {
      toast.error('Could not save your profile.')
    } finally { setLoading(false) }
  }

  // Helper to get initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-[#0A2E1C] flex items-center justify-center text-white text-xl font-bold shadow-md">
          {getInitials(user?.fullName || 'User')}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Keep your details up to date for personalised career recommendations.
          </p>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Account Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-400">Full Name</div>
            <div className="text-base font-medium text-gray-800">{user?.fullName}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Email Address</div>
            <div className="text-base font-medium text-gray-800">{user?.email}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Role</div>
            <div className="text-base font-medium text-gray-800 capitalize">{user?.role?.toLowerCase()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Subscription</div>
            <div className="text-base font-medium text-gray-800">
              {user?.subscriptionType === 'PAID' ? '⭐ Premium' : 'Free'}
            </div>
          </div>
        </div>
      </div>

      {/* Top Career Interest - only if exists */}
      {profile?.topCluster && (
        <div className="bg-gradient-to-r from-[#0A2E1C] to-[#1A6B50] rounded-2xl shadow-md p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Your Top Career Interest</div>
              <div className="text-2xl font-bold mt-1">{profile.topCluster.name}</div>
              <div className="text-sm opacity-80 mt-1">
                Based on your profile, you might enjoy careers in this cluster.
              </div>
            </div>
            <div className="text-4xl opacity-70">🎯</div>
          </div>
        </div>
      )}

      {/* Preferences Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Preferences</h2>

        <div className="space-y-5">
          {/* Grade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 focus:border-transparent bg-white"
              value={grade}
              onChange={e => setGrade(e.target.value)}
            >
              <option value="">Select your grade</option>
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* A/L Stream */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">A/L Stream</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A2E1C]/20 focus:border-transparent bg-white"
              value={alStream}
              onChange={e => setAlStream(e.target.value)}
            >
              <option value="">Select your stream</option>
              {AL_STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
            <p className="text-xs text-gray-400 mb-3">Select all that apply – this helps us match you with relevant career paths.</p>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(tag => {
                const isSelected = interests.includes(tag)
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleInterest(tag)}
                    className={`text-sm px-4 py-2 rounded-full border transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#0A2E1C] text-white border-[#0A2E1C] shadow-md scale-105'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#1A6B50] hover:shadow-sm'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
            <div className="mt-2 text-xs text-gray-400">
              {interests.length} selected
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={save}
            disabled={loading}
            className="btn-primary px-8 py-2.5 text-sm font-medium rounded-lg flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Saving…
              </>
            ) : (
              '💾 Save Changes'
            )}
          </button>
        </div>
      </div>

      {/* Extra note */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        Your profile data is used to personalise job recommendations and career guidance.
      </div>
    </div>
  )
}


