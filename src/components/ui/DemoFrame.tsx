import type { ReactNode } from 'react'

interface DemoFrameProps {
  title: string
  description?: string
  children: ReactNode
}

/** Consistent chrome around every interactive demo. */
export function DemoFrame({ title, description, children }: DemoFrameProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-300/40 bg-gradient-to-b from-brand-50/50 to-transparent">
      <div className="flex items-center gap-2 border-b border-brand-300/30 bg-brand-100/40 px-4 py-2">
        <span className="chip bg-brand-600 text-[10px] uppercase tracking-wider text-white">
          ▶ Demo tương tác
        </span>
        <span className="text-sm font-semibold text-ink-800">{title}</span>
      </div>
      <div className="p-4 sm:p-5">
        {description && (
          <p className="mb-4 text-sm text-ink-600">{description}</p>
        )}
        {children}
      </div>
    </div>
  )
}
