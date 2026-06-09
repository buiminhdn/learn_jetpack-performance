import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SECTIONS } from '../data/sections'
import { SectionView } from '../components/learn/SectionView'
import { useProgress } from '../context/ProgressContext'
import { ProgressRing } from '../components/ui/ProgressRing'

export function LearnPage() {
  const location = useLocation()
  const { percent, doneCount, total, reset } = useProgress()

  // Scroll to the anchored section when navigating with a hash.
  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1))
      const el = document.getElementById(id)
      if (el) {
        // Wait a tick for layout to settle.
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
      }
    } else {
      window.scrollTo({ top: 0 })
    }
  }, [location])

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-8 sm:px-8">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-android-600">
          Cẩm nang tương tác
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-ink-900 sm:text-4xl">
          Tối ưu hiệu năng <span className="text-android-500">Jetpack Compose</span>
        </h1>
        <p className="mt-2 prose-vi">
          30 quy tắc, mỗi quy tắc có giải thích, code Bad/Good và demo tương tác để bạn trực tiếp
          quan sát recomposition, phase, state, lazy list, stability, side effect và animation.
        </p>

        <div className="mt-4 flex items-center gap-4 rounded-2xl border border-ink-200/70 bg-white/60 p-4">
          <ProgressRing percent={percent} size={56} stroke={6} />
          <div className="flex-1">
            <p className="text-sm font-semibold">Tiến độ học tập</p>
            <p className="text-xs text-ink-500">
              {doneCount}/{total} mục · đánh dấu “Đã học” ở mỗi quy tắc
            </p>
          </div>
          {doneCount > 0 && (
            <button onClick={reset} className="btn-ghost text-xs">
              Đặt lại
            </button>
          )}
        </div>
      </header>

      {SECTIONS.map((meta) => (
        <SectionView key={meta.id} meta={meta} />
      ))}

      <p className="mt-10 text-center text-sm text-ink-400">
        Hết cẩm nang · Dựa trên tài liệu <i>Jetpack Compose Performance</i> chính thức.
      </p>
    </div>
  )
}
