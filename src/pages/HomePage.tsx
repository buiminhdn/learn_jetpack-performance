import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GROUPS, SECTIONS } from '../data/sections'
import { useProgress } from '../context/ProgressContext'
import { ProgressRing } from '../components/ui/ProgressRing'

const FEATURES = [
  { icon: '🔄', title: 'Recomposition trực quan', desc: 'Xem component nào sáng lên (recompose) và phạm vi rộng/hẹp ra sao.' },
  { icon: '🧩', title: 'Ba phase Compose', desc: 'Quan sát Composition → Layout → Draw và phase nào được bỏ qua.' },
  { icon: '📜', title: 'Lazy list & key', desc: 'Chèn/xáo item để thấy key giữ đúng identity, contentType tái dùng.' },
  { icon: '🧊', title: 'Stability & skip', desc: 'Bật/tắt stable param để thấy Compose skip hay không.' },
  { icon: '⚡', title: 'Side effects', desc: 'Ghép đúng LaunchedEffect / DisposableEffect / rememberUpdatedState.' },
  { icon: '📊', title: 'Benchmark frame', desc: 'So sánh frame timing trước/sau tối ưu, đếm jank.' },
]

export function HomePage() {
  const { percent, doneCount, total } = useProgress()
  const demoCount = SECTIONS.filter((s) => s.hasDemo).length

  return (
    <div className="px-4 pb-24 pt-10 sm:px-8">
      {/* Hero */}
      <section className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="chip mx-auto mb-4 bg-android-100 text-android-700">
            🤖 Android · Jetpack Compose · Performance
          </span>
          <h1 className="text-4xl font-extrabold leading-tight text-ink-900 sm:text-5xl">
            Học tối ưu hiệu năng Compose <br />
            <span className="bg-gradient-to-r from-brand-500 to-android-500 bg-clip-text text-transparent">
              bằng demo tương tác
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl prose-vi text-base">
            Không chỉ đọc lý thuyết. Bạn sẽ tự tay bật/tắt từng kỹ thuật tối ưu và quan sát ngay
            recomposition, state, lazy list, stability, side effects, animation và benchmark thay đổi
            thế nào.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/learn" className="btn-primary text-base">
              📚 Bắt đầu học
            </Link>
            <Link to="/playground" className="btn-android text-base">
              🧪 Mở Playground
            </Link>
            <Link to="/quiz" className="btn-ghost text-base">
              ❓ Làm Quiz
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Quy tắc', value: SECTIONS.length },
            { label: 'Demo tương tác', value: demoCount },
            { label: 'Nhóm chủ đề', value: GROUPS.length },
            { label: 'Hoàn thành', value: `${percent}%` },
          ].map((s) => (
            <div key={s.label} className="card p-4">
              <p className="text-2xl font-extrabold text-android-500">{s.value}</p>
              <p className="text-xs text-ink-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Continue learning */}
      {doneCount > 0 && (
        <section className="mx-auto mt-10 max-w-4xl">
          <div className="flex items-center gap-4 rounded-2xl border border-android-300/50 bg-android-50/60 p-5">
            <ProgressRing percent={percent} size={56} stroke={6} />
            <div className="flex-1">
              <p className="font-semibold">Tiếp tục học</p>
              <p className="text-sm text-ink-500">
                Bạn đã hoàn thành {doneCount}/{total} quy tắc. Tiếp tục nhé!
              </p>
            </div>
            <Link to="/learn" className="btn-android">
              Tiếp tục →
            </Link>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="mx-auto mt-14 max-w-5xl">
        <h2 className="text-center text-2xl font-extrabold text-ink-900">
          Bạn sẽ quan sát được gì?
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card p-5"
            >
              <div className="mb-2 text-2xl">{f.icon}</div>
              <h3 className="font-bold text-ink-800">{f.title}</h3>
              <p className="mt-1 text-sm text-ink-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Topic groups */}
      <section className="mx-auto mt-14 max-w-5xl">
        <h2 className="text-center text-2xl font-extrabold text-ink-900">
          9 nhóm chủ đề
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g) => {
            const count = SECTIONS.filter((s) => s.group === g.id).length
            return (
              <Link
                key={g.id}
                to={`/learn#${SECTIONS.find((s) => s.group === g.id)?.id ?? ''}`}
                className="card flex items-center gap-3 p-4 transition-all hover:border-brand-400 hover:shadow-glow"
              >
                <span className="text-2xl">{g.icon}</span>
                <span className="flex-1">
                  <span className="block font-semibold text-ink-800">{g.title}</span>
                  <span className="text-xs text-ink-400">{count} quy tắc</span>
                </span>
                <span className="text-ink-300">→</span>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
