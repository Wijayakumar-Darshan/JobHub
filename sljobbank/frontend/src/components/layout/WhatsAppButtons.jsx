// src/components/WhatsAppButtons.jsx
const GROUPS = [
  {
    label: '13-Year Education Group',
    sub: 'Grade 1–13 support',
    url: 'https://chat.whatsapp.com/REPLACE_WITH_13YEAR_GROUP_LINK',
    color: '#25D366',
  },
  {
    label: 'A/L Stream Group',
    sub: 'Advanced Level guidance',
    url: 'https://chat.whatsapp.com/REPLACE_WITH_AL_STREAM_GROUP_LINK',
    color: '#128C7E',
  },
];

export default function WhatsAppButtons() {
  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col gap-2.5">
      {GROUPS.map((group) => (
        <a
          key={group.label}
          href={group.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 bg-white/95 backdrop-blur-md text-gray-800 shadow-lg hover:shadow-xl rounded-2xl px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] border border-gray-100"
          title={`Join: ${group.sub}`}
        >
          {/* WhatsApp Icon */}
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0 shadow-sm ring-1 ring-white/30"
            style={{ backgroundColor: group.color }}
          >
            💬
          </div>

          <div className="min-w-0 pr-1">
            <div className="font-semibold text-sm text-gray-900 leading-tight tracking-tight">
              {group.label}
            </div>
            <div className="text-xs text-gray-500 line-clamp-1">
              {group.sub}
            </div>
          </div>

          {/* Subtle arrow */}
          <div className="ml-auto text-gray-300 group-hover:text-emerald-500 transition-colors text-lg">
            →
          </div>
        </a>
      ))}
    </div>
  );
}

