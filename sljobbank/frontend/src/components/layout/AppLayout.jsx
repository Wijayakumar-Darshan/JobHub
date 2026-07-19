import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import { useSettingsStore } from '@/store/settingsStore'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import WhatsAppButtons from './WhatsAppButtons'

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const { paidModeEnabled } = useSettingsStore()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #f8fafc 0%, #eef5ff 50%, #f3f7f5 100%)',
      }}
    >
      <Sidebar
        user={user}
        currentPath={location.pathname}
        onLogout={handleLogout}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <Topbar user={user} paidMode={paidModeEnabled} />

        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px',
            scrollBehavior: 'smooth',
          }}
        >
          <div
            style={{
              minHeight: '100%',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 10px 35px rgba(15, 23, 42, 0.08)',
              border: '1px solid rgba(226,232,240,0.8)',
              backdropFilter: 'blur(10px)',
              transition: 'all .3s ease',
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>

      <WhatsAppButtons />
    </div>
  )
}