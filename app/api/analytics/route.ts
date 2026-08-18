import { db } from '@/lib/db'
import { properties } from '@/lib/property-schema'
import { propertyInterest, propertyShares, shareProperties, shareViews } from '@/lib/share-schema'
import { count, eq, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [viewsRes] = await db.select({ total: count() }).from(shareViews)
    const [responsesRes] = await db.select({ total: count() }).from(propertyInterest)
    const [sharesRes] = await db.select({ total: count() }).from(propertyShares)

    const globalBreakdown = await db
      .select({
        response: propertyInterest.response,
        total: count(),
      })
      .from(propertyInterest)
      .groupBy(propertyInterest.response)

    // Per-property demand analytics
    const allProperties = await db.select().from(properties)

    const perPropertyAnalytics = await Promise.all(
      allProperties.map(async (prop) => {
        const [propViews] = await db
          .select({ total: count() })
          .from(shareViews)
          .where(eq(shareViews.propertyId, prop.id))

        const [propShares] = await db
          .select({ total: count() })
          .from(shareProperties)
          .where(eq(shareProperties.propertyId, prop.id))

        const interestRows = await db
          .select({
            response: propertyInterest.response,
            total: count(),
          })
          .from(propertyInterest)
          .where(eq(propertyInterest.propertyId, prop.id))
          .groupBy(propertyInterest.response)

        let interested = 0
        let maybe = 0
        let notInterested = 0

        interestRows.forEach((row) => {
          if (row.response === 'interested') interested = Number(row.total)
          else if (row.response === 'maybe') maybe = Number(row.total)
          else if (row.response === 'not_for_me' || row.response === 'not_interested') notInterested = Number(row.total)
        })

        return {
          id: prop.id,
          title: prop.title,
          city: prop.city,
          state: prop.state,
          price: prop.price,
          views: Number(propViews?.total || 0),
          shares: Number(propShares?.total || 0),
          interested,
          maybe,
          notInterested,
          totalResponses: interested + maybe + notInterested,
        }
      })
    )

    return NextResponse.json({
      totalViews: Number(viewsRes?.total || 0),
      totalResponses: Number(responsesRes?.total || 0),
      totalShares: Number(sharesRes?.total || 0),
      globalBreakdown,
      properties: perPropertyAnalytics,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics.' }, { status: 500 })
  }
}
