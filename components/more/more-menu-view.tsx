'use client'

import React from 'react'
import {
  UserCheck,
  Share2,
  BarChart3,
  Sliders,
  ChevronRight,
} from 'lucide-react'

interface MoreMenuViewProps {
  onNavigateTab: (tab: any) => void
  currentUser: { id: string; name: string; role: string; email: string }
}

export default function MoreMenuView({ onNavigateTab, currentUser }: MoreMenuViewProps) {
  const MENU_ITEMS = [
    {
      id: 'attendance',
      title: 'GPS Employee Attendance',
      subtitle: 'Check in / Check out & field visit notes',
      icon: UserCheck,
      color: 'text-zinc-950 bg-zinc-100 border-zinc-200',
    },
    {
      id: 'social',
      title: 'Social Media Calendar',
      subtitle: 'Post drafts & AI caption helper',
      icon: Share2,
      color: 'text-zinc-950 bg-zinc-100 border-zinc-200',
    },
    {
      id: 'reports',
      title: 'Reports & Business Analytics',
      subtitle: 'Lead conversion, calls & won deals',
      icon: BarChart3,
      color: 'text-zinc-950 bg-zinc-100 border-zinc-200',
    },
    {
      id: 'settings',
      title: 'Integrations & Settings',
      subtitle: 'Twilio Voice, WhatsApp & Dry-Run Mode',
      icon: Sliders,
      color: 'text-zinc-950 bg-zinc-100 border-zinc-200',
    },
  ]

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div>
        <h2 className="text-base font-black text-zinc-950">More Modules</h2>
        <p className="text-xs text-zinc-500">Manage employee attendance, social posts, reports & API settings.</p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-900 text-white font-bold text-sm flex items-center justify-center">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-zinc-950 text-sm">{currentUser.name}</h3>
            <p className="text-xs text-zinc-500 font-medium">{currentUser.email}</p>
            <span className="inline-block mt-0.5 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-900 border border-zinc-200">
              Role: {currentUser.role.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Menu Cards */}
      <div className="space-y-2.5">
        {MENU_ITEMS.map((item) => {
          const IconComponent = item.icon
          return (
            <div
              key={item.id}
              onClick={() => onNavigateTab(item.id)}
              className="cursor-pointer bg-white hover:bg-zinc-50/80 border border-zinc-200 hover:border-zinc-400 p-4 rounded-2xl transition shadow-xs flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${item.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-950 group-hover:text-zinc-700 transition">
                    {item.title}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-0.5">{item.subtitle}</p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-950 transition" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
