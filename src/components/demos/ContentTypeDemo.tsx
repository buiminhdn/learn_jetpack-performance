import { useMemo, useState } from 'react'
import { DemoFrame } from '../ui/DemoFrame'
import { Toggle } from '../ui/Toggle'
import { RecomposeCounter } from '../ui/RecomposeCounter'
import { CodeBlock } from '../ui/CodeBlock'

type FeedType = 'header' | 'post' | 'ad'

const TYPE_META: Record<FeedType, { label: string; color: string }> = {
  header: { label: 'Header', color: 'bg-brand-500' },
  post: { label: 'Post', color: 'bg-android-500' },
  ad: { label: 'Ad', color: 'bg-amber-500' },
}

// A representative heterogeneous feed.
const FEED: FeedType[] = [
  'header', 'post', 'post', 'ad', 'post', 'header', 'post', 'ad',
  'post', 'post', 'ad', 'header', 'post', 'post', 'ad', 'post',
]
const WINDOW = 5

/** Simulate scrolling and count how many compositions must be created. */
function simulate(offset: number, useContentType: boolean) {
  let created = 0
  const typedPool: Record<FeedType, number> = { header: 0, post: 0, ad: 0 }
  let flatPool = 0
  let lastType: FeedType | null = null

  for (let i = 0; i <= offset + WINDOW; i++) {
    const type = FEED[i % FEED.length]
    if (i < WINDOW) {
      // initial fill always creates
      created++
      continue
    }
    if (useContentType) {
      if (typedPool[type] > 0) typedPool[type]--
      else created++
      const leaving = FEED[(i - WINDOW) % FEED.length]
      typedPool[leaving]++
    } else {
      // single pool: reuse only helps when the recycled slot had the same type
      if (flatPool > 0 && lastType === type) flatPool--
      else created++
      flatPool = 1
      lastType = FEED[(i - WINDOW) % FEED.length]
    }
  }
  return created
}

export function ContentTypeDemo() {
  const [useContentType, setUseContentType] = useState(true)
  const [offset, setOffset] = useState(0)

  const created = useMemo(() => simulate(offset, useContentType), [offset, useContentType])
  const window = useMemo(
    () => Array.from({ length: WINDOW }, (_, i) => FEED[(offset + i) % FEED.length]),
    [offset],
  )

  return (
    <DemoFrame
      title="contentType giúp tái sử dụng composition"
      description="Danh sách trộn nhiều loại item. Cuộn xuống và đếm số composition phải tạo mới."
    >
      <div className="mb-4">
        <Toggle
          checked={useContentType}
          onChange={setUseContentType}
          label={useContentType ? 'Có contentType cho từng loại item' : 'Không khai báo contentType'}
          description={
            useContentType
              ? 'Compose giữ pool riêng cho mỗi loại → tái dùng đúng layout.'
              : 'Composition tái dùng dễ lệch loại → phải tạo lại nhiều hơn.'
          }
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button onClick={() => setOffset((o) => o + 1)} className="btn-primary">
          ⬇️ Cuộn 1 item
        </button>
        <button onClick={() => setOffset((o) => o + 5)} className="btn-ghost">
          ⏬ Cuộn 5 item
        </button>
        <button onClick={() => setOffset(0)} className="btn-ghost">
          ↺ Reset
        </button>
        <RecomposeCounter count={created} warn={!useContentType} label="composition đã tạo" />
      </div>

      <div className="flex gap-2">
        {window.map((type, i) => (
          <div
            key={i}
            className={`flex-1 rounded-xl p-3 text-center text-xs font-bold text-white ${TYPE_META[type].color}`}
          >
            {TYPE_META[type].label}
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-ink-500">↑ Cửa sổ hiển thị hiện tại (offset {offset})</p>

      <div className="mt-4">
        <CodeBlock
          tone="good"
          code={`items(\n    items = feedItems,\n    key = FeedItem::id,\n    contentType = { item ->\n        when (item) {\n            is FeedItem.Header -> "header"\n            is FeedItem.Post -> "post"\n            is FeedItem.Ad -> "ad"\n        }\n    }\n) { item -> /* ... */ }`}
        />
      </div>
    </DemoFrame>
  )
}
