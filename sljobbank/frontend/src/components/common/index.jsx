// src/components/ui/index.js  (or keep in a shared file)

export function Badge({ type = 'gray', children, size = 'normal' }) {
  const base = "inline-flex items-center font-medium rounded-full";
  const sizes = {
    sm: "text-xs px-2 py-0.5",
    normal: "text-sm px-3 py-1",
  };

  const colors = {
    success: 'bg-emerald-100 text-emerald-700',
    danger:  'bg-red-100 text-red-700',
    warn:    'bg-amber-100 text-amber-700',
    info:    'bg-blue-100 text-blue-700',
    gray:    'bg-gray-100 text-gray-700',
    purple:  'bg-purple-100 text-purple-700',
    teal:    'bg-teal-100 text-teal-700',
    paid:    'bg-emerald-100 text-emerald-700',
    free:    'bg-gray-100 text-gray-600',
  };

  return (
    <span className={`${base} ${sizes[size]} ${colors[type] || colors.gray}`}>
      {children}
    </span>
  );
}

export function Avatar({ name, size = 40, className = "" }) {
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <div
      className={`flex items-center justify-center font-bold text-white rounded-full flex-shrink-0 ring-2 ring-white shadow-sm ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: '#0A2E1C',
        fontSize: size * 0.38,
      }}
    >
      {initials}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, color = '#0A2E1C', trend, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-lg transition-all cursor-pointer ${onClick ? 'hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-4xl font-bold text-gray-900 tracking-tighter">{value}</div>
          <div className="text-sm text-gray-500 mt-1">{label}</div>
          {trend && <div className="text-emerald-600 text-xs font-medium mt-2">{trend}</div>}
        </div>
        {Icon && (
          <div className="p-3 rounded-2xl" style={{ backgroundColor: `${color}10` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        )}
      </div>
    </div>
  );
}

export function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-900">{children}</h2>
      {action}
    </div>
  );
}

export function Divider() {
  return <div className="h-px bg-gray-100 my-8" />;
}

export function ProgressBar({ pct = 0, color = '#1A6B50' }) {
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function Alert({ type = 'info', children }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warn: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className={`border rounded-2xl p-4 text-sm ${styles[type] || styles.info}`}>
      {children}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-16 px-6">
      <div className="text-6xl mb-6 opacity-70">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-xs mx-auto">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Modal({ title, children, onClose, width = 'max-w-lg' }) {
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-white rounded-3xl w-full ${width} max-h-[90vh] overflow-hidden shadow-2xl`}>
        <div className="px-8 py-5 border-b flex items-center justify-between bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="text-3xl leading-none text-gray-400 hover:text-gray-600 transition"
          >
            ×
          </button>
        </div>
        <div className="p-8 overflow-auto max-h-[calc(90vh-73px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Spinner({ size = 32 }) {
  return (
    <div className="flex justify-center py-12">
      <div 
        className="border-4 border-gray-200 border-t-[#0A2E1C] rounded-full animate-spin"
        style={{ width: size, height: size }}
      />
    </div>
  );
}

