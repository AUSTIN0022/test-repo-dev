'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Building2, Lock, Mail, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')

      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Unable to log in')
    } finally {
      setLoading(false)
    }
  }

  function handleDemoLogin() {
    setEmail('austin@gmail.com')
    setPassword('austin2026')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-border bg-card p-8 shadow-xl">
        <div className="text-center space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-serif font-bold text-2xl">
            H
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Welcome back to haven</h1>
          <p className="text-xs text-muted-foreground">Sign in to manage your property inventory and shared links.</p>
        </div>

        {error && (
          <div className="rounded-xl bg-destructive/10 p-3 text-xs font-semibold text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@havenrealestate.com"
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Signing in…' : <><ArrowRight size={16} /> Sign In</>}
          </button>
        </form>

        <div className="border-t border-border pt-4 text-center space-y-3">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="flex items-center justify-center gap-2 text-xs font-semibold text-primary hover:underline mx-auto"
          >
            <Sparkles size={14} /> Fill Demo Broker Credentials
          </button>

          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account?{' '}
            <a href="/register" className="font-semibold text-foreground underline">
              Create account
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
