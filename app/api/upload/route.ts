import { put } from '@vercel/blob'
import { NextResponse, type NextRequest } from 'next/server'

const MAX_SIZE = 15 * 1024 * 1024
const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'A file is required.' }, { status: 400 })
  if (!allowed.has(file.type)) return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 })
  if (file.size > MAX_SIZE) return NextResponse.json({ error: 'Files must be smaller than 15MB.' }, { status: 400 })
  try {
    const blob = await put(`properties/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`, file, { access: 'private', addRandomSuffix: false })
    return NextResponse.json({ pathname: blob.pathname, contentType: file.type, filename: file.name })
  } catch {
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
