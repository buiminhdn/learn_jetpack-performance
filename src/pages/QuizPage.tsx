import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { QUIZ } from '../data/quiz'
import { SECTION_BY_NUMBER } from '../data/sections'

export function QuizPage() {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [finished, setFinished] = useState(false)

  const q = QUIZ[index]
  const total = QUIZ.length
  const score = useMemo(() => Object.values(answers).filter(Boolean).length, [answers])
  const relatedSection = SECTION_BY_NUMBER.get(q?.rule)

  const pick = (optId: string) => {
    if (picked) return
    setPicked(optId)
    setAnswers((prev) => ({ ...prev, [q.id]: optId === q.correct }))
  }

  const next = () => {
    if (index + 1 >= total) {
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
  }

  const restart = () => {
    setIndex(0)
    setPicked(null)
    setAnswers({})
    setFinished(false)
  }

  if (finished) {
    const pct = Math.round((score / total) * 100)
    const great = pct >= 80
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-8">
        <div className="text-6xl">{great ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
        <h1 className="mt-4 text-3xl font-extrabold text-ink-900">
          Bạn đúng {score}/{total}
        </h1>
        <p className="mt-2 prose-vi">
          {great
            ? 'Xuất sắc! Bạn đã nắm vững các nguyên tắc tối ưu Compose.'
            : 'Ôn lại các quy tắc liên quan rồi thử lại nhé — bạn sẽ tiến bộ nhanh thôi.'}
        </p>
        <div className="mx-auto mt-6 h-3 max-w-sm overflow-hidden rounded-full bg-ink-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-android-500 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={restart} className="btn-primary">
            ↺ Làm lại
          </button>
          <Link to="/learn" className="btn-ghost">
            📚 Ôn lại cẩm nang
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-8">
      <header className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-ink-500">
            Câu {index + 1}/{total}
          </span>
          <span className="font-semibold text-android-600">Điểm: {score}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-ink-200">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-300"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="card p-6">
            {relatedSection && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                Quy tắc {q.rule}: {relatedSection.title}
              </p>
            )}
            <h2 className="text-lg font-bold text-ink-900">{q.question}</h2>

            <div className="mt-4 space-y-2">
              {q.options.map((opt) => {
                const isCorrect = opt.id === q.correct
                const isPicked = opt.id === picked
                let cls = 'border-ink-200 bg-white hover:border-brand-400'
                if (picked) {
                  if (isCorrect) cls = 'border-android-400 bg-android-100'
                  else if (isPicked) cls = 'border-red-400 bg-red-100'
                  else cls = 'border-ink-200 bg-white opacity-60'
                }
                return (
                  <button
                    key={opt.id}
                    onClick={() => pick(opt.id)}
                    disabled={!!picked}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${cls}`}
                  >
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ink-100 text-xs font-bold uppercase">
                      {opt.id}
                    </span>
                    <span>{opt.text}</span>
                    {picked && isCorrect && <span className="ml-auto">✅</span>}
                    {picked && isPicked && !isCorrect && <span className="ml-auto">❌</span>}
                  </button>
                )
              })}
            </div>

            {picked && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl border border-brand-300/50 bg-brand-50/60 p-3 text-sm"
              >
                <p className="prose-vi">{q.explanation}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <Link
                    to={`/learn#${relatedSection?.id ?? ''}`}
                    className="text-xs font-semibold text-brand-600 underline"
                  >
                    Ôn lại quy tắc {q.rule} →
                  </Link>
                  <button onClick={next} className="btn-primary">
                    {index + 1 >= total ? 'Xem kết quả' : 'Câu tiếp theo →'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
