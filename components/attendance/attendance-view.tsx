'use client'

import React, { useState, useEffect } from 'react'
import {
  UserCheck,
  Clock,
  Navigation,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'

interface AttendanceViewProps {
  currentUser: { id: string; name: string; role: string }
}

export default function AttendanceView({ currentUser }: AttendanceViewProps) {
  const [attendances, setAttendances] = useState<any[]>([])
  const [checkedInList, setCheckedInList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [locationName, setLocationName] = useState('Golf Course Road, Gurgaon')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [fieldNotes, setFieldNotes] = useState('')

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/attendance')
      const data = await res.json()
      if (data.success) {
        setAttendances(data.attendances)
        setCheckedInList(data.currentlyCheckedIn)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendance()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          setLocationName(`Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (Gurgaon Sector 43)`)
        },
        () => {
          setCoords({ lat: 28.4595, lng: 77.0266 })
        }
      )
    }
  }, [])

  const myActiveRecord = checkedInList.find((a) => a.user.id === currentUser.id)

  const handleCheckIn = async () => {
    try {
      setSubmitting(true)
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check_in',
          userId: currentUser.id,
          latitude: coords?.lat || 28.4595,
          longitude: coords?.lng || 77.0266,
          locationName,
          notes: fieldNotes || 'Morning check-in from mobile app',
        }),
      })
      const data = await res.json()
      if (data.success) {
        alert('✅ ' + data.message)
        fetchAttendance()
      } else {
        alert(data.error)
      }
    } catch (e: any) {
      alert(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCheckOut = async () => {
    try {
      setSubmitting(true)
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check_out',
          userId: currentUser.id,
          latitude: coords?.lat || 28.4595,
          longitude: coords?.lng || 77.0266,
          locationName,
          notes: fieldNotes || 'End of day check-out',
        }),
      })
      const data = await res.json()
      if (data.success) {
        alert('✅ ' + data.message)
        fetchAttendance()
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
    <div className="space-y-4 animate-in fade-in duration-200">
      <div>
        <h2 className="text-base font-black text-zinc-950 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-zinc-900" /> GPS Employee Attendance
        </h2>
        <p className="text-xs text-zinc-500">Mark attendance with geolocation & track field visit notes.</p>
      </div>

      {/* GPS Location & Check-in / Check-out Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Navigation className="w-4 h-4 text-zinc-900 animate-pulse" />
            <div>
              <span className="font-bold text-zinc-900 block">Current Location</span>
              <span className="text-[11px] text-zinc-500">{locationName}</span>
            </div>
          </div>

          <span className={`text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-xl border ${myActiveRecord ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-zinc-100 text-zinc-700 border-zinc-200'}`}>
            {myActiveRecord ? 'CHECKED IN' : 'NOT CHECKED IN'}
          </span>
        </div>

        {/* Field Notes Input */}
        <div>
          <input
            type="text"
            placeholder="Field visit notes / site location remarks..."
            value={fieldNotes}
            onChange={(e) => setFieldNotes(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {!myActiveRecord ? (
            <button
              onClick={handleCheckIn}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs active:scale-95 transition"
            >
              <UserCheck className="w-4 h-4" /> {submitting ? 'Checking In...' : '1-Tap GPS Check-In'}
            </button>
          ) : (
            <button
              onClick={handleCheckOut}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shadow-xs active:scale-95 transition"
            >
              <Clock className="w-4 h-4" /> {submitting ? 'Checking Out...' : '1-Tap GPS Check-Out'}
            </button>
          )}
        </div>
      </div>

      {/* Currently Checked In Team Summary */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-zinc-950 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Currently Checked In Team ({checkedInList.length})
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">Live Status</span>
        </h3>

        {checkedInList.length === 0 ? (
          <p className="text-xs text-zinc-500 py-2">No team members checked in right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {checkedInList.map((a) => (
              <div key={a.id} className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img
                    src={a.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={a.user.name}
                    className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                  />
                  <div>
                    <span className="font-bold text-zinc-900 block">{a.user.name}</span>
                    <span className="text-[10px] text-zinc-500 capitalize">{a.user.role.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-emerald-800 font-mono font-bold block">
                    In: {new Date(a.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-[9px] text-zinc-500 uppercase font-bold">{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attendance History */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-zinc-950">Attendance Log History</h3>
        <div className="space-y-2">
          {attendances.map((a) => (
            <div key={a.id} className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-zinc-900">{a.user?.name}</span>
                <p className="text-[10px] text-zinc-500 mt-0.5">{a.checkInLocation}</p>
              </div>
              <div className="text-right">
                <span className="text-zinc-800 font-mono text-[11px] block font-semibold">
                  {new Date(a.checkInTime).toLocaleDateString()}
                </span>
                <span className={`text-[10px] font-bold uppercase ${a.status === 'late' ? 'text-amber-800' : 'text-emerald-800'}`}>
                  {a.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
