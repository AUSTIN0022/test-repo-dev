'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  MoreHorizontal,
  PhoneCall,
  Bell,
  Sparkles,
  UserCheck,
  Share2,
  BarChart3,
  Sliders,
  Plus,
  ShieldCheck,
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  avatarUrl?: string
}

interface AppShellProps {
  children: React.ReactNode
  currentUser: UserProfile
  setCurrentUserRole: (role: string) => void
  onOpenNewLeadModal: () => void
  unreadNotificationsCount?: number
}

const ROLES = [
  { id: 'admin', label: 'Admin / Owner' },
  { id: 'sales_manager', label: 'Sales Manager' },
  { id: 'sales_agent', label: 'Sales Agent' },
  { id: 'field_executive', label: 'Field Executive' },
  { id: 'social_media_manager', label: 'Social Media Manager' },
]

export default function MobileShell({
  children,
  currentUser,
  setCurrentUserRole,
  onOpenNewLeadModal,
  unreadNotificationsCount = 2,
}: AppShellProps) {
  const pathname = usePathname()
  const [showRoleSelector, setShowRoleSelector] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const [notifications] = useState([
    {
      id: '1',
      title: 'New Webhook Lead Assigned',
      message: 'Rahul Sharma from 36 Acre interested in 3BHK Gurgaon.',
      time: '10 mins ago',
    },
    {
      id: '2',
      title: 'Call Bridge Completed',
      message: 'Simulated 115s call between Agent Rohit and Lead Rahul.',
      time: '25 mins ago',
    },
  ])

  const handleRoleChange = async (roleId: string) => {
    setCurrentUserRole(roleId)
    setShowRoleSelector(false)
    try {
      await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: roleId }),
      })
    } catch {}
  }

  const isRouteActive = (route: string) => {
    if (route === '/dashboard') return pathname === '/dashboard' || pathname === '/'
    return pathname.startsWith(route)
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/leads', label: 'Leads', icon: Users },
    { href: '/properties', label: 'Properties', icon: Building2 },
    { href: '/followups', label: 'Follow-ups', icon: CalendarCheck },
    { href: '/attendance', label: 'GPS Attendance', icon: UserCheck },
    { href: '/social', label: 'Social Media', icon: Share2 },
    { href: '/reports', label: 'Analytics & Reports', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Sliders },
  ]

  return (
    <div className="min-h-screen bg-zinc-50/80 text-zinc-900 flex flex-col md:flex-row font-sans selection:bg-zinc-900 selection:text-white">
      {/* ======================================================== */}
      {/* DESKTOP SIDEBAR NAVIGATION (Visible on md: and larger)   */}
      {/* ======================================================== */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-200/80 bg-white/90 backdrop-blur-md fixed inset-y-0 left-0 z-40 shadow-xs">
        {/* Brand Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 flex items-center justify-center shadow-md text-white font-black text-sm tracking-wider group-hover:scale-105 transition-transform duration-200">
              EF
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-zinc-950 text-base tracking-tight leading-none">
                  Estate<span className="text-zinc-500">Flow</span>
                </h1>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  CRM
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium leading-none mt-1 truncate max-w-[140px]">
                Apex Horizon Realty
              </p>
            </div>
          </Link>
        </div>

        {/* Primary Desktop Sidebar Nav List */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <button
            onClick={onOpenNewLeadModal}
            className="w-full flex items-center justify-center gap-2 mb-4 py-2.5 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
          >
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
              <Plus className="w-3 h-3 text-white" />
            </div>
            Add New Prospect
          </button>

          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3 pb-1">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon
            const active = isRouteActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-zinc-950 text-white font-bold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/90'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Sidebar Footer: Active User & Role Switcher */}
        <div className="p-3 border-t border-zinc-100 bg-zinc-50/60 backdrop-blur-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-zinc-950 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-950 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-zinc-500 capitalize truncate">{currentUser.role.replace('_', ' ')}</p>
              </div>
            </div>

            <button
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              className="p-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950 shadow-xs hover:border-zinc-300 transition-all duration-200"
              title="Switch Demo Role"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MOBILE TOP HEADER (Visible on < md screen sizes)         */}
      {/* ======================================================== */}
      <header className="md:hidden sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-zinc-200/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-zinc-950 flex items-center justify-center shadow-xs text-white font-black text-sm tracking-wider">
            EF
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-zinc-950 text-base tracking-tight leading-none">
                Estate<span className="text-zinc-500">Flow</span>
              </h1>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                CRM
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium leading-none mt-0.5 truncate max-w-[140px]">
              Apex Horizon Realty
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition text-xs font-semibold text-emerald-800"
            title="Switch User Role"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="capitalize text-[11px] font-bold text-emerald-900">
              {currentUser.role.replace('_', ' ')}
            </span>
          </button>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 border border-zinc-200 transition shadow-xs"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zinc-950 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Role Switcher Modal Dropdown */}
      {showRoleSelector && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-start justify-center pt-16 px-4">
          <div className="bg-white border border-zinc-200/90 rounded-2xl w-full max-w-sm p-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Switch Demo Role
              </h3>
              <button
                onClick={() => setShowRoleSelector(false)}
                className="text-zinc-400 hover:text-zinc-900 text-xs px-2 py-1"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-zinc-500 mb-3">
              Switch roles instantly to test permissions and features across the sales team:
            </p>
            <div className="space-y-2">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleRoleChange(r.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition text-left ${
                    currentUser.role === r.id
                      ? 'bg-zinc-950 text-white border-zinc-950 font-bold shadow-xs'
                      : 'bg-zinc-50/80 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <span className="text-xs font-semibold">{r.label}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${currentUser.role === r.id ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-white text-zinc-700 border-zinc-200'}`}>
                    {currentUser.role === r.id ? 'Active' : 'Switch'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-start justify-end pt-14 pr-2">
          <div className="bg-white border border-zinc-200/90 rounded-2xl w-full max-w-sm p-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" /> Notifications
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-zinc-500 hover:text-zinc-900 text-xs font-semibold"
              >
                Done
              </button>
            </div>
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {notifications.map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs">
                  <div className="font-bold text-zinc-900 flex items-center justify-between">
                    <span>{n.title}</span>
                    <span className="text-[10px] text-blue-600 font-mono font-semibold">{n.time}</span>
                  </div>
                  <p className="text-zinc-600 mt-1">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MAIN VIEWPORT WORKSPACE (Offset md:pl-64 for Sidebar)    */}
      {/* ======================================================== */}
      <main className="flex-1 md:pl-64 pb-20 md:pb-8 pt-2 px-3 md:px-8 max-w-[1600px] w-full mx-auto">
        {children}
      </main>

      {/* ======================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Visible on < md only)      */}
      {/* ======================================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-zinc-200/80 px-2 py-1.5 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              isRouteActive('/dashboard')
                ? 'text-zinc-950 font-bold bg-zinc-100'
                : 'text-zinc-400 hover:text-zinc-700 font-medium'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Home</span>
          </Link>

          <Link
            href="/leads"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              isRouteActive('/leads')
                ? 'text-zinc-950 font-bold bg-zinc-100'
                : 'text-zinc-400 hover:text-zinc-700 font-medium'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Leads</span>
          </Link>

          {/* Quick Action FAB Button */}
          <button
            onClick={onOpenNewLeadModal}
            className="w-11 h-11 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white flex items-center justify-center shadow-md active:scale-95 transition -mt-4 border-2 border-white"
            title="Add New Lead"
          >
            <PhoneCall className="w-5 h-5" />
          </button>

          <Link
            href="/properties"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              isRouteActive('/properties')
                ? 'text-zinc-950 font-bold bg-zinc-100'
                : 'text-zinc-400 hover:text-zinc-700 font-medium'
            }`}
          >
            <Building2 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Properties</span>
          </Link>

          <Link
            href="/followups"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              isRouteActive('/followups')
                ? 'text-zinc-950 font-bold bg-zinc-100'
                : 'text-zinc-400 hover:text-zinc-700 font-medium'
            }`}
          >
            <CalendarCheck className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Follow-ups</span>
          </Link>

          <Link
            href="/more"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              ['/more', '/attendance', '/social', '/settings', '/reports'].some(p => pathname.startsWith(p))
                ? 'text-zinc-950 font-bold bg-zinc-100'
                : 'text-zinc-400 hover:text-zinc-700 font-medium'
            }`}
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">More</span>
          </Link>
        </div>
      </nav>
    </div>
  )

}
