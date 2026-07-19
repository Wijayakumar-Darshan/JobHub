import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import WhatsAppButtons from './WhatsAppButtons';

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const { paidModeEnabled } = useSettingsStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F2F5F3]">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A2E1C] transform transition-transform duration-300 md:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar
          user={user}
          currentPath={location.pathname}
          onLogout={handleLogout}
          onClose={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 transition-all duration-300">
        <Topbar
          user={user}
          paidMode={paidModeEnabled}
          toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="card min-h-[calc(100vh-80px)]">
            <Outlet />
          </div>
        </main>
      </div>

      <WhatsAppButtons />
    </div>
  );
}