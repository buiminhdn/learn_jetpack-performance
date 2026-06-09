import { useEffect, useRef, useState } from 'react'
import { DemoFrame } from '../ui/DemoFrame'
import { Toggle } from '../ui/Toggle'
import { RecomposeCounter } from '../ui/RecomposeCounter'
import { BadGoodCompare } from '../ui/BadGoodCompare'

export function ModifierLambdaDemo() {
  const [useLambda, setUseLambda] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [x, setX] = useState(0)
  const [recompose, setRecompose] = useState(0)
  const raf = useRef<number | null>(null)
  const startTime = useRef(0)

  useEffect(() => {
    if (!playing) return
    startTime.current = performance.now()
    const tick = (now: number) => {
      const t = (now - startTime.current) / 1000
      const nextX = (Math.sin(t * 2) * 0.5 + 0.5) * 220
      setX(nextX)
      // offset(x.dp) reads in Composition → each animated frame triggers a recomposition.
      if (!useLambda) setRecompose((c) => c + 1)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [playing, useLambda])

  return (
    <DemoFrame
      title="Modifier lambda cho giá trị đổi liên tục"
      description="Chạy animation. offset(x.dp) đọc state ở Composition (đếm tăng vùn vụt); offset { } đọc ở Layout."
    >
      <div className="mb-4">
        <Toggle
          checked={useLambda}
          onChange={setUseLambda}
          label={useLambda ? 'Modifier.offset { IntOffset(x, 0) }' : 'Modifier.offset(x = x.dp)'}
          description={
            useLambda
              ? 'Đọc trong Layout phase → không tốn Composition khi animate.'
              : 'Đọc trong Composition → mỗi frame là một recomposition.'
          }
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={() => setPlaying((p) => !p)} className="btn-primary">
          {playing ? '⏸️ Dừng' : '▶️ Chạy animation'}
        </button>
        <button
          onClick={() => {
            setRecompose(0)
            setPlaying(false)
            setX(0)
          }}
          className="btn-ghost"
        >
          ↺ Reset
        </button>
        <RecomposeCounter count={recompose} warn={!useLambda} label="Composition / animation" />
      </div>

      <div className="relative h-20 overflow-hidden rounded-xl border border-ink-200 bg-ink-50">
        <div
          className="absolute top-1/2 h-12 w-12 -translate-y-1/2 rounded-xl bg-gradient-to-br from-brand-500 to-android-500 shadow-glow"
          style={{ transform: `translate(${x}px, -50%)` }}
        />
      </div>

      <p className="mt-3 text-sm text-ink-600">
        {useLambda
          ? '✅ Animation mượt mà không tạo ra Composition nào.'
          : '⚠️ Mỗi frame animation kéo theo một lần Composition — lãng phí.'}
      </p>

      <div className="mt-4">
        <BadGoodCompare
          badCode={`Box(\n    modifier = Modifier.offset(x = animatedX.dp)\n)`}
          goodCode={`Box(\n    modifier = Modifier.offset {\n        IntOffset(animatedX.roundToInt(), 0)\n    }\n)`}
        />
      </div>
    </DemoFrame>
  )
}
