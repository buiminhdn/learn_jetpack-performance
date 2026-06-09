import { useEffect, useRef, useState } from 'react'
import { DemoFrame } from '../ui/DemoFrame'
import { Toggle } from '../ui/Toggle'
import { CodeBlock } from '../ui/CodeBlock'

const DURATION = 2600

export function RememberUpdatedStateDemo() {
  const [useRUS, setUseRUS] = useState(true)
  const [target, setTarget] = useState<'Home' | 'Login'>('Home')
  const [progress, setProgress] = useState(0)
  const [running, setRunning] = useState(false)
  const [fired, setFired] = useState<string | null>(null)
  const captured = useRef<'Home' | 'Login'>('Home')
  const start = useRef(0)
  const raf = useRef<number | null>(null)
  const targetRef = useRef(target)
  targetRef.current = target

  useEffect(() => {
    if (!running) return
    const tick = (now: number) => {
      const elapsed = now - start.current
      const p = Math.min(1, elapsed / DURATION)
      setProgress(p)
      if (p >= 1) {
        // Fire the latest callback (rememberUpdatedState) or the captured one.
        setFired(useRUS ? targetRef.current : captured.current)
        setRunning(false)
        return
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const startTimer = () => {
    captured.current = target
    setFired(null)
    setProgress(0)
    start.current = performance.now()
    setRunning(true)
  }

  return (
    <DemoFrame
      title="rememberUpdatedState giữ callback mới nhất"
      description="Bấm bắt đầu, rồi ĐỔI đích đến trong lúc đếm ngược. Effect không restart — câu hỏi là nó gọi callback nào?"
    >
      <div className="mb-4">
        <Toggle
          checked={useRUS}
          onChange={setUseRUS}
          label={useRUS ? 'Dùng rememberUpdatedState(onTimeout)' : 'Capture callback lúc tạo (không cập nhật)'}
          description={
            useRUS
              ? 'LaunchedEffect(Unit) không restart nhưng gọi onTimeout mới nhất.'
              : 'Effect giữ callback cũ → gọi đúng giá trị lúc bắt đầu (có thể stale).'
          }
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button onClick={startTimer} disabled={running} className="btn-primary">
          ⏱️ Bắt đầu (delay 2.6s)
        </button>
        <span className="text-sm text-ink-500">Đích hiện tại:</span>
        {(['Home', 'Login'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTarget(t)}
            className={`chip text-sm ${
              target === t
                ? 'bg-brand-600 text-white'
                : 'bg-ink-100 text-ink-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-ink-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-android-500 transition-[width] duration-75"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {fired && (
        <div
          className={`mt-4 rounded-xl border p-3 text-sm ${
            fired === target
              ? 'border-android-300 bg-android-50'
              : 'border-amber-300 bg-amber-50'
          }`}
        >
          Effect đã gọi: <span className="font-bold">onTimeout → {fired}</span>{' '}
          {fired === target
            ? '✅ đúng đích mới nhất.'
            : '⚠️ vẫn là đích cũ (stale) — đây là lỗi khi không dùng rememberUpdatedState.'}
        </div>
      )}

      <div className="mt-4">
        <CodeBlock
          tone="good"
          code={`val currentOnTimeout by rememberUpdatedState(onTimeout)\n\nLaunchedEffect(Unit) {\n    delay(2_600)\n    currentOnTimeout() // luôn là bản mới nhất, effect không restart\n}`}
        />
      </div>
    </DemoFrame>
  )
}
