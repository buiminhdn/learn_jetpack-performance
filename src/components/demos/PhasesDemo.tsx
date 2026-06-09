import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { DemoFrame } from '../ui/DemoFrame'
import { Toggle } from '../ui/Toggle'
import { RecomposeCounter } from '../ui/RecomposeCounter'

type Phase = 'composition' | 'layout' | 'draw'

const PHASES: { id: Phase; label: string; desc: string; icon: string }[] = [
  { id: 'composition', label: 'Composition', desc: 'UI nào tồn tại', icon: '🧩' },
  { id: 'layout', label: 'Layout', desc: 'đo & đặt vị trí', icon: '📐' },
  { id: 'draw', label: 'Draw', desc: 'vẽ pixel', icon: '🎨' },
]

export function PhasesDemo() {
  const [offset, setOffset] = useState(40)
  const [readInLayout, setReadInLayout] = useState(true)
  const [active, setActive] = useState<Phase[]>([])
  const [recompose, setRecompose] = useState(0)
  const timer = useRef<number | null>(null)

  // Whenever the offset changes, light up the phases that would actually run.
  useEffect(() => {
    const phases: Phase[] = readInLayout
      ? ['layout', 'draw'] // offset { } reads state in Layout phase
      : ['composition', 'layout', 'draw'] // offset(x.dp) reads in Composition
    setActive(phases)
    if (!readInLayout) setRecompose((c) => c + 1)

    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setActive([]), 650)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset])

  return (
    <DemoFrame
      title="Ba phase & nơi đọc state"
      description="Kéo thanh trượt để di chuyển hộp. Quan sát phase nào phải chạy lại tuỳ theo cách đọc state."
    >
      <div className="mb-5">
        <Toggle
          checked={readInLayout}
          onChange={setReadInLayout}
          label={readInLayout ? 'Đọc state ở Layout — Modifier.offset { }' : 'Đọc state ở Composition — Modifier.offset(x.dp)'}
          description={
            readInLayout
              ? 'Lambda đọc giá trị trong Layout phase → bỏ qua Composition.'
              : 'Giá trị đọc trong Composition phase → kích hoạt lại cả ba phase.'
          }
        />
      </div>

      {/* Phase pipeline */}
      <div className="mb-5 flex items-stretch gap-2">
        {PHASES.map((p, i) => {
          const isActive = active.includes(p.id)
          const skipped = active.length > 0 && !isActive
          return (
            <div key={p.id} className="flex flex-1 items-center gap-2">
              <motion.div
                animate={{
                  scale: isActive ? 1.04 : 1,
                  opacity: skipped ? 0.4 : 1,
                }}
                className={`flex-1 rounded-xl border p-3 text-center transition-colors ${
                  isActive
                    ? 'border-android-400 bg-android-100'
                    : skipped
                      ? 'border-dashed border-ink-300 bg-ink-50'
                      : 'border-ink-200 bg-white'
                }`}
              >
                <div className="text-xl">{p.icon}</div>
                <div className="text-sm font-bold text-ink-800">{p.label}</div>
                <div className="text-[11px] text-ink-500">{p.desc}</div>
                {skipped && (
                  <div className="mt-1 text-[10px] font-semibold text-ink-400">⤼ bỏ qua</div>
                )}
              </motion.div>
              {i < PHASES.length - 1 && <span className="text-ink-400">→</span>}
            </div>
          )
        })}
      </div>

      {/* Stage */}
      <div className="relative mb-4 h-24 overflow-hidden rounded-xl border border-ink-200 bg-ink-50">
        <motion.div
          animate={{ x: offset }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="absolute top-1/2 h-14 w-14 -translate-y-1/2 rounded-xl bg-gradient-to-br from-brand-500 to-android-500 shadow-glow"
        />
      </div>

      <input
        type="range"
        min={0}
        max={240}
        value={offset}
        onChange={(e) => setOffset(Number(e.target.value))}
        className="w-full accent-android-500"
        aria-label="Di chuyển hộp"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <RecomposeCounter count={recompose} warn={!readInLayout} label="lần Composition" />
        <p className="text-sm text-ink-600">
          {readInLayout
            ? '✅ Composition đứng yên — chỉ Layout & Draw chạy lại khi di chuyển.'
            : '⚠️ Mỗi lần di chuyển đều tốn một lần Composition không cần thiết.'}
        </p>
      </div>
    </DemoFrame>
  )
}
