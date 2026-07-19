import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  // ... your PAGE_TITLES object remains the same
};

function Avatar({ name, size = 38 }) {
  const initial = name?.[0]?.toUpperCase() || '?';
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #E8A200, #D38F00)',
        color: '#0A2E1C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: size * 0.42,
        flexShrink: 0,
        boxShadow: '0 2px 6px rgba(232, 162, 0, 0.3)',
        border: '2px solid #fff',
      }}
    >
      {initial}
    </div>
  );
}

export default function Topbar({ user, paidMode }) {
  const { pathname } = useLocation();

  // Match longest prefix
  const title = Object.entries(PAGE_TITLES)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([k]) => pathname.startsWith(k))?.[1] || 'Dashboard';

  return (
    <div
      style={{
        background: '#ffffff',
        height: 68,
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #E5E7EB',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      {/* Left Side - Page Title */}
      <div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.4px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 13,
            color: '#64748B',
            marginTop: 1,
          }}
        >
          Sri Lanka Job Bank • Career Guidance System
        </div>
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Paid Mode Badge */}
        {paidMode && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12.5,
              fontWeight: 700,
              padding: '6px 14px',
              background: '#FEF3C7',
              color: '#92400E',
              borderRadius: 9999,
              border: '1px solid #FDE68C',
            }}
          >
            💳 Paid Mode Active
          </div>
        )}

        {/* Greeting */}
        <div
          style={{
            textAlign: 'right',
            marginRight: 4,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937' }}>
            Hi, {user?.fullName?.split(' ')[0] || 'User'}
          </div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>
            {user?.role === 'SUPER_ADMIN' ? 'Super Administrator' : user?.role}
          </div>
        </div>

        {/* Avatar */}
        <Avatar name={user?.fullName} size={42} />

        {/* Optional: Quick Actions (can be extended later) */}
        <div style={{ width: 1, height: 32, background: '#E5E7EB', margin: '0 8px' }} />

        <button
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'transparent',
            border: '1px solid #E5E7EB',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 18,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          ⚙️
        </button>
      </div>
    </div>
  );
}