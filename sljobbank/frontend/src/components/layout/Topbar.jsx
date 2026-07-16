import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/student/dashboard': 'Student Dashboard',
  '/student/clusters': 'Career Clusters',
  '/student/jobs': 'Browse Jobs',
  '/student/favorites': 'Saved Jobs',
  '/student/career-test': 'Career Key Test',
  '/student/chat': 'Community Chat',
  '/student/subscription': 'Subscription',
  '/student/profile': 'My Profile',

  '/counselor/dashboard': 'Counselor Dashboard',
  '/counselor/jobs': 'Manage Jobs',
  '/counselor/institutes': 'Institutes & Universities',
  '/counselor/career-results': 'Career Key Results',
  '/counselor/chat': 'Community Chat',
  '/counselor/analytics': 'Analytics',
  '/counselor/reports': 'Reports',

  '/admin/dashboard': 'Admin Dashboard',
  '/admin/users': 'User Management',
  '/admin/clusters': 'Career Clusters',
  '/admin/jobs': 'Job Management',
  '/admin/qualifications': 'Qualifications',
  '/admin/institutes': 'Institutes & Universities',
  '/admin/career-results': 'Career Key Results',
  '/admin/chat': 'Community Chat',
  '/admin/subscription': 'Subscription Control',
  '/admin/payments': 'Payment History',
  '/admin/settings': 'System Settings',
  '/admin/analytics': 'Analytics',
  '/admin/reports': 'Reports',
};

function Avatar({ name, size = 38 }) {
  if (!name) return null;

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="flex items-center justify-center font-bold text-white rounded-full flex-shrink-0 border-2 border-white shadow-sm"
      style={{
        width: size,
        height: size,
        background: '#0A2E1C',
        fontSize: size * 0.38,
      }}
    >
      {initials}
    </div>
  );
}

export default function Topbar({ user, paidMode }) {
  const { pathname } = useLocation();

  // Match the longest prefix
  const title = Object.entries(PAGE_TITLES)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([path]) => pathname.startsWith(path))?.[1] || 'Dashboard';

  return (
    <div className="h-16 bg-white border-b border-gray-100 px-6 md:px-10 flex items-center justify-between flex-shrink-0 shadow-sm">
      {/* Page Title */}
      <div className="font-semibold text-xl text-gray-900 tracking-tight">
        {title}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Paid Mode Indicator */}
        {paidMode && (
          <div className="hidden sm:flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            💳 Paid Mode Active
          </div>
        )}

        {/* Greeting */}
        <div className="hidden md:block text-right">
          <span className="text-sm text-gray-600">Hi, {user?.fullName?.split(' ')[0]}</span>
        </div>

        {/* Avatar */}
        <Avatar name={user?.fullName} size={38} />
      </div>
    </div>
  );
}