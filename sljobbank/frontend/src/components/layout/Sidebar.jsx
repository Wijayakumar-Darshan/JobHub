// Sidebar.jsx
export default function Sidebar({ user, currentPath, onLogout, isOpen, onClose }) {
  const navigate = useNavigate();
  const items = NAV[user?.role] || [];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar itself */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-60 bg-[#0A2E1C] text-white flex flex-col flex-shrink-0
          transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo / Header - same as before */}
        <div className="px-6 pt-7 pb-6 border-b border-white/10">
          {/* ... unchanged ... */}
        </div>

        {/* Navigation - same as before */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {/* ... unchanged ... */}
        </nav>

        {/* User Footer - same as before */}
        <div className="p-5 border-t border-white/10 mt-auto">
          {/* ... unchanged ... */}
        </div>
      </div>
    </>
  );
}

