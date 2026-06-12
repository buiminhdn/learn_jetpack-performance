import { useMemo, useState } from 'react'
import { PROMPTS } from '../data/prompts'
import type { PromptItem, PromptScope } from '../types'

const FEATURE_TOKEN = '{{FEATURE}}'

const SCOPES: {
  id: PromptScope
  title: string
  icon: string
  desc: string
}[] = [
  {
    id: 'project',
    title: 'Toàn dự án',
    icon: '🏗️',
    desc: 'Quét cả codebase và xuất báo cáo .md. Dán vào AI agent (Claude Code, Cursor...).',
  },
  {
    id: 'feature',
    title: 'Theo Feature',
    icon: '🎯',
    desc: 'Điền tên feature vào ô bên dưới, prompt sẽ tự hoàn chỉnh trước khi sao chép.',
  },
]

export function PromptsPage() {
  const [query, setQuery] = useState('')
  const [activeScope, setActiveScope] = useState<PromptScope | 'all'>('all')
  const [featureName, setFeatureName] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Thứ tự chủ đề khi nhóm trong mỗi section, theo lần xuất hiện đầu tiên.
  const categoryOrder = useMemo(() => {
    const seen: string[] = []
    PROMPTS.forEach((p) => {
      if (!seen.includes(p.category)) seen.push(p.category)
    })
    return seen
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PROMPTS.filter((p) => {
      const matchScope = activeScope === 'all' || p.scope === activeScope
      const haystack = `${p.title} ${p.description} ${p.category} ${p.tags.join(' ')}`.toLowerCase()
      const matchQuery = !q || haystack.includes(q)
      return matchScope && matchQuery
    })
  }, [query, activeScope])

  const applyFeature = (text: string) => {
    const name = featureName.trim()
    return name ? text.split(FEATURE_TOKEN).join(name) : text
  }

  const copy = async (prompt: PromptItem) => {
    try {
      await navigator.clipboard.writeText(applyFeature(prompt.body))
      setCopiedId(prompt.id)
      window.setTimeout(() => setCopiedId((id) => (id === prompt.id ? null : id)), 1800)
    } catch {
      // Trình duyệt chặn clipboard — bỏ qua trong môi trường không hỗ trợ.
    }
  }

  const total = PROMPTS.length

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-8">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-android-600">
          Nhờ AI review thay bạn
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-ink-900 sm:text-4xl">Thư viện Prompt</h1>
        <p className="mt-2 prose-vi">
          {total} prompt review code Jetpack Compose, chia theo phạm vi:{' '}
          <span className="font-semibold">Toàn dự án</span> (xuất báo cáo{' '}
          <span className="font-mono text-ink-700">.md</span>) và{' '}
          <span className="font-semibold">Theo Feature</span> (chỉ cần điền tên feature). Bấm{' '}
          <span className="font-semibold">Sao chép</span> rồi dán vào AI agent.
        </p>
      </header>

      {/* Controls */}
      <div className="mb-8 space-y-3">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm prompt..."
            className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-brand-400"
          />
        </div>

        {/* Scope segmented control */}
        <div className="inline-flex rounded-xl border border-ink-200 bg-ink-50 p-1">
          {([
            { id: 'all' as const, label: 'Tất cả' },
            { id: 'project' as const, label: '🏗️ Toàn dự án' },
            { id: 'feature' as const, label: '🎯 Feature' },
          ]).map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveScope(opt.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeScope === opt.id
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {SCOPES.filter((s) => activeScope === 'all' || activeScope === s.id).map((scope) => {
        const scopePrompts = filtered.filter((p) => p.scope === scope.id)
        if (scopePrompts.length === 0) return null
        const cats = categoryOrder.filter((c) => scopePrompts.some((p) => p.category === c))

        return (
          <section key={scope.id} className="mb-12">
            <div className="mb-4 rounded-2xl border border-ink-200/70 bg-gradient-to-r from-brand-50 to-android-50/60 px-5 py-4">
              <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink-900">
                <span>{scope.icon}</span>
                {scope.title}
                <span className="chip bg-white text-xs font-medium text-ink-500">
                  {scopePrompts.length}
                </span>
              </h2>
              <p className="mt-1 text-sm text-ink-500">{scope.desc}</p>

              {scope.id === 'feature' && (
                <div className="mt-3">
                  <label className="mb-1 block text-xs font-semibold text-ink-600">
                    Tên feature
                  </label>
                  <input
                    type="text"
                    value={featureName}
                    onChange={(e) => setFeatureName(e.target.value)}
                    placeholder="VD: Đăng nhập, Giỏ hàng, Chi tiết sản phẩm..."
                    className="w-full rounded-xl border border-ink-300 bg-white py-2 px-3 text-sm outline-none transition-colors focus:border-brand-400 sm:max-w-sm"
                  />
                  <p className="mt-1 text-[11px] text-ink-400">
                    Token{' '}
                    <code className="rounded bg-ink-100 px-1 font-mono text-ink-600">
                      {FEATURE_TOKEN}
                    </code>{' '}
                    trong prompt sẽ được thay bằng tên này khi sao chép.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-8">
              {cats.map((cat) => {
                const items = scopePrompts.filter((p) => p.category === cat)
                return (
                  <div key={cat}>
                    <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-ink-700">
                      <span>{items[0].icon}</span>
                      {cat}
                    </h3>
                    <div className="space-y-4">
                      {items.map((prompt) => (
                        <article key={prompt.id} className="card overflow-hidden">
                          <div className="flex items-start justify-between gap-3 border-b border-ink-200/70 bg-ink-50/60 px-4 py-3">
                            <div className="min-w-0">
                              <h4 className="font-bold text-ink-800">{prompt.title}</h4>
                              <p className="mt-0.5 text-sm text-ink-500">{prompt.description}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                {prompt.output && (
                                  <span className="chip bg-ink-900 font-mono text-[11px] text-white">
                                    → {applyFeature(prompt.output)}
                                  </span>
                                )}
                                {prompt.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="chip bg-brand-100 text-[11px] text-brand-700"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => copy(prompt)}
                              className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                                copiedId === prompt.id
                                  ? 'bg-android-500 text-ink-950'
                                  : 'bg-ink-900 text-white hover:bg-ink-700'
                              }`}
                            >
                              {copiedId === prompt.id ? '✓ Đã chép' : '📋 Sao chép'}
                            </button>
                          </div>
                          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words px-4 py-3 text-[13px] leading-relaxed text-ink-700">
                            {applyFeature(prompt.body)}
                          </pre>
                        </article>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}

      {filtered.length === 0 && (
        <p className="rounded-2xl border border-ink-200/70 bg-white/60 px-4 py-10 text-center text-sm text-ink-400">
          Không tìm thấy prompt nào.
        </p>
      )}
    </div>
  )
}
