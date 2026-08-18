'use client'

import React, { useState, createContext, useContext } from 'react'
import MobileShell from './mobile-shell'
import PropertyShareModal from '../leads/share-modal'
import NewLeadModal from '../leads/new-lead-modal'
import { useRouter } from 'next/navigation'

interface AppContextType {
  currentUser: { id: string; name: string; email: string; role: string }
  setCurrentUserRole: (role: string) => void
  handleTriggerCallBridge: (leadId: string) => Promise<void>
  handleTriggerWebhookTest: () => Promise<void>
  openShareModalFor: (leadId?: string, propertyId?: string) => void
  openNewLeadModal: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppLayoutWrapper')
  return ctx
}

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
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
        router.push('/leads')
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
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUserRole: handleRoleChange,
        handleTriggerCallBridge,
        handleTriggerWebhookTest,
        openShareModalFor,
        openNewLeadModal: () => setShowNewLeadModal(true),
      }}
    >
      <MobileShell
        currentUser={currentUser}
        setCurrentUserRole={handleRoleChange}
        onOpenNewLeadModal={() => setShowNewLeadModal(true)}
      >
        {children}
      </MobileShell>

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
        onLeadAdded={() => router.push('/leads')}
      />
    </AppContext.Provider>
  )
}
