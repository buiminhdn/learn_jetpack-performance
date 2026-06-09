import { useEffect, useRef, useState } from 'react'
import { DemoFrame } from '../ui/DemoFrame'
import { Toggle } from '../ui/Toggle'
import { RecomposeCounter } from '../ui/RecomposeCounter'
import { BadGoodCompare } from '../ui/BadGoodCompare'

export function AnimationDemo() {
  const [useTransform, setUseTransform] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [scale, setScale] = useState(1)
  const [relayouts, setRelayouts] = useState(0)
  const raf = useRef<number | null>(null)
  const startTime = useRef(0)

  useEffect(() => {
    if (!playing) return
    startTime.current = performance.now()
    const tick = (now: number) => {
      const t = (now - startTime.current) / 1000
      setScale(1 + (Math.sin(t * 3) * 0.5 + 0.5) * 0.8)
      // Animating size triggers Layout (and shifts siblings) each frame.
      if (!useTransform) setRelayouts((c) => c + 1)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [playing, useTransform])

  const size = 56
  return (
    <DemoFrame
      title="Animate transform thay vì relayout"
      description="Box ở giữa “thở”. Animate kích thước làm các box bên cạnh xô đẩy (relayout); animate scale qua graphicsLayer thì không."
    >
      <div className="mb-4">
        <Toggle
          checked={useTransform}
          onChange={setUseTransform}
          label={useTransform ? 'graphicsLayer { scaleX = s; scaleY = s }' : 'Animate Modifier.size(...) — đổi layout'}
          description={
            useTransform
              ? 'Chỉ ảnh hưởng Draw → hàng xóm đứng yên, không relayout.'
              : 'Đổi kích thước thật → Layout chạy lại và đẩy các phần tử khác.'
          }
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={() => setPlaying((p) => !p)} className="btn-primary">
          {playing ? '⏸️ Dừng' : '▶️ Chạy'}
        </button>
        <button onClick={() => { setRelayouts(0); setPlaying(false); setScale(1) }} className="btn-ghost">
          ↺ Reset
        </button>
        <RecomposeCounter count={relayouts} warn={!useTransform} label="Layout pass / animation" />
      </div>

      <div className="flex items-center justify-center gap-3 rounded-xl border border-ink-200 bg-ink-50 p-6">
        <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-ink-300" />
        <div
          className="flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-android-500 font-bold text-white"
          style={
            useTransform
              ? { width: size, height: size, transform: `scale(${scale})` }
              : { width: size * scale, height: size * scale }
          }
        >
          ❤
        </div>
        <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-ink-300" />
      </div>

      <p className="mt-3 text-sm text-ink-600">
        {useTransform
          ? '✅ Box hai bên đứng yên — animation chỉ chạy ở Draw.'
          : '⚠️ Box hai bên bị xô đẩy mỗi frame vì layout chạy lại.'}
      </p>

      <div className="mt-4">
        <BadGoodCompare
          badCode={`val offset by animateDpAsState(target)\nLargeScreen(Modifier.offset(y = offset)) // relayout`}
          goodCode={`val offsetPx by animateFloatAsState(target)\nLargeScreen(Modifier.offset {\n    IntOffset(0, offsetPx.roundToInt())\n})`}
        />
      </div>
    </DemoFrame>
  )
}
