'use client'

import React, { useState, useEffect } from 'react'
import MobileShell from './layout/mobile-shell'
import DashboardView from './dashboard/dashboard-view'
import LeadListView from './leads/lead-list-view'
import LeadDetailView from './leads/lead-detail-view'
import PropertyInventoryView from './properties/property-inventory-view'
import FollowupView from './followups/followup-view'
import AttendanceView from './attendance/attendance-view'
import SocialCalendarView from './social/social-calendar-view'
import IntegrationsView from './settings/integrations-view'
import ReportsView from './reports/reports-view'
import MoreMenuView from './more/more-menu-view'

import PropertyShareModal from './leads/share-modal'
import NewLeadModal from './leads/new-lead-modal'

export type NavTab = 'dashboard' | 'leads' | 'properties' | 'followups' | 'attendance' | 'social' | 'settings' | 'reports' | 'more'

export default function PropertyHub() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard')
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  
  const [currentUser, setCurrentUser] = useState({
    id: 'user-admin',
    name: 'Vikramaditya Singhania',
    email: 'admin@apexhorizon.in',
    role: 'admin',
  })

  // Share & New Lead Modals State
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareLeadId, setShareLeadId] = useState<string | undefined>(undefined)
  const [sharePropertyId, setSharePropertyId] = useState<string | undefined>(undefined)

  const [showNewLeadModal, setShowNewLeadModal] = useState(false)

  // Trigger Call Bridge Action
  const handleTriggerCallBridge = async (leadId: string) => {
    try {
      const res = await fetch('/api/calls/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      })
      const data = await res.json()
      if (data.success) {
        alert(`📞 Call Bridge Triggered (${data.result.mode.toUpperCase()})\n\n${data.result.message}`)
      } else {
        alert('Call Bridge Failed: ' + data.error)
      }
    } catch (e: any) {
      alert(e.message)
    }
  }

  // Trigger Webhook Test Intake (36 Acre Sample Lead)
  const handleTriggerWebhookTest = async () => {
    try {
      const res = await fetch('/api/webhooks/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: `Intake Prospect #${Math.floor(Math.random() * 900 + 100)}`,
          phone: `+9198${Math.floor(Math.random() * 89999999 + 10000000)}`,
          email: 'web.prospect@36acre.com',
          source: '36 Acre',
          propertyType: 'apartment',
          budgetMin: 8500000,
          budgetMax: 14000000,
          preferredLocation: 'Golf Course Road, Gurgaon',
          notes: 'Webhook Lead: Looking for 3BHK ready penthouse.',
        }),
      })
      const data = await res.json()
      if (data.success) {
        alert(`🎉 Webhook Lead Ingested & Auto Call Bridge Triggered!\n\nLead: ${data.lead.fullName}\nAgent: ${data.lead.assignedAgent}\nSource: 36 Acre`)
        setActiveTab('leads')
      } else {
        alert(data.error)
      }
    } catch (e: any) {
      alert(e.message)
    }
  }

  const openShareModalFor = (leadId?: string, propertyId?: string) => {
    setShareLeadId(leadId)
    setSharePropertyId(propertyId)
    setShowShareModal(true)
  }

  const handleRoleChange = (roleId: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      role: roleId,
    }))
  }

  return (
    <MobileShell
      currentUser={currentUser}
      setCurrentUserRole={handleRoleChange}
      onOpenNewLeadModal={() => setShowNewLeadModal(true)}
    >
      {/* 1. Dashboard View */}
      {activeTab === 'dashboard' && (
        <DashboardView
          onOpenNewLeadModal={() => setShowNewLeadModal(true)}
          onTriggerWebhookTest={handleTriggerWebhookTest}
        />
      )}

      {/* 2. Leads View (List or Detail) */}
      {activeTab === 'leads' && (
        selectedLeadId ? (
          <LeadDetailView
            leadId={selectedLeadId}
            onBack={() => setSelectedLeadId(null)}
            onTriggerCallBridge={handleTriggerCallBridge}
            onOpenShareModal={openShareModalFor}
          />
        ) : (
          <LeadListView
            onOpenNewLeadModal={() => setShowNewLeadModal(true)}
            onTriggerCallBridge={handleTriggerCallBridge}
            onOpenShareModal={openShareModalFor}
          />
        )
      )}

      {/* 3. Properties View */}
      {activeTab === 'properties' && (
        <PropertyInventoryView onOpenShareModal={openShareModalFor} />
      )}

      {/* 4. Follow-ups View */}
      {activeTab === 'followups' && (
        <FollowupView
          onSelectLead={(id) => {
            setSelectedLeadId(id)
            setActiveTab('leads')
          }}
          onTriggerCallBridge={handleTriggerCallBridge}
        />
      )}

      {/* 5. GPS Attendance View */}
      {activeTab === 'attendance' && (
        <AttendanceView currentUser={currentUser} />
      )}

      {/* 6. Social Media View */}
      {activeTab === 'social' && <SocialCalendarView />}

      {/* 7. Settings & Integrations View */}
      {activeTab === 'settings' && <IntegrationsView />}

      {/* 8. Reports & Analytics View */}
      {activeTab === 'reports' && <ReportsView />}

      {/* 9. More Menu View */}
      {activeTab === 'more' && (
        <MoreMenuView
          onNavigateTab={(t: any) => setActiveTab(t)}
          currentUser={currentUser}
        />
      )}

      {/* Global Modals */}
      <PropertyShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        preselectedLeadId={shareLeadId}
        preselectedPropertyId={sharePropertyId}
      />

      <NewLeadModal
        isOpen={showNewLeadModal}
        onClose={() => setShowNewLeadModal(false)}
        onLeadAdded={() => setActiveTab('leads')}
      />
    </MobileShell>
  )
}

