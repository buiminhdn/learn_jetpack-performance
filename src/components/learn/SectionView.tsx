import { Suspense } from 'react'
import type { SectionMeta } from '../../types'
import { SECTION_CONTENT } from '../../content'
import { DEMO_REGISTRY } from '../demos/registry'
import { GROUPS } from '../../data/sections'
import { useProgress } from '../../context/ProgressContext'

interface SectionViewProps {
  meta: SectionMeta
}

export function SectionView({ meta }: SectionViewProps) {
  const { isCompleted, toggleCompleted } = useProgress()
  const done = isCompleted(meta.id)
  const Demo = DEMO_REGISTRY[meta.id]
  const group = GROUPS.find((g) => g.id === meta.group)
  const content = SECTION_CONTENT[meta.id]

  return (
    <section id={meta.id} className="scroll-anchor border-b border-ink-200/70 py-10">
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-android-500 text-lg font-extrabold text-white shadow-glow">
          {meta.number}
        </div>
        <div className="min-w-0 flex-1">
          {group && (
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              {group.icon} {group.title}
            </p>
          )}
          <h2 className="text-xl font-extrabold text-ink-900 sm:text-2xl">
            {meta.title}
          </h2>
          <p className="mt-1 text-sm text-ink-500">{meta.summary}</p>
        </div>
        <button
          onClick={() => toggleCompleted(meta.id)}
          className={`chip flex-shrink-0 border text-xs transition-colors ${
            done
              ? 'border-android-400 bg-android-100 text-android-700'
              : 'border-ink-300 text-ink-500 hover:border-android-400'
          }`}
        >
          {done ? '✓ Đã học' : 'Đánh dấu đã học'}
        </button>
      </div>

      {content && <div className="space-y-4">{content}</div>}

      {Demo && (
        <div className="mt-6">
          <Suspense fallback={<div className="card p-6 text-center text-sm text-ink-400">Đang tải demo…</div>}>
            <Demo />
          </Suspense>
        </div>
      )}
    </section>
  )
}
