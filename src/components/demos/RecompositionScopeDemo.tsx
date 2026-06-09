import { useState } from 'react'
import { DemoFrame } from '../ui/DemoFrame'
import { Toggle } from '../ui/Toggle'
import { RecomposeCounter } from '../ui/RecomposeCounter'
import { FlashBox } from './shared/FlashBox'

export function RecompositionScopeDemo() {
  const [hoisted, setHoisted] = useState(false)
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const [parentRecompose, setParentRecompose] = useState(0)
  const [aRecompose, setARecompose] = useState(0)
  const [bRecompose, setBRecompose] = useState(0)

  const bump = (which: 'a' | 'b') => {
    if (hoisted) {
      // State hoisted & read at parent → the whole subtree recomposes.
      setParentRecompose((c) => c + 1)
      setARecompose((c) => c + 1)
      setBRecompose((c) => c + 1)
    } else {
      // State kept local → only the owning child recomposes.
      if (which === 'a') setARecompose((c) => c + 1)
      else setBRecompose((c) => c + 1)
    }
    if (which === 'a') setA((v) => v + 1)
    else setB((v) => v + 1)
  }

  return (
    <DemoFrame
      title="Phạm vi recomposition"
      description="Recomposition là bình thường — vấn đề là phạm vi. State cục bộ chỉ recompose đúng phần phụ thuộc."
    >
      <div className="mb-4">
        <Toggle
          checked={hoisted}
          onChange={setHoisted}
          label={hoisted ? 'State đọc ở cha (phạm vi rộng)' : 'State cục bộ ở mỗi con (phạm vi hẹp)'}
          description={
            hoisted
              ? 'Đọc state quá cao → đổi 1 con cũng recompose cả cây.'
              : 'Mỗi con tự giữ state → đổi con này không đụng con kia.'
          }
        />
      </div>

      <FlashBox signature={parentRecompose} tone="bad" className="border border-dashed border-ink-300 p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Parent</p>
          <RecomposeCounter count={parentRecompose} warn={hoisted} label="" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FlashBox signature={aRecompose} tone={hoisted ? 'bad' : 'ok'}>
            <div className="card-muted p-3 text-center">
              <p className="text-sm font-semibold">Child A</p>
              <p className="my-1 text-2xl font-bold tabular-nums">{a}</p>
              <button onClick={() => bump('a')} className="btn-primary w-full !py-1 text-xs">
                A++
              </button>
            </div>
          </FlashBox>
          <FlashBox signature={bRecompose} tone={hoisted ? 'bad' : 'ok'}>
            <div className="card-muted p-3 text-center">
              <p className="text-sm font-semibold">Child B</p>
              <p className="my-1 text-2xl font-bold tabular-nums">{b}</p>
              <button onClick={() => bump('b')} className="btn-android w-full !py-1 text-xs">
                B++
              </button>
            </div>
          </FlashBox>
        </div>
      </FlashBox>

      <p className="mt-3 text-sm text-ink-600">
        {hoisted
          ? '⚠️ Bấm A hay B đều làm Parent + cả hai con sáng đỏ — phạm vi quá rộng.'
          : '✅ Bấm A chỉ A sáng, bấm B chỉ B sáng — phạm vi gọn gàng.'}
      </p>
    </DemoFrame>
  )
}
