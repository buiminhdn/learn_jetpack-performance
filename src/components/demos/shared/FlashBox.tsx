import { useEffect, useRef, useState, type ReactNode } from 'react'

interface FlashBoxProps {
  /** When this value changes, the box flashes to signal a "recomposition". */
  signature: unknown
  /** 'bad' = red flash (unwanted recomposition), 'ok' = green flash (intended). */
  tone?: 'bad' | 'ok'
  className?: string
  children: ReactNode
  /** Optional callback fired on each flash (e.g. to bump a counter). */
  onFlash?: () => void
}

/**
 * Visualises recomposition: every time `signature` changes, the wrapper briefly
 * flashes — mimicking the highlight Layout Inspector shows on recomposed nodes.
 */
export function FlashBox({ signature, tone = 'bad', className = '', children, onFlash }: FlashBoxProps) {
  const [flashKey, setFlashKey] = useState(0)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setFlashKey((k) => k + 1)
    onFlash?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])

  return (
    <div
      key={flashKey}
      className={`${flashKey > 0 ? (tone === 'ok' ? 'recompose-flash-ok' : 'recompose-flash') : ''} rounded-xl ${className}`}
    >
      {children}
    </div>
  )
}
