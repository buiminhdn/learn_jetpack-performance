import { useEffect, useState } from 'react'

/**
 * Tracks which anchored section is currently in view.
 *
 * Uses a scroll listener (rAF-throttled) instead of intersection ratios because
 * sections here are often taller than the viewport — ratio-based detection would
 * pick the wrong one. We pick the last section whose top has scrolled above the
 * detection line just under the sticky header.
 */
export function useActiveSection(ids: string[], offset = 120) {
  const [active, setActive] = useState<string>(ids[0] ?? '')

  useEffect(() => {
    if (ids.length === 0) return

    let frame = 0

    const compute = () => {
      frame = 0
      let current = ids[0]
      let found = false
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= offset) {
          current = id
          found = true
        }
      }
      // If we're scrolled to the very bottom, force the last section active so the
      // final (often short) section can still light up.
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      if (atBottom) current = ids[ids.length - 1]
      else if (!found) current = ids[0]

      setActive((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids, offset])

  return active
}
