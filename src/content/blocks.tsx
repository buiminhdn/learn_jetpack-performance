import type { ReactNode } from 'react'

/** Body paragraph in Vietnamese reading style. */
export function P({ children }: { children: ReactNode }) {
  return <p className="prose-vi">{children}</p>
}

/** Inline technical term kept in English / monospace. */
export function T({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md bg-ink-100 px-1.5 py-0.5 font-mono text-[0.85em] text-brand-700">
      {children}
    </code>
  )
}

/** Bulleted list. */
export function UL({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="prose-vi flex gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-android-500" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

/** A small sub-heading inside a section. */
export function H({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-2 text-base font-bold text-ink-800">{children}</h3>
  )
}
