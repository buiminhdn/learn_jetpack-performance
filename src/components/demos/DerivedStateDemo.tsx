import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DemoFrame } from '../ui/DemoFrame'
import { Toggle } from '../ui/Toggle'
import { RecomposeCounter } from '../ui/RecomposeCounter'
import { CodeBlock } from '../ui/CodeBlock'

const ITEM_H = 44
const COUNT = 40

export function DerivedStateDemo() {
  const [useDerived, setUseDerived] = useState(true)
  const [index, setIndex] = useState(0)
  const [directReads, setDirectReads] = useState(0)
  const [derivedReads, setDerivedReads] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastShow = useRef(false)

  const showButton = index > 0

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newIndex = Math.floor(e.currentTarget.scrollTop / ITEM_H)
    if (newIndex !== index) {
      setIndex(newIndex)
      // Reading firstVisibleItemIndex directly recomposes the consumer every step.
      setDirectReads((c) => c + 1)
      const nowShow = newIndex > 0
      if (nowShow !== lastShow.current) {
        lastShow.current = nowShow
        // derivedStateOf only notifies when the derived boolean actually flips.
        setDerivedReads((c) => c + 1)
      }
    }
  }

  const scrollTop = () => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })

  const consumerRecompositions = useDerived ? derivedReads : directReads

  return (
    <DemoFrame
      title="derivedStateOf giảm số lần invalidation"
      description="Cuộn danh sách. Nút “lên đầu” chỉ cần biết index > 0 — một boolean đổi rất ít so với index."
    >
      <div className="mb-4">
        <Toggle
          checked={useDerived}
          onChange={setUseDerived}
          label={useDerived ? 'derivedStateOf { index > 0 }' : 'Đọc thẳng listState.firstVisibleItemIndex > 0'}
          description={
            useDerived
              ? 'Consumer chỉ recompose khi boolean đổi (lúc qua mốc đầu/không đầu).'
              : 'Consumer recompose mỗi khi index đổi — tức gần như mỗi bước cuộn.'
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="h-56 overflow-y-auto rounded-xl border border-ink-200 bg-white"
          >
            {Array.from({ length: COUNT }).map((_, i) => (
              <div
                key={i}
                style={{ height: ITEM_H }}
                className="flex items-center border-b border-ink-100 px-4 text-sm"
              >
                <span className="mr-3 font-mono text-xs text-ink-400">#{i}</span>
                Bài viết số {i + 1}
              </div>
            ))}
          </div>

          <AnimatePresence>
            {showButton && (
              <motion.button
                initial={{ opacity: 0, scale: 0.6, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6, y: 10 }}
                onClick={scrollTop}
                className="btn-android absolute bottom-3 right-3 !rounded-full !px-3 !py-2 shadow-glow-android"
              >
                ↑ Lên đầu
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col justify-center gap-2 text-sm">
          <div className="card-muted px-3 py-2">
            <p className="text-xs text-ink-500">firstVisibleItemIndex</p>
            <p className="font-mono text-lg font-bold tabular-nums">{index}</p>
          </div>
          <RecomposeCounter
            count={consumerRecompositions}
            warn={!useDerived}
            label="consumer recompose"
          />
        </div>
      </div>

      <div className="mt-4">
        <CodeBlock
          tone={useDerived ? 'good' : 'bad'}
          code={
            useDerived
              ? `val showButton by remember {\n    derivedStateOf { listState.firstVisibleItemIndex > 0 }\n}`
              : `// đọc trực tiếp: đổi theo từng bước cuộn\nval showButton = listState.firstVisibleItemIndex > 0`
          }
        />
      </div>
    </DemoFrame>
  )
}
