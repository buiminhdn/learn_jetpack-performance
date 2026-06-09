import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Toggle } from '../components/ui/Toggle'
import { RecomposeCounter } from '../components/ui/RecomposeCounter'
import { CodeBlock } from '../components/ui/CodeBlock'

interface TechniqueState {
  remember: boolean
  key: boolean
  contentType: boolean
  minimalParams: boolean
  derived: boolean
  layoutRead: boolean
  lifecycle: boolean
  immutable: boolean
}

const DEFAULTS: TechniqueState = {
  remember: false,
  key: false,
  contentType: false,
  minimalParams: false,
  derived: false,
  layoutRead: false,
  lifecycle: false,
  immutable: false,
}

const TECHNIQUES: { key: keyof TechniqueState; label: string; rule: number; desc: string }[] = [
  { key: 'remember', label: 'remember cho tính toán nặng', rule: 2, desc: 'Sort/filter không chạy lại mỗi recomposition.' },
  { key: 'key', label: 'key ổn định trong list', rule: 5, desc: 'Cập nhật 1 item chỉ recompose item đó.' },
  { key: 'contentType', label: 'contentType cho item', rule: 6, desc: 'Tái sử dụng composition khi cuộn.' },
  { key: 'minimalParams', label: 'Truyền dữ liệu tối thiểu', rule: 11, desc: 'Field không liên quan đổi → row được skip.' },
  { key: 'derived', label: 'derivedStateOf cho scroll', rule: 4, desc: 'Nút “lên đầu” chỉ recompose khi đổi trạng thái.' },
  { key: 'layoutRead', label: 'Đọc scroll ở layout phase', rule: 9, desc: 'Header không recompose khi cuộn.' },
  { key: 'lifecycle', label: 'collectAsStateWithLifecycle', rule: 24, desc: 'Không xử lý khi màn hình ở background.' },
  { key: 'immutable', label: 'Immutable & stable state', rule: 13, desc: 'Compose skip được khi input không đổi.' },
]

const ROWS = 6

export function PlaygroundPage() {
  const [t, setT] = useState<TechniqueState>(DEFAULTS)
  const [recompose, setRecompose] = useState(0)
  const [flashed, setFlashed] = useState<Set<number>>(new Set())
  const [flashHeader, setFlashHeader] = useState(0)
  const [log, setLog] = useState<string[]>([])

  const set = (k: keyof TechniqueState, v: boolean) => setT((prev) => ({ ...prev, [k]: v }))

  const score = useMemo(() => {
    const on = Object.values(t).filter(Boolean).length
    return Math.round((on / Object.keys(t).length) * 100)
  }, [t])

  const flashRows = (rows: number[]) => {
    setFlashed(new Set(rows))
    window.setTimeout(() => setFlashed(new Set()), 600)
  }

  const addLog = (msg: string) => setLog((prev) => [msg, ...prev].slice(0, 5))

  // Scrolling the list.
  const onScroll = () => {
    let n = 0
    if (!t.derived) n += 1
    if (!t.layoutRead) {
      n += 1
      setFlashHeader((c) => c + 1)
    }
    if (!t.contentType) n += 2 // extra compositions recreated
    setRecompose((c) => c + n)
    addLog(`Cuộn danh sách → +${n} recomposition`)
  }

  // Updating a single item's data.
  const onUpdateItem = () => {
    const target = 2
    const rows = t.key ? [target] : Array.from({ length: ROWS }, (_, i) => i)
    flashRows(rows)
    setRecompose((c) => c + rows.length)
    addLog(`Cập nhật item #${target} → +${rows.length} recomposition`)
  }

  // Changing an unrelated field on the screen state.
  const onUnrelated = () => {
    const canSkip = t.minimalParams && t.immutable
    const rows = canSkip ? [] : Array.from({ length: ROWS }, (_, i) => i)
    flashRows(rows)
    setRecompose((c) => c + rows.length)
    addLog(`Đổi field không liên quan → +${rows.length} recomposition`)
  }

  const reset = () => {
    setRecompose(0)
    setLog([])
    setFlashed(new Set())
  }

  const generatedCode = useMemo(() => buildCode(t), [t])

  const health =
    score >= 80 ? { label: 'Mượt mà', color: 'text-android-500', icon: '🟢' }
      : score >= 40 ? { label: 'Tạm ổn', color: 'text-amber-500', icon: '🟡' }
        : { label: 'Dễ jank', color: 'text-red-500', icon: '🔴' }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-8">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-android-600">
          Thử nghiệm trực tiếp
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-ink-900 sm:text-4xl">
          Playground tối ưu
        </h1>
        <p className="mt-2 prose-vi">
          Bật/tắt từng kỹ thuật, thực hiện hành động (cuộn, cập nhật, đổi field) và quan sát số
          recomposition cùng đoạn code thay đổi theo lựa chọn của bạn.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: toggles + actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            {TECHNIQUES.map((tech) => (
              <Toggle
                key={tech.key}
                checked={t[tech.key]}
                onChange={(v) => set(tech.key, v)}
                label={tech.label}
                description={tech.desc}
              />
            ))}
          </div>

          <div className="card p-4">
            <p className="mb-3 text-sm font-bold text-ink-700">Hành động</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={onScroll} className="btn-primary">⬇️ Cuộn danh sách</button>
              <button onClick={onUpdateItem} className="btn-ghost">✏️ Cập nhật 1 item</button>
              <button onClick={onUnrelated} className="btn-ghost">🔔 Đổi field không liên quan</button>
              <button onClick={reset} className="btn-ghost">↺ Reset</button>
            </div>
            {log.length > 0 && (
              <ul className="mt-3 space-y-1 text-xs text-ink-500">
                {log.map((l, i) => (
                  <li key={i} className={i === 0 ? 'font-semibold text-ink-700' : ''}>
                    • {l}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <CodeBlock title="ProductScreen.kt (sinh theo lựa chọn)" code={generatedCode} tone={score >= 80 ? 'good' : score < 40 ? 'bad' : 'neutral'} />
        </div>

        {/* Right: phone mockup + metrics */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {/* Metrics */}
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-ink-500">Sức khỏe khung hình</p>
                <p className={`text-lg font-extrabold ${health.color}`}>
                  {health.icon} {health.label}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink-500">Điểm tối ưu</p>
                <p className="text-2xl font-extrabold text-brand-500">{score}%</p>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-android-500 transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="mt-3">
              <RecomposeCounter count={recompose} warn={score < 40} label="tổng recomposition" />
            </div>
          </div>

          {/* Phone */}
          <div className="mx-auto w-full max-w-[300px] rounded-[2rem] border-4 border-ink-800 bg-ink-900 p-2 shadow-2xl">
            <div className="overflow-hidden rounded-[1.5rem] bg-white">
              {/* Header */}
              <motion.div
                key={flashHeader}
                animate={flashHeader ? { backgroundColor: ['rgba(239,68,68,0.5)', 'rgba(0,0,0,0)'] } : {}}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-between bg-gradient-to-r from-brand-500 to-android-500 px-4 py-3 text-white"
              >
                <span className="font-bold">Sản phẩm</span>
                <span className="text-xs opacity-80">{t.layoutRead ? 'header ổn định' : 'header recompose'}</span>
              </motion.div>
              {/* List */}
              <div className="max-h-[320px] space-y-2 overflow-y-auto p-3" onScroll={onScroll}>
                {Array.from({ length: ROWS }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={flashed.has(i) ? { backgroundColor: ['rgba(239,68,68,0.45)', 'rgba(0,0,0,0)'] } : {}}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-3 rounded-xl border border-ink-200 p-2.5"
                  >
                    <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-brand-400 to-android-400" />
                    <div className="min-w-0 flex-1">
                      <div className="h-2.5 w-2/3 rounded bg-ink-200" />
                      <div className="mt-1.5 h-2 w-1/3 rounded bg-ink-100" />
                    </div>
                  </motion.div>
                ))}
                <div className="py-6 text-center text-[10px] text-ink-400">cuộn để mô phỏng</div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-ink-400">
            Hộp đỏ nhấp nháy = component bị recomposition.{' '}
            <Link to="/learn" className="text-brand-500 underline">
              Xem chi tiết →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function buildCode(t: TechniqueState): string {
  const collect = t.lifecycle
    ? 'val uiState by viewModel.uiState.collectAsStateWithLifecycle()'
    : 'val uiState by viewModel.uiState.collectAsState() // không theo lifecycle'

  const param = t.minimalParams
    ? 'products: List<ProductUiModel>,'
    : 'uiState: ProductUiState, // truyền cả object'

  const stateType = t.immutable
    ? 'data class ProductUiState(val products: List<ProductUiModel> = emptyList())'
    : 'data class ProductUiState(val products: MutableList<ProductUiModel>) // unstable'

  const sortLine = t.remember
    ? 'val sorted = remember(products) { products.sortedBy(ProductUiModel::name) }'
    : 'val sorted = products.sortedBy(ProductUiModel::name) // chạy lại mỗi recomposition'

  const derived = t.derived
    ? 'val showTop by remember { derivedStateOf { state.firstVisibleItemIndex > 0 } }'
    : 'val showTop = state.firstVisibleItemIndex > 0 // recompose mỗi bước cuộn'

  const offset = t.layoutRead
    ? 'Header(Modifier.offset { IntOffset(0, state.firstVisibleItemOffset) })'
    : 'Header(offset = state.firstVisibleItemOffset.dp) // đọc ở Composition'

  const itemsBlock = t.key
    ? `items(\n        items = sorted,\n        key = ProductUiModel::id${t.contentType ? ',\n        contentType = { "product" }' : ''}\n    ) { product -> ProductRow(product) }`
    : `items(sorted) { product -> ProductRow(product) }${t.key ? '' : ' // thiếu key'}`

  return `${stateType}

@Composable
fun ProductScreen(${param}) {
    ${collect}
    val state = rememberLazyListState()
    ${sortLine}
    ${derived}

    Column {
        ${offset}
        LazyColumn(state = state) {
            ${itemsBlock}
        }
    }
}`
}
