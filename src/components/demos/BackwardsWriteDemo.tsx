import { useEffect, useRef, useState } from 'react'
import { DemoFrame } from '../ui/DemoFrame'
import { RecomposeCounter } from '../ui/RecomposeCounter'
import { BadGoodCompare } from '../ui/BadGoodCompare'

export function BackwardsWriteDemo() {
  const [loopCount, setLoopCount] = useState(0)
  const [running, setRunning] = useState(false)
  const [goodCount, setGoodCount] = useState(0)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (running) {
      timer.current = window.setInterval(() => {
        setLoopCount((c) => {
          if (c >= 60) {
            setRunning(false)
            return c
          }
          return c + 1
        })
      }, 40)
    }
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [running])

  const startLoop = () => {
    setLoopCount(0)
    setRunning(true)
  }

  return (
    <DemoFrame
      title="Backwards write → vòng lặp recomposition"
      description="Ghi state ngay trong thân Composable (sau khi đã đọc) khiến Compose recompose liên tục."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* Bad */}
        <div className="rounded-xl border border-red-300/70 p-4">
          <p className="mb-2 text-sm font-bold text-red-600">❌ count++ trong thân Composable</p>
          <button onClick={startLoop} disabled={running} className="btn mb-3 bg-red-600 text-white hover:bg-red-500">
            {running ? 'Đang loop...' : '▶️ Mô phỏng loop'}
          </button>
          <div className="flex items-center gap-2">
            <RecomposeCounter count={loopCount} warn label="recompose" />
            {loopCount >= 60 && (
              <span className="text-xs text-red-500">…và sẽ không dừng trong thực tế!</span>
            )}
          </div>
        </div>

        {/* Good */}
        <div className="rounded-xl border border-android-300/70 p-4">
          <p className="mb-2 text-sm font-bold text-android-700">✅ count++ trong onClick</p>
          <button onClick={() => setGoodCount((c) => c + 1)} className="btn-android mb-3">
            ➕ Tăng ({goodCount})
          </button>
          <div className="flex items-center gap-2">
            <RecomposeCounter count={goodCount} label="recompose (đúng nhịp)" />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <BadGoodCompare
          badCode={`@Composable\nfun BadCounter() {\n    var count by remember { mutableIntStateOf(0) }\n    Text(count.toString())\n    count++ // backwards write!\n}`}
          goodCode={`@Composable\nfun Counter() {\n    var count by remember { mutableIntStateOf(0) }\n    Button(onClick = { count++ }) { Text("Tăng") }\n    Text(count.toString())\n}`}
        />
      </div>
    </DemoFrame>
  )
}
