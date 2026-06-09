import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { DemoFrame } from '../ui/DemoFrame'
import { Toggle } from '../ui/Toggle'
import { RecomposeCounter } from '../ui/RecomposeCounter'
import { FlashBox } from './shared/FlashBox'
import { BadGoodCompare } from '../ui/BadGoodCompare'

export function DeferStateReadDemo() {
  const [defer, setDefer] = useState(true)
  const [scroll, setScroll] = useState(0)
  const [parentRecompose, setParentRecompose] = useState(0)
  const prevScroll = useRef(0)

  useEffect(() => {
    if (scroll !== prevScroll.current) {
      prevScroll.current = scroll
      // Reading scrollState.value at the parent recomposes the parent each step.
      if (!defer) setParentRecompose((c) => c + 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scroll])

  return (
    <DemoFrame
      title="Trì hoãn đọc state → thu hẹp phạm vi recompose"
      description="Kéo để “cuộn”. Đọc scrollState.value ngay tại cha khiến cả cha recompose; truyền provider lambda thì chỉ phần layout đọc."
    >
      <div className="mb-4">
        <Toggle
          checked={defer}
          onChange={setDefer}
          label={defer ? 'Truyền provider: offsetProvider = { scrollState.value }' : 'Đọc trực tiếp: offset = scrollState.value'}
          description={
            defer
              ? 'State đọc trong layout phase của Title → cha không recompose.'
              : 'Cha đọc state nên recompose liên tục khi cuộn.'
          }
        />
      </div>

      <FlashBox signature={defer ? 0 : parentRecompose} tone="bad" className="border border-dashed border-ink-300 p-3">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-500">
          SnackDetail (cha)
        </p>
        <div className="relative h-24 overflow-hidden rounded-lg bg-ink-100">
          <motion.div
            animate={{ y: scroll * 0.3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute left-3 top-3 rounded-lg bg-gradient-to-br from-brand-500 to-android-500 px-4 py-2 text-sm font-bold text-white shadow-glow"
          >
            Snack Title
          </motion.div>
        </div>
      </FlashBox>

      <input
        type="range"
        min={0}
        max={200}
        value={scroll}
        onChange={(e) => setScroll(Number(e.target.value))}
        className="mt-4 w-full accent-android-500"
        aria-label="Cuộn"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <RecomposeCounter count={parentRecompose} warn={!defer} label="recompose cha" />
        <p className="text-sm text-ink-600">
          {defer
            ? '✅ Cha đứng yên (0 flash) — chỉ Title di chuyển trong layout phase.'
            : '⚠️ Mỗi bước cuộn làm cả cha recompose.'}
        </p>
      </div>

      <div className="mt-4">
        <BadGoodCompare
          badCode={`Title(\n    offset = scrollState.value // đọc tại cha\n)`}
          goodCode={`Title(\n    offsetProvider = { scrollState.value } // đọc khi cần\n)\n\n// trong Title:\nModifier.offset { IntOffset(0, offsetProvider()) }`}
        />
      </div>
    </DemoFrame>
  )
}
