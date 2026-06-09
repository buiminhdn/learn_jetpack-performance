import { useEffect, useRef, useState } from 'react'
import { DemoFrame } from '../ui/DemoFrame'
import { Toggle } from '../ui/Toggle'
import { FlashBox } from './shared/FlashBox'
import { BadGoodCompare } from '../ui/BadGoodCompare'

interface Item {
  id: number
  label: string
}

export function RememberKeyDemo() {
  const [withKey, setWithKey] = useState(false)
  const [items, setItems] = useState<Item[]>([
    { id: 1, label: 'Item #1' },
    { id: 2, label: 'Item #2' },
  ])
  const nextId = useRef(3)
  const [frozen, setFrozen] = useState<Item[]>(items)

  // Without a key, `remember { ... }` keeps the value captured on first run.
  // We freeze the snapshot the moment we switch into "no key" mode and never refresh it.
  useEffect(() => {
    if (!withKey) setFrozen(items)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withKey])

  const addItem = () => {
    const id = nextId.current++
    setItems((prev) => [...prev, { id, label: `Item #${id}` }])
  }
  const reset = () => {
    nextId.current = 3
    const base = [
      { id: 1, label: 'Item #1' },
      { id: 2, label: 'Item #2' },
    ]
    setItems(base)
    setFrozen(base)
  }

  const displayed = withKey ? items : frozen
  const stale = !withKey && displayed.length !== items.length

  return (
    <DemoFrame
      title="Key quyết định remember có cập nhật không"
      description="Thêm item rồi quan sát: thiếu key thì kết quả remember bị “đóng băng” (stale)."
    >
      <div className="mb-4">
        <Toggle
          checked={withKey}
          onChange={setWithKey}
          label={withKey ? 'remember(items) { items.filter { ... } }' : 'remember { items.filter { ... } }  // thiếu key'}
          description={
            withKey
              ? 'Có key items → tính lại khi danh sách đổi.'
              : 'Thiếu key → giữ kết quả lần đầu, không cập nhật khi items đổi.'
          }
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={addItem} className="btn-primary">
          ➕ Thêm item ({items.length})
        </button>
        <button onClick={reset} className="btn-ghost">
          ↺ Reset
        </button>
      </div>

      <FlashBox signature={displayed.length} tone={withKey ? 'ok' : 'bad'}>
        <div className="card-muted p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Kết quả remember
            </p>
            <span
              className={`chip text-xs ${
                stale
                  ? 'bg-red-100 text-red-700'
                  : 'bg-android-100 text-android-700'
              }`}
            >
              {stale ? `Stale! hiển thị ${displayed.length}, thực tế ${items.length}` : `${displayed.length} item`}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {displayed.map((it) => (
              <span key={it.id} className="chip bg-brand-100 text-brand-700">
                {it.label}
              </span>
            ))}
          </div>
        </div>
      </FlashBox>

      <div className="mt-4">
        <BadGoodCompare
          badCode={`// Kết quả không cập nhật khi items đổi\nval filtered = remember {\n    items.filter { it.visible }\n}`}
          goodCode={`// Tính lại đúng lúc items đổi\nval filtered = remember(items) {\n    items.filter { it.visible }\n}`}
        />
      </div>
    </DemoFrame>
  )
}
