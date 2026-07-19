import { useEffect } from 'react'
import AppRouter from './routes'
import useAuthStore from './store/authStore'
import { useSettingsStore } from './store/settingsStore'
import { settingsApi } from './api'

export default function App() {
  const { isAuthenticated } = useAuthStore()
  const { setSettings }     = useSettingsStore()

  // Load system settings on mount (so paidMode is always current)
  useEffect(() => {
    if (isAuthenticated()) {
      settingsApi.get()
        .then(res => setSettings(res.data))
        .catch(() => {})
    }
  }, [])

  return <AppRouter />
}



