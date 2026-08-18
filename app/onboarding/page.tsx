'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Building2, Check, Globe, MapPin, Sparkles, User, UserCheck } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [role, setRole] = useState<'broker' | 'company' | 'agent'>('broker')
  const [form, setForm] = useState({
    city: 'Austin',
    state: 'TX',
    country: 'United States',
    licenseNumber: 'RE-987654321',
  })
  const [loading, setLoading] = useState(false)

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  async function handleFinish() {
    setLoading(true)
    try {
      await fetch('/api/broker', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: form.city,
          state: form.state,
          country: form.country,
          licenseNumber: form.licenseNumber,
        }),
      })
      router.push('/')
    } catch {
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <div className="w-full max-w-lg space-y-6 rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-serif font-bold text-base">
              H
            </span>
            <span className="font-serif text-xl font-semibold">Haven Setup</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span className={`size-2.5 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <span className={`size-2.5 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <span className={`size-2.5 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
            <span>Step {step} of 3</span>
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h1 className="font-serif text-3xl font-semibold">Tell us about your business</h1>
              <p className="mt-1 text-xs text-muted-foreground">How will you be using Haven to manage property inventory?</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'broker', title: 'Independent Broker', desc: 'I manage my own residential or commercial property inventory.' },
                { id: 'company', title: 'Real Estate Agency / Company', desc: 'A multi-agent team sharing a central inventory pool.' },
                { id: 'agent', title: 'Real Estate Agent', desc: 'Individual agent working under a brokerage.' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRole(opt.id as any)}
                  className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                    role === opt.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${role === opt.id ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                    {role === opt.id && <Check size={12} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{opt.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Location & License Details */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h1 className="font-serif text-3xl font-semibold">Location & License</h1>
              <p className="mt-1 text-xs text-muted-foreground">Add location defaults for your property inventory.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary City</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                  <input
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    placeholder="Austin"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">State / Region</label>
                  <input
                    value={form.state}
                    onChange={(e) => update('state', e.target.value)}
                    placeholder="TX"
                    className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Country</label>
                  <input
                    value={form.country}
                    onChange={(e) => update('country', e.target.value)}
                    placeholder="United States"
                    className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Broker License Number</label>
                <input
                  value={form.licenseNumber}
                  onChange={(e) => update('licenseNumber', e.target.value)}
                  placeholder="RE-987654321"
                  className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full rounded-xl border border-border py-3 text-sm font-semibold hover:bg-muted"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Add First Property or Skip */}
        {step === 3 && (
          <div className="space-y-5 text-center animate-in fade-in py-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <Sparkles size={32} />
            </div>

            <div>
              <h1 className="font-serif text-3xl font-semibold">Your workspace is ready!</h1>
              <p className="mt-2 text-xs text-muted-foreground max-w-sm mx-auto">
                You can add your first property listing right now or jump straight to your inventory dashboard.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <button
                type="button"
                disabled={loading}
                onClick={handleFinish}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Enter Inventory Hub Workspace <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
