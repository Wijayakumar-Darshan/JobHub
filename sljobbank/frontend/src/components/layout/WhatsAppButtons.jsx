// Two WhatsApp group links, shown as floating buttons on every dashboard layout.
// Replace these with your real group invite links before deploying.
const GROUPS = [
  {
    label: '13-Year Education Group',
    sub: 'Grade 1–13 consistent education support',
    url: 'https://chat.whatsapp.com/REPLACE_WITH_13YEAR_GROUP_LINK',
    color: '#25D366',
  },
  {
    label: 'A/L Stream Group',
    sub: 'Advanced Level stream discussion & guidance',
    url: 'https://chat.whatsapp.com/REPLACE_WITH_AL_STREAM_GROUP_LINK',
    color: '#128C7E',
  },
]

export default function WhatsAppButtons() {
  return (
    <div style={{
      position: 'fixed', right: 20, bottom: 20, display: 'flex',
      flexDirection: 'column', gap: 10, zIndex: 40,
    }}>
      {GROUPS.map((g) => (
        <a
          key={g.label}
          href={g.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`Join: ${g.sub}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 9,
            background: g.color, color: '#fff', padding: '10px 14px',
            borderRadius: 999, boxShadow: '0 6px 20px rgba(0,0,0,.22)',
            textDecoration: 'none', fontSize: 12.5, fontWeight: 700,
            transition: 'transform .15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <span style={{ fontSize: 17 }}>💬</span>
          {g.label}
        </a>
      ))}
    </div>
  )
}
