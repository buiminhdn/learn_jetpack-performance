import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { DemoFrame } from '../ui/DemoFrame'

const APIS = ['LaunchedEffect', 'DisposableEffect', 'SideEffect', 'produceState', 'rememberCoroutineScope']

interface Scenario {
  id: string
  text: string
  answer: string
  why: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 's1',
    text: 'Tải dữ liệu bằng coroutine khi userId thay đổi.',
    answer: 'LaunchedEffect',
    why: 'Coroutine gắn lifecycle Composition, restart khi key (userId) đổi.',
  },
  {
    id: 's2',
    text: 'Đăng ký network callback và phải gỡ khi rời màn hình.',
    answer: 'DisposableEffect',
    why: 'Cần onDispose { } để unregister listener/tài nguyên.',
  },
  {
    id: 's3',
    text: 'Đồng bộ một giá trị Compose ra object bên ngoài sau mỗi composition thành công.',
    answer: 'SideEffect',
    why: 'SideEffect chạy sau mỗi composition thành công để publish state ra ngoài.',
  },
  {
    id: 's4',
    text: 'Chuyển một nguồn dữ liệu async/callback thành Compose State.',
    answer: 'produceState',
    why: 'produceState bắc cầu callback/async → State<T> dùng được trong UI.',
  },
  {
    id: 's5',
    text: 'Khởi chạy coroutine từ sự kiện onClick của nút.',
    answer: 'rememberCoroutineScope',
    why: 'Cần scope để launch coroutine từ event handler, không phải lúc composition.',
  },
]

export function SideEffectApiDemo() {
  const [current, setCurrent] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const scenario = SCENARIOS[current]
  const correct = picked === scenario.answer

  const shuffledApis = useMemo(() => APIS, [])

  const pick = (api: string) => {
    if (picked) return
    setPicked(api)
    if (api === scenario.answer) setScore((s) => s + 1)
  }

  const next = () => {
    setPicked(null)
    setCurrent((c) => (c + 1) % SCENARIOS.length)
  }

  return (
    <DemoFrame
      title="Chọn đúng Side Effect API"
      description="Đọc tình huống và chọn API phù hợp. Ghép đúng để củng cố bảng tra cứu."
    >
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-ink-500">
          Tình huống {current + 1}/{SCENARIOS.length}
        </span>
        <span className="font-semibold text-android-600">Điểm: {score}</span>
      </div>

      <div className="card-muted mb-4 p-4 text-sm font-medium">{scenario.text}</div>

      <div className="grid gap-2 sm:grid-cols-2">
        {shuffledApis.map((api) => {
          const isAnswer = api === scenario.answer
          const isPicked = api === picked
          let cls = 'border-ink-200 bg-white hover:border-brand-400'
          if (picked) {
            if (isAnswer) cls = 'border-android-400 bg-android-100'
            else if (isPicked) cls = 'border-red-400 bg-red-100'
            else cls = 'border-ink-200 bg-white opacity-50'
          }
          return (
            <button
              key={api}
              onClick={() => pick(api)}
              disabled={!!picked}
              className={`rounded-xl border px-3 py-2.5 text-left font-mono text-sm transition-all ${cls}`}
            >
              {api}
            </button>
          )
        })}
      </div>

      {picked && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 rounded-xl border p-3 text-sm ${
            correct
              ? 'border-android-300 bg-android-50'
              : 'border-amber-300 bg-amber-50'
          }`}
        >
          <p className="font-semibold">
            {correct ? '✅ Chính xác!' : `💡 Đáp án đúng: ${scenario.answer}`}
          </p>
          <p className="mt-1 text-ink-600">{scenario.why}</p>
          <button onClick={next} className="btn-primary mt-3">
            Tình huống tiếp theo →
          </button>
        </motion.div>
      )}
    </DemoFrame>
  )
}
