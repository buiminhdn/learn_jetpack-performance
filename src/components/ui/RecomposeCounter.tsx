import { motion } from 'framer-motion'

interface RecomposeCounterProps {
  count: number
  label?: string
  /** When true (e.g. count went up unnecessarily) renders in a warning tone. */
  warn?: boolean
}

/**
 * A pill that visualises how many times a (simulated) Composable has recomposed.
 * The number "pops" each time it changes, mimicking the Layout Inspector counter.
 */
export function RecomposeCounter({ count, label = 'recompositions', warn }: RecomposeCounterProps) {
  return (
    <span
      className={`chip font-mono ${
        warn
          ? 'bg-red-100 text-red-700'
          : 'bg-brand-100 text-brand-700'
      }`}
    >
      <span aria-hidden>🔄</span>
      <motion.span
        key={count}
        initial={{ scale: 1.6, opacity: 0.4 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        className="tabular-nums font-bold"
      >
        {count}
      </motion.span>
      <span className="opacity-70">{label}</span>
    </span>
  )
}
