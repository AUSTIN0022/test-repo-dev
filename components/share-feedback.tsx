'use client'

import { useState } from 'react'

const options = [
  ['interested', 'Interested'],
  ['maybe', 'Maybe'],
  ['not_for_me', 'Not Interested'],
] as const

export function ShareFeedback({ shareId, propertyId }: { shareId: string; propertyId: string }) {
  const [selected, setSelected] = useState<string>('')
  const [sent, setSent] = useState(false)
  const [saving, setSaving] = useState(false)

  async function choose(response: string) {
    setSelected(response)
    setSent(false)
    setSaving(true)
    try {
      await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareId, propertyId, response }),
      })
      setSent(true)
    } catch {
      // error handling
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border-t border-border pt-5">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Are you interested in this property?
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map(([value, label]) => {
          const active = selected === value
          return (
            <button
              key={value}
              type="button"
              disabled={saving}
              onClick={() => choose(value)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                active
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border bg-background hover:border-primary hover:text-primary'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
      {sent && (
        <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-emerald-500" /> Thanks — your preference has been recorded.
        </p>
      )}
    </div>
  )
}
