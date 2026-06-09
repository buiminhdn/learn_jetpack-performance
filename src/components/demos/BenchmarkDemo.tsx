import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { DemoFrame } from '../ui/DemoFrame'
import { Toggle } from '../ui/Toggle'

const FRAME_BUDGET = 16 // ms, ~60fps

// Deterministic pseudo-frame timings (ms) for a scroll session.
function frames(optimized: boolean) {
  const base = optimized ? 9 : 14
  const spike = optimized ? 4 : 26
  return Array.from({ length: 30 }, (_, i) => {
    const wobble = ((i * 37) % 11) - 5
    const isSpike = !optimized ? i % 4 === 0 : i % 13 === 0
    return Math.max(4, base + wobble * 0.6 + (isSpike ? spike : 0))
  })
}

export function BenchmarkDemo() {
  const [optimized, setOptimized] = useState(false)
  const data = useMemo(() => frames(optimized), [optimized])

  const jank = data.filter((f) => f > FRAME_BUDGET).length
  const max = Math.max(...data)
  const sorted = [...data].sort((a, b) => a - b)
  const p90 = sorted[Math.floor(sorted.length * 0.9)]

  return (
    <DemoFrame
      title="Đo frame timing trước khi kết luận"
      description="Mỗi cột là thời gian dựng một frame khi cuộn. Vượt 16ms (đường đỏ) là jank. So sánh before/after."
    >
      <div className="mb-4">
        <Toggle
          checked={optimized}
          onChange={setOptimized}
          label={optimized ? 'Sau tối ưu (đã sửa bottleneck)' : 'Trước tối ưu (baseline)'}
          description={
            optimized
              ? 'Phần lớn frame dưới ngân sách 16ms → cuộn mượt.'
              : 'Nhiều frame vượt 16ms → người dùng cảm nhận giật (jank).'
          }
        />
      </div>

      <div className="mb-3 flex flex-wrap gap-2 text-xs">
        <span className="chip bg-ink-100">
          Frame jank: <b className={jank > 3 ? 'text-red-500' : 'text-android-600'}>{jank}</b>/30
        </span>
        <span className="chip bg-ink-100">
          p90: <b>{p90.toFixed(1)}ms</b>
        </span>
        <span className="chip bg-ink-100">
          max: <b>{max.toFixed(1)}ms</b>
        </span>
      </div>

      <div className="relative h-44 rounded-xl border border-ink-200 bg-ink-50 p-2">
        {/* budget line */}
        <div
          className="absolute left-2 right-2 border-t-2 border-dashed border-red-400/70"
          style={{ bottom: `${8 + (FRAME_BUDGET / 40) * 100}%` }}
        >
          <span className="absolute -top-4 right-0 text-[10px] font-bold text-red-500">16ms</span>
        </div>
        <div className="flex h-full items-end gap-[3px]">
          {data.map((f, i) => {
            const over = f > FRAME_BUDGET
            return (
              <motion.div
                key={`${optimized}-${i}`}
                initial={{ height: 0 }}
                animate={{ height: `${Math.min(100, (f / 40) * 100)}%` }}
                transition={{ delay: i * 0.012, type: 'spring', stiffness: 200, damping: 20 }}
                className={`flex-1 rounded-t ${
                  over ? 'bg-red-500' : 'bg-android-500'
                }`}
                title={`${f.toFixed(1)}ms`}
              />
            )
          })}
        </div>
      </div>

      <p className="mt-3 text-sm text-ink-600">
        {optimized
          ? '✅ Số frame vượt ngân sách giảm rõ rệt — nhưng chỉ kết luận được khi đo trên release/benchmark build.'
          : '⚠️ Đừng đoán: hãy dùng Macrobenchmark/Perfetto để biết frame nào chậm và vì sao.'}
      </p>
    </DemoFrame>
  )
}
