import { useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/student/dashboard':    'Student Dashboard',
  '/student/clusters':     'Career Clusters',
  '/student/jobs':         'Browse Jobs',
  '/student/favorites':    'Saved Jobs',
  '/student/career-test':  'Career Key Test',
  '/student/chat':         'Community Chat',
  '/student/subscription': 'Subscription',
  '/student/profile':      'My Profile',
  '/counselor/dashboard':  'Counselor Dashboard',
  '/counselor/jobs':       'Manage Jobs',
  '/counselor/institutes': 'Institutes & Universities',
  '/counselor/career-results': 'Career Key Results',
  '/counselor/chat':       'Community Chat',
  '/counselor/analytics':  'Analytics',
  '/counselor/reports':    'Reports',
  '/admin/dashboard':      'Admin Dashboard',
  '/admin/users':          'User Management',
  '/admin/clusters':       'Career Clusters',
  '/admin/jobs':           'Job Management',
  '/admin/qualifications': 'Qualifications',
  '/admin/institutes':     'Institutes & Universities',
  '/admin/career-results': 'Career Key Results',
  '/admin/chat':           'Community Chat',
  '/admin/subscription':   'Subscription Control',
  '/admin/payments':       'Payment History',
  '/admin/settings':       'System Settings',
  '/admin/analytics':      'Analytics',
  '/admin/reports':        'Reports',
}

function Avatar({ name, size=34 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:'#0A2E1C', color:'#E8A200', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:size*0.38, flexShrink:0 }}>
      {name?.[0]?.toUpperCase()}
    </div>
  )
}

export default function Topbar({ user, paidMode, toggleMobileMenu }) {
  const { pathname } = useLocation();

  const title = Object.entries(PAGE_TITLES)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([k]) => pathname.startsWith(k))?.[1] || 'Dashboard';

  return (
    <div className="h-16 bg-white border-b border-[#E2E8E4] px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Hamburger - Mobile Only */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden w-10 h-10 flex items-center justify-center text-2xl text-gray-700"
        >
          ☰
        </button>

        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-sub">Sri Lanka Job Bank • Career Guidance</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {paidMode && (
          <div className="badge badge-warn text-xs">
            💳 Paid Mode Active
          </div>
        )}

        <div className="text-right hidden sm:block">
          <div className="font-semibold text-sm">Hi, {user?.fullName?.split(' ')[0]}</div>
          <div className="text-xs text-gray-500">
            {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : user?.role}
          </div>
        </div>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E8A200] to-amber-600 flex items-center justify-center text-[#0A2E1C] font-bold shadow">
          {user?.fullName?.[0]?.toUpperCase()}
        </div>
      </div>
    </div>
  );
}