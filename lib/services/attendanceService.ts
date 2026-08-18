import { prisma } from '@/lib/prisma'

export interface CheckInOptions {
  organizationId: string
  userId: string
  latitude?: number
  longitude?: number
  locationName?: string
  notes?: string
  selfieUrl?: string
}

export interface CheckOutOptions {
  organizationId: string
  userId: string
  latitude?: number
  longitude?: number
  locationName?: string
  notes?: string
}

export async function processCheckIn(options: CheckInOptions) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if user already checked in today
  const existing = await prisma.attendance.findFirst({
    where: {
      userId: options.userId,
      checkInTime: { gte: today },
    },
  })

  if (existing) {
    throw new Error('User has already checked in today.')
  }

  // Determine status (Late if check-in after 9:30 AM local)
  const now = new Date()
  const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30)
  const status = options.notes?.toLowerCase().includes('site') ? 'field_visit' : isLate ? 'late' : 'present'

  const record = await prisma.attendance.create({
    data: {
      organizationId: options.organizationId,
      userId: options.userId,
      checkInTime: now,
      checkInLatitude: options.latitude,
      checkInLongitude: options.longitude,
      checkInLocation: options.locationName || 'Golf Course Road, Gurgaon',
      status,
      notes: options.notes,
      selfieUrl: options.selfieUrl,
    },
  })

  return {
    success: true,
    attendanceId: record.id,
    checkInTime: record.checkInTime,
    status: record.status,
    message: `Check-in recorded (${record.status.toUpperCase()}).`,
  }
}

export async function processCheckOut(options: CheckOutOptions) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const activeRecord = await prisma.attendance.findFirst({
    where: {
      userId: options.userId,
      checkInTime: { gte: today },
      checkOutTime: null,
    },
    orderBy: { checkInTime: 'desc' },
  })

  if (!activeRecord) {
    throw new Error('No active check-in found for today.')
  }

  const updated = await prisma.attendance.update({
    where: { id: activeRecord.id },
    data: {
      checkOutTime: new Date(),
      checkOutLatitude: options.latitude,
      checkOutLongitude: options.longitude,
      checkOutLocation: options.locationName || 'Gurgaon Office',
      notes: options.notes ? `${activeRecord.notes || ''} | Out Note: ${options.notes}` : activeRecord.notes,
    },
  })

  return {
    success: true,
    attendanceId: updated.id,
    checkOutTime: updated.checkOutTime,
    message: 'Check-out recorded successfully.',
  }
}
