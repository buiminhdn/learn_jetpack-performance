import { Description, Field, Label, Switch } from '@headlessui/react'

interface ToggleProps {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  description?: string
}

/**
 * Accessible labelled switch built on Headless UI.
 * The whole label area toggles the switch — no nested-button-in-label bug.
 */
export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <Field className="flex items-center justify-between gap-4 rounded-xl border border-ink-200/70 bg-white px-4 py-3 transition-colors hover:border-brand-300">
      <span className="min-w-0">
        <Label className="block cursor-pointer text-sm font-semibold text-ink-800">
          {label}
        </Label>
        {description && (
          <Description className="mt-0.5 block text-xs text-ink-500">
            {description}
          </Description>
        )}
      </span>
      <Switch
        checked={checked}
        onChange={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 ${
          checked ? 'bg-android-500' : 'bg-ink-300'
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </Switch>
    </Field>
  )
}
