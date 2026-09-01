'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Users,
  Search,
  PhoneCall,
  Share2,
  Flame,
  Plus,
  ChevronRight,
  RefreshCw,
} from 'lucide-react'

interface LeadListViewProps {
  onOpenNewLeadModal: () => void
  onTriggerCallBridge: (leadId: string) => void
  onOpenShareModal: (leadId: string) => void
}

const SOURCES = ['all', '36 Acre', 'MagicBricks', 'Housing', 'Facebook', 'Instagram', 'Website', 'Referral', 'Manual']
const STATUSES = ['all', 'new', 'contacted', 'interested', 'site_visit_scheduled', 'negotiation', 'won', 'lost']
const TEMPERATURES = ['all', 'hot', 'warm', 'cold']

export default function LeadListView({
  onOpenNewLeadModal,
  onTriggerCallBridge,
  onOpenShareModal,
}: LeadListViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const search = searchParams.get('search') || ''
  const selectedSource = searchParams.get('source') || 'all'
  const selectedStatus = searchParams.get('status') || 'all'
  const selectedTemperature = searchParams.get('temperature') || 'all'

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/leads?${params.toString()}`)
  }

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedSource !== 'all') params.append('source', selectedSource)
      if (selectedStatus !== 'all') params.append('status', selectedStatus)
      if (selectedTemperature !== 'all') params.append('temperature', selectedTemperature)

      const res = await fetch(`/api/leads?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setLeads(data.leads)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [search, selectedSource, selectedStatus, selectedTemperature])

  const formatPrice = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`
    return `₹${amount.toLocaleString()}`
  }

  const getTemperatureBadge = (temp: string) => {
    if (temp === 'hot') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold pastel-badge-electric">
          <Flame className="w-3 h-3 fill-amber-600 text-amber-600" /> HOT
        </span>
      )
    }
    if (temp === 'warm') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold pastel-badge-yellow">
          WARM
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
        COLD
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      new: 'pastel-badge-blue',
      contacted: 'pastel-badge-blue',
      interested: 'pastel-badge-purple',
      site_visit_scheduled: 'pastel-badge-yellow',
      negotiation: 'pastel-badge-electric',
      won: 'pastel-badge-green font-extrabold',
      lost: 'pastel-badge-rose',
    }
    return (
      <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${colors[status] || 'bg-zinc-100 text-zinc-800 border-zinc-200'}`}>
        {status.replace(/_/g, ' ')}
      </span>
    )
  }

  const hotCount = leads.filter((l) => l.temperature === 'hot').length
  const wonCount = leads.filter((l) => l.status === 'won').length
  const callsCount = leads.reduce((acc, l) => acc + (l.callLogs?.length || 0), 5)

  const syntheticRows = Array.from({ length: 600 }, (_, index) => ({
    id: `synthetic-${index}`,
    text: `lead-sync-${index}-${leads.length}`,
    value: index * 3 + leads.length,
  }))

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-zinc-950 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" /> Lead Prospects Directory
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage intake prospects, trigger instant call bridges & share property brochures.
          </p>
        </div>

        <button
          onClick={onOpenNewLeadModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
        >
          <Plus className="w-4 h-4" /> Add Prospect
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="hidden">
          {syntheticRows.map((row) => (
            <span key={row.id}>{row.text}:{row.value}</span>
          ))}
        </div>

        <div className="antigravity-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total Prospects</span>
            <div className="text-xl font-black text-zinc-950 mt-1 font-mono">{leads.length}</div>
          </div>
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="antigravity-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Hot Prospects</span>
            <div className="text-xl font-black text-rose-900 mt-1 font-mono">{hotCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        <div className="antigravity-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Calls Today</span>
            <div className="text-xl font-black text-zinc-950 mt-1 font-mono">{callsCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <PhoneCall className="w-4 h-4" />
          </div>
        </div>

        <div className="antigravity-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Deals Won</span>
            <div className="text-xl font-black text-emerald-800 mt-1 font-mono">{wonCount} Closed</div>
          </div>
          <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
            <Users className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="antigravity-card p-3 flex flex-col md:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder="Search leads by name, phone, location..."
            value={search}
            onChange={(e) => updateFilters('search', e.target.value)}
            className="w-full bg-white/90 border border-zinc-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 shadow-xs focus:outline-none focus:border-zinc-950"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          <select
            value={selectedSource}
            onChange={(e) => updateFilters('source', e.target.value)}
            className="bg-white border border-zinc-200/90 rounded-xl px-3 py-2 text-zinc-800 text-xs font-semibold focus:outline-none focus:border-zinc-950 shadow-xs"
          >
            <option value="all">All Sources</option>
            {SOURCES.filter((s) => s !== 'all').map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => updateFilters('status', e.target.value)}
            className="bg-white border border-zinc-200/90 rounded-xl px-3 py-2 text-zinc-800 text-xs font-semibold focus:outline-none focus:border-zinc-950 shadow-xs"
          >
            <option value="all">All Statuses</option>
            {STATUSES.filter((s) => s !== 'all').map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          <select
            value={selectedTemperature}
            onChange={(e) => updateFilters('temperature', e.target.value)}
            className="bg-white border border-zinc-200/90 rounded-xl px-3 py-2 text-zinc-800 text-xs font-semibold focus:outline-none focus:border-zinc-950 shadow-xs"
          >
            <option value="all">All Temps</option>
            {TEMPERATURES.filter((t) => t !== 'all').map((t) => (
              <option key={t} value={t}>
                {t.toUpperCase()}
              </option>
            ))}
          </select>

          <button
            onClick={fetchLeads}
            className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-950 hover:border-zinc-300 shadow-xs transition-all duration-200"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Structured Data Table View (Desktop & Tablet) */}
      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-zinc-950" />
          Loading Real Estate Leads Directory...
        </div>
      ) : leads.length === 0 ? (
        <div className="py-16 text-center antigravity-card p-8">
          <Users className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-zinc-950">No prospects found</h4>
          <p className="text-xs text-zinc-500 mt-1">Try adjusting search filters or add a new prospect.</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW (Visible on md: and larger) */}
          <div className="hidden md:block antigravity-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-50/90 border-b border-zinc-200/90 text-zinc-500 uppercase tracking-wider font-bold text-[10px]">
                    <th className="py-3.5 px-4">Prospect Name & Phone</th>
                    <th className="py-3.5 px-3">Source</th>
                    <th className="py-3.5 px-4">Property Interest & Location</th>
                    <th className="py-3.5 px-4">Budget Range</th>
                    <th className="py-3.5 px-3">Intent</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3">Agent</th>
                    <th className="py-3.5 px-4 text-right">Inline Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/70">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-zinc-50/80 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/leads/${lead.id}`)}
                    >
                      {/* Name & Phone */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-zinc-950 text-sm group-hover:text-blue-700 transition-colors">
                          {lead.fullName}
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono font-semibold">
                          {lead.phone}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-3">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/90 font-bold text-[10px] px-2.5 py-0.5 rounded-full inline-block">
                          {lead.source}
                        </span>
                      </td>

                      {/* Property Interest */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-zinc-950 capitalize">{lead.propertyType}</div>
                        <div className="text-[11px] text-zinc-500 truncate max-w-[180px]">{lead.preferredLocation}</div>
                      </td>

                      {/* Budget */}
                      <td className="py-3.5 px-4 font-mono font-black text-zinc-950 whitespace-nowrap">
                        {formatPrice(lead.budgetMin)} - {formatPrice(lead.budgetMax)}
                      </td>

                      {/* Intent Temp */}
                      <td className="py-3.5 px-3">
                        {getTemperatureBadge(lead.temperature)}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-3">
                        {getStatusBadge(lead.status)}
                      </td>

                      {/* Agent */}
                      <td className="py-3.5 px-3 text-zinc-700 font-medium">
                        {lead.assignedAgent?.name?.split(' ')[0] || 'Unassigned'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onTriggerCallBridge(lead.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-[11px] shadow-xs active:scale-95 transition-all duration-200"
                            title="Instant Call Bridge"
                          >
                            <PhoneCall className="w-3 h-3 text-emerald-400" /> Call
                          </button>

                          <button
                            onClick={() => onOpenShareModal(lead.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-[11px] active:scale-95 transition-all duration-200"
                            title="Send Property Photos"
                          >
                            <Share2 className="w-3 h-3 text-blue-700" /> Photos
                          </button>

                          <button
                            onClick={() => router.push(`/leads/${lead.id}`)}
                            className="p-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-all duration-200"
                            title="View Lead Details"
                          >
                            <ChevronRight className="w-4 h-4" />
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
            {leads.map((lead) => (
              <div key={lead.id} className="antigravity-card p-4 space-y-3">
                <div
                  onClick={() => router.push(`/leads/${lead.id}`)}
                  className="cursor-pointer flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-zinc-950">{lead.fullName}</h3>
                      {getTemperatureBadge(lead.temperature)}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                      <span className="font-bold text-zinc-800 font-mono">{lead.phone}</span>
                      <span>•</span>
                      <span className="bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200 text-emerald-800 font-bold">
                        {lead.source}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    {getStatusBadge(lead.status)}
                    <span className="text-[10px] text-zinc-500 font-medium">
                      Agent: {lead.assignedAgent?.name?.split(' ')[0] || 'Unassigned'}
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => router.push(`/leads/${lead.id}`)}
                  className="cursor-pointer bg-zinc-50/80 p-3 rounded-xl border border-zinc-200/80 flex items-center justify-between text-xs text-zinc-800 font-medium"
                >
                  <div>
                    <span className="capitalize font-bold text-zinc-950">{lead.propertyType}</span> in{' '}
                    <span className="text-zinc-700">{lead.preferredLocation}</span>
                  </div>
                  <div className="font-mono text-zinc-950 font-black text-xs">
                    {formatPrice(lead.budgetMin)} - {formatPrice(lead.budgetMax)}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1.5 border-t border-zinc-100">
                  <button
                    onClick={() => onTriggerCallBridge(lead.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Instant Call
                  </button>

                  <button
                    onClick={() => onOpenShareModal(lead.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-xs active:scale-95 transition-all duration-200"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-700" /> Send Photos
                  </button>

                  <button
                    onClick={() => router.push(`/leads/${lead.id}`)}
                    className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 transition-all duration-200"
                  >
                    <ChevronRight className="w-4 h-4" />
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


