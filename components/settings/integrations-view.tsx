'use client'

import React, { useState, useEffect } from 'react'
import {
  Sliders,
  Key,
  ShieldCheck,
  RefreshCw,
  Clock,
} from 'lucide-react'

export default function IntegrationsView() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<any>({
    twilioSid: '',
    twilioToken: '',
    twilioPhone: '+14155238886',
    whatsappNumber: '+14155238886',
    resendApiKey: '',
    openaiApiKey: '',
    assignmentMode: 'round_robin',
    maxCallDurationSeconds: 120,
    dryRunCall: true,
    dryRunMessage: true,
    dryRunEmail: true,
  })

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.success && data.settings) {
        setSettings(data.settings)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (data.success) {
        alert('✅ Integration Settings & Dry-Run Mode updated successfully!')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-zinc-900" />
        Loading Settings & Integrations...
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 animate-in fade-in duration-200">
      <div>
        <h2 className="text-base font-black text-zinc-950 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-zinc-900" /> Settings & Integrations
        </h2>
        <p className="text-xs text-zinc-500">Configure Twilio Voice, WhatsApp, Call Time Limits & Dry-Run Mode.</p>
      </div>

      {/* Dry-Run Safeguard Banner */}
      <div className="bg-white border border-zinc-200 p-4 rounded-2xl shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-zinc-900" />
          <h3 className="text-sm font-bold text-zinc-950">Dry-Run Mode & Call Duration Safeguard</h3>
        </div>
        <p className="text-xs text-zinc-600 leading-relaxed font-medium">
          Dry-Run Mode is <strong className="text-zinc-950">ENABLED</strong> by default. In Dry-Run mode, call bridges, WhatsApp messages, and emails are simulated in software so 0 Twilio credits/minutes are consumed.
        </p>
      </div>

      {/* 1. Dry-Run Toggles Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-zinc-950 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-zinc-900" /> Simulated / Dry-Run Toggles
        </h3>

        <div className="space-y-2.5 text-xs">
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 cursor-pointer">
            <div>
              <span className="font-bold text-zinc-900 block">Dry-Run Call Bridge</span>
              <span className="text-[10px] text-zinc-500">Simulate Twilio Voice agent-to-lead calls without placing live phone calls.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.dryRunCall}
              onChange={(e) => setSettings({ ...settings, dryRunCall: e.target.checked })}
              className="w-4 h-4 rounded text-zinc-900 bg-white border-zinc-300 focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 cursor-pointer">
            <div>
              <span className="font-bold text-zinc-900 block">Dry-Run WhatsApp / SMS</span>
              <span className="text-[10px] text-zinc-500">Simulate 1-click WhatsApp follow-ups in lead timeline.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.dryRunMessage}
              onChange={(e) => setSettings({ ...settings, dryRunMessage: e.target.checked })}
              className="w-4 h-4 rounded text-zinc-900 bg-white border-zinc-300 focus:ring-0"
            />
          </label>
        </div>
      </div>

      {/* 2. Twilio Call Duration Limit Setting */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-zinc-950 flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-900" /> Max Call Duration Limit (Seconds)
        </h3>
        <p className="text-xs text-zinc-500 font-medium">
          Enforces maximum call duration limit (<code className="text-zinc-950 font-bold">timeLimit</code>) per bridge call to protect your Twilio free trial balance (e.g. 120s = 2 mins).
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-zinc-600 font-medium block mb-1">Max Duration (Seconds)</label>
            <input
              type="number"
              value={settings.maxCallDurationSeconds}
              onChange={(e) => setSettings({ ...settings, maxCallDurationSeconds: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="text-zinc-600 font-medium block mb-1">Lead Assignment Mode</label>
            <select
              value={settings.assignmentMode}
              onChange={(e) => setSettings({ ...settings, assignmentMode: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
            >
              <option value="round_robin">Round Robin (Sequential)</option>
              <option value="least_busy">Least Busy Agent</option>
              <option value="manual">Manual Assignment</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. API Credentials */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-zinc-950 flex items-center gap-2">
          <Key className="w-4 h-4 text-zinc-900" /> API Keys & Credentials
        </h3>

        <div className="space-y-2 text-xs">
          <div>
            <label className="text-zinc-600 font-medium block mb-1">Twilio Account SID</label>
            <input
              type="text"
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={settings.twilioSid || ''}
              onChange={(e) => setSettings({ ...settings, twilioSid: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="text-zinc-600 font-medium block mb-1">Twilio Auth Token</label>
            <input
              type="password"
              placeholder="••••••••••••••••••••••••••••••••"
              value={settings.twilioToken || ''}
              onChange={(e) => setSettings({ ...settings, twilioToken: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-zinc-600 font-medium block mb-1">Twilio Voice Number</label>
              <input
                type="text"
                placeholder="+14155238886"
                value={settings.twilioPhone || ''}
                onChange={(e) => setSettings({ ...settings, twilioPhone: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="text-zinc-600 font-medium block mb-1">WhatsApp Number</label>
              <input
                type="text"
                placeholder="+14155238886"
                value={settings.whatsappNumber || ''}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-600 font-medium block mb-1">OpenAI API Key (Optional AI Captions)</label>
            <input
              type="password"
              placeholder="sk-proj-••••••••••••••••••••••••"
              value={settings.openaiApiKey || ''}
              onChange={(e) => setSettings({ ...settings, openaiApiKey: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition active:scale-95"
        >
          {saving ? 'Saving Settings...' : 'Save All Settings'}
        </button>
      </div>
    </form>
  )
}
