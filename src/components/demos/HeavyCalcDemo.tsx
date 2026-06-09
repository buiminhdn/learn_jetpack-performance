import { useCallback, useState } from 'react'
import { DemoFrame } from '../ui/DemoFrame'
import { Toggle } from '../ui/Toggle'
import { RecomposeCounter } from '../ui/RecomposeCounter'
import { FlashBox } from './shared/FlashBox'
import { CodeBlock } from '../ui/CodeBlock'

const NAMES = ['An', 'Bình', 'Cường', 'Dũng', 'Hà', 'Khánh', 'Lan', 'Minh', 'Nam', 'Oanh']

function makeContacts(seed: number) {
  return Array.from({ length: 5 }, (_, i) => ({
    id: i,
    name: NAMES[(seed + i * 3) % NAMES.length],
  }))
}

export function HeavyCalcDemo() {
  const [useRemember, setUseRemember] = useState(true)
  const [seed, setSeed] = useState(0)
  const [parentRenders, setParentRenders] = useState(0)
  const [sortRuns, setSortRuns] = useState(0)
  const [sorted, setSorted] = useState(() =>
    [...makeContacts(0)].sort((a, b) => a.name.localeCompare(b.name, 'vi')),
  )

  const runSort = useCallback((s: number) => {
    setSortRuns((n) => n + 1)
    setSorted([...makeContacts(s)].sort((a, b) => a.name.localeCompare(b.name, 'vi')))
  }, [])

  // Simulates an unrelated state change in the parent (e.g. a counter elsewhere).
  const recomposeParent = () => {
    setParentRenders((n) => n + 1)
    // Without remember(contacts), the sort body re-runs on every recomposition.
    if (!useRemember) runSort(seed)
  }

  // Changing the actual data legitimately requires re-sorting in both modes.
  const changeData = () => {
    const next = seed + 1
    setSeed(next)
    setParentRenders((n) => n + 1)
    runSort(next)
  }

  return (
    <DemoFrame
      title="remember tránh tính toán lặp lại"
      description="“Recompose cha” mô phỏng một state khác trong cha thay đổi. Quan sát số lần sort thực sự chạy."
    >
      <div className="mb-4">
        <Toggle
          checked={useRemember}
          onChange={setUseRemember}
          label={useRemember ? 'Có remember(contacts, comparator)' : 'Sort thẳng trong thân Composable'}
          description={
            useRemember
              ? 'Chỉ sort lại khi key (contacts) đổi.'
              : 'Sort chạy lại mỗi lần Composable recompose — kể cả khi dữ liệu không đổi.'
          }
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={recomposeParent} className="btn-primary">
          ♻️ Recompose cha (state khác)
        </button>
        <button onClick={changeData} className="btn-ghost">
          🔀 Đổi dữ liệu (cần sort lại)
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <RecomposeCounter count={parentRenders} label="recompose cha" />
        <RecomposeCounter count={sortRuns} warn={!useRemember} label="lần sort đã chạy 🐌" />
      </div>

      <FlashBox signature={sortRuns} tone={useRemember ? 'ok' : 'bad'}>
        <div className="card-muted p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
            Danh sách đã sắp xếp
          </p>
          <div className="flex flex-wrap gap-2">
            {sorted.map((c) => (
              <span
                key={c.id}
                className="chip bg-brand-100 text-brand-700"
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </FlashBox>

      <p className="mt-3 text-sm text-ink-600">
        {useRemember
          ? '✅ Sort chỉ chạy khi dữ liệu đổi — recompose cha không kéo theo sort.'
          : '⚠️ Mỗi recompose cha đều chạy lại sort, dù dữ liệu y hệt.'}
      </p>

      <div className="mt-4">
        <CodeBlock
          tone={useRemember ? 'good' : 'bad'}
          code={
            useRemember
              ? `val sorted = remember(contacts, comparator) {\n    contacts.sortedWith(comparator)\n}`
              : `// chạy lại mỗi recomposition\nval sorted = contacts.sortedWith(comparator)`
          }
        />
      </div>
    </DemoFrame>
  )
}
