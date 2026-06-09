import { useMemo } from 'react'
import { CHECKLIST } from '../data/checklist'
import { useProgress } from '../context/ProgressContext'
import { ProgressRing } from '../components/ui/ProgressRing'

export function ChecklistPage() {
  const { checklist, toggleChecklist, resetChecklist } = useProgress()

  const allItems = useMemo(() => CHECKLIST.flatMap((c) => c.items), [])
  const done = checklist.length
  const total = allItems.length
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-8">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-android-600">
          Review trước khi merge
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-ink-900 sm:text-4xl">
          Checklist hiệu năng
        </h1>
        <p className="mt-2 prose-vi">
          Tick từng mục khi review code. Tiến độ được lưu trên trình duyệt của bạn.
        </p>

        <div className="mt-4 flex items-center gap-4 rounded-2xl border border-ink-200/70 bg-white/60 p-4">
          <ProgressRing percent={percent} size={56} stroke={6} />
          <div className="flex-1">
            <p className="text-sm font-semibold">
              {done}/{total} mục đã kiểm
            </p>
            <p className="text-xs text-ink-500">
              {percent === 100 ? '🎉 Sẵn sàng merge!' : 'Hoàn thành toàn bộ trước khi merge.'}
            </p>
          </div>
          {done > 0 && (
            <button onClick={resetChecklist} className="btn-ghost text-xs">
              Đặt lại
            </button>
          )}
        </div>
      </header>

      <div className="space-y-5">
        {CHECKLIST.map((cat) => {
          const catDone = cat.items.filter((i) => checklist.includes(i.id)).length
          return (
            <section key={cat.id} className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-ink-200/70 bg-ink-50/60 px-4 py-3">
                <h2 className="font-bold text-ink-800">
                  <span className="mr-2">{cat.icon}</span>
                  {cat.title}
                </h2>
                <span className="chip bg-ink-100 text-xs text-ink-500">
                  {catDone}/{cat.items.length}
                </span>
              </div>
              <ul className="divide-y divide-ink-100">
                {cat.items.map((item) => {
                  const checked = checklist.includes(item.id)
                  return (
                    <li key={item.id}>
                      <label className="flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-ink-50">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleChecklist(item.id)}
                          className="mt-0.5 h-5 w-5 flex-shrink-0 cursor-pointer rounded accent-android-500"
                        />
                        <span
                          className={`text-sm ${
                            checked
                              ? 'text-ink-400 line-through'
                              : 'text-ink-700'
                          }`}
                        >
                          {item.label}
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
