import type { ReactNode } from 'react'

type CalloutKind = 'info' | 'tip' | 'warning' | 'rule' | 'danger'

const styles: Record<CalloutKind, { box: string; icon: string; label: string }> = {
  info: {
    box: 'border-brand-300/60 bg-brand-50/70',
    icon: 'ℹ️',
    label: 'Ghi chú',
  },
  tip: {
    box: 'border-android-300/60 bg-android-50/70',
    icon: '💡',
    label: 'Mẹo',
  },
  warning: {
    box: 'border-amber-300/70 bg-amber-50/80',
    icon: '⚠️',
    label: 'Lưu ý',
  },
  rule: {
    box: 'border-indigo-300/60 bg-indigo-50/70',
    icon: '📌',
    label: 'Quy tắc',
  },
  danger: {
    box: 'border-red-300/70 bg-red-50/80',
    icon: '🚫',
    label: 'Nguy hiểm',
  },
}

interface CalloutProps {
  kind?: CalloutKind
  title?: string
  children: ReactNode
}

export function Callout({ kind = 'info', title, children }: CalloutProps) {
  const s = styles[kind]
  return (
    <div className={`rounded-xl border p-4 ${s.box}`}>
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
        <span aria-hidden>{s.icon}</span>
        <span>{title ?? s.label}</span>
      </div>
      <div className="prose-vi text-sm">{children}</div>
    </div>
  )
}
