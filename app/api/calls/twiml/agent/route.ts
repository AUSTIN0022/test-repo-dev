import { NextRequest, NextResponse } from 'next/server'

// GET/POST /api/calls/twiml/agent - TwiML instruction for Twilio when agent picks up
export async function POST(req: NextRequest) {
  return handleTwiML(req)
}

export async function GET(req: NextRequest) {
  return handleTwiML(req)
}

async function handleTwiML(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const leadName = searchParams.get('leadName') || 'New Lead'
  const source = searchParams.get('source') || 'Real Estate Ad'
  const leadPhone = searchParams.get('leadPhone') || ''
  const timeLimit = searchParams.get('timeLimit') || '120'
  const callId = searchParams.get('callId') || ''

  const appUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://real-estate-property-hub.v0.build'
  const connectActionUrl = `${appUrl}/api/calls/twiml/connect?leadPhone=${encodeURIComponent(leadPhone)}&timeLimit=${timeLimit}&callId=${callId}`

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="${connectActionUrl}" method="POST" timeout="10">
    <Say voice="Polly.Aditi">New real estate lead from ${source}. Press 1 to connect with ${leadName}.</Say>
  </Gather>
  <Say voice="Polly.Aditi">Connecting you now with ${leadName}.</Say>
  <Dial timeLimit="${timeLimit}">
    <Number>${leadPhone}</Number>
  </Dial>
</Response>`

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml' },
  })
}
