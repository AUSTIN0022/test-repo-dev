'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  PhoneCall,
  CalendarCheck,
  Flame,
  Building2,
  UserCheck,
  TrendingUp,
  Plus,
  Share2,
  Sparkles,
  ChevronRight,
} from 'lucide-react'

interface DashboardViewProps {
  onOpenNewLeadModal: () => void
  onTriggerWebhookTest: () => void
}

export default function DashboardView({
  onOpenNewLeadModal,
  onTriggerWebhookTest,
}: DashboardViewProps) {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchReports = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/reports')
      const data = await res.json()
      if (data.success) {
        setStats(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const summary = stats?.summary || {
    totalLeads: 20,
    wonLeads: 2,
    hotLeads: 6,
    callsToday: 5,
    followupsDueToday: 4,
    availableInventory: 10,
    checkedInToday: 4,
  }

  const leadsBySource = stats?.leadsBySource || [
    { source: '36 Acre', count: 6 },
    { source: 'MagicBricks', count: 5 },
    { source: 'Housing', count: 4 },
    { source: 'Facebook', count: 3 },
    { source: 'Instagram', count: 2 },
  ]

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="antigravity-card p-5 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                LIVE CRM DASHBOARD
              </span>
              <span className="text-xs text-zinc-500 font-medium">Gurgaon Sales Hub</span>
            </div>
            <h2 className="text-xl font-black text-zinc-950 tracking-tight">
              Apex Horizon Realty CRM
            </h2>
            <p className="text-xs text-zinc-600 mt-1">
              Automated Agent-to-Lead Call Bridge & 1-Click Follow-ups active.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto mt-2 sm:mt-0">
            <button
              onClick={onOpenNewLeadModal}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
            >
              <Plus className="w-4 h-4" /> Add Prospect
            </button>
            <button
              onClick={onTriggerWebhookTest}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300/80 active:scale-95 transition-all duration-200"
              title="Test Incoming Webhook Intake (36 Acre)"
            >
              <Sparkles className="w-4 h-4 text-amber-600" /> Test Webhook
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Total Leads */}
        <div
          onClick={() => router.push('/leads')}
          className="antigravity-card p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Total Leads</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-950 mt-3 tracking-tight">
            {summary.totalLeads}
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-[11px] text-emerald-700 font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> +4 new today
          </div>
        </div>

        {/* 2. Calls Made Today */}
        <div
          onClick={() => router.push('/leads')}
          className="antigravity-card p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Calls Today</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-950 mt-3 tracking-tight">
            {summary.callsToday}
          </div>
          <div className="text-[11px] text-zinc-500 font-medium mt-1.5">
            Avg bridge: 1m 45s
          </div>
        </div>

        {/* 3. Follow-ups Due Today */}
        <div
          onClick={() => router.push('/followups')}
          className="antigravity-card p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Follow-ups</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-900 mt-3 tracking-tight">
            {summary.followupsDueToday}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 1-Click WhatsApp
          </div>
        </div>

        {/* 4. Hot Prospects */}
        <div
          onClick={() => router.push('/leads?temperature=hot')}
          className="antigravity-card p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Hot Prospects</span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-900 mt-3 tracking-tight">
            {summary.hotLeads}
          </div>
          <div className="text-[11px] text-rose-700 font-medium mt-1.5">
            High purchase intent
          </div>
        </div>
      </div>

      {/* Secondary Quick Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div
          onClick={() => router.push('/properties')}
          className="antigravity-card p-3.5 cursor-pointer flex items-center justify-between group"
        >
          <div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Inventory</div>
            <div className="text-base font-black text-zinc-950 mt-0.5">10 Properties</div>
          </div>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
            <Building2 className="w-4 h-4" />
          </div>
        </div>

        <div
          onClick={() => router.push('/attendance')}
          className="antigravity-card p-3.5 cursor-pointer flex items-center justify-between group"
        >
          <div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Attendance</div>
            <div className="text-base font-black text-emerald-800 mt-0.5">4 Checked In</div>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>

        <div
          onClick={() => router.push('/reports')}
          className="antigravity-card p-3.5 cursor-pointer flex items-center justify-between group"
        >
          <div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Deals Won</div>
            <div className="text-base font-black text-zinc-950 mt-0.5">{summary.wonLeads} Closed</div>
          </div>
          <div className="p-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Leads by Source Distribution Bar */}
      <div className="antigravity-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-blue-600" /> Lead Source Distribution
          </h3>
          <span className="text-[11px] text-zinc-500 font-mono">36 Acre, MagicBricks, Housing</span>
        </div>

        <div className="space-y-3">
          {leadsBySource.map((s: any) => {
            const total = summary?.totalLeads || 1
            const pct = Math.round((s.count / total) * 100)
            return (
              <div
                key={s.source}
                onClick={() => router.push(`/leads?source=${encodeURIComponent(s.source)}`)}
                className="text-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between text-zinc-800 font-medium mb-1.5">
                  <span className="font-bold group-hover:text-zinc-950 transition-colors">{s.source}</span>
                  <span className="text-zinc-500 font-mono text-[11px]">{s.count} leads ({pct}%)</span>
                </div>
                <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden border border-zinc-200/80">
                  <div
                    className="bg-zinc-950 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Access Navigation Cards */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => router.push('/leads')}
          className="antigravity-card p-4 text-left flex items-center justify-between group"
        >
          <div>
            <div className="text-xs font-bold text-zinc-950 group-hover:text-blue-700 transition-colors">
              Manage Leads
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Call bridge, WhatsApp & Photo share
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-600 flex items-center justify-center group-hover:bg-zinc-950 group-hover:text-white transition-all duration-200">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        <button
          onClick={() => router.push('/properties')}
          className="antigravity-card p-4 text-left flex items-center justify-between group"
        >
          <div>
            <div className="text-xs font-bold text-zinc-950 group-hover:text-blue-700 transition-colors">
              Property Inventory
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Gurgaon & NCR listings
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-600 flex items-center justify-center group-hover:bg-zinc-950 group-hover:text-white transition-all duration-200">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        <button
          onClick={() => router.push('/attendance')}
          className="antigravity-card p-4 text-left flex items-center justify-between group"
        >
          <div>
            <div className="text-xs font-bold text-zinc-950 group-hover:text-emerald-700 transition-colors">
              GPS Attendance
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Check in / Check out
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-600 flex items-center justify-center group-hover:bg-zinc-950 group-hover:text-white transition-all duration-200">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        <button
          onClick={() => router.push('/social')}
          className="antigravity-card p-4 text-left flex items-center justify-between group"
        >
          <div>
            <div className="text-xs font-bold text-zinc-950 group-hover:text-purple-700 transition-colors">
              Social Calendar
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Post drafts & AI caption helper
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-600 flex items-center justify-center group-hover:bg-zinc-950 group-hover:text-white transition-all duration-200">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  )
}

