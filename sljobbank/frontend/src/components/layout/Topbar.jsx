// Topbar.jsx
export default function Topbar({ user, paidMode, onMenuToggle }) {
  const { pathname } = useLocation();
  // ... title logic ...

  return (
    <div className="h-16 bg-white border-b border-gray-100 px-6 md:px-10 flex items-center justify-between flex-shrink-0 shadow-sm">
      {/* Left side: hamburger + title */}
      <div className="flex items-center gap-3">
        {/* Hamburger button (visible on md and smaller) */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Page Title */}
        <div className="font-semibold text-xl text-gray-900 tracking-tight">
          {title}
        </div>
      </div>

      {/* Right side - same as before */}
      <div className="flex items-center gap-4">
        {/* ... paid mode, greeting, avatar ... */}
      </div>
    </div>
  );
}

