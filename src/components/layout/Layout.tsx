import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Topbar } from './Topbar'
import { Sidebar } from './Sidebar'
import { SECTIONS } from '../../data/sections'
import { useActiveSection } from '../../hooks/useActiveSection'

const SECTION_IDS = SECTIONS.map((s) => s.id)

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeId = useActiveSection(SECTION_IDS)
  const location = useLocation()

  // The section sidebar is only relevant while reading the guide.
  const showSidebar = location.pathname === '/learn'

  return (
    <div className="min-h-screen">
      <Topbar onToggleMenu={() => setMobileOpen((v) => !v)} />

      <div className="mx-auto flex max-w-[1500px]">
        {/* Desktop sidebar */}
        {showSidebar && (
          <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 flex-shrink-0 border-r border-ink-200/70 lg:block">
            <Sidebar activeId={activeId} />
          </aside>
        )}

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] border-r border-ink-200/70 bg-white shadow-2xl lg:hidden"
            >
              <Sidebar activeId={activeId} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
