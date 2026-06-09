import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { DemoFrame } from '../ui/DemoFrame'
import { Toggle } from '../ui/Toggle'
import { BadGoodCompare } from '../ui/BadGoodCompare'

interface Note {
  id: number
  title: string
}

const START: Note[] = [
  { id: 101, title: 'Mua sữa' },
  { id: 102, title: 'Gọi điện cho mẹ' },
  { id: 103, title: 'Đọc tài liệu Compose' },
]

export function LazyKeyDemo() {
  const [withKey, setWithKey] = useState(false)
  const [notes, setNotes] = useState<Note[]>(START)
  const [likedById, setLikedById] = useState<Set<number>>(new Set([102]))
  const [likedByPos, setLikedByPos] = useState<Set<number>>(new Set([1]))
  const nextId = useRef(104)

  const toggleLike = (note: Note, pos: number) => {
    if (withKey) {
      setLikedById((prev) => {
        const next = new Set(prev)
        next.has(note.id) ? next.delete(note.id) : next.add(note.id)
        return next
      })
    } else {
      setLikedByPos((prev) => {
        const next = new Set(prev)
        next.has(pos) ? next.delete(pos) : next.add(pos)
        return next
      })
    }
  }

  const isLiked = (note: Note, pos: number) =>
    withKey ? likedById.has(note.id) : likedByPos.has(pos)

  const insertTop = () => {
    const id = nextId.current++
    setNotes((prev) => [{ id, title: `Việc mới #${id}` }, ...prev])
  }
  const reset = () => {
    nextId.current = 104
    setNotes(START)
    setLikedById(new Set([102]))
    setLikedByPos(new Set([1]))
  }

  return (
    <DemoFrame
      title="Key giữ đúng identity của item"
      description="Tim một vài item, rồi chèn item mới lên đầu. Không có key, trạng thái “tim” bám theo vị trí → gắn nhầm item."
    >
      <div className="mb-4">
        <Toggle
          checked={withKey}
          onChange={setWithKey}
          label={withKey ? 'key = { note.id }  (theo identity)' : 'Không key  (theo vị trí/index)'}
          description={
            withKey
              ? 'Trạng thái item đi theo id, dù danh sách thay đổi thứ tự.'
              : 'Compose định danh item theo vị trí → state gắn nhầm khi chèn/xoá.'
          }
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={insertTop} className="btn-primary">
          ⬆️ Chèn item lên đầu
        </button>
        <button onClick={reset} className="btn-ghost">
          ↺ Reset
        </button>
      </div>

      <div className="space-y-2">
        {notes.map((note, pos) => {
          const liked = isLiked(note, pos)
          return (
            <motion.div
              layout
              key={note.id}
              className="flex items-center justify-between rounded-xl border border-ink-200 bg-white px-4 py-2.5"
            >
              <span className="flex items-center gap-3">
                <span className="font-mono text-xs text-ink-400">id:{note.id}</span>
                <span className="text-sm">{note.title}</span>
              </span>
              <button
                onClick={() => toggleLike(note, pos)}
                className={`text-lg transition-transform active:scale-125 ${liked ? '' : 'grayscale opacity-40'}`}
                aria-label="Yêu thích"
              >
                ❤️
              </button>
            </motion.div>
          )
        })}
      </div>

      <p className="mt-3 text-sm text-ink-600">
        {withKey
          ? '✅ Tim luôn ở đúng item dù chèn lên đầu — state theo id.'
          : '⚠️ Sau khi chèn, tim “nhảy” sang item khác vì state gắn theo vị trí.'}
      </p>

      <div className="mt-4">
        <BadGoodCompare
          badCode={`LazyColumn {\n    items(notes) { note ->\n        NoteRow(note) // không key → định danh theo vị trí\n    }\n}`}
          goodCode={`LazyColumn {\n    items(\n        items = notes,\n        key = Note::id\n    ) { note ->\n        NoteRow(note)\n    }\n}`}
        />
      </div>
    </DemoFrame>
  )
}
