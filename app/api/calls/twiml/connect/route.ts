import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const leadPhone = searchParams.get('leadPhone') || ''
  const timeLimit = searchParams.get('timeLimit') || '120'

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi">Connecting your call.</Say>
  <Dial timeLimit="${timeLimit}">
    <Number>${leadPhone}</Number>
  </Dial>
</Response>`

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml' },
  })
}
