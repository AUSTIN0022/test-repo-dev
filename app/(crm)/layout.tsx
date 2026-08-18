import React from 'react'
import AppLayoutWrapper from '@/components/layout/app-layout-wrapper'

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return <AppLayoutWrapper>{children}</AppLayoutWrapper>
}
