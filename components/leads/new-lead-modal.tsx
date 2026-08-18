'use client'

import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'

interface NewLeadModalProps {
  isOpen: boolean
  onClose: () => void
  onLeadAdded: () => void
}

export default function NewLeadModal({ isOpen, onClose, onLeadAdded }: NewLeadModalProps) {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [source, setSource] = useState('36 Acre')
  const [propertyType, setPropertyType] = useState('apartment')
  const [budgetMin, setBudgetMin] = useState('5000000')
  const [budgetMax, setBudgetMax] = useState('15000000')
  const [preferredLocation, setPreferredLocation] = useState('Gurgaon')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !phone) return
    try {
      setSubmitting(true)
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email: email || undefined,
          source,
          propertyType,
          budgetMin,
          budgetMax,
          preferredLocation,
          notes,
          temperature: 'hot',
        }),
      })
      const data = await res.json()
      if (data.success) {
        onLeadAdded()
        onClose()
        setFullName('')
        setPhone('')
        setEmail('')
        setNotes('')
      } else {
        alert(data.error)
      }
    } catch (e: any) {
      alert(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-zinc-200 rounded-2xl w-full max-w-md p-4 space-y-3 shadow-xl animate-in fade-in duration-200 text-xs"
      >
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
            <Plus className="w-4 h-4 text-zinc-900" /> Add New Real Estate Prospect
          </h3>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-900">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-zinc-600 font-medium block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Rahul Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="text-zinc-600 font-medium block mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+919999999999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-zinc-600 font-medium block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="text-zinc-600 font-medium block mb-1">Lead Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
              >
                <option value="36 Acre">36 Acre</option>
                <option value="MagicBricks">MagicBricks</option>
                <option value="Housing">Housing.com</option>
                <option value="Facebook">Facebook Ads</option>
                <option value="Instagram">Instagram Ads</option>
                <option value="Website">Website Form</option>
                <option value="Referral">Referral</option>
                <option value="Manual">Manual Entry</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-zinc-600 font-medium block mb-1">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-900 capitalize"
              >
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
                <option value="rental">Rental</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-600 font-medium block mb-1">Preferred Location</label>
              <input
                type="text"
                placeholder="e.g. Golf Course Road"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-zinc-600 font-medium block mb-1">Budget Min (₹)</label>
              <input
                type="number"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="text-zinc-600 font-medium block mb-1">Budget Max (₹)</label>
              <input
                type="number"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-600 font-medium block mb-1">Requirement Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Looking for 3BHK ready to move near Horizon Center"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-zinc-100 text-zinc-700 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs"
          >
            {submitting ? 'Saving Lead...' : 'Save Lead'}
          </button>
        </div>
      </form>
    </div>
  )
}
