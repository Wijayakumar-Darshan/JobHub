import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import WhatsAppButtons from './WhatsAppButtons';

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const { paidModeEnabled } = useSettingsStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#F8FAF9] overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        user={user} 
        currentPath={location.pathname} 
        onLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <Topbar 
          user={user} 
          paidMode={paidModeEnabled} 
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#F8FAF9] p-6 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating WhatsApp Buttons */}
      <WhatsAppButtons />
    </div>
  );
}