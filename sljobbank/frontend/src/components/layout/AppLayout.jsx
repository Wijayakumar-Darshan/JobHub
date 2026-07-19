// AppLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// ... other imports

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const { paidModeEnabled } = useSettingsStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeSidebar();
  };

  return (
    <div className="flex h-screen bg-[#F8FAF9] overflow-hidden">
      {/* Sidebar - now receives props */}
      <Sidebar
        user={user}
        currentPath={location.pathname}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar - now receives toggle function */}
        <Topbar
          user={user}
          paidMode={paidModeEnabled}
          onMenuToggle={toggleSidebar}
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

