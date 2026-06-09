import { useState } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import kotlin from 'react-syntax-highlighter/dist/esm/languages/prism/kotlin'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Register only the languages we use to keep the bundle small.
SyntaxHighlighter.registerLanguage('kotlin', kotlin)

interface CodeBlockProps {
  code: string
  language?: string
  /** Optional label shown in the header (e.g. file name). */
  title?: string
  /** Visual tone: neutral, bad (đỏ), good (xanh). */
  tone?: 'neutral' | 'bad' | 'good'
}

const toneStyles: Record<NonNullable<CodeBlockProps['tone']>, string> = {
  neutral: 'border-ink-200/70',
  bad: 'border-red-300/70',
  good: 'border-android-300/70',
}

const toneHeader: Record<NonNullable<CodeBlockProps['tone']>, string> = {
  neutral: 'bg-ink-100/70 text-ink-600',
  bad: 'bg-red-50 text-red-700',
  good: 'bg-android-50 text-android-700',
}

export function CodeBlock({ code, language = 'kotlin', title, tone = 'neutral' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={`overflow-hidden rounded-xl border ${toneStyles[tone]}`}>
      <div className={`flex items-center justify-between px-3 py-1.5 text-xs font-medium ${toneHeader[tone]}`}>
        <span className="flex items-center gap-2 font-mono">
          {tone === 'bad' && <span aria-hidden>❌</span>}
          {tone === 'good' && <span aria-hidden>✅</span>}
          {title ?? language}
        </span>
        <button
          onClick={handleCopy}
          className="rounded-md px-2 py-0.5 transition-colors hover:bg-black/10"
          aria-label="Copy code"
        >
          {copied ? 'Đã chép ✓' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          margin: 0,
          padding: '16px',
          fontSize: '13px',
          background: 'transparent',
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        }}
        codeTagProps={{ style: { fontFamily: '"JetBrains Mono", ui-monospace, monospace' } }}
        wrapLongLines
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  )
}
