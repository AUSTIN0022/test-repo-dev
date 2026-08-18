'use client'

import React, { useState, useEffect } from 'react'
import {
  Share2,
  X,
  MessageSquare,
  Mail,
  Send,
  RefreshCw,
} from 'lucide-react'

interface PropertyShareModalProps {
  isOpen: boolean
  onClose: () => void
  preselectedLeadId?: string
  preselectedPropertyId?: string
}

export default function PropertyShareModal({
  isOpen,
  onClose,
  preselectedLeadId,
  preselectedPropertyId,
}: PropertyShareModalProps) {
  const [leads, setLeads] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [selectedLeadId, setSelectedLeadId] = useState(preselectedLeadId || '')
  const [selectedPropertyId, setSelectedPropertyId] = useState(preselectedPropertyId || '')
  const [channel, setChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp')
  const [customNote, setCustomNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (preselectedLeadId) setSelectedLeadId(preselectedLeadId)
    if (preselectedPropertyId) setSelectedPropertyId(preselectedPropertyId)
  }, [preselectedLeadId, preselectedPropertyId])

  useEffect(() => {
    if (!isOpen) return
    const fetchData = async () => {
      try {
        setLoading(true)
        const [lRes, pRes] = await Promise.all([fetch('/api/leads'), fetch('/api/properties')])
        const [lData, pData] = await Promise.all([lRes.json(), pRes.json()])
        if (lData.success) setLeads(lData.leads)
        if (pData.success) setProperties(pData.properties)

        if (lData.leads?.length > 0 && !preselectedLeadId && !selectedLeadId) {
          setSelectedLeadId(lData.leads[0].id)
        }
        if (pData.properties?.length > 0 && !preselectedPropertyId && !selectedPropertyId) {
          setSelectedPropertyId(pData.properties[0].id)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isOpen])

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLeadId || !selectedPropertyId) return
    try {
      setSending(true)
      const res = await fetch('/api/properties/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLeadId,
          propertyIds: [selectedPropertyId],
          channel,
          customNote: customNote || undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        alert(`✅ Property photos & brochure link shared via 1-Click ${channel.toUpperCase()}!\n\nShare Link: ${data.result.shareLink}`)
        onClose()
      } else {
        alert(data.error)
      }
    } catch (e: any) {
      alert(e.message)
    } finally {
      setSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <form
        onSubmit={handleShare}
        className="bg-white border border-zinc-200 rounded-2xl w-full max-w-md p-4 space-y-3.5 shadow-xl animate-in fade-in duration-200 text-xs"
      >
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-zinc-900" /> 1-Click Property Photo Sharing
          </h3>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-900">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-zinc-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-zinc-900" />
            Loading Leads & Inventory...
          </div>
        ) : (
          <div className="space-y-3">
            {/* Select Lead */}
            <div>
              <label className="text-zinc-600 font-medium block mb-1">Target Prospect / Lead</label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-bold focus:outline-none focus:border-zinc-900"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.fullName} ({l.phone}) - {l.preferredLocation}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Property */}
            <div>
              <label className="text-zinc-600 font-medium block mb-1">Property to Share</label>
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-bold focus:outline-none focus:border-zinc-900"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} - ₹{(p.price / 100000).toFixed(1)} Lakhs ({p.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Channel Selection */}
            <div>
              <label className="text-zinc-600 font-medium block mb-1">Dispatch Channel</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`py-2 px-2 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                    channel === 'whatsapp'
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('sms')}
                  className={`py-2 px-2 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                    channel === 'sms'
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" /> SMS
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`py-2 px-2 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                    channel === 'email'
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
              </div>
            </div>

            {/* Custom Note */}
            <div>
              <label className="text-zinc-600 font-medium block mb-1">Message Note (Optional Override)</label>
              <textarea
                rows={3}
                placeholder="Default: Hi {{leadName}}, sharing details of {{propertyTitle}} in {{location}}. Price: {{price}}. Photos & details: {{shareLink}}"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900"
              />
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-zinc-100 text-zinc-700 font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={sending || loading}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs"
          >
            {sending ? 'Sending...' : `Send via ${channel.toUpperCase()}`}
          </button>
        </div>
      </form>
    </div>
  )
}
