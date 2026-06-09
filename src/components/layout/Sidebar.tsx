import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { GROUPS, SECTIONS } from '../../data/sections'
import { useProgress } from '../../context/ProgressContext'
import { ProgressRing } from '../ui/ProgressRing'

interface SidebarProps {
  activeId: string
  onNavigate?: () => void
}

export function Sidebar({ activeId, onNavigate }: SidebarProps) {
  const [query, setQuery] = useState('')
  const { isCompleted, doneCount, total, percent } = useProgress()
  const location = useLocation()
  const navigate = useNavigate()
  const onLearn = location.pathname === '/learn'
  const navRef = useRef<HTMLElement>(null)

  // Keep the active nav item scrolled into view inside the sidebar.
  useEffect(() => {
    if (!onLearn || !activeId) return
    const el = navRef.current?.querySelector<HTMLElement>(`[data-section-id="${activeId}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeId, onLearn])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SECTIONS
    return SECTIONS.filter((s) => {
      const haystack = `${s.number} ${s.title} ${s.summary} ${s.keywords.join(' ')}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [query])

  const grouped = useMemo(
    () =>
      GROUPS.map((group) => ({
        group,
        sections: filtered.filter((s) => s.group === group.id),
      })).filter((g) => g.sections.length > 0),
    [filtered],
  )

  const goToSection = (id: string) => {
    onNavigate?.()
    if (onLearn) {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    navigate(`/learn#${id}`)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Progress summary */}
      <div className="flex items-center gap-3 border-b border-ink-200/70 px-4 py-3">
        <ProgressRing percent={percent} size={48} stroke={5} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink-800">Tiến độ học</p>
          <p className="text-xs text-ink-500">
            {doneCount}/{total} mục hoàn thành
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm rule, từ khoá..."
            className="w-full rounded-xl border border-ink-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-brand-400"
          />
        </div>
      </div>

      {/* Section nav */}
      <nav ref={navRef} className="flex-1 overflow-y-auto px-2 pb-6">
        {grouped.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-ink-400">Không tìm thấy mục nào.</p>
        )}
        {grouped.map(({ group, sections }) => (
          <div key={group.id} className="mb-3">
            <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-400">
              <span className="mr-1.5">{group.icon}</span>
              {group.title}
            </p>
            <ul>
              {sections.map((s) => {
                const active = s.id === activeId && onLearn
                const done = isCompleted(s.id)
                return (
                  <li key={s.id}>
                    <button
                      data-section-id={s.id}
                      aria-current={active ? 'true' : undefined}
                      onClick={() => goToSection(s.id)}
                      className={`group flex w-full items-center gap-2 rounded-lg border-l-2 px-3 py-1.5 text-left text-sm transition-colors ${
                        active
                          ? 'border-brand-500 bg-brand-100 font-semibold text-brand-700'
                          : 'border-transparent text-ink-600 hover:bg-ink-100'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                          done
                            ? 'bg-android-500 text-ink-950'
                            : active
                              ? 'bg-brand-500 text-white'
                              : 'bg-ink-200 text-ink-500'
                        }`}
                      >
                        {done ? '✓' : s.number}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{s.title}</span>
                      {s.hasDemo && (
                        <span className="text-[10px]" title="Có demo tương tác" aria-hidden>
                          ▶
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-ink-200/70 px-4 py-3">
        <Link
          to="/playground"
          onClick={onNavigate}
          className="btn-android w-full text-sm"
        >
          🧪 Mở Playground
        </Link>
      </div>
    </div>
  )
}
