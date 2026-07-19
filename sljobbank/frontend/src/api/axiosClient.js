import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: attach JWT ──────────────────────────
api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('sl-jobbank-auth')
    if (stored) {
      const { token } = JSON.parse(stored)?.state || {}
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor: handle 401/403 ─────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      localStorage.removeItem('sl-jobbank-auth')
      window.location.href = '/login'
    } else if (status === 403) {
      toast.error('Access denied.')
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.')
    }
    return Promise.reject(error)
  },
)

export default api


