import { CodeBlock } from './CodeBlock'

interface BadGoodCompareProps {
  badCode: string
  goodCode: string
  badTitle?: string
  goodTitle?: string
  badNote?: string
  goodNote?: string
  language?: string
}

/** Side-by-side (stacked on mobile) Bad vs Good code comparison. */
export function BadGoodCompare({
  badCode,
  goodCode,
  badTitle = 'Chưa tối ưu',
  goodTitle = 'Tốt hơn',
  badNote,
  goodNote,
  language = 'kotlin',
}: BadGoodCompareProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-2">
        <CodeBlock code={badCode} tone="bad" title={badTitle} language={language} />
        {badNote && <p className="px-1 text-xs text-red-600">{badNote}</p>}
      </div>
      <div className="space-y-2">
        <CodeBlock code={goodCode} tone="good" title={goodTitle} language={language} />
        {goodNote && <p className="px-1 text-xs text-android-700">{goodNote}</p>}
      </div>
    </div>
  )
}
