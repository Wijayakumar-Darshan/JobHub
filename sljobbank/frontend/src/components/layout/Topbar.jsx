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

export default function Topbar({ user, paidMode }) {
  const { pathname } = useLocation()
  // Match longest prefix
  const title = Object.entries(PAGE_TITLES)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([k]) => pathname.startsWith(k))?.[1] || 'Page'

  return (
    <div style={{ background:'#fff', padding:'0 26px', height:58, display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #E2E8E4', flexShrink:0, boxShadow:'0 1px 3px rgba(0,0,0,.04)' }}>
      <div style={{ fontSize:17, fontWeight:800, color:'#111827' }}>{title}</div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        {paidMode && (
          <span style={{ fontSize:11, padding:'2px 10px', borderRadius:20, fontWeight:700, background:'#FEF3C7', color:'#92400E' }}>💳 Paid Mode ON</span>
        )}
        <span style={{ fontSize:13, color:'#6B7280' }}>Hi, {user?.fullName?.split(' ')[0]}</span>
        <Avatar name={user?.fullName} size={34} />
      </div>
    </div>
  )
}
