import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import { useSettingsStore } from '@/store/settingsStore'
import Sidebar  from './Sidebar'
import Topbar   from './Topbar'
import WhatsAppButtons from './WhatsAppButtons'

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const { paidModeEnabled } = useSettingsStore()
  const navigate  = useNavigate()
  const location  = useLocation()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#F2F5F3' }}>
      <Sidebar user={user} currentPath={location.pathname} onLogout={handleLogout} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <Topbar user={user} paidMode={paidModeEnabled} />
        <main style={{ flex:1, padding:26, overflowY:'auto' }}>
          <Outlet />
        </main>
      </div>
      <WhatsAppButtons />
    </div>
  )
}
