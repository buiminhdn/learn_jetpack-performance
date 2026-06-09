import { NavLink } from 'react-router-dom'

interface TopbarProps {
  onToggleMenu: () => void
}

const NAV = [
  { to: '/learn', label: 'Học', icon: '📚' },
  { to: '/playground', label: 'Playground', icon: '🧪' },
  { to: '/quiz', label: 'Quiz', icon: '❓' },
  { to: '/checklist', label: 'Checklist', icon: '✅' },
]

export function Topbar({ onToggleMenu }: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          onClick={onToggleMenu}
          className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 lg:hidden"
          aria-label="Mở menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>

        <NavLink to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-lg">
            🤖
          </span>
          <div className="leading-tight">
            <p className="text-sm font-extrabold text-ink-900">
              Compose <span className="text-android-500">Performance</span>
            </p>
            <p className="hidden text-[11px] text-ink-500 sm:block">
              Academy · học tương tác
            </p>
          </div>
        </NavLink>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-100 text-brand-700'
                    : 'text-ink-600 hover:bg-ink-100'
                }`
              }
            >
              <span className="mr-1" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile page nav */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-ink-200/70 px-3 py-2 md:hidden">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-100 text-brand-700'
                  : 'text-ink-600'
              }`
            }
          >
            <span className="mr-1" aria-hidden>
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
