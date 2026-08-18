'use client'

import React, { useState, useEffect } from 'react'
import {
  BarChart3,
  Users,
  RefreshCw,
} from 'lucide-react'

export default function ReportsView() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchReports = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/reports')
      const result = await res.json()
      if (result.success) {
        setData(result)
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

  if (loading || !data) {
    return (
      <div className="py-12 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-zinc-900" />
        Generating CRM Reports & Agent Performance Metrics...
      </div>
    )
  }

  const { summary, agentPerformance } = data

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div>
        <h2 className="text-base font-black text-zinc-950 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-zinc-900" /> Business Reports & Analytics
        </h2>
        <p className="text-xs text-zinc-500">Track lead conversion sources, agent calls & won deals.</p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="bg-white border border-zinc-200 p-3 rounded-2xl shadow-xs">
          <span className="text-zinc-500 font-bold block">Total Leads Ingested</span>
          <span className="text-2xl font-black text-zinc-950 mt-1 block">{summary.totalLeads}</span>
        </div>

        <div className="bg-white border border-zinc-200 p-3 rounded-2xl shadow-xs">
          <span className="text-zinc-500 font-bold block">Deals Won</span>
          <span className="text-2xl font-black text-emerald-800 mt-1 block">{summary.wonLeads}</span>
        </div>

        <div className="bg-white border border-zinc-200 p-3 rounded-2xl shadow-xs">
          <span className="text-zinc-500 font-bold block">Calls Dispatched</span>
          <span className="text-2xl font-black text-zinc-950 mt-1 block">{summary.callsToday}</span>
        </div>

        <div className="bg-white border border-zinc-200 p-3 rounded-2xl shadow-xs">
          <span className="text-zinc-500 font-bold block">Property Shares</span>
          <span className="text-2xl font-black text-zinc-950 mt-1 block">{summary.totalShares}</span>
        </div>
      </div>

      {/* Agent Performance Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-zinc-950 flex items-center gap-2">
          <Users className="w-4 h-4 text-zinc-900" /> Sales Agent Performance
        </h3>

        <div className="space-y-2 text-xs">
          {agentPerformance.map((ag: any) => (
            <div
              key={ag.id}
              className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={ag.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={ag.name}
                  className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                />
                <div>
                  <span className="font-bold text-zinc-950 block">{ag.name}</span>
                  <span className="text-[10px] text-zinc-500 capitalize font-medium">{ag.role.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <div className="text-center">
                  <span className="text-zinc-950 font-black font-mono block">{ag._count.assignedLeads}</span>
                  <span className="text-[9px] text-zinc-500 font-bold">Leads</span>
                </div>
                <div className="text-center">
                  <span className="text-zinc-950 font-black font-mono block">{ag._count.calls}</span>
                  <span className="text-[9px] text-zinc-500 font-bold">Calls</span>
                </div>
                <div className="text-center">
                  <span className="text-zinc-950 font-black font-mono block">{ag._count.followups}</span>
                  <span className="text-[9px] text-zinc-500 font-bold">Follow-ups</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
