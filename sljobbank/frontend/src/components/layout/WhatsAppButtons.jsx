const GROUPS = [
  {
    label: '13-Year Education',
    url: 'https://chat.whatsapp.com/HKJtUIOXznZEuvPjaICtWg?s=cl&p=a&ilr=0&amv=1',
    color: '#25D366',
  },
  {
    label: 'A/L Stream',
    url: 'https://chat.whatsapp.com/De7NaKYHIcr3C3KrGO3OxJ?s=cl&p=a&ilr=0&amv=1',
    color: '#128C7E',
  },
]

export default function WhatsAppButtons() {
  return (
    <div
      style={{
        position: 'fixed',
        right: 15,
        bottom: 15,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
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
            gap: 8,
            width: 190,
            padding: '8px 12px',
            borderRadius: 14,
            textDecoration: 'none',
            color: '#fff',
            background: `linear-gradient(135deg, ${g.color}, ${g.color}CC)`,
            boxShadow: '0 6px 18px rgba(0,0,0,0.22)',
            transition: 'all .25s ease',
            border: '1px solid rgba(255,255,255,.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'
            e.currentTarget.style.boxShadow =
              '0 10px 25px rgba(0,0,0,.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.boxShadow =
              '0 6px 18px rgba(0,0,0,.22)'
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255,255,255,.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            💬
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 2,
              }}
            >
              {g.label}
            </div>

            <div
              style={{
                fontSize: 10,
                opacity: 0.9,
              }}
            >
              {g.sub}
            </div>
          </div>

          <div
            style={{
              fontSize: 16,
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