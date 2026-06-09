import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { SECTIONS } from '../data/sections'

interface ProgressContextValue {
  /** Section ids the user has marked as done. */
  completed: string[]
  isCompleted: (id: string) => boolean
  toggleCompleted: (id: string) => void
  markCompleted: (id: string) => void
  reset: () => void
  total: number
  doneCount: number
  percent: number
  /** Checklist item ids ticked in the checklist page. */
  checklist: string[]
  toggleChecklist: (id: string) => void
  resetChecklist: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useLocalStorage<string[]>('cpa-progress', [])
  const [checklist, setChecklist] = useLocalStorage<string[]>('cpa-checklist', [])

  const isCompleted = useCallback((id: string) => completed.includes(id), [completed])

  const toggleCompleted = useCallback(
    (id: string) => {
      setCompleted((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      )
    },
    [setCompleted],
  )

  const markCompleted = useCallback(
    (id: string) => {
      setCompleted((prev) => (prev.includes(id) ? prev : [...prev, id]))
    },
    [setCompleted],
  )

  const reset = useCallback(() => setCompleted([]), [setCompleted])

  const toggleChecklist = useCallback(
    (id: string) => {
      setChecklist((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      )
    },
    [setChecklist],
  )

  const resetChecklist = useCallback(() => setChecklist([]), [setChecklist])

  const total = SECTIONS.length
  const doneCount = completed.length
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100)

  const value = useMemo(
    () => ({
      completed,
      isCompleted,
      toggleCompleted,
      markCompleted,
      reset,
      total,
      doneCount,
      percent,
      checklist,
      toggleChecklist,
      resetChecklist,
    }),
    [
      completed,
      isCompleted,
      toggleCompleted,
      markCompleted,
      reset,
      total,
      doneCount,
      percent,
      checklist,
      toggleChecklist,
      resetChecklist,
    ],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
