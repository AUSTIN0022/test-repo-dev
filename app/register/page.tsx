'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Building2, Lock, Mail, Phone, User } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    agencyName: '',
    email: '',
    phone: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')

      router.push('/onboarding')
    } catch (err: any) {
      setError(err.message || 'Unable to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-border bg-card p-8 shadow-xl">
        <div className="text-center space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-serif font-bold text-2xl">
            H
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Create your account</h1>
          <p className="text-xs text-muted-foreground">Start centralizing and sharing your property inventory.</p>
        </div>

        {error && (
          <div className="rounded-xl bg-destructive/10 p-3 text-xs font-semibold text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Full Name *
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
              <input
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Alex Morgan"
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Agency / Business Name *
            </label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
              <input
                required
                value={form.agencyName}
                onChange={(e) => update('agencyName', e.target.value)}
                placeholder="Haven Real Estate Group"
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Email Address *
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="alex@havenrealestate.com"
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
              <input
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Password *
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Creating Account…' : <><ArrowRight size={16} /> Continue to Onboarding</>}
          </button>
        </form>

        <div className="border-t border-border pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-foreground underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
