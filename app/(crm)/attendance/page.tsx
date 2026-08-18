'use client'

import React from 'react'
import AttendanceView from '@/components/attendance/attendance-view'
import { useApp } from '@/components/layout/app-layout-wrapper'

export default function AttendancePage() {
  const { currentUser } = useApp()

  return <AttendanceView currentUser={currentUser} />
}
