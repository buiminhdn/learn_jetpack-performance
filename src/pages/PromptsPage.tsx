import { useMemo, useState } from 'react'
import { PROMPTS } from '../data/prompts'
import type { PromptItem } from '../types'

export function PromptsPage() {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const set = new Set<string>()
    PROMPTS.forEach((c) => c.prompts.forEach((p) => p.tags.forEach((t) => set.add(t))))
    return Array.from(set).sort()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PROMPTS.map((cat) => ({
      ...cat,
      prompts: cat.prompts.filter((p) => {
        const matchTag = !activeTag || p.tags.includes(activeTag)
        const haystack = `${p.title} ${p.description} ${p.tags.join(' ')}`.toLowerCase()
        const matchQuery = !q || haystack.includes(q)
        return matchTag && matchQuery
      }),
    })).filter((cat) => cat.prompts.length > 0)
  }, [query, activeTag])

  const copy = async (prompt: PromptItem) => {
    try {
      await navigator.clipboard.writeText(prompt.body)
      setCopiedId(prompt.id)
      window.setTimeout(() => setCopiedId((id) => (id === prompt.id ? null : id)), 1800)
    } catch {
      // Trình duyệt chặn clipboard — bỏ qua trong môi trường không hỗ trợ.
    }
  }

  const total = useMemo(() => PROMPTS.reduce((n, c) => n + c.prompts.length, 0), [])

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-8">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-android-600">
          Nhờ AI review thay bạn
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-ink-900 sm:text-4xl">Thư viện Prompt</h1>
        <p className="mt-2 prose-vi">
          {total} prompt sẵn sàng để dán vào AI (Claude, ChatGPT, Gemini...) kèm code của bạn. Bấm{' '}
          <span className="font-semibold">Sao chép</span>, dán prompt, rồi thay đoạn code cần review.
        </p>
      </header>

      {/* Search + tag filter */}
      <div className="mb-6 space-y-3">
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
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`chip text-xs transition-colors ${
              activeTag === null ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
            }`}
          >
            Tất cả
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag((t) => (t === tag ? null : tag))}
              className={`chip text-xs transition-colors ${
                activeTag === tag ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="rounded-2xl border border-ink-200/70 bg-white/60 px-4 py-10 text-center text-sm text-ink-400">
          Không tìm thấy prompt nào.
        </p>
      )}

      <div className="space-y-8">
        {filtered.map((cat) => (
          <section key={cat.id}>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-ink-800">
              <span>{cat.icon}</span>
              {cat.title}
              <span className="chip bg-ink-100 text-xs font-medium text-ink-500">
                {cat.prompts.length}
              </span>
            </h2>
            <div className="space-y-4">
              {cat.prompts.map((prompt) => (
                <article key={prompt.id} className="card overflow-hidden">
                  <div className="flex items-start justify-between gap-3 border-b border-ink-200/70 bg-ink-50/60 px-4 py-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-ink-800">{prompt.title}</h3>
                      <p className="mt-0.5 text-sm text-ink-500">{prompt.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {prompt.tags.map((tag) => (
                          <span key={tag} className="chip bg-brand-100 text-[11px] text-brand-700">
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
                    {prompt.body}
                  </pre>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
