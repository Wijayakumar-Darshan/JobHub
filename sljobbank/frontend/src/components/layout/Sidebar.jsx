import { useNavigate } from 'react-router-dom';

const NAV = {
  STUDENT: [
    { section: 'Main' },
    { path: '/student/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/student/clusters', icon: '🗂️', label: 'Career Clusters' },
    { path: '/student/jobs', icon: '💼', label: 'Browse Jobs' },
    { path: '/student/favorites', icon: '❤️', label: 'Saved Jobs' },
    { section: 'Career Guidance' },
    { path: '/student/career-test', icon: '🧭', label: 'Career Key Test' },
    { path: '/student/chat', icon: '💬', label: 'Community Chat' },
    { section: 'Account' },
    { path: '/student/subscription', icon: '💳', label: 'Subscription' },
    { path: '/student/profile', icon: '👤', label: 'My Profile' },
  ],
  COUNSELOR: [
    { section: 'Management' },
    { path: '/counselor/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/counselor/jobs', icon: '💼', label: 'Manage Jobs' },
    { path: '/counselor/institutes', icon: '🏫', label: 'Institutes & Universities' },
    { section: 'Career Guidance' },
    { path: '/counselor/career-results', icon: '🧭', label: 'Career Key Results' },
    { path: '/counselor/chat', icon: '💬', label: 'Community Chat' },
    { section: 'Insights' },
    { path: '/counselor/analytics', icon: '📊', label: 'Analytics' },
    { path: '/counselor/reports', icon: '📋', label: 'Reports' },
  ],
  SUPER_ADMIN: [
    { section: 'Management' },
    { path: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/admin/users', icon: '👥', label: 'User Management' },
    { path: '/admin/clusters', icon: '🗂️', label: 'Career Clusters' },
    { path: '/admin/jobs', icon: '💼', label: 'Job Management' },
    { path: '/admin/qualifications', icon: '🎓', label: 'Qualifications' },
    { path: '/admin/institutes', icon: '🏫', label: 'Institutes & Universities' },
    { section: 'Career Guidance' },
    { path: '/admin/career-results', icon: '🧭', label: 'Career Key Results' },
    { path: '/admin/chat', icon: '💬', label: 'Community Chat' },
    { section: 'System' },
    { path: '/admin/subscription', icon: '💳', label: 'Subscription Control' },
    { path: '/admin/payments', icon: '💰', label: 'Payment History' },
    { path: '/admin/settings', icon: '⚙️', label: 'System Settings' },
    { path: '/admin/analytics', icon: '📊', label: 'Analytics' },
    { path: '/admin/reports', icon: '📋', label: 'Reports' },
  ],
};

const ROLE_LABELS = {
  STUDENT: 'Student',
  COUNSELOR: 'Counselor',
  SUPER_ADMIN: 'Super Admin',
};

export default function Sidebar({ user, currentPath, onLogout }) {
  const navigate = useNavigate();
  const items = NAV[user?.role] || [];

  return (
    <div className="w-60 bg-[#0A2E1C] text-white flex flex-col flex-shrink-0 h-screen overflow-hidden">
      {/* Logo / Header */}
      <div className="px-6 pt-7 pb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🇱🇰</span>
          <div>
            <div className="text-xl font-black tracking-tighter text-[#E8A200]">SL Job Bank</div>
            <div className="text-[10px] text-white/40 uppercase tracking-[1px] -mt-0.5">Career Guidance</div>
          </div>
        </div>

        <div className="mt-6 inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-[#E8A200] text-xs font-semibold">
          {ROLE_LABELS[user?.role] || 'User'}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {items.map((item, i) => {
          if (item.section) {
            return (
              <div
                key={i}
                className="px-5 pt-6 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/30"
              >
                {item.section}
              </div>
            );
          }

          const isActive = currentPath.startsWith(item.path);

          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 mx-2 px-5 py-3 rounded-xl text-[13.5px] font-medium cursor-pointer transition-all duration-150 hover:bg-white/10 active:bg-white/5
                ${isActive 
                  ? 'bg-white/10 text-[#E8A200] border-l-4 border-[#E8A200]' 
                  : 'text-white/75 hover:text-white'
                }`}
            >
              <span className="text-lg opacity-90">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-5 border-t border-white/10 mt-auto">
        <div className="px-3">
          <div className="font-semibold text-white text-sm">{user?.fullName}</div>
          <div className="text-white/50 text-xs mt-0.5 truncate">{user?.email}</div>
        </div>

        <button
          onClick={onLogout}
          className="mt-5 w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white/80 hover:text-white py-3 rounded-2xl text-sm font-medium transition-all active:scale-[0.985]"
        >
          ↩ Sign Out
        </button>
      </div>
    </div>
  );
}