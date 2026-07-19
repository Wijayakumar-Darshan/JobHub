import { useNavigate } from 'react-router-dom';

const C = {
  primary: '#0A2E1C',
  accent: '#E8A200',
  dark: '#062017',
  light: '#ffffff',
};

const NAV = {
  // ... your NAV object remains unchanged
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
    <div
      style={{
        width: 248,
        background: C.primary,
        color: C.light,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        boxShadow: '4px 0 20px rgba(0,0,0,0.25)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 100,
      }}
    >
      {/* Logo Header */}
      <div
        style={{
          padding: '28px 20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: C.dark,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 28 }}>🇱🇰</div>
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: '-0.5px',
                color: C.accent,
              }}
            >
              SL Job Bank
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginTop: 1,
              }}
            >
              Career Guidance
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            background: 'rgba(232, 162, 0, 0.15)',
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 700,
            color: C.accent,
          }}
        >
          {ROLE_LABELS[user?.role]}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {items.map((item, i) => {
          if (item.section) {
            return (
              <div
                key={i}
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  padding: '16px 20px 6px',
                  marginTop: i > 0 ? 8 : 0,
                }}
              >
                {item.section}
              </div>
            );
          }

          const active = currentPath.startsWith(item.path);

          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '11px 20px',
                margin: '2px 8px',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: active ? C.accent : 'rgba(255,255,255,0.85)',
                background: active ? 'rgba(232,162,0,0.12)' : 'transparent',
                borderLeft: active ? `4px solid ${C.accent}` : '4px solid transparent',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ fontSize: 18, width: 24 }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          background: C.dark,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: '#E8A200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            👤
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>
              {user?.fullName}
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.5)',
                marginTop: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.email}
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          style={{
            marginTop: 16,
            width: '100%',
            padding: '10px 16px',
            background: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.85)',
            border: 'none',
            borderRadius: 8,
            fontSize: 13.5,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,60,60,0.15)';
            e.currentTarget.style.color = '#ffcccc';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
          }}
        >
          ↩ Sign Out
        </button>
      </div>
    </div>
  );
}