import { useNavigate } from 'react-router-dom';

const C = { primary: '#0A2E1C', accent: '#E8A200' };

const NAV = {
  STUDENT: [
    { section:'Main' },
    { path:'/student/dashboard',    icon:'🏠', label:'Dashboard' },
    { path:'/student/clusters',     icon:'🗂️', label:'Career Clusters' },
    { path:'/student/jobs',         icon:'💼', label:'Browse Jobs' },
    { path:'/student/favorites',    icon:'❤️', label:'Saved Jobs' },
    { section:'Career Guidance' },
    { path:'/student/career-test',  icon:'🧭', label:'Career Key Test' },
    { path:'/student/chat',         icon:'💬', label:'Community Chat' },
    { section:'Account' },
    { path:'/student/subscription', icon:'💳', label:'Subscription' },
    { path:'/student/profile',      icon:'👤', label:'My Profile' },
  ],
  COUNSELOR: [
    { section:'Management' },
    { path:'/counselor/dashboard',  icon:'🏠', label:'Dashboard' },
    { path:'/counselor/jobs',       icon:'💼', label:'Manage Jobs' },
    { path:'/counselor/institutes', icon:'🏫', label:'Institutes & Universities' },
    { section:'Career Guidance' },
    { path:'/counselor/career-results', icon:'🧭', label:'Career Key Results' },
    { path:'/counselor/chat',       icon:'💬', label:'Community Chat' },
    { section:'Insights' },
    { path:'/counselor/analytics',  icon:'📊', label:'Analytics' },
    { path:'/counselor/reports',    icon:'📋', label:'Reports' },
  ],
  SUPER_ADMIN: [
    { section:'Management' },
    { path:'/admin/dashboard',    icon:'🏠', label:'Dashboard' },
    { path:'/admin/users',        icon:'👥', label:'User Management' },
    { path:'/admin/clusters',     icon:'🗂️', label:'Career Clusters' },
    { path:'/admin/jobs',         icon:'💼', label:'Job Management' },
    { path:'/admin/qualifications', icon:'🎓', label:'Qualifications' },
    { path:'/admin/institutes',   icon:'🏫', label:'Institutes & Universities' },
    { section:'Career Guidance' },
    { path:'/admin/career-results', icon:'🧭', label:'Career Key Results' },
    { path:'/admin/chat',         icon:'💬', label:'Community Chat' },
    { section:'System' },
    { path:'/admin/subscription', icon:'💳', label:'Subscription Control' },
    { path:'/admin/payments',     icon:'💰', label:'Payment History' },
    { path:'/admin/settings',     icon:'⚙️', label:'System Settings' },
    { path:'/admin/analytics',    icon:'📊', label:'Analytics' },
    { path:'/admin/reports',      icon:'📋', label:'Reports' },
  ],
}

const ROLE_LABELS = { STUDENT:'Student', COUNSELOR:'Counselor', SUPER_ADMIN:'Super Admin' }

export default function Sidebar({ user, currentPath, onLogout, onClose }) {
  const navigate = useNavigate();
  const items = NAV[user?.role] || [];

  const handleClick = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🇱🇰</span>
          <div>
            <div className="text-xl font-black text-[#E8A200] tracking-tight">
              SL Job Bank
            </div>
            <div className="text-[10px] text-white/50 uppercase tracking-widest">
              Career Guidance System
            </div>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-[#E8A200] text-xs font-bold">
          {ROLE_LABELS[user?.role]}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {items.map((item, i) => {
          if (item.section) {
            return (
              <div key={i} className="nav-section">
                {item.section}
              </div>
            );
          }

          const active = currentPath.startsWith(item.path);

          return (
            <div
              key={item.path}
              onClick={() => handleClick(item.path)}
              className={`sidebar-nav-item ${active ? 'active' : ''}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-5 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8A200] to-amber-600 flex items-center justify-center text-[#0A2E1C] font-bold text-xl">
            {user?.fullName?.[0]}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white text-sm truncate">
              {user?.fullName}
            </div>
            <div className="text-white/50 text-xs truncate">{user?.email}</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full btn-ghost text-white border-white/20 hover:bg-white/10 hover:text-white"
        >
          ↩ Sign Out
        </button>
      </div>
    </div>
  );
}