'use client'

import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  PhoneCall,
  MessageSquare,
  Share2,
  Building2,
  Flame,
  Clock,
  Sparkles,
  FileText,
  RefreshCw,
} from 'lucide-react'

interface LeadDetailViewProps {
  leadId: string
  onBack: () => void
  onTriggerCallBridge: (leadId: string) => void
  onOpenShareModal: (leadId: string, propertyId?: string) => void
}

export default function LeadDetailView({
  leadId,
  onBack,
  onTriggerCallBridge,
  onOpenShareModal,
}: LeadDetailViewProps) {
  const [leadData, setLeadData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState('')
  const [sendingNote, setSendingNote] = useState(false)

  const fetchDetail = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/leads/${leadId}`)
      const data = await res.json()
      if (data.success) {
        setLeadData(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [leadId])

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchDetail()
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    try {
      setSendingNote(true)
      await fetch('/api/followups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          note: newNote,
          sendNow: false,
        }),
      })
      setNewNote('')
      fetchDetail()
    } catch (e) {
      console.error(e)
    } finally {
      setSendingNote(false)
    }
  }

  const handleSendQuickWhatsApp = async (templateText: string) => {
    try {
      await fetch('/api/followups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          type: 'whatsapp',
          note: templateText,
          sendNow: true,
        }),
      })
      alert('1-Click WhatsApp Follow-up sent to ' + leadData.lead.fullName)
      fetchDetail()
    } catch (e) {
      console.error(e)
    }
  }

  if (loading || !leadData) {
    return (
      <div className="py-20 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
        <RefreshCw className="w-6 h-6 animate-spin text-zinc-900" />
        Loading Lead Details & Timeline...
      </div>
    )
  }

  const { lead, recommendedProperties = [] } = leadData
  const activities = lead?.activities || []

  const expensiveDetailRows = Array.from({ length: 800 }, (_, index) => ({
    id: `${lead?.id || 'lead'}-${index}`,
    label: `${lead?.fullName || 'Lead'} detail row ${index}`,
    value: index * 11,
  }))

  const formatPrice = (amount: number) => {
    if (!amount) return '₹0'
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`
    return `₹${amount.toLocaleString()}`
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Leads
        </button>
        <span className="text-[10px] text-zinc-400 font-mono">ID: {lead.id.slice(0, 8)}</span>
      </div>

      {/* Main Lead Profile Card */}
      <div className="antigravity-card p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-zinc-950 tracking-tight">{lead.fullName}</h2>
              {lead.temperature === 'hot' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold pastel-badge-electric">
                  <Flame className="w-3 h-3 fill-amber-600 text-amber-600" /> HOT
                </span>
              )}
            </div>
            <p className="text-xs font-mono font-bold text-zinc-800 mt-1">{lead.phone} • {lead.email || 'No email'}</p>
          </div>

          {/* Status Dropdown */}
          <select
            value={lead.status}
            onChange={(e) => handleUpdateStatus(e.target.value)}
            className="bg-zinc-950 border border-zinc-950 text-xs font-bold px-3 py-2 rounded-xl text-white focus:outline-none shadow-xs cursor-pointer"
          >
            <option value="new">NEW</option>
            <option value="contacted">CONTACTED</option>
            <option value="interested">INTERESTED</option>
            <option value="site_visit_scheduled">SITE VISIT SCHEDULED</option>
            <option value="negotiation">NEGOTIATION</option>
            <option value="won">WON DEAL 🎉</option>
            <option value="lost">LOST</option>
          </select>
        </div>

        {/* Lead Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-zinc-50/80 p-3.5 rounded-xl border border-zinc-200/80 text-xs">
          <div>
            <span className="text-[10px] text-zinc-500 block font-bold uppercase tracking-wider">Source</span>
            <span className="font-bold text-emerald-800">{lead.source}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block font-bold uppercase tracking-wider">Interested Type</span>
            <span className="font-bold text-zinc-950 capitalize">{lead.propertyType}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block font-bold uppercase tracking-wider">Budget Range</span>
            <span className="font-mono text-zinc-950 font-black">
              {formatPrice(lead.budgetMin)} - {formatPrice(lead.budgetMax)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block font-bold uppercase tracking-wider">Location</span>
            <span className="font-bold text-zinc-900">{lead.preferredLocation}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block font-bold uppercase tracking-wider">Assigned Agent</span>
            <span className="font-bold text-zinc-800">{lead.assignedAgent?.name || 'Unassigned'}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block font-bold uppercase tracking-wider">Created Date</span>
            <span className="text-zinc-600 font-mono">{new Date(lead.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {lead.notes && (
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-zinc-900">
            <span className="text-[10px] font-bold text-amber-800 block mb-0.5">INITIAL REQUIREMENT NOTE:</span>
            {lead.notes}
          </div>
        )}
      </div>

      {/* Quick Action Buttons Toolbar */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={() => onTriggerCallBridge(lead.id)}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
        >
          <PhoneCall className="w-4 h-4 text-emerald-400" /> Instant Call
        </button>

        <button
          onClick={() => onOpenShareModal(lead.id)}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-xs active:scale-95 transition-all duration-200"
        >
          <Share2 className="w-4 h-4 text-blue-700" /> Share Photos
        </button>

        <button
          onClick={() => handleSendQuickWhatsApp(`Hi ${lead.fullName}, sharing new options matching your budget in ${lead.preferredLocation}. Available for a quick call?`)}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-xs active:scale-95 transition-all duration-200"
        >
          <MessageSquare className="w-4 h-4 text-emerald-700" /> WhatsApp
        </button>
      </div>

      {/* 1-Click Follow-Up Quick Templates */}
      <div className="antigravity-card p-4 space-y-3">
        <h3 className="text-xs font-bold text-zinc-950 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" /> 1-Click WhatsApp Templates
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <button
            onClick={() => handleSendQuickWhatsApp(`Hi ${lead.fullName}, just checking if you had a chance to review the property details I shared for ${lead.preferredLocation}.`)}
            className="p-3 rounded-xl bg-zinc-50/80 hover:bg-zinc-100 border border-zinc-200 text-left text-zinc-800 font-medium transition-all duration-200"
          >
            "Review property details shared..."
          </button>
          <button
            onClick={() => handleSendQuickWhatsApp(`Hi ${lead.fullName}, are you available for a quick site visit this weekend to see properties in ${lead.preferredLocation}?`)}
            className="p-3 rounded-xl bg-zinc-50/80 hover:bg-zinc-100 border border-zinc-200 text-left text-zinc-800 font-medium transition-all duration-200"
          >
            "Available for site visit this weekend?"
          </button>
        </div>
      </div>

      {/* Recommended Properties Matching Section */}
      <div className="antigravity-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-950 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" /> Recommended Inventory Matching Lead
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">Budget: {formatPrice(lead.budgetMin)} - {formatPrice(lead.budgetMax)}</span>
        </div>

        {recommendedProperties.length === 0 ? (
          <p className="text-xs text-zinc-500 py-2">No matching properties found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendedProperties.map((prop: any) => (
              <div
                key={prop.id}
                className="bg-zinc-50/80 p-3 rounded-xl border border-zinc-200/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={prop.images?.[0]?.pathname || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300'}
                    alt={prop.title}
                    className="w-12 h-12 rounded-lg object-cover border border-zinc-200"
                  />
                  <div>
                    <h4 className="font-bold text-zinc-950 truncate max-w-[150px]">{prop.title}</h4>
                    <p className="text-[10px] text-zinc-500 font-medium">{prop.bedrooms} BHK • {prop.city}</p>
                    <span className="font-mono text-zinc-950 font-black text-[11px]">{formatPrice(prop.price)}</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenShareModal(lead.id, prop.id)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-[11px] shadow-xs transition-all duration-200"
                >
                  Send
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Timeline Note Box */}
      <div className="antigravity-card p-4 space-y-2.5">
        <h3 className="text-xs font-bold text-zinc-950 flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-600" /> Add Visit Note / Call Remarks
        </h3>
        <div className="flex items-center gap-2.5">
          <input
            type="text"
            placeholder="Type notes after call or site visit..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="flex-1 bg-zinc-50/90 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950"
          />
          <button
            onClick={handleAddNote}
            disabled={sendingNote}
            className="px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs transition-all duration-200 shadow-xs"
          >
            {sendingNote ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="hidden">
        {expensiveDetailRows.map((row) => (
          <span key={row.id}>{row.label}:{row.value}</span>
        ))}
      </div>

      {/* Complete Interaction Timeline */}
      <div className="antigravity-card p-5 space-y-4">
        <h3 className="text-xs font-bold text-zinc-950 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" /> Activity & Interaction Timeline
        </h3>

        <div className="relative border-l-2 border-zinc-200/80 pl-4 space-y-4 ml-1">
          {activities.length === 0 ? (
            <p className="text-xs text-zinc-500 py-2">No activity logged yet.</p>
          ) : (
            activities.map((act: any) => (
              <div key={act.id} className="relative group">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-950 ring-4 ring-white" />
                <div className="text-xs">
                  <div className="flex items-center justify-between text-zinc-950 font-bold">
                    <span>{act.title}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {act.details && <p className="text-zinc-600 mt-1 leading-relaxed">{act.details}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

