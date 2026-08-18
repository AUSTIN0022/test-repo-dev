'use client'

import { useEffect, useState } from 'react'
import { Building2, Check, Mail, Phone, ShieldCheck, User, X } from 'lucide-react'

export type BrokerProfile = {
  id: string
  fullName: string
  agencyName: string
  email: string
  phone: string
  bio: string
  licenseNumber: string
  avatarUrl?: string | null
  logoUrl?: string | null
}

export function BrokerProfileModal({
  isOpen,
  onClose,
  onUpdated,
}: {
  isOpen: boolean
  onClose: () => void
  onUpdated: (profile: BrokerProfile) => void
}) {
  const [form, setForm] = useState<BrokerProfile>({
    id: '',
    fullName: '',
    agencyName: '',
    email: '',
    phone: '',
    bio: '',
    licenseNumber: '',
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      fetch('/api/broker')
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setForm(data)
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [isOpen])

  const update = (key: keyof BrokerProfile, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/broker', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update profile')
      onUpdated(data)
      setMessage('Broker profile updated successfully!')
      setTimeout(() => {
        onClose()
      }, 1200)
    } catch (err: any) {
      setMessage(err.message || 'Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 size={20} />
            </span>
            <div>
              <h2 className="font-serif text-2xl font-semibold">Broker & Agency Profile</h2>
              <p className="text-xs text-muted-foreground">This info appears on your public shared collections.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading broker profile…</div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Agent / Broker Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                  <input
                    required
                    value={form.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Real Estate Agency / Company</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                  <input
                    required
                    value={form.agencyName}
                    onChange={(e) => update('agencyName', e.target.value)}
                    placeholder="Haven Real Estate Group"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="alex@havenrealestate.com"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">License Number</label>
                <div className="relative">
                  <ShieldCheck size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                  <input
                    value={form.licenseNumber}
                    onChange={(e) => update('licenseNumber', e.target.value)}
                    placeholder="RE-987654321"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Agent Bio / Statement</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => update('bio', e.target.value)}
                  placeholder="Premier real estate advisor specializing in luxury modern properties..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            {message && (
              <div className={`rounded-xl px-4 py-2.5 text-xs font-medium ${message.includes('Error') ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                {message}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-border bg-background py-3 text-sm font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {saving ? 'Saving…' : <><Check size={16} /> Save Profile</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
