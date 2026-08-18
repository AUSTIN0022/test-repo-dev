'use client'

import React, { useState, useEffect } from 'react'
import {
  CalendarCheck,
  CheckCircle2,
  MessageSquare,
  PhoneCall,
  RefreshCw,
} from 'lucide-react'

export default function FollowupView({
  onSelectLead,
  onTriggerCallBridge,
}: {
  onSelectLead: (id: string) => void
  onTriggerCallBridge: (id: string) => void
}) {
  const [followups, setFollowups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFollowups = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/followups?status=pending')
      const data = await res.json()
      if (data.success) {
        setFollowups(data.followups)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFollowups()
  }, [])

  const handleAction = async (id: string, action: 'complete' | 'snooze') => {
    try {
      await fetch('/api/followups', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      fetchFollowups()
    } catch (e) {
      console.error(e)
    }
  }

  const handleQuickWhatsApp = async (leadId: string, leadName: string, text: string) => {
    try {
      await fetch('/api/followups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          type: 'whatsapp',
          note: text,
          sendNow: true,
        }),
      })
      alert('1-Click WhatsApp Follow-up sent to ' + leadName)
      fetchFollowups()
    } catch (e) {
      console.error(e)
    }
  }

  const [search, setSearch] = useState('')
  const [filterTab, setFilterTab] = useState<'all' | 'due' | 'overdue' | 'completed'>('due')

  const filteredFollowups = followups.filter((f) => {
    const matchesSearch =
      !search ||
      f.lead?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      f.note?.toLowerCase().includes(search.toLowerCase()) ||
      f.lead?.phone?.includes(search)
    return matchesSearch
  })

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-zinc-950 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-amber-600" /> Follow-ups & Task Execution
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Execute 1-click WhatsApp follow-ups, calls, or site visit reminders.
          </p>
        </div>

        <button
          onClick={fetchFollowups}
          className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 font-bold text-xs shadow-xs hover:text-zinc-950 hover:border-zinc-300 transition-all duration-200"
          title="Refresh Tasks"
        >
          <RefreshCw className="w-4 h-4 text-zinc-600" /> Refresh List
        </button>
      </div>

      {/* KPI Summary Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="antigravity-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Tasks Due</span>
            <div className="text-xl font-black text-amber-900 mt-1 font-mono">{followups.length}</div>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="antigravity-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">High Priority</span>
            <div className="text-xl font-black text-rose-900 mt-1 font-mono">
              {followups.filter((f) => f.lead?.temperature === 'hot').length || 1}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="antigravity-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Completed Today</span>
            <div className="text-xl font-black text-emerald-800 mt-1 font-mono">5</div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="antigravity-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">WhatsApp Sent</span>
            <div className="text-xl font-black text-blue-900 mt-1 font-mono">8</div>
          </div>
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="antigravity-card p-3 flex flex-col md:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Filter tasks by prospect name, note, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/90 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 shadow-xs focus:outline-none focus:border-zinc-950"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setFilterTab('due')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              filterTab === 'due'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Due Today ({followups.length})
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              filterTab === 'completed'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Structured Data Table View */}
      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-zinc-950" />
          Loading Follow-ups Directory...
        </div>
      ) : filteredFollowups.length === 0 ? (
        <div className="py-16 text-center antigravity-card p-8">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-zinc-950">All follow-ups caught up!</h4>
          <p className="text-xs text-zinc-500 mt-1">No pending tasks found for selected filters.</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW (Visible on md: and larger) */}
          <div className="hidden md:block antigravity-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-50/90 border-b border-zinc-200/90 text-zinc-500 uppercase tracking-wider font-bold text-[10px]">
                    <th className="py-3.5 px-4">Prospect & Contact</th>
                    <th className="py-3.5 px-3">Source</th>
                    <th className="py-3.5 px-4">Follow-up Note / Task Purpose</th>
                    <th className="py-3.5 px-3">Due Date</th>
                    <th className="py-3.5 px-3">Agent</th>
                    <th className="py-3.5 px-4 text-right">Inline Row Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/70">
                  {filteredFollowups.map((f) => (
                    <tr
                      key={f.id}
                      className="hover:bg-zinc-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectLead(f.lead.id)}
                    >
                      {/* Name & Phone */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-zinc-950 text-sm group-hover:text-blue-700 transition-colors">
                          {f.lead.fullName}
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono font-semibold">
                          {f.lead.phone}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-3">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/90 font-bold text-[10px] px-2.5 py-0.5 rounded-full inline-block">
                          {f.lead.source}
                        </span>
                      </td>

                      {/* Task Note */}
                      <td className="py-3.5 px-4">
                        <p className="text-zinc-800 font-medium text-xs leading-relaxed max-w-[320px]">
                          {f.note}
                        </p>
                      </td>

                      {/* Due Date */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="text-[10px] font-mono text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-bold inline-block">
                          {new Date(f.dueDate).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Agent */}
                      <td className="py-3.5 px-3 text-zinc-700 font-medium whitespace-nowrap">
                        {f.lead.assignedAgent?.name?.split(' ')[0] || 'Agent'}
                      </td>

                      {/* Inline Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onTriggerCallBridge(f.lead.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-[11px] shadow-xs active:scale-95 transition-all duration-200"
                            title="Instant Call"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> Call
                          </button>

                          <button
                            onClick={() => handleQuickWhatsApp(f.lead.id, f.lead.fullName, f.note)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-[11px] active:scale-95 transition-all duration-200"
                            title="Send WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-blue-700" /> WhatsApp
                          </button>

                          <button
                            onClick={() => handleAction(f.id, 'complete')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[11px] font-bold transition-all duration-200 active:scale-95"
                            title="Mark Completed"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Done
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS VIEW (Visible on < md screen sizes) */}
          <div className="md:hidden space-y-3">
            {filteredFollowups.map((f) => (
              <div key={f.id} className="antigravity-card p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        onClick={() => onSelectLead(f.lead.id)}
                        className="text-base font-black text-zinc-950 hover:text-blue-700 cursor-pointer transition-colors"
                      >
                        {f.lead.fullName}
                      </h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {f.lead.source}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-700 mt-1 font-medium leading-relaxed">{f.note}</p>
                  </div>

                  <span className="text-[10px] font-mono text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shrink-0 font-bold">
                    Due: {new Date(f.dueDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-zinc-100">
                  <button
                    onClick={() => onTriggerCallBridge(f.lead.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> Instant Call
                  </button>

                  <button
                    onClick={() => handleQuickWhatsApp(f.lead.id, f.lead.fullName, f.note)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-xs transition-all duration-200 active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-700" /> WhatsApp
                  </button>

                  <button
                    onClick={() => handleAction(f.id, 'complete')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold transition-all duration-200 active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}


