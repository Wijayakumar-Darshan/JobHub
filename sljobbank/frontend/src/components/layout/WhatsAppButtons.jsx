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
    <div
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        zIndex: 999,
      }}
    >
      {GROUPS.map((g) => (
        <a
          key={g.label}
          href={g.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`Join: ${g.sub}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            minWidth: 290,
            padding: '14px 18px',
            borderRadius: 18,
            textDecoration: 'none',
            color: '#fff',
            background: `linear-gradient(135deg, ${g.color}, ${g.color}CC)`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            backdropFilter: 'blur(10px)',
            transition: 'all .25s ease',
            border: '1px solid rgba(255,255,255,.18)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
            e.currentTarget.style.boxShadow =
              '0 16px 35px rgba(0,0,0,.35)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.boxShadow =
              '0 10px 30px rgba(0,0,0,.25)'
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              background: 'rgba(255,255,255,.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              flexShrink: 0,
            }}
          >
            💬
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 3,
              }}
            >
              {g.label}
            </div>

            <div
              style={{
                fontSize: 12,
                opacity: 0.9,
                lineHeight: 1.4,
              }}
            >
              {g.sub}
            </div>
          </div>

          <div
            style={{
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            →
          </div>
        </a>
      ))}
    </div>
  )
}